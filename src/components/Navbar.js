import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import ThemeToggle from '@contexts/ThemeToggle';

import {
  ArrowLeftEndOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  FaMagic,
  FaProjectDiagram,
  FaBook,
  FaCog,
  FaChartLine,
} from 'react-icons/fa';
import { LuBrainCircuit, LuBotMessageSquare } from 'react-icons/lu';

/**
 * Navigation list component with animations
 * @param {Object} props - Component props
 * @param {Array} props.items - Navigation items
 * @param {Function} props.onNavigate - Navigation handler
 * @param {Function} props.closeSidebar - Close sidebar handler
 * @param {boolean} props.showContent - Show content state
 * @param {string} props.activePath - Active path for highlighting
 */
const NavList = ({
  items,
  onNavigate,
  closeSidebar,
  showContent,
  activePath,
}) => (
  <ul className="flex flex-col gap-2">
    {items.map(({ path, label, icon: Icon }) => {
      const isActive = activePath === path;
      return (
        <li key={path} className="text-right">
          <button
            onClick={() => {
              onNavigate(path);
              closeSidebar?.();
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
    ? `md:hidden fixed right-0 top-0 bottom-0 bg-gray-800 dark:bg-gray-900 shadow-lg z-30 border-l border-gray-700 transition-all duration-500 ease-in-out ${
        isExpanded ? 'w-56' : 'w-10'
      }`
    : `hidden md:block fixed right-0 top-0 bottom-0 bg-gray-800 dark:bg-gray-900 shadow-lg z-30 border-l border-gray-700 transition-all duration-500 ease-in-out ${
        isExpanded ? 'w-56' : 'w-10'
      }`;

  return (
    <div className={sidebarClasses}>
      <div className="flex flex-col h-full">
        {/* Header like desktop when expanded - FIXED in expanded mode */}
        {isExpanded && (
          <header className="p-4 border-b flex w-full justify-between items-center border-gray-700 whitespace-nowrap relative flex-shrink-0">
            <h1
              className={`text-white text-lg font-bold flex-1 text-right transition-all duration-500 ease-in-out ${
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
                <ThemeToggle />
              </div>
              {/* Toggle button in header when expanded */}
              <button
                onClick={onToggle}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-all duration-500 border-0"
                aria-label="Close menu"
              >
                <ChevronLeftIcon
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
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 mx-1 rounded-md transition-all duration-500 border-0 flex-shrink-0"
                aria-label="Open menu"
              >
                <ChevronLeftIcon
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
                  />
                  {/* Settings button */}
                  <button
                    onClick={() => {
                      onNavigate('/setting');
                      onToggle(false);
                    }}
                    className="flex mt-1 items-center gap-2 w-full text-right text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-500 whitespace-nowrap"
                  >
                    <FaCog className="w-4 h-4 text-gray-300 group-hover:text-white" />
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
                  {items.map(({ path, label, icon: Icon }) => (
                    <button
                      key={path}
                      onClick={() => onNavigate(path)}
                      className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-500"
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                  {/* Settings icon in mini mode */}
                  <button
                    onClick={() => onNavigate('/setting')}
                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-500"
                    aria-label="تنظیمات"
                  >
                    <FaCog className="h-4 w-4" />
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
                            className={`text-white text-xs truncate transition-all duration-500 ease-in-out ${
                              showContent
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-4'
                            }`}
                          >
                            {user ? `${user.name}` : 'Guest'}
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
                        className={`flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md transition-all duration-500 ease-in-out ${
                          showContent
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-4'
                        }`}
                        aria-label="Logout"
                      >
                        <ArrowLeftEndOnRectangleIcon className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    // Mini user section - ALWAYS AT BOTTOM
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <div className="border-0">
                          <ThemeToggle />
                        </div>
                        <div className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full cursor-default">
                          {getBadgeLetters(user?.name)}
                        </div>
                        <button
                          onClick={onLogout}
                          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-500"
                          aria-label="Logout"
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

  /**
   * Hide navbar state
   */
  const [hide, setHide] = useState(false)

  /**
   * Navigation items configuration (documents section removed)
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
    setIsDesktopExpanded(false);
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
    // Only call onSidebarCollapse when sidebar is collapsed (not expanded)
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
        setHide(true)
      } else if (event.data.type === 'SHOW_NAVBAR') {
        setIsDesktopExpanded(false);
        setHide(false)
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSidebarCollapse]);

  /**
   * Return null if hide state is true
   */
  if(hide) return null;

  return (
    <div dir="rtl">
      {/* Mobile View */}
      <div className="md:hidden">
        {/* Blur Overlay when expanded - Only for mobile */}
        <BlurOverlay
          onClose={() => setIsMobileExpanded(false)}
          isVisible={isMobileExpanded}
        />

        {/* Mobile Expandable Sidebar */}
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

        {/* Desktop Expandable Sidebar */}
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
