// ./searchDocument/SearchDocument.jsx
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * SearchDocument Component - A responsive search bar for document filtering with search functionality
 * @param {Array} documents - Array of documents to search through
 * @param {function} onSearchResults - Callback function to return search results
 * @param {string} placeholder - Placeholder text for the search input
 * @param {string} searchQuery - Current search query value (optional for controlled component)
 * @param {function} onSearchChange - Function to handle search input changes (optional for controlled component)
 */
const SearchDocument = ({
  documents,
  onSearchResults,
  placeholder = 'جستجو در عنوان اسناد...',
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');

  // Use external search query if provided, otherwise use internal state
  const searchQuery =
    externalSearchQuery !== undefined
      ? externalSearchQuery
      : internalSearchQuery;
  const setSearchQuery = externalOnSearchChange || setInternalSearchQuery;

  // Filter documents based on search query
  const filterDocuments = useCallback(() => {
    if (!searchQuery.trim()) {
      onSearchResults(documents);
      return;
    }

    const filtered = documents.filter(
      (document) =>
        document.title &&
        document.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    onSearchResults(filtered);
  }, [searchQuery, documents, onSearchResults]);

  // Trigger search when search query or documents change
  useEffect(() => {
    filterDocuments();
  }, [searchQuery, documents, filterDocuments]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex-grow max-w-lg mx-auto md:mx-0">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <div className="absolute right-3 top-3 text-gray-400 dark:text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

SearchDocument.propTypes = {
  documents: PropTypes.array.isRequired,
  onSearchResults: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
};

export default SearchDocument;
