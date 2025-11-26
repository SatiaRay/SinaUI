import React, { useMemo } from 'react';
import { WizardButtonsContainer } from '../ui/common';
import WizardButton from './WizardButton';
import { useChat } from '../../contexts/ChatContext'; 

/**
 * WizardButtons — render a list of wizard buttons
 */
const WizardButtons = ({ wizards, onWizardSelect }) => {
  const { wizardPath, handleWizardBack } = useChat();

  const wizardsToShow = useMemo(() => {
    if (wizardPath.length === 0) return wizards;

    const backWizard = {
      id: '__back__',
      title: 'بازگشت',
      __type: 'back',
    };

    return [backWizard, ...wizards];
  }, [wizardPath.length, wizards]);

  const handleSelect = (wizard) => {
    if (wizard?.__type === 'back') {
      handleWizardBack();
      return;
    }
    onWizardSelect?.(wizard);
  };

  return (
    <WizardButtonsContainer>
      {wizardsToShow.map((wizard) => (
        <WizardButton
          key={wizard.id}
          wizard={wizard}
          onWizardClick={handleSelect}
        />
      ))}
    </WizardButtonsContainer>
  );
};

export default WizardButtons;
