import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';

import {
  ArrowLeftEndOnRectangleIcon,
  PlusIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import {
  FaMagic,
  FaProjectDiagram,
  FaBook,
  FaCog,
  FaChartLine,
  FaCrown,
  FaUser,
} from 'react-icons/fa';
import { LuBrainCircuit, LuBotMessageSquare } from 'react-icons/lu';

/**
 * Custom Theme Toggle Button Component
 * @param {Object} props - Component props
 * @param {Function} props.onThemeChange - Theme change handler
 * @param {boolean} props.showText - Whether to show text label
 */
const ThemeToggleButton = ({ onThemeChange, showText = true }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    onThemeChange?.(newIsDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md transition-all duration-300"
      aria-label="تغییر تم"
    >
      {isDark ? (
        <>
          <SunIcon className="h-4 w-4" />
          {showText && <span>روز</span>}
        </>
      ) : (
        <>
          <MoonIcon className="h-4 w-4" />
          {showText && <span>شب</span>}
        </>
      )}
    </button>
  );
};

/**
 * Navigation list component with animations
 * @param {Object} props - Component props
 * @param {Array} props.items - Navigation items
 * @param {Function} props.onNavigate - Navigation handler
 * @param {Function} props.closeSidebar - Close sidebar handler
 * @param {boolean} props.showContent - Show content state
 * @param {string} props.activePath - Active path for highlighting
 * @param {boolean} props.isMobile - Mobile flag
 */
const NavList = ({
  items,
  onNavigate,
  closeSidebar,
  showContent,
  activePath,
  isMobile = false,
}) => (
  <ul className="flex flex-col gap-2">
    {items.map(({ path, label, icon: Icon }) => {
      const isActive = activePath === path;
      return (
        <li key={path} className="text-right">
          <button
            onClick={() => {
              onNavigate(path);
              // Only close sidebar on mobile devices
              if (isMobile) {
                closeSidebar?.();
              }
            }}
            className={`flex items-center gap-2 w-full text-right px-4 py-2 rounded-md text-sm font-medium transition-colors duration-500 whitespace-nowrap ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {Icon && (
              <Icon
                className={`w-4 h-4 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-300 group-hover:text-white'
                }`}
              />
            )}
            <span
              className={`transition-all duration-500 ease-in-out ${
                showContent
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-4'
              }`}
            >
              {label}
            </span>
          </button>
        </li>
      );
    })}
  </ul>
);

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
const WorkspaceDropdown = ({
  isOpen,
  onClose,
  onWorkspaceChange,
  currentWorkspace = null,
  position = 'header',
  isExpanded = true,
  workspaces = [],
}) => {
  const dropdownRef = useRef(null);
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

      {/* Add New Workspace Button */}
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
    </div>
  );
};

/**
 * Expandable Sidebar Component - Works for both mobile and desktop
 * @param {Object} props - Component props
 * @param {Array} props.items - Navigation items
 * @param {Function} props.onNavigate - Navigation handler
 * @param {Object} props.user - User object
 * @param {Function} props.onLogout - Logout handler
 * @param {boolean} props.isExpanded - Expanded state
 * @param {Function} props.onToggle - Toggle handler
 * @param {boolean} props.isMobile - Mobile flag
 * @param {boolean} props.overlayVisible - Overlay visibility
 * @param {string} props.activePath - Active path for highlighting
 */
const ExpandableSidebar = ({
  items,
  onNavigate,
  user,
  onLogout,
  isExpanded,
  onToggle,
  isMobile = false,
  overlayVisible = false,
  activePath,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);

  /**
   * Mock data for workspaces - in real app this would come from API
   * Dynamic workspaces that can be extended later
   * Added a workspace with very long name for testing purposes
   */
  const [workspaces, setWorkspaces] = useState([
    {
      id: 1,
      name: 'آکمی اینک',
      color: 'bg-blue-500',
      letter: 'A',
      role: 'admin',
      plan: 'پرو',
      shortcut: '⌘1',
    },
    {
      id: 2,
      name: 'آکمی کورپ',
      color: 'bg-green-500',
      letter: 'B',
      role: 'member',
      plan: 'استاندارد',
      shortcut: '⌘2',
    },
    {
      id: 3,
      name: 'ایویل کورپ',
      color: 'bg-purple-500',
      letter: 'C',
      role: 'admin',
      plan: 'رایگان',
      shortcut: '⌘3',
    },
    {
      id: 4,
      name: 'تکنو پارس',
      color: 'bg-red-500',
      letter: 'T',
      role: 'member',
      plan: 'استاندارد',
      shortcut: '⌘4',
    },
    {
      id: 5,
      name: 'ایده پردازان',
      color: 'bg-yellow-500',
      letter: 'I',
      role: 'admin',
      plan: 'پرو',
      shortcut: '⌘5',
    },
    {
      id: 6,
      name: 'شرکت توسعه نرم‌افزارهای هوشمند ایران با مسئولیت محدود بسیار طولانی نام برای تست نمایش',
      color: 'bg-pink-500',
      letter: 'ش',
      role: 'admin',
      plan: 'پرو پیشرفته',
      shortcut: '⌘6',
    },
  ]);

  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isHovered, setIsHovered] = useState(false);
  const workspaceRef = useRef(null);

  /**
   * Initialize current workspace from localStorage on mount
   * Now only stores workspace ID instead of full workspace object
   */
  useEffect(() => {
    const loadWorkspaceFromStorage = () => {
      try {
        // Load saved workspace ID from localStorage
        const savedWorkspaceId = localStorage.getItem(
          'khan-selected-workspace-id'
        );

        if (savedWorkspaceId) {
          const workspaceId = parseInt(savedWorkspaceId, 10);

          // Find workspace by ID in available workspaces
          const workspaceExists = workspaces.find((w) => w.id === workspaceId);

          if (workspaceExists) {
            setCurrentWorkspace(workspaceExists);
            console.log('Workspace loaded from localStorage ID:', workspaceId);
          } else {
            // If saved workspace doesn't exist, use first workspace
            const defaultWorkspace = workspaces[0];
            setCurrentWorkspace(defaultWorkspace);
            localStorage.setItem(
              'khan-selected-workspace-id',
              defaultWorkspace.id.toString()
            );
            console.log('Saved workspace not found, using default');
          }
        } else {
          // No saved workspace, use first one
          const defaultWorkspace = workspaces[0];
          setCurrentWorkspace(defaultWorkspace);
          localStorage.setItem(
            'khan-selected-workspace-id',
            defaultWorkspace.id.toString()
          );
          console.log('No saved workspace ID, using default');
        }
      } catch (error) {
        console.error('Error loading workspace ID from localStorage:', error);
        // Fallback to first workspace
        const defaultWorkspace = workspaces[0];
        setCurrentWorkspace(defaultWorkspace);
      }
    };

    loadWorkspaceFromStorage();
  }, []);

  /**
   * Get badge letters from user name
   * @param {string} name - User name
   * @returns {string} Badge letters
   */
  const getBadgeLetters = (name = '') => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const second = parts[1]?.[0] || '';
    return (first + second).toUpperCase();
  };

  /**
   * Handle animations for opening and closing sidebar
   */
  useEffect(() => {
    if (isExpanded) {
      setIsClosing(false);
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      // Start closing animation
      setShowContent(false);
      setIsClosing(true);
      const timer = setTimeout(() => setIsClosing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  /**
   * Handle workspace change
   * @param {Object} workspace - New workspace object
   */
  const handleWorkspaceChange = (workspace) => {
    setCurrentWorkspace(workspace);
    setWorkspaceDropdownOpen(false);

    /**
     * Store only workspace ID in localStorage instead of full object
     * This reduces storage usage and improves performance
     */
    localStorage.setItem('khan-selected-workspace-id', workspace.id.toString());

    // Update document title
    document.title = `${workspace.name} - مدیریت چت`;

    // You could also update favicon here if needed
    console.log(
      `Workspace changed to: ${workspace.name} (ID: ${workspace.id})`
    );
  };

  /**
   * Handle theme change
   * @param {string} newTheme - New theme ('light' or 'dark')
   */
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  /**
   * Toggle workspace dropdown with proper state management
   */
  const toggleWorkspaceDropdown = () => {
    setWorkspaceDropdownOpen((prev) => !prev);
  };

  /**
   * Close workspace dropdown
   */
  const closeWorkspaceDropdown = () => {
    setWorkspaceDropdownOpen(false);
    setIsHovered(false);
  };

  /**
   * Handle workspace header click - fix toggling issue
   */
  const handleWorkspaceClick = () => {
    setWorkspaceDropdownOpen((prev) => !prev);
  };

  /**
   * Handle workspace header hover state
   */
  const handleWorkspaceHover = (hoverState) => {
    if (isExpanded) {
      setIsHovered(hoverState);
    }
  };

  /**
   * Close dropdown when clicking anywhere outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        workspaceRef.current &&
        !workspaceRef.current.contains(event.target)
      ) {
        // Check if click is on workspace button
        const isWorkspaceButton = event.target.closest(
          '[data-workspace-button]'
        );
        if (!isWorkspaceButton) {
          setWorkspaceDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Different behavior for mobile vs desktop
  const sidebarClasses = isMobile
    ? `md:hidden fixed right-0 top-0 bottom-0 bg-gray-800 dark:bg-gray-900 shadow-lg z-30 border-l border-gray-700 transition-all duration-500 ease-in-out ${
        isExpanded ? 'w-56' : 'w-10'
      }`
    : `hidden md:block fixed right-0 top-0 bottom-0 bg-gray-800 dark:bg-gray-900 shadow-lg z-30 border-l border-gray-700 transition-all duration-500 ease-in-out ${
        isExpanded ? 'w-56' : 'w-10'
      }`;

  /**
   * Calculate workspace header animation classes
   */
  const getWorkspaceHeaderClasses = () => {
    if (!isExpanded) return '';

    return `transition-all duration-500 ease-in-out ${
      showContent ? 'opacity-100' : 'opacity-0'
    }`;
  };

  return (
    <div className={sidebarClasses}>
      <div className="flex flex-col h-full">
        {/* Header like desktop when expanded */}
        {isExpanded && (
          <header className="p-3 border-b border-gray-700 whitespace-nowrap relative flex-shrink-0">
            <div className="flex items-center justify-between gap-2 min-w-0">
              {/* Workspace Dropdown Section - Single Line */}
              <div
                className="flex-1 min-w-0 text-left relative"
                ref={workspaceRef}
              >
                <div
                  onMouseEnter={() => handleWorkspaceHover(true)}
                  onMouseLeave={() => handleWorkspaceHover(false)}
                  className={`relative ${getWorkspaceHeaderClasses()}`}
                >
                  <button
                    onClick={handleWorkspaceClick}
                    data-workspace-button="true"
                    className={`flex items-center justify-start w-full text-white hover:text-gray-200 transition-colors px-2 py-1 rounded-md min-w-0 ${
                      isHovered || workspaceDropdownOpen ? 'bg-gray-700/50' : ''
                    }`}
                    aria-label="انتخاب فضای کاری"
                    aria-expanded={workspaceDropdownOpen}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                      {currentWorkspace && (
                        <>
                          {/* Workspace icon with dynamic color from dropdown */}
                          <div
                            className={`w-6 h-6 ${currentWorkspace.color} rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                          >
                            {currentWorkspace.letter}
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <span className="text-sm font-bold truncate block text-right">
                              {currentWorkspace.name}
                            </span>
                            <div className="flex items-center justify-end gap-1 mt-0.5">
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full truncate max-w-[80px]">
                                {currentWorkspace.plan}
                              </span>
                              {currentWorkspace.role === 'admin' && (
                                <FaCrown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Workspace Dropdown */}
                  <WorkspaceDropdown
                    isOpen={workspaceDropdownOpen}
                    onClose={closeWorkspaceDropdown}
                    onWorkspaceChange={handleWorkspaceChange}
                    currentWorkspace={currentWorkspace}
                    position="header"
                    isExpanded={isExpanded}
                    workspaces={workspaces}
                  />
                </div>
              </div>

              {/* Toggle sidebar button - Always visible */}
              <button
                onClick={onToggle}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-gray-700 size-7 min-w-[28px]"
                aria-label="Toggle Sidebar"
                data-sidebar="trigger"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-300"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M9 3v18"></path>
                </svg>
                <span className="sr-only">Toggle Sidebar</span>
              </button>
            </div>
          </header>
        )}

        {/* Scrollable content area - WITH SCROLL */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col min-h-full">
            {/* Toggle button and workspace badge in mini mode */}
            {!isExpanded && (
              <div className="flex flex-col items-center gap-3 py-3 flex-shrink-0">
                {/* Workspace badge in mini mode */}
                <div className="relative" ref={workspaceRef}>
                  <div className="relative">
                    <button
                      onClick={handleWorkspaceClick}
                      data-workspace-button="true"
                      className={`w-8 h-8 flex items-center justify-center ${
                        currentWorkspace?.color || 'bg-blue-500'
                      } text-white text-xs font-bold rounded-md hover:opacity-90 transition-all relative`}
                      aria-label="انتخاب فضای کاری"
                      aria-expanded={workspaceDropdownOpen}
                    >
                      {currentWorkspace?.letter || 'A'}
                    </button>

                    {/* Workspace Dropdown for mini mode */}
                    <WorkspaceDropdown
                      isOpen={workspaceDropdownOpen}
                      onClose={closeWorkspaceDropdown}
                      onWorkspaceChange={handleWorkspaceChange}
                      currentWorkspace={currentWorkspace}
                      position="mini"
                      isExpanded={isExpanded}
                      workspaces={workspaces}
                    />
                  </div>
                </div>

                {/* Toggle button */}
                <button
                  onClick={onToggle}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-gray-700 size-7"
                  aria-label="Toggle Sidebar"
                  data-sidebar="trigger"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M9 3v18"></path>
                  </svg>
                  <span className="sr-only">Toggle Sidebar</span>
                </button>
              </div>
            )}

            {/* Navigation section - Takes available space but can grow */}
            <nav className="flex-1">
              {isExpanded ? (
                <div className="px-2 py-3">
                  <NavList
                    items={items}
                    onNavigate={onNavigate}
                    closeSidebar={() => onToggle(false)}
                    showContent={showContent}
                    activePath={activePath}
                    isMobile={isMobile}
                  />

                  {/* Settings button */}
                  <button
                    onClick={() => {
                      onNavigate('/setting');
                      // Only close sidebar on mobile when navigating to settings
                      if (isMobile) {
                        onToggle(false);
                      }
                    }}
                    className={`flex mt-1 items-center gap-2 w-full text-right px-4 py-2 rounded-md text-sm font-medium transition-colors duration-500 whitespace-nowrap ${
                      activePath === '/setting'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <FaCog
                      className={`w-4 h-4 ${
                        activePath === '/setting'
                          ? 'text-white'
                          : 'text-gray-300 group-hover:text-white'
                      }`}
                    />
                    <span
                      className={`transition-all duration-500 ease-in-out ${
                        showContent
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 translate-x-4'
                      }`}
                    >
                      تنظیمات
                    </span>
                  </button>
                </div>
              ) : (
                // Mini icons view - same icons, no re-render
                <div className="flex flex-col items-center gap-3 py-3">
                  {items.map(({ path, label, icon: Icon }) => {
                    const isActive = activePath === path;
                    return (
                      <button
                        key={path}
                        onClick={() => onNavigate(path)}
                        className={`p-2 rounded-md transition-colors duration-500 ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }`}
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}

                  {/* Settings icon in mini mode */}
                  <button
                    onClick={() => onNavigate('/setting')}
                    className={`p-2 rounded-md transition-colors duration-500 ${
                      activePath === '/setting'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                    aria-label="تنظیمات"
                  >
                    <FaCog className="h-4 w-4" />
                  </button>
                </div>
              )}
            </nav>

            {/* Bottom section - Theme toggle and user info WITHOUT SEPARATOR */}
            <div className="flex-shrink-0">
              <div className={`${isExpanded ? 'px-2 py-3' : 'py-3'}`}>
                {/* Theme Toggle Button - Simplified: Icon only, aligned to left */}
                <div className={`mb-3 ${!isExpanded ? 'px-1' : ''}`}>
                  {isExpanded ? (
                    <div
                      className={`flex justify-end transition-all duration-500 ease-in-out ${
                        showContent ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <button
                        onClick={() => {
                          const isDark =
                            document.documentElement.classList.contains('dark');
                          if (isDark) {
                            document.documentElement.classList.remove('dark');
                            localStorage.setItem('theme', 'light');
                            setTheme('light');
                          } else {
                            document.documentElement.classList.add('dark');
                            localStorage.setItem('theme', 'dark');
                            setTheme('dark');
                          }
                        }}
                        className="flex items-center justify-center p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                        aria-label="تغییر تم"
                      >
                        {theme === 'dark' ? (
                          <SunIcon className="h-4 w-4" />
                        ) : (
                          <MoonIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          const isDark =
                            document.documentElement.classList.contains('dark');
                          if (isDark) {
                            document.documentElement.classList.remove('dark');
                            localStorage.setItem('theme', 'light');
                            setTheme('light');
                          } else {
                            document.documentElement.classList.add('dark');
                            localStorage.setItem('theme', 'dark');
                            setTheme('dark');
                          }
                        }}
                        className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                        aria-label="تغییر تم"
                      >
                        {theme === 'dark' ? (
                          <SunIcon className="h-4 w-4" />
                        ) : (
                          <MoonIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* User section - No border on top */}
                <div
                  className={`flex transition-all duration-500 ease-in-out ${
                    isExpanded
                      ? 'flex-row items-center justify-between'
                      : 'flex-col items-center gap-2'
                  }`}
                >
                  {isExpanded ? (
                    // Expanded user section with animations
                    <>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full transition-all duration-500 flex-shrink-0">
                          {getBadgeLetters(user?.name)}
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p
                            className={`text-white text-xs truncate transition-all duration-500 ease-in-out ${
                              showContent
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-4'
                            }`}
                          >
                            {user ? `${user.name}` : 'مهمان'}
                          </p>
                          <p
                            className={`text-gray-400 text-xs truncate transition-all duration-500 ease-in-out ${
                              showContent
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-4'
                            }`}
                          >
                            {user?.email || 'example@example.com'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onLogout}
                        className={`flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md transition-all duration-500 ease-in-out flex-shrink-0 ${
                          showContent
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-4'
                        }`}
                        aria-label="خروج"
                      >
                        <ArrowLeftEndOnRectangleIcon className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    // Mini user section
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full cursor-default">
                          {getBadgeLetters(user?.name)}
                        </div>
                        <button
                          onClick={onLogout}
                          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-500"
                          aria-label="خروج"
                        >
                          <ArrowLeftEndOnRectangleIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Background Blur Overlay Component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Close handler
 * @param {boolean} props.isVisible - Visibility state
 */
const BlurOverlay = ({ onClose, isVisible }) => (
  <div
    className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-20 transition-opacity duration-500 ease-in-out ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
    onClick={onClose}
  />
);

/**
 * Main Navbar Component
 * @param {Object} props - Component props
 * @param {Function} props.onSidebarCollapse - Sidebar collapse handler
 */
const Navbar = ({ onSidebarCollapse }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Hide navbar state
   */
  const [hide, setHide] = useState(false);

  /**
   * Navigation items configuration
   */
  const navItems = [
    { path: '/chat', label: 'چت', icon: LuBotMessageSquare },
    { path: '/document', label: 'پایگاه دانش', icon: LuBrainCircuit },
    { path: '/wizard', label: 'ویزاردها', icon: FaMagic },
    { path: '/workflow', label: 'گردش کار', icon: FaProjectDiagram },
    { path: '/instruction', label: 'دستورالعمل‌ها', icon: FaBook },
    { path: '/monitoring', label: 'مانیتورینگ', icon: FaChartLine },
  ];

  /**
   * Load sidebar state from localStorage on component mount
   */
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('khan-sidebar-expanded');

    if (savedSidebarState === null || savedSidebarState === undefined) {
      localStorage.setItem('khan-sidebar-expanded', JSON.stringify(true));
      setIsDesktopExpanded(true);
      onSidebarCollapse(false);
    } else {
      const isExpanded = JSON.parse(savedSidebarState);
      setIsDesktopExpanded(isExpanded);
      onSidebarCollapse(!isExpanded);
    }

    setIsInitialized(true);
  }, [onSidebarCollapse]);

  /**
   * Save sidebar state to localStorage whenever it changes
   */
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(
        'khan-sidebar-expanded',
        JSON.stringify(isDesktopExpanded)
      );
    }
  }, [isDesktopExpanded, isInitialized]);

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      resetUIState();
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  /**
   * Reset all UI states
   */
  const resetUIState = () => {
    setIsMobileExpanded(false);
    setIsDesktopExpanded(true);
    onSidebarCollapse(false);
  };

  /**
   * Toggle mobile sidebar
   */
  const toggleMobileSidebar = () => {
    setIsMobileExpanded(!isMobileExpanded);
  };

  /**
   * Toggle desktop sidebar and save state
   */
  const toggleDesktopSidebar = () => {
    const newState = !isDesktopExpanded;
    setIsDesktopExpanded(newState);
    onSidebarCollapse(!newState);
  };

  /**
   * Handle messages for navbar visibility
   */
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'HIDE_NAVBAR') {
        setIsMobileExpanded(false);
        setIsDesktopExpanded(false);
        setHide(true);
      } else if (event.data.type === 'SHOW_NAVBAR') {
        setIsDesktopExpanded(true);
        setHide(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSidebarCollapse]);

  /**
   * Auto-close mobile sidebar on navigation
   */
  useEffect(() => {
    setIsMobileExpanded(false);
  }, [location.pathname]);

  /**
   * Return null if hide state is true
   */
  if (hide) return null;

  return (
    <div dir="rtl">
      {/* Mobile View */}
      <div className="md:hidden">
        <BlurOverlay
          onClose={() => setIsMobileExpanded(false)}
          isVisible={isMobileExpanded}
        />

        <ExpandableSidebar
          items={navItems}
          onNavigate={navigate}
          user={user}
          onLogout={handleLogout}
          isExpanded={isMobileExpanded}
          onToggle={toggleMobileSidebar}
          isMobile={true}
          overlayVisible={isMobileExpanded}
          activePath={location.pathname}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <ExpandableSidebar
          items={navItems}
          onNavigate={navigate}
          user={user}
          onLogout={handleLogout}
          isExpanded={isDesktopExpanded}
          onToggle={toggleDesktopSidebar}
          isMobile={false}
          overlayVisible={false}
          activePath={location.pathname}
        />
      </div>
    </div>
  );
};

export default Navbar;
