import React from "react";

/**
 * list for Workspace Settings tabs.
 */
export const TABS = [
  { key: "overview", label: "نمای کلی" },
  { key: "members", label: "اعضا" },
  { key: "billing", label: "صورتحساب" },
  { key: "danger", label: "بخش خطرناک" },
];

/**
 * InfoRow
 * A small row component to show workspace info as label/value.
 *
 * @params {string} label Row title text.
 * @params {string | number | React.ReactNode} value Row value.
 * @return {JSX.Element} Rendered info row.
 */
export const InfoRow = ({ label, value, variant = "default", icon }) => {
  const badgeStyles = {
    "badge-blue":
      "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800/50",
    "badge-gray":
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-100 dark:border-gray-600",
  };

  const isBadge = variant !== "default";
  const style = isBadge
    ? badgeStyles[variant]
    : "text-base md:text-lg font-extrabold text-gray-900 dark:text-white";

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/50 border border-gray-200/70 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-200 flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
          {label}
        </span>
      </div>

      {isBadge ? (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${style}`}
        >
          {value || "—"}
        </span>
      ) : (
        <span className={style}>{value || "—"}</span>
      )}
    </div>
  );
};
