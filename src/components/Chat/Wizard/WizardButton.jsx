import { useState } from 'react';
import { WizardButtonStyled } from '../../ui/common';
import { wizardEndpoints } from '../../../utils/apis';

const WizardButton = ({ wizard, onWizardClick }) => {
  const [error, setError] = useState(null);

  const handleWizardClick = async (wizardId) => {
    try {
      const data = await wizardEndpoints.getWizard(wizardId);
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
