import React from 'react';
import WizardButton from './WizardButton';

const WizardButtons = ({ wizards, onWizardSelect }) => {

    return (
        <div className="flex max-md:h-7 h-10 scrollbar-hidden justify-center flex-col overflow-x-scroll max-w-[80%] flex-wrap gap-2 w-2/3 md:w-auto">
            {wizards.map((wizard) => (
                <WizardButton key={wizard.id} wizard={wizard} onWizardClick={onWizardSelect} />
            ))}
        </div>
    );
};

export default WizardButtons;