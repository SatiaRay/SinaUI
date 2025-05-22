import React, { useState, useEffect } from 'react';
import CreateWizard from './CreateWizard';

const WizardIndex = () => {
  const [wizards, setWizards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  useEffect(() => {
    fetchWizards();
  }, []);

  const fetchWizards = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/wizards`);
      if (!response.ok) {
        throw new Error('خطا در دریافت لیست ویزاردها');
      }
      const data = await response.json();
      setWizards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWizardCreated = (newWizard) => {
    setWizards(prevWizards => [newWizard, ...prevWizards]);
  };

  const toggleWizardStatus = async (wizardId, currentStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [wizardId]: true }));
    try {
      const endpoint = currentStatus ? 'disable' : 'enable';
      const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/${wizardId}/${endpoint}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('خطا در تغییر وضعیت ویزارد');
      }

      // Update the local state
      setWizards(prevWizards =>
        prevWizards.map(wizard =>
          wizard.id === wizardId
            ? { ...wizard, enabled: !currentStatus }
            : wizard
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [wizardId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <button
          onClick={fetchWizards}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">پاسخ‌های ویزارد</h2>
        <button
          onClick={() => setShowCreateWizard(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          ایجاد ویزارد جدید
        </button>
      </div>

      {showCreateWizard && (
        <CreateWizard 
          onClose={() => setShowCreateWizard(false)}
          onWizardCreated={handleWizardCreated}
        />
      )}

      {wizards.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            هیچ ویزاردی یافت نشد
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wizards.map((wizard) => (
            <div
              key={wizard.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {wizard.title}
                  </h3>
                  <button
                    onClick={() => toggleWizardStatus(wizard.id, wizard.enabled)}
                    disabled={updatingStatus[wizard.id]}
                    className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                      wizard.enabled
                        ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                        : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {updatingStatus[wizard.id] ? (
                      <div className="flex items-center gap-1">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                        <span>در حال تغییر...</span>
                      </div>
                    ) : wizard.enabled ? (
                      'فعال'
                    ) : (
                      'غیرفعال'
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>شناسه: {wizard.id}</span>
                  <span>
                    {new Date(wizard.created_at).toLocaleString('fa-IR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WizardIndex; 