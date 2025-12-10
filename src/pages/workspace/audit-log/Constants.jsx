/**
 * Audit Log UI Constants
 * Shared styles/labels/utilities used in audit-log components.
 */

export const ACTION_STYLE = {
    create:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    update: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    invite:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    login: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  };
  
  export const ACTION_LABEL = {
    create: "ایجاد",
    update: "ویرایش",
    delete: "حذف",
    invite: "دعوت",
    login: "ورود",
  };
  
  /**
   * Format ISO date to fa-IR localized date/time.
   * @params {string} iso ISO date string
   * @return {string} localized formatted datetime
   */
  export const fmt = (iso) =>
    new Date(iso).toLocaleString("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  