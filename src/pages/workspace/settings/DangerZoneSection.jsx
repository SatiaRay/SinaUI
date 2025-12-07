import React from 'react';

/**
 * DangerZonePlaceholder
 * Temporary placeholder shown for the Danger Zone tab.
 *
 * @return {JSX.Element} Rendered danger zone placeholder.
 */
const DangerZoneSection = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-red-200 dark:border-red-700 text-center">
    <p className="text-red-600 dark:text-red-300">
      بخش خطرناک (حذف/ترک فضای کاری) بعداً فعال می‌شود.
    </p>
  </div>
);

export default DangerZoneSection;
