import React, { useEffect, useState, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useGetToolStatsQuery } from '../../../store/api/ai-features/monitoringLogsApi';
import {
  Loader2,
  Calendar,
  BarChart3,
  Filter,
  ChevronDown,
} from 'lucide-react';
import {
  HeaderSkeleton,
  CardsGridSkeleton,
  ChartSkeleton,
} from './ToolUsageSkeletons';
import Error from '../../../components/Error';

/**
 * Color palette for chart and cards
 * Provides consistent coloring across the component
 */
const colors = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#679EF8',
  '#46C99D',
  '#F7B442',
  '#8688F4',
  '#A581F8',
  '#F071B0',
  '#49C8BA',
];

/**
 * Truncates long labels for better display in charts
 * @param {string} label - Original label text
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Truncated label
 */
const truncateLabel = (label, maxLength = 12) =>
  label.length > maxLength ? label.slice(0, maxLength) + '…' : label;

/**
 * ErrorAlert Component for validation errors
 * Displays validation error messages
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 */
const ValidationError = ({ message }) => (
  <div
    className="p-4 mb-4 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-xl flex items-start gap-3 animate-fadeIn"
    role="alert"
    aria-live="polite"
  >
    <div className="flex-1">
      <p className="font-medium text-amber-800 dark:text-amber-200">
        مقدار نامعتبر
      </p>
      <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">
        {message}
      </p>
    </div>
  </div>
);

/**
 * StatCard Component
 * Displays individual tool statistics in card format
 * @param {Object} props - Component props
 * @param {Object} props.tool - Tool statistics data
 * @param {boolean} props.loading - Loading state
 */
