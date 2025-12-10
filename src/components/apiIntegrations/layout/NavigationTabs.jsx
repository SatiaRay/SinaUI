import React from 'react';
import {
  TbChevronRight,
  TbSettings,
  TbCode,
  TbLock,
  TbApi,
  TbTestPipe,
} from 'react-icons/tb';

/**
 * Icon mapping for tabs
 * @constant
 * @type {Object}
 */
const iconMap = {
  TbSettings: TbSettings,
  TbCode: TbCode,
  TbLock: TbLock,
  TbApi: TbApi,
  TbTestPipe: TbTestPipe,
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
  if (isMobile) return null;

  /**
   * Renders icon component based on icon name
   * @function renderIcon
   * @param {string} iconName - Name of the icon
   * @returns {JSX.Element} Icon component
   */
  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || TbSettings;
    return <IconComponent />;
  };

  return (
    <nav className="hidden md:flex flex-col w-full md:w-64 border-b md:border-b-0 md:border-r dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          تنظیمات API
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          مراحل پیکربندی
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tabs.map((tab) => {
          const IconComponent = iconMap[tab.icon] || TbSettings;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full p-4 border-r-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/40'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <IconComponent />
              </div>
              <div className="text-right flex-1">
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {tab.description}
                </div>
              </div>
              {activeTab === tab.id && (
                <TbChevronRight className="text-indigo-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationTabs;
