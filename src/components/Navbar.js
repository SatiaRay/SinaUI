import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import Icon from './ui/Icon';
import ThemeToggleBtn from './ui/ThemeToggleBtn';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

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
    {items.map(({ path, label, icon: IconBtn }) => {
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
                ? 'bg-blue-600 text-white dark:bg-blue-700 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon
              name={IconBtn}
              className={`w-4 h-4 ${
                isActive
                  ? 'text-white dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
              }`}
            />
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
  const { theme } = useTheme(); // استفاده از useTheme hook

  // Generate unique ID for tooltips to avoid conflicts
  const sidebarId = isMobile ? 'mobile-sidebar' : 'desktop-sidebar';

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
    ? `md:hidden fixed right-0 top-0 bottom-0 bg-gray-100 dark:bg-gray-900 shadow-lg z-30 border-l border-gray-300 dark:border-gray-700 transition-all duration-500 ease-in-out ${
        isExpanded ? 'w-56' : 'w-10'
      }`
    : `hidden md:block fixed right-0 top-0 bottom-0 bg-gray-100 dark:bg-gray-900 shadow-lg z-30 border-l border-gray-300 dark:border-gray-700 transition-all duration-500 ease-in-out ${
        isExpanded ? 'w-56' : 'w-10'
      }`;

  return (
    <div className={sidebarClasses}>
      <div className="flex flex-col h-full">
        {/* Header like desktop when expanded */}
        {isExpanded && (
          <header className="p-4 border-b flex w-full justify-between items-center border-gray-300 dark:border-gray-700 whitespace-nowrap relative flex-shrink-0">
            <h1
              className={`text-gray-900 dark:text-white text-lg font-bold flex-1 text-right transition-all duration-500 ease-in-out ${
                showContent
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-4'
              }`}
            >
              مدیریت چت
            </h1>
            <div
              className={`flex items-center gap-2 transition-all duration-500 ease-in-out ${
                showContent
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-4'
              }`}
            >
              <div className="border-0">
                <ThemeToggleBtn />
              </div>
              {/* Toggle button in header when expanded */}
              <button
                onClick={onToggle}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-all duration-500 border-0"
                aria-label="Close menu"
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
            {/* Workspace badge in mini mode - Only workspace badge without toggle button */}
            {!isExpanded && (
              <button
                onClick={onToggle}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 mx-1 rounded-md transition-all duration-500 border-0 flex-shrink-0"
                aria-label="Open menu"
                data-tooltip-id={`${sidebarId}-tooltip`}
                data-tooltip-content="باز کردن منو"
                data-tooltip-place="left"
              >
                <Icon
                  name="ChevronLeft"
                  className={`h-4 w-4 transition-transform duration-500 ${
                    isExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
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
                        ? 'bg-blue-600 text-white dark:bg-blue-700 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon
                      name="Settings"
                      className={`w-4 h-4 ${
                        activePath === '/setting'
                          ? 'text-white dark:text-gray-100'
                          : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
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
                  {items.map(({ path, label, icon: iconName }) => {
                    const isActive = activePath === path;
                    return (
                      <button
                        key={path}
                        onClick={() => onNavigate(path)}
                        className={`p-2 rounded-md transition-colors duration-500 ${
                          isActive
                            ? 'bg-blue-600 text-white dark:bg-blue-700 dark:text-gray-100'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        aria-label={label}
                        data-tooltip-id={`${sidebarId}-tooltip`}
                        data-tooltip-content={label}
                        data-tooltip-place="left"
                      >
                        <Icon name={iconName} className="h-4 w-4" />
                      </button>
                    );
                  })}

                  {/* Settings icon in mini mode */}
                  <button
                    onClick={() => onNavigate('/setting')}
                    className={`p-2 rounded-md transition-colors duration-500 ${
                      activePath === '/setting'
                        ? 'bg-blue-600 text-white dark:bg-blue-700 dark:text-gray-100'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    aria-label="تنظیمات"
                    data-tooltip-id={`${sidebarId}-tooltip`}
                    data-tooltip-content="تنظیمات"
                    data-tooltip-place="left"
                  >
                    <Icon name="Settings" className="h-4 w-4" />
                  </button>
                </div>
              )}
            </nav>

            {/* Bottom section - Theme toggle and user info WITHOUT SEPARATOR */}
            <div className="flex-shrink-0">
              <div className={`${isExpanded ? 'px-2 py-3' : 'py-3'}`}>
                {/* Toggle sidebar button in mini mode - Moved to above theme toggle */}
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
                            className={`text-gray-900 dark:text-white text-xs truncate transition-all duration-500 ease-in-out ${
                              showContent
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-4'
                            }`}
                          >
                            {user ? `${user.name}` : 'مهمان'}
                          </p>
                          <p
                            className={`text-gray-600 dark:text-gray-400 text-xs truncate transition-all duration-500 ease-in-out ${
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
                        className={`flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md transition-all duration-500 ease-in-out ${
                          showContent
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-4'
                        }`}
                        aria-label="خروج"
                      >
                        <Icon name="LogOut" className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    // Mini user section
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="border-0"
                          data-tooltip-id={`${sidebarId}-tooltip`}
                          data-tooltip-content="تغییر تم"
                          data-tooltip-place="left"
                        >
                          <ThemeToggleBtn />
                        </div>
                        <div
                          className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full cursor-default"
                          data-tooltip-id={`${sidebarId}-tooltip`}
                          data-tooltip-content={user ? user.name : 'کاربر'}
                          data-tooltip-place="left"
                        >
                          {getBadgeLetters(user?.name)}
                        </div>
                        <button
                          onClick={onLogout}
                          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-500"
                          aria-label="Logout"
                        >
                          <Icon name="LogOut" className="h-4 w-4" />
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

      {/* React Tooltip for mini mode - Responsive to theme */}
      {!isExpanded && (
        <Tooltip
          key={`${sidebarId}-tooltip-${theme}`}
          id={`${sidebarId}-tooltip`}
          className={`z-50 !text-xs !py-1 !px-2 !rounded-md !opacity-100 !transition-colors !duration-200 ${tooltipClasses}`}
          style={{
            maxWidth: '200px',
            fontWeight: '500',
            fontSize: '0.75rem',
            lineHeight: '1rem',
          }}
          delayShow={300}
          delayHide={150}
          noArrow={false}
          opacity={1}
          place="left"
        />
      )}
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
  const { theme } = useTheme();

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
    { path: '/chat', label: 'چت', icon: 'MessageSquareText' },
    { path: '/document', label: 'پایگاه دانش', icon: 'BrainCircuit' },
    { path: '/wizard', label: 'ویزاردها', icon: 'Sparkles' },
    { path: '/workflow', label: 'گردش کار', icon: 'Workflow' },
    { path: '/instruction', label: 'دستورالعمل‌ها', icon: 'BookOpen' },
    { path: '/monitoring', label: 'مانیتورینگ', icon: 'Activity' },
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
    <div dir="rtl" className={theme}>
      {' '}
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
