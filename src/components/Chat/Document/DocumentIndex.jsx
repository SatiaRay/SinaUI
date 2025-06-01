import DocumentCard from "./DocumentCard";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { getDocuments } from '../../../services/api';

const DocumentIndex = () => {
    const [documentContentLoading, setDocumentContentLoading] = useState(false);
    const [error, setError] = useState(null);
    const [documentContent, setDocumentContent] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documents, setDocuments] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const isManual = location.pathname.endsWith('/manuals');
                const response = await getDocuments(isManual);
                if (response && response.data) {
                    setDocuments(response.data);
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching documents:', err);
            }
        }

        fetchDocuments();
    }, [location.pathname]);

    const handleDocumentCardClick = (document) => {
        fetchDocument(document);
    };

    const fetchDocument = async (document) => {
        setDocumentContentLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/documents/${document.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('خطا در دریافت محتوای فایل');
            }
            const data = await response.json();
            setDocumentContent(data);
            setSelectedDocument(document);
        } catch (err) {

            setError(err.message);
            console.error('Error fetching document content:', err);
        } finally {
            setDocumentContentLoading(false);
        }
    };


    return (
        <>
            {location.pathname.includes('/domain/') && (
                <div className="flex justify-end mb-3">
                    <Link
                        to="/document/domains"
                        className="px-6 py-3 rounded-lg font-medium transition-all bg-gray-300"
                    >
                        بازگشت
                    </Link>
                </div>
            )}
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                {documents.map((document) => (
                    <DocumentCard 
                        key={document.id}
                        document={document} 
                        onStatusChange={async (documentId) => {
                            try {
                                const isManual = location.pathname.endsWith('/manuals');
                                const response = await getDocuments(isManual);
                                if (response && response.data) {
                                    setDocuments(response.data);
                                }
                            } catch (err) {
                                console.error('Error refreshing documents:', err);
                            }
                        }}
                    />
                ))}
            </div>
        </>
    )
}

DocumentIndex.propTypes = {
    documents: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        // Add other document properties as needed
    }))
};

export default DocumentIndex;