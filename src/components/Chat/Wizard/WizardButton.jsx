import React from 'react';
import { WizardButtonStyled } from '../../ui/common';
import { useGetWizardQuery } from '../../../store/api/AiApi';

/**
 * WizardButton component for triggering wizard selection
 */
const WizardButton = ({ wizard, onWizardClick }) => {
  /**
   * Wizard data query hook
   */
  const { data, isLoading, isError, error } = useGetWizardQuery({ id: wizard.id, enableOnly: true }, {
    skip: !wizard.id,
  });

  /**
   * Handle wizard click with fetched data
   */
  const handleWizardClick = () => {
    if (!isLoading && !isError && data) {
      onWizardClick(data);
    }
  };

  return (
    <WizardButtonStyled
      key={wizard.id}
      onClick={handleWizardClick}
      disabled={isLoading || isError}
    >
      {wizard.title}
    </WizardButtonStyled>
  );
};

export default WizardButton;