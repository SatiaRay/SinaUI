export const Pagination = ({page, perpage, totalPages, totalItems, handlePageSizeChange, handlePageChange}) => {
    if(totalPages == 1)
      return null;

    return (
      <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4">
        {/* <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            تعداد آیتم در هر صفحه:
          </label>
          <select
            id="pageSize"
            value={perpage}
            onChange={handlePageSizeChange}
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div> */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:border-gray-600 ${
              page === 1
                ? 'dark:text-gray-600 text-gray-400'
                : 'dark:text-white text-black'
            }`}
          >
            قبلی
          </button>
          <span className="mx-4">
            صفحه {page} از {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:border-gray-600 ${
              page === totalPages
                ? 'dark:text-gray-600 text-gray-400'
                : 'dark:text-white text-black'
            }`}
          >
            بعدی
          </button>
        </div>
      </div>
    );
  };