import React from 'react';
import { useTheme } from '@contexts/ThemeContext';
import Icon from '../ui/Icon';

const ThemeToggleBtn = () => {
  /**
   * Using theme hook
   */
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      title={theme === 'light' ? 'تغییر به حالت تاریک' : 'تغییر به حالت روشن'}
      aria-label={
        theme === 'light' ? 'تغییر به حالت تاریک' : 'تغییر به حالت روشن'
      }
    >
      {theme === 'light' ? (
        // Moon icon for light mode (switch to dark)
        <Icon name="MoonStar" className="w-4 h-4" />
      ) : (
        // Sun icon for dark mode (switch to light)
        <Icon name="Sun" className="w-4 h-4" />
      )}
    </button>
  );
};

export default ThemeToggleBtn;
