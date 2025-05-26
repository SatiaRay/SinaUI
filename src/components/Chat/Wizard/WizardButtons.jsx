import React, { useState, useEffect } from 'react';
import WizardButton from './WizardButton';

const WizardButtons = ({ onWizardSelect }) => {
  const [wizards, setWizards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnabledWizards();
  }, []);

  const fetchEnabledWizards = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/wizards/roots`);
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

  const handleWizardClick = async (wizard) => {
    onWizardSelect(wizard)
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
        <WizardButton wizard={wizard} onWizardClick={handleWizardClick} />
      ))}
    </div>
  );
};

export default WizardButtons; 