import React, { useState, useEffect } from 'react';
import Icon from '@components/ui/Icon';

/**
 * Icon mapping for tabs
 * @constant
 * @type {Object}
 */
const iconMap = {
  TbSettings: 'Settings',
  TbCode: 'Code',
  TbLock: 'Lock',
  TbApi: 'Api',
  TbTestPipe: 'TestTube',
  TbChevronRight: 'ChevronRight',
};

/**
 * Navigation Tabs Component
 * @component
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.setActiveTab - Function to set active tab
 * @param {Array} props.tabs - Array of tab configurations
 * @param {boolean} props.isMobile - Mobile detection flag
 * @returns {JSX.Element} Rendered navigation tabs
 */
const NavigationTabs = ({ activeTab, setActiveTab, tabs, isMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  /**
   * Handle window resize for responsive behavior
   * @function handleResize
   */
  const handleResize = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      setWindowWidth(width);

      // Auto-collapse sidebar on medium screens (768px - 1024px)
      if (width >= 768 && width < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    }
  };

  /**
   * Initialize responsive behavior
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  /**
   * Handle tab click with responsive considerations
   * @function handleTabClick
   * @param {string} tabId - ID of the tab to activate
   */
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  if (isMobile) {
    return null;
  }
  if (window.innerWidth < 1150) {
    return null;
  }

  // Desktop: Regular sidebar
  return (
    <div className="relative h-full">
      <nav
        className={`flex flex-col h-full border-b md:border-b-0 md:border-r dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header section */}
        <div
          className={`p-4 border-b dark:border-gray-700 ${isCollapsed ? 'text-center' : ''}`}
        >
          {isCollapsed ? (
            <div className="flex flex-col items-center">
              <Icon
                name="Settings"
                className="text-gray-900 dark:text-white"
                size={24}
              />
              <div className="mt-2 w-8 h-1 bg-indigo-500 rounded-full"></div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                تنظیمات API
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                مراحل پیکربندی
              </p>
            </>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow z-10"
          aria-label={
            isCollapsed
              ? 'Expand settings sidebar'
              : 'Collapse settings sidebar'
          }
        >
          <Icon
            name="ChevronRight"
            className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Tabs list */}
        <div className="flex-1 overflow-y-auto">
          {tabs.map((tab) => {
            const iconName = iconMap[tab.icon] || 'Settings';
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center w-full p-4 border-r-2 transition-all group relative ${
                  activeTab === tab.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? tab.label : ''}
              >
                <div
                  className={`rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 dark:bg-indigo-900/40'
                      : 'bg-gray-100 dark:bg-gray-800'
                  } ${isCollapsed ? 'p-2' : 'p-2'}`}
                >
                  <Icon name={iconName} />
                </div>

                {!isCollapsed && (
                  <div className="text-right flex-1 mr-3 min-w-0">
                    <div className="font-medium truncate">{tab.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {tab.description}
                    </div>
                  </div>
                )}

                {!isCollapsed && activeTab === tab.id && (
                  <Icon
                    name="ChevronRight"
                    className="text-indigo-500 flex-shrink-0"
                  />
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-gray-300 text-xs mt-1 max-w-xs">
                      {tab.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default NavigationTabs;
