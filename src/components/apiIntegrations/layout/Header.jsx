import React, { useState, useEffect } from 'react';
import {
  FaArrowLeft,
  FaSave,
  FaExclamationTriangle,
  FaCheckCircle,
} from 'react-icons/fa';
import {
  TbApi,
  TbTestPipe,
  TbRefresh,
  TbChevronDown,
  TbEdit,
  TbEye,
} from 'react-icons/tb';

import Swal from 'sweetalert2';

/**
 * Header component for API integration page (supports both create and edit modes)
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.navigate - Navigation function
 * @param {string} props.activeTab - Currently active tab
 * @param {boolean} props.mobileMenuOpen - Mobile menu state
 * @param {Function} props.setMobileMenuOpen - Set mobile menu state
 * @param {boolean} props.isMobile - Mobile detection flag
 * @param {Array} props.tabs - Array of tab configurations
 * @param {Function} props.navigateToFullTest - Function to navigate to test tab
 * @param {Function} props.handleSubmit - Form submit handler
 * @param {boolean} props.isSubmitting - Submitting state
 * @param {boolean} props.isEditMode - Whether in edit mode (default: false)
 * @param {boolean} props.hasChanges - Whether form has unsaved changes (edit mode only)
 * @param {Object} props.apiData - Original API data for comparison (edit mode only)
 * @param {Function} props.onPreview - Function to preview API (edit mode only)
 * @param {Function} props.onTabChange - Function to change active tab
 * @returns {JSX.Element} Rendered header
 */
