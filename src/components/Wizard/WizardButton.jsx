import React from 'react';
import { WizardButtonStyled } from '../ui/common';

/**
 * WizardButton presentational button to select a wizard
 */
const WizardButton = ({ wizard, onWizardClick }) => {
  /**
   * Handle button click
   */
  const handleWizardClick = () => {
    onWizardClick?.(wizard);
  };

  return (
    <WizardButtonStyled key={wizard.id} onClick={handleWizardClick}>
      {wizard.title}
    </WizardButtonStyled>
  );
};

export default WizardButton;
