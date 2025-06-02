import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDomains } from "../../../../services/api";

const DomainIndex = () => {
    const [domains, setDomains] = useState([])

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const domains = await getDomains();

                setDomains(domains.data)
            } catch (err) {

            }
        }

        fetchDomains()
    }, [])

    return (
        <>
            <div className="flex justify-between mb-3">
                <Link
                    to="/crawl-url"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    خزش URL
                </Link>
            </div>
            <div className="flex gap-2">
                {domains.map((domain) => (
                    <Link
                        key={domain.id}
                        to={`/document/domain/${domain.id}`}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                {domain.domain}
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {domain.document_count} فایل
                            </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <p>تاریخ ایجاد: {new Date(domain.created_at).toLocaleString('fa-IR')}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default DomainIndex;