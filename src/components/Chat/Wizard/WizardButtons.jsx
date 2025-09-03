import React from 'react';
import WizardButton from './WizardButton';

const WizardButtons = ({ wizards, onWizardSelect }) => {
  return (
    <div className="flex w-full gap-2 pb-4 items-center justify-center">
      {wizards.map((wizard) => (
        <WizardButton
          key={wizard.id}
          wizard={wizard}
          onWizardClick={onWizardSelect}
        />
      ))}
    </div>
  );
};

export default WizardButtons;
