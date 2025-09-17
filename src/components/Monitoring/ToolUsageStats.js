// ToolUsageStats.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { monitoringEndpoints } from '../../utils/apis';
import { Loader2, AlertCircle, Calendar, BarChart3 } from 'lucide-react';

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
  '#26539D',
  '#0A7653',
  '#9D6507',
  '#3F419A',
  '#593B9D',
  '#972E62',
  '#0D766A',
  '#1B3C71',
  '#07553B',
  '#714905',
  '#2E2F6F',
  '#402A71',
  '#6D2146',
  '#09554C',
  '#BFD6FC',
  '#B1E8D6',
  '#FCDFB0',
  '#CCCDFA',
  '#D9CAFC',
  '#F9C4DE',
  '#B3E8E2',
  '#93BAFA',
  '#7CD8BA',
  '#FACA79',
  '#A9ABF7',
  '#BFA5FA',
  '#F59AC7',
  '#7ED8CE',
  '#306BCA',
  '#0D986A',
  '#C98209',
  '#5154C6',
  '#724BCA',
  '#C23B7D',
  '#109788',
  '#112445',
  '#043424',
  '#452C03',
  '#1C1D43',
  '#271A45',
  '#42142B',
  '#06342E',
  '#060D19',
  '#02130D',
  '#191001',
  '#0A0A18',
  '#0E0919',
  '#18070F',
  '#021211',
];

const truncateLabel = (label, maxLength = 12) =>
  label.length > maxLength ? label.slice(0, maxLength) + '…' : label;

