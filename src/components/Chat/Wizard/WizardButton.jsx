import { useState } from 'react';
import { WizardButtonStyled } from '../../ui/common';

const WizardButton = ({ wizard, onWizardClick }) => {
  const [error, setError] = useState(null);

  const handleWizardClick = async (wizardId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_CHAT_API_URL}/wizards/${wizardId}?enable_only=true`
      );
      if (!response.ok) {
        throw new Error('خطا در دریافت محتوای ویزارد');
      }
      const data = await response.json();
      onWizardClick(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <WizardButtonStyled
      key={wizard.id}
      onClick={() => {
        handleWizardClick(wizard.id);
      }}
    >
      {wizard.title}
    </WizardButtonStyled>
  );
};

export default WizardButton;
