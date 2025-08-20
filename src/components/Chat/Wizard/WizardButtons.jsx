import React from 'react';
import WizardButton from './WizardButton';

const WizardButtons = ({ wizards, onWizardSelect }) => {


    return (
        <div className="flex flex-wrap gap-2 py-4">
            {wizards.map((wizard) => (
                <WizardButton key={wizard.id} wizard={wizard} onWizardClick={onWizardSelect} />
            ))}
        </div>
    );
};

export default WizardButtons;