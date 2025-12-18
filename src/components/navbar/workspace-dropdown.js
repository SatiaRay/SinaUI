import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { FaCrown, FaUser, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { 
  useGetWorkspacesQuery,
  useSwitchWorkspaceMutation 
} from 'store/api/idp-features/workspaceApi';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectActiveWorkspace,
  setCurrentWorkspace,
  selectWorkspaceError,
  selectWorkspaceStatus,
} from 'store/features/workspaceSlice';

/**
 * Workspace Dropdown Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Dropdown open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onWorkspaceChange - Workspace change handler (optional)
 * @param {Object} props.currentWorkspace - Current workspace data (optional, will use Redux if not provided)
 * @param {string} props.position - Dropdown position ('header' or 'mini')
 * @param {boolean} props.isExpanded - Sidebar expanded state (for positioning)
 */
export const WorkspaceDropdown = ({
  isOpen,
  onClose,
  onWorkspaceChange,
  currentWorkspace = null,
  position = 'header',
  isExpanded = true,
}) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Get current workspace from Redux store if not provided
  const activeWorkspace = useSelector(selectActiveWorkspace);
  const workspaceError = useSelector(selectWorkspaceError);
  const workspaceStatus = useSelector(selectWorkspaceStatus);
  const actualCurrentWorkspace = currentWorkspace || activeWorkspace;

  /**
   * Fetch workspaces using RTK Query
   * Remove skip option to prevent infinite refetch loops
   */
  const {
    data: workspacesData,
    isLoading: isLoadingWorkspaces,
    isFetching: isFetchingWorkspaces,
    isError: isWorkspacesError,
    error: workspacesError,
    refetch: refetchWorkspaces,
  } = useGetWorkspacesQuery(
    { perpage: 20, page: 1 }, 
    { 
      // Remove skip option to cache the data properly
      // Use pollingInterval: 0 to prevent auto-refetch
      pollingInterval: 0,
      // Don't refetch on mount if we already have data
      refetchOnMountOrArgChange: false,
    }
  );

  /**
   * Switch workspace mutation
   */
  const [switchWorkspace, { 
    isLoading: isSwitching, 
    isSuccess: switchSuccess,
    isError: switchError,
    error: switchErrorData,
    reset: resetSwitchMutation,
  }] = useSwitchWorkspaceMutation();

  /**
   * Extract workspaces from response
   */
  const workspaces = React.useMemo(() => {
    if (!workspacesData) return [];
    
    // Handle different response structures
    if (Array.isArray(workspacesData)) return workspacesData;
    if (workspacesData?.data && Array.isArray(workspacesData.data)) return workspacesData.data;
    if (workspacesData?.workspaces && Array.isArray(workspacesData.workspaces)) return workspacesData.workspaces;
    if (workspacesData?.items && Array.isArray(workspacesData.items)) return workspacesData.items;
    
    return [];
  }, [workspacesData]);

  /**
   * Handle workspace switching
   */
  const handleWorkspaceChange = useCallback(async (workspace) => {
    if (!workspace?.id) return;
    
    // Don't switch if already on this workspace
    if (actualCurrentWorkspace?.id === workspace.id) {
      onClose();
      return;
    }

    setLocalError(null);
    resetSwitchMutation();

    try {
      // Call the switch workspace API
      const result = await switchWorkspace(workspace).unwrap();
      
      // Update Redux store with new workspace
      dispatch(setCurrentWorkspace(workspace.id));
      
      // Call the parent handler if provided
      if (onWorkspaceChange) {
        onWorkspaceChange(workspace);
      }
      
      // Close dropdown on success
      onClose();
      
      // Show success message (you can replace with toast notification)
      console.log('Successfully switched to workspace:', workspace.name);
      
      // Refresh the page to update all data with new workspace context
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error) {
      console.error('Failed to switch workspace:', error);
      setLocalError(error.data?.message || 'Failed to switch workspace');
      
      // Keep dropdown open to show error
    }
  }, [switchWorkspace, dispatch, actualCurrentWorkspace?.id, onWorkspaceChange, onClose, resetSwitchMutation]);

  /**
   * Handle animation states for dropdown
   */
  useEffect(() => {
    if (isOpen) {
      setShowDropdown(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 50);
      
      // Reset errors when opening dropdown
      setLocalError(null);
      resetSwitchMutation();
      
      // Only refetch if we haven't fetched before or if it's been a while
      if (!hasFetched || (!isLoadingWorkspaces && !isFetchingWorkspaces)) {
        refetchWorkspaces();
        setHasFetched(true);
      }
      
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setShowDropdown(false);
        setIsAnimating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /**
   * Handle click outside to close dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Check if click is on workspace button itself
        const workspaceButton = event.target.closest('[data-workspace-button]');
        if (!workspaceButton) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  /**
   * Handle shortcut key presses for workspace switching
   * Dynamically supports 1-9 shortcuts based on available workspaces
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Cmd/Ctrl + number shortcuts
      if ((event.metaKey || event.ctrlKey) && !event.shiftKey) {
        const key = event.key;

        // Dynamically check if key is a number between 1 and workspaces length
        const workspaceCount = workspaces.length;
        const validNumbers = Array.from(
          { length: Math.min(workspaceCount, 9) },
          (_, i) => (i + 1).toString()
        );

        if (validNumbers.includes(key)) {
          event.preventDefault();
          const workspaceIndex = parseInt(key, 10) - 1;

          if (workspaces[workspaceIndex]) {
            const workspace = workspaces[workspaceIndex];
            handleWorkspaceChange(workspace);

            // Show a small notification (could be replaced with toast notification)
            console.log(
              `Switched to workspace: ${workspace.name} using shortcut ⌘${key}`
            );
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleWorkspaceChange, workspaces]);

  /**
   * Handle escape key to close dropdown
   */
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, onClose]);

  /**
   * Get role icon based on user role
   * @param {string} role - User role
   * @returns {JSX.Element} Role icon
   */
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaCrown className="w-3 h-3 text-yellow-500" />;
      case 'member':
        return <FaUser className="w-3 h-3 text-gray-400" />;
      default:
        return <FaUser className="w-3 h-3 text-gray-400" />;
    }
  };

  /**
   * Get workspace display properties
   */
  const getWorkspaceDisplayProps = (workspace, index) => {
    // Generate a color based on workspace ID for consistent coloring
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-orange-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500'
    ];
    const colorIndex = workspace.id ? 
      (parseInt(workspace.id.substring(0, 8), 16) % colors.length) : 
      (index % colors.length);
    
    // Get first letter for icon
    const firstLetter = workspace.name?.charAt(0)?.toUpperCase() || 'W';
    
    // Determine user role in this workspace
    const userRole = workspace.role || workspace.user_role || 'member';
    
    return {
      color: colors[colorIndex],
      letter: firstLetter,
      role: userRole,
      shortcut: `⌘${index + 1}`,
      plan: workspace.plan || 'Free',
    };
  };

  if (!showDropdown) return null;

  /**
   * Calculate dropdown position based on sidebar state and position type
   */
  const getDropdownPosition = () => {
    if (position === 'mini') {
      return 'fixed top-14 right-10 w-64';
    }

    if (!isExpanded) {
      return 'fixed top-14 right-10 w-64';
    }

    return 'absolute top-full right-0 mt-2 w-64';
  };

  /**
   * Calculate animation classes based on dropdown state
   */
  const getAnimationClasses = () => {
    if (!isAnimating && isOpen) {
      return 'opacity-100 scale-100 translate-y-0';
    }
    return 'opacity-0 scale-95 -translate-y-2 pointer-events-none';
  };

  /**
   * Render loading state
   */
  const renderLoadingState = () => (
    <div className="p-6 flex flex-col items-center justify-center">
      <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mb-3" />
      <p className="text-sm text-gray-300">در حال بارگذاری فضای کاری‌ها...</p>
    </div>
  );

  /**
   * Render error state
   */
  const renderErrorState = () => {
    const errorMessage = workspacesError?.data?.message || 
                        localError || 
                        workspaceError || 
                        'خطا در بارگذاری فضای کاری‌ها';
    
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 text-red-400 mb-2">
          <FaExclamationTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">خطا</span>
        </div>
        <p className="text-xs text-gray-400 mb-3">{errorMessage}</p>
        <button
          onClick={refetchWorkspaces}
          className="w-full px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <div className="p-4 text-center">
      <p className="text-sm text-gray-400 mb-3">فضای کاری‌ای یافت نشد</p>
      <button
        onClick={() => {
          console.log('Create new workspace clicked');
          onClose();
        }}
        className="text-sm text-blue-400 hover:text-blue-300"
      >
        اولین فضای کاری را ایجاد کنید
      </button>
    </div>
  );

  return (
    <div
      ref={dropdownRef}
      className={`bg-gray-800 dark:bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50 ${getDropdownPosition()} transition-all duration-200 ease-out ${getAnimationClasses()}`}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-xs font-medium text-gray-300">
          فضاهای کاری
        </h3>
        {(isLoadingWorkspaces || isFetchingWorkspaces) && (
          <FaSpinner className="w-3 h-3 text-blue-400 animate-spin" />
        )}
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto">
        {isLoadingWorkspaces ? (
          renderLoadingState()
        ) : isWorkspacesError ? (
          renderErrorState()
        ) : workspaces.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {/* Workspace List */}
            {workspaces.map((workspace, index) => {
              const displayProps = getWorkspaceDisplayProps(workspace, index);
              const isCurrentWorkspace = actualCurrentWorkspace?.id === workspace.id;

              return (
                <button
                  key={workspace.id}
                  onClick={() => handleWorkspaceChange(workspace)}
                  disabled={isSwitching || isCurrentWorkspace}
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isCurrentWorkspace ? 'bg-gray-700/50' : ''
                  }`}
                >
                  {/* Workspace Info - Right aligned */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white truncate">
                        {workspace.name}
                      </span>
                      <span className="text-xs text-gray-400 font-mono flex-shrink-0 ml-2">
                        {displayProps.shortcut}
                      </span>
                    </div>
                    <div className="flex items-center justify-start gap-2 mt-1">
                      <span className="text-xs text-gray-400 truncate">
                        {displayProps.plan}
                      </span>
                      {getRoleIcon(displayProps.role)}
                    </div>
                  </div>

                  {/* Workspace Icon - Left side */}
                  <div
                    className={`w-8 h-8 ${displayProps.color} rounded-md flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                  >
                    {displayProps.letter}
                  </div>
                  
                  {isSwitching && actualCurrentWorkspace?.id === workspace.id && (
                    <FaSpinner className="w-4 h-4 ml-2 animate-spin text-blue-400" />
                  )}
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* Separator */}
      {!isLoadingWorkspaces && !isWorkspacesError && workspaces.length > 0 && (
        <div className="border-t border-gray-700"></div>
      )}

      {/* Add New Workspace Button */}
      {!isLoadingWorkspaces && !isWorkspacesError && (
        <button
          onClick={() => {
            console.log('Add new workspace clicked');
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-700 transition-colors duration-200 text-gray-300 hover:text-white"
        >
          <span className="flex-1 text-right text-sm font-medium truncate">
            افزودن فضای کاری جدید
          </span>
          <div className="w-8 h-8 border border-dashed border-gray-500 rounded-md flex items-center justify-center flex-shrink-0">
            <PlusIcon className="w-4 h-4" />
          </div>
        </button>
      )}.0

      {/* Switch error message */}
      {switchError && !localError && (
        <div className="p-2 bg-red-900/20 border-t border-red-800">
          <p className="text-xs text-red-400 text-center">
            خطا در تغییر فضای کاری
          </p>
        </div>
      )}
    </div>
  );
};