import React, { useMemo } from 'react';
import { WizardButtonsContainer } from '../ui/common';
import WizardButton from './WizardButton';
import { useChat } from '../../contexts/ChatContext';

const WizardButtons = ({ wizards, onWizardSelect }) => {
  const { wizardPath, handleWizardBack } = useChat();

  const wizardsToShow = useMemo(() => {
    const list = [...wizards];

    if (wizardPath.length > 0) {
      const backButton = {
        id: '__back__',
        title: 'بازگشت',
        icon: '←',
        __type: 'back',
      };
      list.unshift(backButton); 
    }

    return list;
  }, [wizards, wizardPath.length]);

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