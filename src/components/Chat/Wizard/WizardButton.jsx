import { useState } from "react";

const WizardButton = ({ wizard, onWizardClick }) => {
  const [error, setError] = useState(null);

  const handleWizardClick = async (wizardId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_CHAT_API_URL}/wizards/${wizardId}?enable_only=true`
      );
      if (!response.ok) {
        throw new Error("خطا در دریافت محتوای ویزارد");
      }
      const data = await response.json();
      onWizardClick(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <button
      key={wizard.id}
      onClick={() => {
        handleWizardClick(wizard.id);
      }}
      className="py-1 px-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors box-sizing:border-box"
    >
      {wizard.title}
    </button>
  );
};

export default WizardButton;
