import React from 'react';
import { WizardButtonStyled } from '../ui/common';

/**
 * WizardButton presentational button to select a wizard
 */
const WizardButton = ({ wizard, onWizardClick }) => {
  const handleWizardClick = () => {
    onWizardClick?.(wizard);
  };

  return (
    <WizardButtonStyled onClick={handleWizardClick}>
      {wizard.icon && (
        <span
          className="wizard-btn__icon"
          style={{ marginInlineEnd: 8, display: 'inline-flex', alignItems: 'center' , position:'relative', top:1 }}
        >
          {wizard.icon}
        </span>
      )}
      <span>{wizard.title}</span>
    </WizardButtonStyled>
  );
};

export default WizardButton;
