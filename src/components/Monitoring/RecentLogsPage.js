import React, { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { monitoringEndpoints } from '../../utils/apis';
import LogCard from './LogCard';

const RecentLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // فیلترها
  const [search, setSearch] = useState('');
  const [hasErrors, setHasErrors] = useState('all'); // all | true | false
  const [hours, setHours] = useState(24); // بازه زمانی
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');

  // دریافت لاگ‌ها
  const fetchLogs = useCallback(
    async (pageNum = 1) => {
      try {
        setLoading(true);

        const calculatedHours = hours ? Number(hours) : 24;

        const data = await monitoringEndpoints.getRecentLogs({
          hours: calculatedHours,
          has_errors: hasErrors === 'all' ? undefined : hasErrors,
          min_duration: minDuration ? Number(minDuration) : undefined,
          max_duration: maxDuration ? Number(maxDuration) : undefined,
          page: pageNum,
          per_page: 12,
        });

        setLogs(data.items || []);
        setPage(data.page);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    },
    [hours, hasErrors, minDuration, maxDuration]
  );

  // وقتی فیلتر تغییر کند → بره صفحه ۱
  useEffect(() => {
    setPage(1);
    fetchLogs(1);
  }, [hours, hasErrors, minDuration, maxDuration, fetchLogs]);

  // وقتی صفحه تغییر کند → همان صفحه را بیاورد
  useEffect(() => {
    fetchLogs(page);
  }, [page, fetchLogs]);

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-hide">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">
          لاگ‌های اخیر
        </h1>

        {/* فیلترها */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* سرچ */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو بر اساس ابزار یا کاربر..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-3 pr-10 py-3 text-base border rounded-lg 
                         dark:bg-gray-700 dark:text-white dark:border-gray-600 
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* فیلتر خطا */}
            <select
              value={hasErrors}
              onChange={(e) => setHasErrors(e.target.value)}
              className="w-full px-3 py-3 text-base border rounded-lg 
                       dark:bg-gray-700 dark:text-white dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">همه</option>
              <option value="true">فقط خطاها</option>
              <option value="false">فقط بدون خطا</option>
            </select>

            {/* بازه ساعتی */}
            <input
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="بازه ساعتی (مثلاً 72)"
              value={hours}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || Number(val) >= 0) setHours(val);
              }}
              className="w-full px-4 py-3 text-base border rounded-lg 
                       dark:bg-gray-700 dark:text-white dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-primary-500 
                       appearance-none 
                       [&::-webkit-outer-spin-button]:appearance-none 
                       [&::-webkit-inner-spin-button]:appearance-none"
            />

            {/* حداقل مدت */}
            <input
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="حداقل مدت (ms)"
              value={minDuration}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || Number(val) >= 0) setMinDuration(val);
              }}
              className="w-full px-4 py-3 text-base border rounded-lg 
                       dark:bg-gray-700 dark:text-white dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-primary-500 
                       appearance-none 
                       [&::-webkit-outer-spin-button]:appearance-none 
                       [&::-webkit-inner-spin-button]:appearance-none"
            />

            {/* حداکثر مدت */}
            <input
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="حداکثر مدت (ms)"
              value={maxDuration}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || Number(val) >= 0) setMaxDuration(val);
              }}
              className="w-full px-4 py-3 text-base border rounded-lg 
                       dark:bg-gray-700 dark:text-white dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-primary-500 
                       appearance-none 
                       [&::-webkit-outer-spin-button]:appearance-none 
                       [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">در حال بارگذاری...</p>
        ) : logs.length === 0 ? (
          <p className="text-center text-gray-500">هیچ لاگی یافت نشد.</p>
        ) : (
          <>
            {/* کارت‌ها */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {logs
                .filter(
                  (log) =>
                    log.tool?.toLowerCase().includes(search.toLowerCase()) ||
                    log.user_id?.toLowerCase().includes(search.toLowerCase())
                )
                .map((log) => (
                  <LogCard key={log.id} log={log} />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm font-medium 
                         bg-gray-200 dark:bg-gray-700 
                         text-gray-700 dark:text-gray-200 
                         disabled:opacity-50 hover:bg-gray-300 
                         dark:hover:bg-gray-600 transition"
              >
                قبلی
              </button>

              <span className="text-sm dark:text-gray-300">
                صفحه {page} از {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-medium 
                         bg-gray-200 dark:bg-gray-700 
                         text-gray-700 dark:text-gray-200 
                         disabled:opacity-50 hover:bg-gray-300 
                         dark:hover:bg-gray-600 transition"
              >
                بعدی
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecentLogsPage;
