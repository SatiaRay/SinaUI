import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WizardButton from '../../../components/wizard/WizardButton';

/**
 * Mocks
 */
jest.mock('../../../components/ui/common', () => ({
  WizardButtonStyled: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe('WizardButton', () => {
  /**
   * Displays title + optional icon
   */
  it('renders title and icon when provided', () => {
    render(<WizardButton wizard={{ id: 1, title: 'T', icon: <i>ICON</i> }} />);
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('ICON')).toBeInTheDocument();
  });

  /**
   * Click calls onWizardClick with wizard
   */
  it('calls onWizardClick with wizard on click', () => {
    const onWizardClick = jest.fn();
    const wizard = { id: 1, title: 'T' };

    render(<WizardButton wizard={wizard} onWizardClick={onWizardClick} />);
    userEvent.click(screen.getByRole('button', { name: 'T' }));

    expect(onWizardClick).toHaveBeenCalledWith(wizard);
  });

  /**
   * Safe when callback missing
   */
  it('does not crash if onWizardClick is undefined', () => {
    render(<WizardButton wizard={{ id: 1, title: 'T' }} />);
    userEvent.click(screen.getByRole('button', { name: 'T' }));
  });
});
