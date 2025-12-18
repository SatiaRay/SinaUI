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
  FaSpinner,
} from 'react-icons/fa';
import { LuBrainCircuit, LuBotMessageSquare } from 'react-icons/lu';
import { WorkspaceDropdown } from './navbar/workspace-dropdown';
import { useGetWorkspacesQuery } from 'store/api/idp-features/workspaceApi';
import { useSelector } from 'react-redux';
import { selectActiveWorkspace } from 'store/features/workspaceSlice';

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
 * Load current workspace from localStorage
 */
const loadCurrentWorkspaceFromStorage = () => {
  try {
    const savedWorkspace = localStorage.getItem('current-workspace');
    if (savedWorkspace) {
      return JSON.parse(savedWorkspace);
    }
    return null;
  } catch (error) {
    console.error('Error loading workspace from localStorage:', error);
    return null;
  }
};

/**
 * Get workspace display properties from workspace object
 */
const getWorkspaceDisplayProps = (workspace) => {
  if (!workspace) {
    return {
      color: 'bg-blue-500',
      letter: 'W',
      plan: 'Free',
      role: 'member',
    };
  }

  // Generate consistent color based on workspace ID
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-cyan-500',
  ];

  // Get color from metadata or generate based on ID
  let color = 'bg-blue-500';
  try {
    if (workspace.metadata) {
      const metadata = JSON.parse(workspace.metadata);
      if (metadata.color) {
        color = metadata.color.startsWith('#') 
          ? `bg-[${metadata.color}]` 
          : `bg-${metadata.color}-500`;
      }
    }
  } catch (e) {
    // If metadata parsing fails, generate color from ID
    const colorIndex = workspace.id 
      ? (parseInt(workspace.id.substring(0, 8), 16) % colors.length)
      : 0;
    color = colors[colorIndex];
  }

  // Get first letter of workspace name
  const firstLetter = workspace.name?.charAt(0)?.toUpperCase() || 'W';

  return {
    color,
    letter: firstLetter,
    plan: workspace.plan || 'Free',
    role: 'member', // You might want to get this from workspace membership data
  };
};