const Header = ({
  navigate,
  activeTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  isMobile,
  tabs,
  navigateToFullTest,
  handleSubmit,
  isSubmitting,
  isEditMode = false,
  hasChanges = false,
  apiData = null,
  onPreview = null,
  onTabChange = () => {},
}) => {
  /**
   * Gets active tab label
   * @function getActiveTabLabel
   * @returns {string} Active tab label
   */
  const getActiveTabLabel = () => {
    const tab = tabs.find((t) => t.id === activeTab);
    return tab ? tab.label : 'اطلاعات پایه';
  };

  /**
   * Gets page title based on mode
   * @function getPageTitle
   * @returns {string} Page title
   */
  const getPageTitle = () => {
    if (isEditMode) {
      return `ویرایش API ${apiData?.name ? `- ${apiData.name}` : ''}`;
    }
    return 'ایجاد API جدید';
  };

  /**
   * Gets page subtitle based on mode
   * @function getPageSubtitle
   * @returns {string} Page subtitle
   */
  const getPageSubtitle = () => {
    if (isEditMode) {
      return hasChanges
        ? 'تغییرات ذخیره نشده‌ای دارید'
        : 'ویرایش تنظیمات API برای اتصال به ربات';
    }
    return 'تنظیمات کامل API برای اتصال به ربات';
  };

  /**
   * Gets save button text based on mode and state
   * @function getSaveButtonText
   * @returns {string} Save button text
   */
  const getSaveButtonText = () => {
    if (isSubmitting) {
      return isEditMode ? 'در حال ذخیره...' : 'در حال ذخیره...';
    }
    if (isEditMode) {
      return hasChanges ? 'ذخیره تغییرات' : 'ذخیره شده';
    }
    return 'ذخیره';
  };

  /**
   * Gets save button icon based on mode and state
   * @function getSaveButtonIcon
   * @returns {JSX.Element} Save button icon
   */
  const getSaveButtonIcon = () => {
    if (isSubmitting) {
      return (
        <TbRefresh className="animate-spin text-xs sm:text-sm md:text-base" />
      );
    }
    if (isEditMode && !hasChanges) {
      return <FaCheckCircle className="text-xs sm:text-sm md:text-base" />;
    }
    return <FaSave className="text-xs sm:text-sm md:text-base" />;
  };

  /**
   * Gets save button color based on mode and state
   * @function getSaveButtonColor
   * @returns {string} CSS classes for button color
   */
  const getSaveButtonColor = () => {
    if (isEditMode && !hasChanges) {
      return 'from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600';
    }
    return 'from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600';
  };

  /**
   * Handles back navigation with confirmation for unsaved changes
   * @function handleBackNavigation
   */
  const handleBackNavigation = async () => {
    if (isEditMode && hasChanges) {
      const result = await Swal.fire({
        title: 'تغییرات ذخیره نشده',
        text: 'تغییرات ذخیره نشده‌ای دارید. آیا می‌خواهید ادامه دهید؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، ادامه بده',
        cancelButtonText: 'انصراف',
        reverseButtons: true,
        customClass: {
          confirmButton:
            'bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600',
          cancelButton:
            'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600',
        },
        buttonsStyling: false,
      });

      if (result.isConfirmed) {
        navigate('/api-integrations');
      }
    } else {
      navigate('/api-integrations');
    }
  };

  /**
   * Gets API status badge color
   * @function getStatusColor
   * @returns {string} CSS classes for status badge
   */
  const getStatusColor = () => {
    if (!apiData) return '';

    if (apiData.is_active) {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    } else {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    }
  };

  /**
   * Gets API status text
   * @function getStatusText
   * @returns {string} Status text
   */
  const getStatusText = () => {
    if (!apiData) return '';
    return apiData.is_active ? 'فعال' : 'غیرفعال';
  };

  /**
   * Handles tab selection from mobile menu
   * @function handleTabSelect
   * @param {string} tabId - Selected tab ID
   */
  const handleTabSelect = (tabId) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left section - Back button, icon and title */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <button
              onClick={handleBackNavigation}
              className="p-1 sm:p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="بازگشت"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400 text-sm sm:text-base" />
            </button>
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <div
                className={`p-1 sm:p-1.5 md:p-2 rounded-lg ${isEditMode ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
              >
                {isEditMode ? (
                  <TbEdit className="text-white text-sm sm:text-base md:text-lg" />
                ) : (
                  <TbApi className="text-white text-sm sm:text-base md:text-lg" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0">
                  <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate min-w-0 max-w-[120px] sm:max-w-[200px] md:max-w-none">
                    {getPageTitle()}
                  </h1>

                  {isEditMode && apiData && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span
                        className={`px-1.5 sm:px-2 md:px-3 py-0.5 text-xs font-medium rounded-full ${getStatusColor()} whitespace-nowrap`}
                      >
                        {getStatusText()}
                      </span>
                      {hasChanges && (
                        <div className="flex items-center gap-0.5 text-xs text-amber-600 dark:text-amber-400">
                          <FaExclamationTriangle className="text-[10px] sm:text-xs" />
                          <span className="hidden sm:inline">
                            تغییرات ذخیره نشده
                          </span>
                          <span className="sm:hidden text-[10px]">!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Desktop subtitle */}
                <p className="hidden sm:block text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {getPageSubtitle()}
                </p>

                {/* Mobile subtitle - only show on very small screens */}
                <p className="sm:hidden text-[10px] text-gray-600 dark:text-gray-400 truncate mt-0.5 max-w-[140px]">
                  {getPageSubtitle()}
                </p>
              </div>
            </div>
          </div>

          {/* Right section - Action buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile tab selector */}
            <div className="md:hidden relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-0.5 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-[10px] sm:text-xs md:text-sm"
                aria-label="انتخاب تب"
              >
                <span className="truncate max-w-[50px] sm:max-w-[70px] md:max-w-none">
                  {getActiveTabLabel()}
                </span>
                <TbChevronDown
                  className={`transition-transform text-xs sm:text-sm ${mobileMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {mobileMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabSelect(tab.id)}
                      className={`flex items-center gap-2 w-full px-4 py-3 text-right text-sm ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Preview button (only in edit mode) */}
            {isEditMode && onPreview && (
              <button
                onClick={onPreview}
                className="px-1.5 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 lg:py-2.5 flex items-center gap-0.5 sm:gap-1 md:gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all text-[10px] sm:text-xs md:text-sm"
                aria-label="پیش‌نمایش"
              >
                <TbEye className="text-xs sm:text-sm md:text-base" />
                <span className="hidden xs:inline">پیش‌نمایش</span>
                <span className="xs:hidden sm:inline md:hidden lg:inline">
                  نمایش
                </span>
              </button>
            )}

            {/* Test button - no text on mobile */}
            <button
              onClick={navigateToFullTest}
              className="px-1.5 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 lg:py-2.5 flex items-center gap-0.5 sm:gap-1 md:gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all text-[10px] sm:text-xs md:text-sm"
              aria-label="تست کامل"
            >
              <TbTestPipe className="text-xs sm:text-sm md:text-base" />
              <span className="hidden sm:inline">تست کامل</span>
            </button>

            {/* Save button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (isEditMode && !hasChanges)}
              className={`px-1.5 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 lg:py-2.5 flex items-center gap-0.5 sm:gap-1 md:gap-2 bg-gradient-to-r ${getSaveButtonColor()} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[10px] sm:text-xs md:text-sm`}
              aria-label={getSaveButtonText()}
            >
              {getSaveButtonIcon()}
              <span className="hidden xs:inline">{getSaveButtonText()}</span>
              <span className="xs:hidden">
                {isSubmitting ? '...' : isEditMode ? 'ذخیره' : 'ذخیره'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
