import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
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
  const [theme, setTheme] = useState('light');

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

  // Detect theme changes
  useEffect(() => {
    // Function to get current theme
    const getCurrentTheme = () => {
      if (typeof window === 'undefined') return 'light';

      // Check localStorage first
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) return storedTheme;

      // Check system preference
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      }

      return 'light';
    };

    // Set initial theme
    setTheme(getCurrentTheme());

    // Listen for theme changes in localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        setTheme(e.newValue || 'light');
      }
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Custom event for theme changes (if using ThemeToggleBtn)
    const handleCustomThemeChange = () => {
      setTheme(getCurrentTheme());
    };

    window.addEventListener('themeChange', handleCustomThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      window.removeEventListener('themeChange', handleCustomThemeChange);
    };
  }, []);

  // Handle animations for opening and closing
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
        {/* Header like desktop when expanded - FIXED in expanded mode */}
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
                <Icon
                  name="ChevronLeft"
                  className={`h-4 w-4 transition-transform duration-500 ${
                    isExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
            </div>
          </header>
        )}

        {/* Scrollable content area - WITH SCROLL */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col min-h-full">
            {/* Toggle button - only show in mini mode */}
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

            {/* Bottom section - Pushed to bottom when content is short */}
            <div className="flex-shrink-0">
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isExpanded ? 'px-2 pb-3' : 'pb-3'
                }`}
              >
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
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full transition-all duration-500">
                          {getBadgeLetters(user?.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-gray-900 dark:text-white text-xs truncate transition-all duration-500 ease-in-out ${
                              showContent
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-4'
                            }`}
                          >
                            {user ? `${user.name}` : 'Guest'}
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
                        className={`flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition-all duration-500 ease-in-out ${
                          showContent
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-4'
                        }`}
                        aria-label="Logout"
                      >
                        <Icon name="LogOut" className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    // Mini user section - ALWAYS AT BOTTOM
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
                          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-500"
                          aria-label="Logout"
                          data-tooltip-id={`${sidebarId}-tooltip`}
                          data-tooltip-content="خروج"
                          data-tooltip-place="left"
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
          id={`${sidebarId}-tooltip`}
          className={`z-50 !text-xs !py-1 !px-2 !rounded-md !opacity-100 !transition-colors !duration-200 ${
            theme === 'dark'
              ? '!bg-gray-800 !text-gray-100 !border !border-gray-700'
              : '!bg-white !text-gray-800 !border !border-gray-200 !shadow-md'
          }`}
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

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false); // Start with false to prevent flash
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Hide navbar state
   */
  const [hide, setHide] = useState(false);

  /**
   * Navigation items configuration (documents section removed)
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
   * If field doesn't exist, set it with default value (true)
   */
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('khan-sidebar-expanded');

    if (savedSidebarState === null || savedSidebarState === undefined) {
      // Field doesn't exist, set it with default value (true)
      localStorage.setItem('khan-sidebar-expanded', JSON.stringify(true));
      setIsDesktopExpanded(true);
      onSidebarCollapse(false);
    } else {
      // Field exists, use the saved value (can be true or false)
      const isExpanded = JSON.parse(savedSidebarState);
      setIsDesktopExpanded(isExpanded);
      onSidebarCollapse(!isExpanded);
    }

    // Mark as initialized to prevent the save effect from running
    setIsInitialized(true);
  }, [onSidebarCollapse]);

  /**
   * Save sidebar state to localStorage whenever it changes, but only after initialization
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
   * Auto-close mobile sidebar on navigation - ONLY FOR MOBILE
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
        {/* Blur Overlay when expanded - Only for mobile */}
        <BlurOverlay
          onClose={() => setIsMobileExpanded(false)}
          isVisible={isMobileExpanded}
        />

        {/* Mobile Expandable Sidebar - Always collapsed by default */}
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
        {/* No blur overlay for desktop - sidebar is part of layout */}

        {/* Desktop Expandable Sidebar - Uses saved state from localStorage */}
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
