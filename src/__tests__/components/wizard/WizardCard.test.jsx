import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WizardCard from '../../../components/wizard/WizardCard';
import { confirm } from '../../../components/ui/alert/confirmation';
import { notify } from '../../../components/ui/toast';
import { useUpdateWizardMutation } from 'store/api/ai-features/wizardApi';

/**
 * Mocks
 */
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));
jest.mock('../../../components/ui/Icon', () => () => null);
jest.mock('../../../components/ui/alert/confirmation', () => ({
  confirm: jest.fn(),
}));
jest.mock('../../../components/ui/toast', () => ({
  notify: { success: jest.fn(), error: jest.fn() },
}));
jest.mock('store/api/ai-features/wizardApi', () => ({
  useUpdateWizardMutation: jest.fn(),
}));

const rrd = require('react-router-dom');

describe('WizardCard', () => {
  const nav = jest.fn();
  const wizard = (o = {}) => ({
    id: 1,
    title: 'W',
    enabled: true,
    wizard_type: 'answer',
    created_at: '2025-01-01T00:00:00.000Z',
    ...o,
  });

  const upd = (
    state = {},
    fn = jest.fn(() => ({ unwrap: () => Promise.resolve() }))
  ) => (
    useUpdateWizardMutation.mockReturnValue([
      fn,
      { isLoading: false, ...state },
    ]),
    fn
  );

  beforeEach(() => {
    jest.clearAllMocks();
    rrd.useNavigate.mockReturnValue(nav);
    upd();
    jest.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('FA_DATE');
  });

  afterEach(() => {
    Date.prototype.toLocaleDateString.mockRestore?.();
  });

  /**
   * Displays wizard name, status, and actions
   */
  it('renders title, status, metadata and action buttons', () => {
    render(<WizardCard wizard={wizard()} handleDelete={jest.fn()} />);

    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('فعال')).toBeInTheDocument();
    expect(screen.getByText(/شناسه:/)).toBeInTheDocument();
    expect(screen.getByText(/نوع:/)).toBeInTheDocument();
    expect(screen.getByText(/تاریخ ایجاد:/)).toBeInTheDocument();
    expect(screen.getByText('FA_DATE')).toBeInTheDocument();

    expect(screen.getAllByText('ویرایش')[0]).toBeInTheDocument();
    expect(screen.getAllByText('حذف')[0]).toBeInTheDocument();
  });

  /**
   * Card click navigates to show page
   */
  it('navigates to /wizard/:id on card click', () => {
    render(<WizardCard wizard={wizard({ id: 5 })} handleDelete={jest.fn()} />);
    userEvent.click(screen.getByText('W'));
    expect(nav).toHaveBeenCalledWith('/wizard/5');
  });

  /**
   * Edit button navigates to edit page
   */
  it('edit click navigates to /wizard/edit/:id and stops card navigation', () => {
    render(<WizardCard wizard={wizard({ id: 7 })} handleDelete={jest.fn()} />);
    userEvent.click(screen.getAllByText('ویرایش')[0]);
    expect(nav).toHaveBeenCalledWith('/wizard/edit/7');
  });

  /**
   * Delete button triggers confirmation and handleDelete
   */
  it('delete click shows confirm then calls handleDelete(id)', async () => {
    const handleDelete = jest.fn();
    confirm.mockImplementation(({ onConfirm }) => onConfirm());

    render(
      <WizardCard
        wizard={wizard({ id: 9, title: 'X' })}
        handleDelete={handleDelete}
      />
    );
    userEvent.click(screen.getAllByText('حذف')[0]);

    await waitFor(() => expect(confirm).toHaveBeenCalled());
    expect(handleDelete).toHaveBeenCalledWith(9);
  });

  /**
   * Toggle status triggers confirmation + update mutation (full payload)
   */
  it('toggle confirm → updateWizard called + success toast', async () => {
    const w = wizard({ enabled: true });
    const updateWizard = upd(
      {},
      jest.fn(() => ({ unwrap: () => Promise.resolve() }))
    );
    confirm.mockImplementation(({ onConfirm }) => onConfirm());

    render(<WizardCard wizard={w} handleDelete={jest.fn()} />);

    userEvent.click(screen.getByText('فعال'));

    await waitFor(() =>
      expect(updateWizard).toHaveBeenCalledWith({
        id: w.id,
        data: { ...w, enabled: false },
      })
    );
    expect(notify.success).toHaveBeenCalledWith(
      'وضعیت ویزارد با موفقیت تغییر کرد'
    );
  });

  /**
   * Toggle error → rollback + toast error
   */
  it('toggle error rolls back and shows error toast', async () => {
    const w = wizard({ enabled: true });
    upd(
      {},
      jest.fn(() => ({
        unwrap: () => Promise.reject({ data: { detail: [{ msg: 'BAD' }] } }),
      }))
    );
    confirm.mockImplementation(({ onConfirm }) => onConfirm());

    render(<WizardCard wizard={w} handleDelete={jest.fn()} />);
    userEvent.click(screen.getByText('فعال'));

    await waitFor(() => expect(notify.error).toHaveBeenCalledWith('BAD'));
    expect(screen.getByText('فعال')).toBeInTheDocument();
  });

  /**
   * Responsive layout and hover states
   */
  it('has responsive/hover class hooks', () => {
    const { container } = render(
      <WizardCard wizard={wizard()} handleDelete={jest.fn()} />
    );
    const root = container.firstChild;
    expect(root).toHaveClass('group');
    expect(root).toHaveClass('hover:-translate-y-1');
  });
});
