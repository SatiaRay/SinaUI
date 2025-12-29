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

jest.mock('../../../../components/wizard/WizardCard', () => {
  return function WizardCardMock({ wizard, handleDelete }) {
    return (
      <div data-testid="wizard-card">
        <span>{wizard.name}</span>
        <button onClick={() => handleDelete(wizard.id)}>delete</button>
      </div>
    );
  };
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <WizardIndexPage />
    </MemoryRouter>
  );

describe('WizardIndexPage', () => {
  const consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  const mockDeleteHook = (impl) => {
    const trigger =
      impl ?? jest.fn(() => ({ unwrap: () => Promise.resolve() }));
    useDeleteWizardMutation.mockReturnValue([trigger]);
    return trigger;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteHook();
  });

  afterAll(() => {
    consoleError.mockRestore();
    consoleWarn.mockRestore();
  });

  /**
   * Renders loading skeleton when isLoading/isFetching
   */
  it('renders loading skeleton when loading', () => {
    useGetWizardsQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    });

    renderPage();
    expect(screen.getByTestId('wizard-index-loading')).toBeInTheDocument();
  });

  /**
   * Error state shows error component
   */
  it('renders error state when isError', () => {
    useGetWizardsQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: { status: 500 },
    });

    renderPage();
    expect(screen.getByText('مشکلی پیش آمده است')).toBeInTheDocument();
  });

  /**
   * Renders empty state when no wizards
   */
  it('renders empty state when list is empty', async () => {
    useGetWizardsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    renderPage();
    expect(
      await screen.findByText('هیچ ویزاردی یافت نشد.')
    ).toBeInTheDocument();
  });

  /**
   * Renders list of wizard cards when data present
   */
  it('renders wizard cards when data exists', async () => {
    useGetWizardsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'Wizard A' },
        { id: 2, name: 'Wizard B' },
      ],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
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
    useGetWizardsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    renderPage();
    expect(
      await screen.findByRole('link', { name: /ویزارد جدید/i })
    ).toHaveAttribute('href', '/wizard/create');
  });

  /**
   * Delete triggers confirmation and mutation
   */
  it('calls delete mutation and shows success toast', async () => {
    const deleteWizard = mockDeleteHook(
      jest.fn(() => ({ unwrap: () => Promise.resolve() }))
    );

    useGetWizardsQuery.mockReturnValue({
      data: [{ id: 1, name: 'Wizard A' }],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    renderPage();

    userEvent.click(await screen.findByRole('button', { name: 'delete' }));

    await waitFor(() => expect(deleteWizard).toHaveBeenCalledWith(1));
    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith('ویزارد با موفقیت حذف شد')
    );
  });

  /**
   * Delete error → toast error
   */
  it('shows error toast when delete fails', async () => {
    mockDeleteHook(
      jest.fn(() => ({ unwrap: () => Promise.reject(new Error('fail')) }))
    );

    useGetWizardsQuery.mockReturnValue({
      data: Object.assign([{ id: 1, name: 'Wizard A' }], {
        wizards: [{ id: 1, name: 'Wizard A' }],
      }),
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    renderPage();

    userEvent.click(await screen.findByRole('button', { name: 'delete' }));

    await waitFor(() =>
      expect(notify.error).toHaveBeenCalledWith('خطا در حذف ویزارد!')
    );
  });
});
