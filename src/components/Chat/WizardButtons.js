import React, { useState, useEffect } from 'react';

const WizardButtons = ({ onWizardSelect }) => {
  const [wizards, setWizards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnabledWizards();
  }, []);

  const fetchEnabledWizards = async () => {
    try {
      const response = await fetch('http://localhost:8000/wizards?enabled=true');
      if (!response.ok) {
        throw new Error('خطا در دریافت ویزاردها');
      }
      const data = await response.json();
      setWizards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWizardClick = async (wizardId) => {
    try {
      const response = await fetch(`http://localhost:8000/wizards/${wizardId}`);
      if (!response.ok) {
        throw new Error('خطا در دریافت محتوای ویزارد');
      }
      const data = await response.json();
      onWizardSelect(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm text-center p-4">
        {error}
      </div>
    );
  }

  if (wizards.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center p-4">
        هیچ ویزارد فعالی یافت نشد
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {wizards.map((wizard) => (
        <button
          key={wizard.id}
          onClick={() => handleWizardClick(wizard.id)}
          className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
        >
          {wizard.title}
        </button>
      ))}
    </div>
  );
};

export default WizardButtons; 