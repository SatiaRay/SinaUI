import React from 'react';
import { WizardButtonsContainer } from '../../ui/common';
import WizardButton from './WizardButton';

const WizardButtons = ({ wizards, onWizardSelect }) => {
  return (
    <WizardButtonsContainer>
      {wizards.map((wizard) => (
        <WizardButton
          key={wizard.id}
          wizard={wizard}
          onWizardClick={onWizardSelect}
        />
      ))}
    </WizardButtonsContainer>
  );
};

export default WizardButtons;
