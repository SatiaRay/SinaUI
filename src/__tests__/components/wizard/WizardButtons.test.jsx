import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WizardButtons from '../../../components/wizard/WizardButtons';
import { useChat } from '../../../contexts/ChatContext';

/**
 * Mocks
 */
jest.mock('../../../contexts/ChatContext', () => ({ useChat: jest.fn() }));
jest.mock('../../../components/ui/common', () => ({
  WizardButtonsContainer: ({ children }) => <div>{children}</div>,
  WizardButtonStyled: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe('WizardButtons', () => {
  const chat = (o = {}) =>
    useChat.mockReturnValue({
      wizardPath: [],
      handleWizardBack: jest.fn(),
      ...o,
    });

  beforeEach(() => jest.clearAllMocks());

  /**
   * Renders provided wizards
   */
  it('renders buttons for wizards', () => {
    chat();
    render(
      <WizardButtons
        wizards={[
          { id: 1, title: 'A' },
          { id: 2, title: 'B' },
        ]}
      />
    );
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'B' })).toBeInTheDocument();
  });

  /**
   * When wizardPath not empty, shows "بازگشت" button first
   */
  it('prepends back button when wizardPath has items', () => {
    chat({ wizardPath: [1] });
    render(<WizardButtons wizards={[{ id: 1, title: 'A' }]} />);

    expect(screen.getByRole('button', { name: /بازگشت/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
  });

  /**
   * Click back triggers handleWizardBack
   */
  it('clicking back calls handleWizardBack', () => {
    const handleWizardBack = jest.fn();
    chat({ wizardPath: [1], handleWizardBack });

    render(<WizardButtons wizards={[{ id: 1, title: 'A' }]} />);
    userEvent.click(screen.getByRole('button', { name: /بازگشت/ }));

    expect(handleWizardBack).toHaveBeenCalled();
  });

  /**
   * Click wizard calls onWizardSelect
   */
  it('clicking wizard calls onWizardSelect', () => {
    chat();
    const onWizardSelect = jest.fn();
    const w = { id: 1, title: 'A' };

    render(<WizardButtons wizards={[w]} onWizardSelect={onWizardSelect} />);
    userEvent.click(screen.getByRole('button', { name: 'A' }));

    expect(onWizardSelect).toHaveBeenCalledWith(w);
  });
});
