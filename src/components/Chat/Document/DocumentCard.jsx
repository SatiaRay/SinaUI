import { Link, Navigate } from "react-router-dom";

const DocumentCard = ({ document, onCardClick }) => {
    return (
        <Link
            key={document.id}
            to={`/document/edit/${document.id}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {document.title || document.uri}
                </h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${document.vector_id
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                    {document.vector_id ? 'فعال' : 'غیر فعال'}
                </span>
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <p>آدرس: {document.uri}</p>
            </div>
        </Link>
    )
}

export default DocumentCard;