const StatCard = ({ tool, loading }) => (
  <div
    className="rounded-2xl shadow-lg p-6 flex flex-col items-center border border-gray-200 dark:border-gray-700
      bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-full animate-fadeIn group"
    style={{ borderTop: `4px solid ${tool.color}` }}
  >
    <p className="font-bold text-lg mb-3 text-gray-800 dark:text-white text-center break-words whitespace-normal line-clamp-2">
      {tool.fullName}
    </p>

    {loading ? (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    ) : (
      <div className="text-center w-full">
        <p
          className="text-3xl font-extrabold mb-2 drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
          style={{ color: tool.color }}
        >
          {tool.total.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          تعداد فراخوانی
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="text-gray-500 dark:text-gray-400 text-left">
            میانگین مدت:
          </div>
          <div className="text-gray-800 dark:text-white text-right font-medium">
            {tool.avg_duration.toFixed(2)}ms
          </div>

          <div className="text-gray-500 dark:text-gray-400 text-left">
            تعداد خطا:
          </div>
          <div
            className={`text-right font-medium ${
              tool.error_count > 0 ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {tool.error_count.toLocaleString()}
          </div>
        </div>
      </div>
    )}
  </div>
);

/**
 * CustomSelect Component for better dark mode support
 */
const CustomSelect = ({ value, onChange, options }) => (
  <div className="relative flex-1 min-w-0">
    <select
      value={value}
      onChange={onChange}
      className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl
               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
               appearance-none cursor-pointer transition-all duration-200"
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
  </div>
);

/**
 * ToolUsageStats Component
 * Main component for displaying tool usage statistics with charts and cards
 * Uses RTK Query for efficient data fetching and caching
 */
export default function ToolUsageStats() {
  const [days, setDays] = useState(7);
  const [inputValue, setInputValue] = useState('7');
  const [validationError, setValidationError] = useState(null);
  const [sortBy, setSortBy] = useState('total'); // total | errors | duration
  const [isDark, setIsDark] = useState(false);

  /**
   * RTK Query hook for fetching tool statistics
   * Automatically handles loading, error, and caching states
   */
  const {
    data: statsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetToolStatsQuery(
    { days, top_n: 20 },
    {
      skip: days <= 0,
    }
  );

  /**
   * Handle retry action for error state
   * Triggers refetch of data
   */
  const handleRetry = () => {
    refetch();
  };

  /**
   * Effect to monitor dark mode changes
   * Updates theme when system or user preference changes
   */
  useEffect(() => {
    const updateDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    // Initial check
    updateDarkMode();

    // Observe class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      // Only update if no manual theme is set
      const hasManualTheme = localStorage.getItem('theme');
      if (!hasManualTheme) {
        updateDarkMode();
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  /**
   * Format and sort tool statistics data for display
   * Transforms API response to component-friendly format
   */
  const toolStats = React.useMemo(() => {
    if (!statsData) return [];

    const formattedData = statsData.map((tool, index) => ({
      key: tool.tool,
      label: truncateLabel(tool.tool.split('.').pop(), 12),
      fullName: tool.tool,
      total: tool.call_count,
      avg_duration: tool.avg_duration,
      error_count: tool.error_count,
      color: colors[index % colors.length],
    }));

    // Sort data based on selected criteria
    return formattedData.sort((a, b) => {
      switch (sortBy) {
        case 'errors':
          return b.error_count - a.error_count;
        case 'duration':
          return b.avg_duration - a.avg_duration;
        case 'total':
        default:
          return b.total - a.total;
      }
    });
  }, [statsData, sortBy]);

  /**
   * Handle days input change with validation
   * @param {Object} e - Change event
   */
  const handleDaysChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === '') {
      setDays(7);
      setValidationError(null);
      return;
    }

    const num = Number(value);
    if (/^\d+$/.test(value) && num > 0 && num <= 365) {
      setDays(num);
      setValidationError(null);
    } else {
      setValidationError('validation');
    }
  };

  /**
   * Handle keyboard events for numeric input
   * @param {Object} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (
      !/[0-9]/.test(e.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  /**
   * Determine grid classes based on number of tool stats
   * @returns {string} CSS grid classes
   */
  const gridClasses = () => {
    const count = toolStats.length;
    if (count <= 2) return 'grid-cols-1 sm:grid-cols-2 justify-center';
    if (count <= 4)
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center';
  };

  const errorColor = isDark ? '#F87171' : '#EF4444';

  /**
   * Nivo chart theme configuration
   * Adapts to dark/light mode
   */
  const nivoTheme = {
    background: 'transparent',
    textColor: isDark ? '#e5e7eb' : '#374151',
    fontSize: 12,
    axis: {
      domain: {
        line: {
          stroke: isDark ? '#4b5563' : '#d1d5db',
          strokeWidth: 1,
        },
      },
      ticks: {
        line: {
          stroke: isDark ? '#4b5563' : '#d1d5db',
          strokeWidth: 1,
        },
        text: {
          fill: isDark ? '#e5e7eb' : '#374151',
          fontSize: 11,
        },
      },
      legend: {
        text: {
          fill: isDark ? '#e5e7eb' : '#374151',
          fontSize: 12,
        },
      },
    },
    grid: {
      line: {
        stroke: isDark ? '#374151' : '#e5e7eb',
        strokeWidth: 1,
        strokeOpacity: 0.25,
      },
    },
    legends: {
      text: {
        fill: isDark ? '#e5e7eb' : '#374151',
        fontSize: 11,
      },
    },
    labels: {
      text: {
        fill: isDark ? '#e5e7eb' : '#374151',
        fontSize: 11,
      },
    },
    tooltip: {
      container: {
        background: isDark ? '#374151' : '#ffffff',
        color: isDark ? '#e5e7eb' : '#374151',
        fontSize: '12px',
        borderRadius: '6px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  };

  // Select options for sorting
  const sortOptions = [
    { value: 'total', label: 'مرتب‌سازی بر اساس تعداد' },
    { value: 'errors', label: 'مرتب‌سازی بر اساس خطا' },
    { value: 'duration', label: 'مرتب‌سازی بر اساس مدت' },
  ];

  // If there's an API error (not validation error), show only the Error component
  if (isError && !validationError) {
    return (
      <>
        <Error error={error} onRetry={handleRetry} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex-1 flex-col p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 gap-6 overflow-y-auto scrollbar-hide">
      {/* Header Section - Show skeleton when loading */}
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                آمار استفاده از ابزارها
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                تحلیل عملکرد و استفاده از ابزارهای سیستم
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Sort Filter */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 min-w-[200px]">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-300 flex-shrink-0" />
              <CustomSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
              />
            </div>

            {/* Days Filter */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-300 flex-shrink-0" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                بازه زمانی:
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputValue}
                onChange={handleDaysChange}
                onKeyDown={handleKeyDown}
                className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="7"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                روز گذشته
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Section */}
      {validationError && (
        <ValidationError message="لطفاً یک عدد بین ۱ تا ۳۶۵ وارد کنید." />
      )}

      {/* Statistics Cards Section - Show skeleton when loading */}
      {isLoading ? (
        <CardsGridSkeleton count={8} />
      ) : (
        <div className={`grid ${gridClasses()} gap-4 sm:gap-6 mb-8`}>
          {toolStats.map((tool) => (
            <StatCard key={tool.key} tool={tool} loading={isLoading} />
          ))}
        </div>
      )}

      {/* Chart Section - Show skeleton when loading */}
      {isLoading ? (
        <ChartSkeleton isDark={isDark} />
      ) : (
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              نمودار مقایسه‌ای ابزارها
            </h3>

            {/* Chart Legend */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded"
                  style={{ background: errorColor }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  تعداد خطاها
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded"
                  style={{ background: toolStats[0]?.color ?? '#3B82F6' }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  تعداد فراخوانی‌ها
                </span>
              </div>
            </div>
          </div>

          {/* Chart Content */}
          {toolStats.length === 0 ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  هیچ داده‌ای برای نمایش وجود ندارد
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  در بازه زمانی انتخاب شده هیچ استفاده‌ای از ابزارها ثبت نشده
                  است. بازه زمانی یا فیلترها را تغییر دهید.
                </p>
              </div>
            </div>
          ) : (
            <div
              className="w-full"
              style={{
                height: `${Math.min(80, toolStats.length * 20 + 40)}vh`,
                maxHeight: '600px',
                minHeight: '400px',
              }}
            >
              <ResponsiveBar
                data={toolStats}
                keys={['total', 'error_count']}
                indexBy="label"
                margin={{ top: 20, right: 80, bottom: 110, left: 80 }}
                padding={0.25}
                groupMode="grouped"
                colors={({ id, data }) =>
                  id === 'error_count' ? errorColor : data.color
                }
                borderRadius={6}
                enableLabel={false}
                maxValue="auto"
                axisBottom={{
                  tickRotation: -45,
                  tickSize: 5,
                  tickPadding: 10,
                  format: (v) => truncateLabel(String(v), 14),
                  legend: 'ابزار',
                  legendPosition: 'middle',
                  legendOffset: 64,
                }}
                axisLeft={{
                  format: (value) => Number(value).toLocaleString(),
                  legend: 'تعداد',
                  legendPosition: 'middle',
                  legendOffset: -60,
                }}
                theme={nivoTheme}
                animate={true}
                motionConfig="gentle"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
