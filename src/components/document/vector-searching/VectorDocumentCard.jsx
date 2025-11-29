import { Clock, Activity, Database } from 'lucide-react';

/**
 * VectorDocumentCard Component
 * Displays individual vector search collection card
 */
export const VectorDocumentCard = ({ collection }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-all duration-200 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate flex-1 mr-2">
            {collection.title}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
              collection.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {collection.status === 'active' ? 'فعال' : 'غیرفعال'}
          </span>
        </div>
  
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 sm:mb-4 line-clamp-2 flex-1">
          {collection.description}
        </p>
  
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Database className="w-4 h-4" />
            <span className="text-xs sm:text-sm">
              {collection.documentCount} سند
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs sm:text-sm">{collection.lastUpdated}</span>
          </div>
        </div>
  
        {/* Dimensions */}
        {collection.dimensions && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Activity className="w-3 h-3" />
              <span>{collection.dimensions} بعدی</span>
            </div>
          </div>
        )}
      </div>
    );
  };