/**
 * Expandable Sidebar Component - Works for both mobile and desktop
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
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isHovered, setIsHovered] = useState(false);
  const workspaceRef = useRef(null);

  // Use RTK Query to fetch workspaces
  const {
    data: workspacesData,
    isLoading: isLoadingWorkspaces,
    isFetching: isFetchingWorkspaces,
  } = useGetWorkspacesQuery(
    { perpage: 20, page: 1 },
    {
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
    }
  );

  // Use Redux store for active workspace
  const activeWorkspaceFromStore = useSelector(selectActiveWorkspace);

  /**
   * Load current workspace on component mount
   */
  useEffect(() => {
    const loadWorkspace = () => {
      // First try from Redux store
      if (activeWorkspaceFromStore) {
        setCurrentWorkspace(activeWorkspaceFromStore);
        return;
      }

      // Then try from localStorage
      const savedWorkspace = loadCurrentWorkspaceFromStorage();
      if (savedWorkspace) {
        setCurrentWorkspace(savedWorkspace);
        return;
      }

      // Finally, use first workspace from fetched data
      if (workspacesData?.data?.[0]) {
        setCurrentWorkspace(workspacesData.data[0]);
      }
    };

    loadWorkspace();
  }, [activeWorkspaceFromStore, workspacesData]);

  /**
   * Extract workspaces from response
   */
  const workspaces = React.useMemo(() => {
    if (!workspacesData) return [];
    
    if (Array.isArray(workspacesData)) return workspacesData;
    if (workspacesData?.data && Array.isArray(workspacesData.data)) return workspacesData.data;
    if (workspacesData?.workspaces && Array.isArray(workspacesData.workspaces)) return workspacesData.workspaces;
    if (workspacesData?.items && Array.isArray(workspacesData.items)) return workspacesData.items;
    
    return [];
  }, [workspacesData]);

  /**
   * Get badge letters from user name
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
      setShowContent(false);
      setIsClosing(true);
      const timer = setTimeout(() => setIsClosing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  /**
   * Handle workspace change
   */
  const handleWorkspaceChange = (workspace) => {
    setCurrentWorkspace(workspace);
    setWorkspaceDropdownOpen(false);

    // Update document title
    document.title = `${workspace.name} - مدیریت چت`;

    console.log(`Workspace changed to: ${workspace.name}`);
  };

  /**
   * Handle theme change
   */
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  /**
   * Toggle workspace dropdown
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
   * Handle workspace header click
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

  // Get display properties for current workspace
  const displayProps = getWorkspaceDisplayProps(currentWorkspace);

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

  /**
   * Render workspace loading state
   */
  const renderWorkspaceLoading = () => (
    <div className="flex items-center justify-center p-2">
      <FaSpinner className="w-4 h-4 text-blue-400 animate-spin" />
    </div>
  );

  return (
    <div className={sidebarClasses}>
      <div className="flex flex-col h-full">
        {/* Header like desktop when expanded */}
        {isExpanded && (
          <header className="p-3 border-b border-gray-700 whitespace-nowrap relative flex-shrink-0">
            <div className="flex items-center justify-between gap-2 min-w-0">
              {/* Workspace Dropdown Section */}
              <div
                className="flex-1 min-w-0 text-left relative"
                ref={workspaceRef}
              >
                <div
                  onMouseEnter={() => handleWorkspaceHover(true)}
                  onMouseLeave={() => handleWorkspaceHover(false)}
                  className={`relative ${getWorkspaceHeaderClasses()}`}
                >
                  {isLoadingWorkspaces ? (
                    renderWorkspaceLoading()
                  ) : (
                    <button
                      onClick={handleWorkspaceClick}
                      data-workspace-button="true"
                      className={`flex items-center justify-start w-full text-white hover:text-gray-200 transition-colors px-2 py-1 rounded-md min-w-0 ${
                        isHovered || workspaceDropdownOpen ? 'bg-gray-700/50' : ''
                      }`}
                      aria-label="انتخاب فضای کاری"
                      aria-expanded={workspaceDropdownOpen}
                      disabled={isFetchingWorkspaces}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                        {currentWorkspace ? (
                          <>
                            {/* Workspace icon */}
                            <div
                              className={`w-6 h-6 ${displayProps.color} rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-blue-500`}
                            >
                              {displayProps.letter}
                            </div>
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <span className="text-sm font-bold truncate block text-right">
                                {currentWorkspace.name}
                              </span>
                              <div className="flex items-center justify-end gap-1 mt-0.5">
                                <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full truncate max-w-[80px]">
                                  {displayProps.plan}
                                </span>
                                {displayProps.role === 'admin' && (
                                  <FaCrown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-600 rounded-md animate-pulse"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-600 rounded w-24 animate-pulse"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  )}

                  {/* Workspace Dropdown */}
                  <WorkspaceDropdown
                    isOpen={workspaceDropdownOpen}
                    onClose={closeWorkspaceDropdown}
                    onWorkspaceChange={handleWorkspaceChange}
                    currentWorkspace={currentWorkspace}
                    position="header"
                    isExpanded={isExpanded}
                  />
                </div>
              </div>

              {/* Toggle sidebar button */}
              <button
                onClick={onToggle}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-gray-700 size-7 min-w-[28px]"
                aria-label="Toggle Sidebar"
                data-sidebar="trigger"
              >
                <svg
                  xmlns="http://www.w3.org2000/svg"
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

        {/* Scrollable content area */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col min-h-full">
            {/* Workspace badge in mini mode */}
            {!isExpanded && (
              <div className="flex flex-col items-center gap-3 py-3 flex-shrink-0">
                <div className="relative" ref={workspaceRef}>
                  <div className="relative">
                    {isLoadingWorkspaces ? (
                      <div className="w-8 h-8 bg-gray-600 rounded-md animate-pulse"></div>
                    ) : (
                      <button
                        onClick={handleWorkspaceClick}
                        data-workspace-button="true"
                        className={`w-8 h-8 flex items-center justify-center ${
                          displayProps.color
                        } text-white text-xs font-bold rounded-md hover:opacity-90 transition-all relative bg-blue-500`}
                        aria-label="انتخاب فضای کاری"
                        aria-expanded={workspaceDropdownOpen}
                        disabled={isFetchingWorkspaces}
                      >
                        {displayProps.letter}
                      </button>
                    )}

                    {/* Workspace Dropdown for mini mode */}
                    <WorkspaceDropdown
                      isOpen={workspaceDropdownOpen}
                      onClose={closeWorkspaceDropdown}
                      onWorkspaceChange={handleWorkspaceChange}
                      currentWorkspace={currentWorkspace}
                      position="mini"
                      isExpanded={isExpanded}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation section */}
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
                // Mini icons view
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

            {/* Bottom section */}
            <div className="flex-shrink-0">
              <div className={`${isExpanded ? 'px-2 py-3' : 'py-3'}`}>
                {/* Toggle sidebar button in mini mode */}
                {!isExpanded && (
                  <div className="mb-3 flex justify-center">
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
                )}

                {/* Theme Toggle Button */}
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

                {/* User section */}
                <div
                  className={`flex transition-all duration-500 ease-in-out ${
                    isExpanded
                      ? 'flex-row items-center justify-between'
                      : 'flex-col items-center gap-2'
                  }`}
                >
                  {isExpanded ? (
                    // Expanded user section
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
 */
const Navbar = ({ onSidebarCollapse }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
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
   * Load sidebar state from localStorage
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
   * Save sidebar state to localStorage
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
   * Toggle desktop sidebar
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

  // Return null if hide state is true
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