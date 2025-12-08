import React, { useEffect, useState, useRef } from 'react';
import { PlusIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { FaCrown, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * Workspace Dropdown Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Dropdown open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onWorkspaceChange - Workspace change handler
 * @param {Object} props.currentWorkspace - Current workspace data
 * @param {string} props.position - Dropdown position ('header' or 'mini')
 * @param {boolean} props.isExpanded - Sidebar expanded state (for positioning)
 * @param {Array} props.workspaces - Array of available workspaces
 */
export const WorkspaceDropdown = ({
  isOpen,
  onClose,
  onWorkspaceChange,
  currentWorkspace = null,
  position = 'header',
  isExpanded = true,
  workspaces = [],
}) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Handle animation states for dropdown
   */
  useEffect(() => {
    if (isOpen) {
      setShowDropdown(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 50);
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
            onWorkspaceChange(workspace);
            onClose();

            // Show a small notification (could be replaced with toast notification)
            console.log(
              `Switched to workspace: ${workspace.name} using shortcut ⌘${key}`
            );
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onWorkspaceChange, onClose, workspaces]);

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
   * Handle navigation to workspace management page
   */
  const handleManageWorkspaces = () => {
    onClose();
    navigate('/workspace');
  };

  /**
   * Handle add new workspace click
   */
  const handleAddNewWorkspace = () => {
    onClose();
    navigate('/workspace/create');
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

  return (
    <div
      ref={dropdownRef}
      className={`bg-gray-800 dark:bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50 ${getDropdownPosition()} transition-all duration-200 ease-out ${getAnimationClasses()}`}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-700">
        <h3 className="text-xs font-medium text-gray-300 text-right">
          فضاهای کاری
        </h3>
      </div>

      {/* Workspace List */}
      <div className="max-h-64 overflow-y-auto">
        {workspaces.map((workspace, index) => (
          <button
            key={workspace.id}
            onClick={() => {
              onWorkspaceChange(workspace);
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-700 transition-colors duration-200 ${
              currentWorkspace?.id === workspace.id ? 'bg-gray-700/50' : ''
            }`}
          >
            {/* Workspace Info - Right aligned */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white truncate">
                  {workspace.name}
                </span>
                <span className="text-xs text-gray-400 font-mono flex-shrink-0 ml-2">
                  {workspace.shortcut || `⌘${index + 1}`}
                </span>
              </div>
              <div className="flex items-center justify-start gap-2 mt-1">
                <span className="text-xs text-gray-400 truncate">
                  {workspace.plan}
                </span>
                {getRoleIcon(workspace.role)}
              </div>
            </div>

            {/* Workspace Icon - Left side */}
            <div
              className={`w-8 h-8 ${workspace.color} rounded-md flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
            >
              {workspace.letter}
            </div>
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="border-t border-gray-700"></div>

      {/* Action Buttons */}
      <div className="space-y-1 p-1">
        {/* Add New Workspace Button */}
        <button
          onClick={handleAddNewWorkspace}
          className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-700 transition-colors duration-200 text-gray-300 hover:text-white rounded"
        >
          <span className="flex-1 text-right text-sm font-medium truncate">
            افزودن فضای کاری جدید
          </span>
          <div className="w-8 h-8 border border-dashed border-gray-500 rounded-md flex items-center justify-center flex-shrink-0">
            <PlusIcon className="w-4 h-4" />
          </div>
        </button>

        {/* Manage Workspaces Button */}
        <button
          onClick={handleManageWorkspaces}
          className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-700 transition-colors duration-200 text-gray-300 hover:text-white rounded"
        >
          <span className="flex-1 text-right text-sm font-medium truncate">
            مدیریت فضاهای کاری
          </span>
          <div className="w-8 h-8 border border-dashed border-gray-500 rounded-md flex items-center justify-center flex-shrink-0">
            <Cog6ToothIcon className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
