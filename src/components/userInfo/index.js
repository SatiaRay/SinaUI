import { UserCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function UserInfo() {
  return (
    <div className="flex items-center space-x-2">
    <div className="relative text-left">
      <button
        onClick={toggleUserDropdown}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
      >
        <UserCircleIcon className="h-6 w-6 ml-3" />
        <span className="font-medium">
          {`${user.first_name} ${user.last_name}` || user.email}
        </span>
      </button>
      {userDropdownOpen && (
        <div className="absolute left-0 mt-2 origin-top-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
          <div className="py-3">
            <div className="p-3">
              {user.current_workspace?.name || ""}
            </div>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleLogout}
            >
              خروج
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
