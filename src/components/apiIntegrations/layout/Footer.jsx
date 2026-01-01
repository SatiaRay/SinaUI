import React from 'react';
import Icon from '@components/ui/Icon';
import Swal from 'sweetalert2';

/**
 * Footer component for API integration page (supports both create and edit modes)
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.navigate - Navigation function
 * @param {Function} props.handleSubmit - Form submit handler
 * @param {boolean} props.isSubmitting - Submitting state
 * @param {Function} props.handleCancel - Cancel handler (optional, defaults to navigate back)
 * @param {boolean} props.isEditMode - Whether in edit mode (default: false)
 * @param {boolean} props.hasChanges - Whether form has unsaved changes (edit mode only)
 * @param {Function} props.onReset - Function to reset form to original values (edit mode only)
 * @param {Function} props.onSaveDraft - Function to save as draft (optional)
 * @param {boolean} props.isDraft - Whether form is in draft mode (create mode only)
 * @returns {JSX.Element} Rendered footer
 */
const Footer = ({
  navigate,
  handleSubmit,
  isSubmitting,
  handleCancel = null,
  isEditMode = false,
  hasChanges = false,
  onReset = null,
  onSaveDraft = null,
  isDraft = false,
}) => {
  /**
   * Gets warning message based on mode
   * @function getWarningMessage
   * @returns {string} Warning message
   */
  const getWarningMessage = () => {
    if (isEditMode) {
      if (hasChanges) {
        return (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Icon name="AlertTriangle" size={14} />
            <span className="font-medium">هشدار:</span> تغییرات ذخیره نشده‌ای
            دارید
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Icon name="Check" size={14} />
            <span className="font-medium">آماده:</span> همه تغییرات ذخیره
            شده‌اند
          </div>
        );
      }
    }

    if (isDraft) {
      return (
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Icon name="History" size={14} />
          <span className="font-medium">پیش‌نویس:</span> می‌توانید بعداً ادامه
          دهید
        </div>
      );
    }

    return (
      <>
        <span className="font-medium">تذکر:</span>{' '}
        {isEditMode
          ? 'پس از ویرایش، API با تنظیمات جدید به‌روزرسانی می‌شود'
          : 'اطلاعات وارد شده پس از ذخیره قابل ویرایش هستند'}
      </>
    );
  };

  /**
   * Gets cancel button text based on mode
   * @function getCancelButtonText
   * @returns {string} Cancel button text
   */
  const getCancelButtonText = () => {
    if (isEditMode) {
      return hasChanges ? 'لغو تغییرات' : 'بازگشت';
    }
    return 'انصراف';
  };

  /**
   * Gets submit button text based on mode and state
   * @function getSubmitButtonText
   * @returns {string} Submit button text
   */
  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return isEditMode ? 'در حال ذخیره...' : 'در حال ذخیره...';
    }
    if (isEditMode) {
      return hasChanges ? 'ذخیره تغییرات' : 'ذخیره شده';
    }
    return isDraft ? 'ذخیره نهایی' : 'ذخیره API جدید';
  };

  /**
   * Gets submit button icon based on mode and state
   * @function getSubmitButtonIcon
   * @returns {JSX.Element} Submit button icon
   */
  const getSubmitButtonIcon = () => {
    if (isSubmitting) {
      return <Icon name="RefreshCw" className="animate-spin" />;
    }
    if (isEditMode && !hasChanges) {
      return <Icon name="Check" />;
    }
    return <Icon name="Save" />;
  };

  /**
   * Gets submit button color based on mode and state
   * @function getSubmitButtonColor
   * @returns {string} CSS classes for button color
   */
  const getSubmitButtonColor = () => {
    if (isEditMode && !hasChanges) {
      return 'from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600';
    }
    if (isDraft) {
      return 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600';
    }
    return 'from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600';
  };

  /**
   * Handles cancel action
   * @function handleCancelAction
   */
  const handleCancelAction = () => {
    if (handleCancel) {
      handleCancel();
    } else {
      navigate('/api-integrations');
    }
  };

  /**
   * Handles reset action with confirmation
   * @async
   * @function handleResetAction
   */
  const handleResetAction = async () => {
    if (!onReset) return;

    if (hasChanges) {
      const result = await Swal.fire({
        title: 'بازنشانی تغییرات',
        text: 'آیا مطمئن هستید که می‌خواهید همه تغییرات را بازنشانی کنید؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، بازنشانی کن',
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
        onReset();
      }
    } else {
      onReset();
    }
  };

  return (
    <footer className="sticky bottom-0 z-50 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
          {/* Left side: Warning/Info message */}
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 md:order-1 flex items-center gap-2">
            {getWarningMessage()}
          </div>

          {/* Right side: Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 order-1 md:order-2 w-full md:w-auto justify-between md:justify-normal">
            {/* Reset button (only in edit mode with changes) */}
            {isEditMode && hasChanges && onReset && (
              <button
                onClick={handleResetAction}
                className="px-3 sm:px-4 py-2 sm:py-2.5 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-xs sm:text-sm flex items-center gap-1 sm:gap-2 justify-center flex-1 md:flex-none"
              >
                <Icon name="RotateCw" />
                <span className="hidden xs:inline">بازنشانی</span>
              </button>
            )}

            {/* Save as draft button (only in create mode) */}
            {!isEditMode && onSaveDraft && (
              <button
                onClick={onSaveDraft}
                disabled={isSubmitting}
                className="px-3 sm:px-4 py-2 sm:py-2.5 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 transition-colors text-xs sm:text-sm flex items-center gap-1 sm:gap-2 justify-center flex-1 md:flex-none"
              >
                <Icon name="Save" />
                <span className="hidden xs:inline">ذخیره پیش‌نویس</span>
                <span className="xs:hidden">پیش‌نویس</span>
              </button>
            )}

            {/* Cancel button */}
            <button
              onClick={handleCancelAction}
              className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm flex items-center gap-1 sm:gap-2 justify-center flex-1 md:flex-none"
            >
              <Icon name="X" />
              <span className="hidden xs:inline">{getCancelButtonText()}</span>
              <span className="xs:hidden">انصراف</span>
            </button>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (isEditMode && !hasChanges)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r ${getSubmitButtonColor()} text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 sm:gap-2 justify-center text-xs sm:text-sm flex-1 md:flex-none`}
            >
              {getSubmitButtonIcon()}
              <span className="hidden xs:inline">{getSubmitButtonText()}</span>
              <span className="xs:hidden">
                {isSubmitting ? '...' : 'ذخیره'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