const ErrorAlert = ({ message, onRetry, type = 'general' }) => {
  const themes = {
    general: {
      title: 'خطا',
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-300 dark:border-red-700',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-500 dark:text-red-400',
    },
    validation: {
      title: 'مقدار نامعتبر',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      border: 'border-amber-300 dark:border-amber-700',
      text: 'text-amber-800 dark:text-amber-200',
      icon: 'text-amber-500 dark:text-amber-400',
    },
  };
  const theme = themes[type] || themes.general;

  return (
    <div
      className={`p-4 mb-4 ${theme.bg} border ${theme.border} rounded-lg flex items-start gap-3 animate-fadeIn`}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className={`h-6 w-6 ${theme.icon} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`font-medium ${theme.text}`}>{theme.title}</p>
        <p className={`${theme.text} text-sm mt-1`}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
          >
            تلاش مجدد
          </button>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ tool, loading }) => (
  <div
    className="rounded-2xl shadow-md p-4 flex flex-col items-center border border-gray-200 dark:border-gray-700
      bg-white dark:bg-gray-900 transition-all hover:shadow-xl hover:scale-[1.02] h-full animate-fadeIn"
    style={{ borderTop: `4px solid ${tool.color}` }}
  >
    <p className="font-bold text-lg mb-2 text-gray-800 dark:text-white text-center break-words whitespace-normal">
      {tool.fullName}
    </p>

    {loading ? (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    ) : (
      <div className="text-center w-full">
        <p
          className="text-2xl font-extrabold mb-1 drop-shadow"
          style={{ color: tool.color }}
        >
          {tool.total.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          تعداد فراخوانی
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-100 dark:border-gray-800 pt-3">
          <div className="text-gray-500 dark:text-gray-400">میانگین مدت:</div>
          <div className="text-gray-800 dark:text-white">
            {tool.avg_duration.toFixed(2)}ms
          </div>

          <div className="text-gray-500 dark:text-gray-400">تعداد خطا:</div>
          <div
            className={
              tool.error_count > 0 ? 'text-red-500 font-bold' : 'text-green-500'
            }
          >
            {tool.error_count.toLocaleString()}
          </div>
        </div>
      </div>
    )}
  </div>
);

export default function ToolUsageStats() {
  const [toolStats, setToolStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(7);
  const [inputValue, setInputValue] = useState('7');

  const getIsDark = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  }, []);

  const [isDark, setIsDark] = useState(getIsDark);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mo = new MutationObserver(() => {
      setIsDark(getIsDark());
    });

    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const mm =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const onPrefChange = () => setIsDark(getIsDark());
    mm && mm.addEventListener && mm.addEventListener('change', onPrefChange);

    return () => {
      mo.disconnect();
      mm &&
        mm.removeEventListener &&
        mm.removeEventListener('change', onPrefChange);
    };
  }, [getIsDark]);

  useEffect(() => {
    if (days > 0) fetchToolStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const fetchToolStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await monitoringEndpoints.getToolStats(days, 20);
      const formattedData = statsData.map((tool, index) => ({
        key: tool.tool,
        label: truncateLabel(tool.tool.split('.').pop(), 12),
        fullName: tool.tool,
        total: tool.call_count,
        avg_duration: tool.avg_duration,
        error_count: tool.error_count,
        color: colors[index % colors.length],
      }));
      setToolStats(formattedData);
    } catch (err) {
      console.error('Error fetching tool stats:', err);
      setError('خطا در دریافت داده‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleDaysChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === '') {
      setDays(7);
      setError(null);
      return;
    }

    const num = Number(value);
    if (/^\d+$/.test(value) && num > 0 && num <= 365) {
      setDays(num);
      setError(null);
    } else {
      setError('validation');
    }
  };

  const handleKeyDown = (e) => {
    if (
      !/[0-9]/.test(e.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const gridClasses = () => {
    const count = toolStats.length;
    if (count <= 2) return 'grid-cols-1 sm:grid-cols-2 justify-center';
    if (count <= 4)
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center';
  };

  const errorColor = isDark ? '#F87171' : '#EF4444';

  const nivoTheme = {
    axis: {
      ticks: {
        text: { fill: isDark ? '#E5E7EB' : '#374151', fontSize: 12 },
      },
      legend: { text: { fill: isDark ? '#E5E7EB' : '#374151' } },
    },
    labels: { text: { fill: isDark ? '#E5E7EB' : '#374151' } },
    grid: {
      line: { stroke: isDark ? '#374151' : '#E5E7EB', strokeOpacity: 0.25 },
    },
    tooltip: { container: {} },
  };

  return (
    // مهم: min-h-screen + overflow-y-auto روی این دیو باعث میشه "کل صفحه" اسکرول کنه
    <div className="min-h-screen flex-1 flex-col p-4 bg-gray-50 dark:bg-gray-800 rounded-lg gap-6 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            آمار استفاده از ابزارها
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-300" />
          <label
            htmlFor="days-input"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
          >
            بازه زمانی:
          </label>
          <input
            id="days-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={handleDaysChange}
            onKeyDown={handleKeyDown}
            className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="7"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            روز گذشته
          </span>
        </div>
      </div>

      {/* Alerts */}
      {error === 'validation' && (
        <ErrorAlert
          message="لطفاً یک عدد بین ۱ تا ۳۶۵ وارد کنید."
          type="validation"
        />
      )}
      {error && error !== 'validation' && (
        <ErrorAlert message={error} onRetry={fetchToolStats} />
      )}

      {/* Cards — note: added mb-6 so cards don't stick to the chart below */}
      <div className={`grid ${gridClasses()} gap-4 mb-6`}>
        {toolStats.map((tool) => (
          <StatCard key={tool.key} tool={tool} loading={loading} />
        ))}
      </div>

      {/* Chart wrapper — added mt-4 for a bit more breathing room */}
      <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            نمودار تعداد فراخوانی و خطاهای ابزارها
          </h3>
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded"
                style={{ background: errorColor }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                خطا
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded"
                style={{ background: toolStats[0]?.color ?? '#3B82F6' }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                فراخوانی
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : toolStats.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh] text-gray-500 dark:text-gray-400">
            هیچ داده‌ای برای نمایش وجود ندارد
          </div>
        ) : (
          // ارتفاع نمودار هنوز تعیین شده، اما چون overflow روی والد نیست، اسکرول به صفحه منتقل میشه
          <div className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]">
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
    </div>
  );
}
