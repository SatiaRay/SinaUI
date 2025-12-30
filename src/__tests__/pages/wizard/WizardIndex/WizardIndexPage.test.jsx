import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import WizardIndexPage from '../../../../pages/wizard/WizardIndex/WizardIndexPage';
import {
  useGetWizardsQuery,
  useDeleteWizardMutation,
} from 'store/api/ai-features/wizardApi';
import { notify } from '../../../../components/ui/toast';

/**
 * Mocks
 */
jest.mock('store/api/ai-features/wizardApi', () => ({
  useGetWizardsQuery: jest.fn(),
  useDeleteWizardMutation: jest.fn(),
}));

jest.mock('../../../../components/ui/Icon', () => () => null);

jest.mock('../../../../pages/wizard/WizardIndex/WizardIndexLoading', () => ({
  WizardIndexLoading: () => <div data-testid="wizard-index-loading" />,
}));

jest.mock('../../../../components/ui/toast', () => ({
  notify: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('../../../../components/wizard/WizardCard', () => (p) => (
  <div data-testid="wizard-card">
    <span>{p.wizard.name}</span>
    <button type="button" onClick={() => p.handleDelete(p.wizard.id)}>
      delete
    </button>
  </div>
));

const renderPage = () =>
  render(
    <MemoryRouter>
      <WizardIndexPage />
    </MemoryRouter>
  );

describe('WizardIndexPage', () => {
  const q = (o) =>
    useGetWizardsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: undefined,
      ...o,
    });

  const del = (unwrapImpl) => {
    const unwrap = jest.fn();
    unwrapImpl?.(unwrap);
    const mutate = jest.fn(() => ({ unwrap }));
    useDeleteWizardMutation.mockReturnValue([mutate]);
    return { mutate, unwrap };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    del();
  });

  /**
   * Renders loading skeleton when isLoading/isFetching
   */
  it('renders loading skeleton when isLoading', () => {
    q({ isLoading: true });
    renderPage();
    expect(screen.getByTestId('wizard-index-loading')).toBeInTheDocument();
  });

  /**
   * Error state shows error component
   */
  it('renders error state when isError', () => {
    q({ isError: true, error: { status: 500 } });
    renderPage();
    expect(screen.getByText('مشکلی پیش آمده است')).toBeInTheDocument();
  });

  /**
   * Renders empty state when no wizards
   */
  it('renders empty state when list is empty', async () => {
    q({ isSuccess: true, data: [] });
    renderPage();
    expect(
      await screen.findByText('هیچ ویزاردی یافت نشد.')
    ).toBeInTheDocument();
  });

  /**
   * Renders list of wizard cards when data present
   */
  it('renders wizard cards when data exists', async () => {
    q({
      isSuccess: true,
      data: [
        { id: 1, name: 'Wizard A' },
        { id: 2, name: 'Wizard B' },
      ],
    });

    renderPage();

    expect(await screen.findAllByTestId('wizard-card')).toHaveLength(2);
    expect(screen.getByText('Wizard A')).toBeInTheDocument();
    expect(screen.getByText('Wizard B')).toBeInTheDocument();
  });

  /**
   * "ویزارد جدید" button navigates to create page
   */
  it('has create link to /wizard/create', async () => {
    q({ isSuccess: true, data: [] });
    renderPage();

    expect(
      await screen.findByRole('link', { name: /ویزارد جدید/i })
    ).toHaveAttribute('href', '/wizard/create');
  });

  /**
   * Delete triggers confirmation and mutation
   */
  it('delete success: optimistic remove + mutation + success toast', async () => {
    q({
      isSuccess: true,
      data: [
        { id: 1, name: 'Wizard A' },
        { id: 2, name: 'Wizard B' },
      ],
    });

    const { mutate } = del((u) => u.mockResolvedValue({}));

    renderPage();
    expect(await screen.findAllByTestId('wizard-card')).toHaveLength(2);

    userEvent.click(screen.getAllByRole('button', { name: 'delete' })[0]);

    await waitFor(() => expect(mutate).toHaveBeenCalledWith(1));
    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith('ویزارد با موفقیت حذف شد')
    );

    await waitFor(() =>
      expect(screen.getAllByTestId('wizard-card')).toHaveLength(1)
    );
    expect(screen.queryByText('Wizard A')).not.toBeInTheDocument();
    expect(screen.getByText('Wizard B')).toBeInTheDocument();
  });

  /**
   * Delete error → toast error + revert list from data.wizards)
   */
  it('delete error: shows error toast and restores list', async () => {
    const list = [
      { id: 1, name: 'Wizard A' },
      { id: 2, name: 'Wizard B' },
    ];

    q({ isSuccess: true, data: Object.assign([...list], { wizards: list }) });

    del((u) => u.mockRejectedValue(new Error('fail')));

    renderPage();
    expect(await screen.findAllByTestId('wizard-card')).toHaveLength(2);

    userEvent.click(screen.getAllByRole('button', { name: 'delete' })[0]);

    await waitFor(() =>
      expect(notify.error).toHaveBeenCalledWith('خطا در حذف ویزارد!')
    );

    await waitFor(() =>
      expect(screen.getAllByTestId('wizard-card')).toHaveLength(2)
    );
    expect(screen.getByText('Wizard A')).toBeInTheDocument();
    expect(screen.getByText('Wizard B')).toBeInTheDocument();
  });
});
