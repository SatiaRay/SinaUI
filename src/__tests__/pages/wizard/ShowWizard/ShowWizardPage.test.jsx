import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ShowWizardPage from '../../../../pages/wizard/ShowWizard/ShowWizardPage';
import {
  useGetWizardQuery,
  useDeleteWizardMutation,
  useUpdateWizardMutation,
} from 'store/api/ai-features/wizardApi';
import { notify } from '../../../../components/ui/toast';
import { confirm } from '../../../../components/ui/alert/confirmation';

/**
 * Mocks
 */
jest.mock('store/api/ai-features/wizardApi', () => ({
  useGetWizardQuery: jest.fn(),
  useDeleteWizardMutation: jest.fn(),
  useUpdateWizardMutation: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock('../../../../components/ui/toast', () => ({
  notify: { success: jest.fn(), error: jest.fn() },
}));
jest.mock('../../../../components/ui/alert/confirmation', () => ({
  confirm: jest.fn(),
}));
jest.mock('../../../../components/ui/Icon', () => () => null);
jest.mock('../../../../pages/wizard/ShowWizard/ShowWizardLoading', () => ({
  ShowWizardLoading: () => <div data-testid="show-wizard-loading" />,
}));
jest.mock(
  '../../../../components/wizard/WizardCard',
  () =>
    ({ wizard, handleDelete, onToggle }) => (
      <div data-testid="wizard-card">
        <span>{wizard.title}</span>
        <button onClick={() => handleDelete?.(wizard.id)}>delete</button>
        <button onClick={() => onToggle?.()}>toggle</button>
      </div>
    )
);

const rrd = require('react-router-dom');
const renderPage = () =>
  render(
    <MemoryRouter>
      <ShowWizardPage />
    </MemoryRouter>
  );

describe('ShowWizardPage', () => {
  const get = (o = {}) =>
    useGetWizardQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      ...o,
    });
  const del = (fn = jest.fn(() => ({ unwrap: () => Promise.resolve() }))) => (
    useDeleteWizardMutation.mockReturnValue([fn]),
    fn
  );
  const upd = (fn = jest.fn(() => ({ unwrap: () => Promise.resolve() }))) => (
    useUpdateWizardMutation.mockReturnValue([fn]),
    fn
  );

  const parent = (x = {}) => ({
    id: 10,
    parent_id: null,
    title: 'Parent Wizard',
    wizard_type: 'question',
    enabled: true,
    context: '<p>CTX</p>',
    children: [],
    ...x,
  });
  const child = (x = {}) => ({ id: 1, title: 'Child 1', enabled: true, ...x });

  beforeEach(() => {
    jest.clearAllMocks();
    rrd.useParams.mockReturnValue({ wizard_id: '10' });
    rrd.useNavigate.mockReturnValue(jest.fn());
    del();
    upd();
  });

  /**
   * Renders loading skeleton when isLoading
   */
  it('renders loading state', () => {
    get({ isLoading: true });
    renderPage();
    expect(screen.getByTestId('show-wizard-loading')).toBeInTheDocument();
  });

  /**
   * Error state shows error message
   */
  it('renders error message (api message fallback)', () => {
    get({ isError: true, error: { data: { message: 'ERR' } } });
    renderPage();
    expect(screen.getByText('ERR')).toBeInTheDocument();
  });

  /**
   * Renders wizard details and children list
   */
  it('renders details and children cards', async () => {
    get({
      isSuccess: true,
      data: parent({
        children: [child(), child({ id: 2, title: 'Child 2', enabled: false })],
      }),
    });
    renderPage();

    expect(await screen.findByText('جزئیات ویزارد')).toBeInTheDocument();
    expect(screen.getByText('Parent Wizard')).toBeInTheDocument();
    expect(screen.getByText(/شناسه:\s*10/)).toBeInTheDocument();
    expect(screen.getByText(/نوع:\s*سوال/)).toBeInTheDocument();
    expect(screen.getByText(/وضعیت:\s*فعال/)).toBeInTheDocument();

    expect(await screen.findAllByTestId('wizard-card')).toHaveLength(2);
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /ویزارد فرزند جدید|جدید/i })
    ).toHaveAttribute('href', '/wizard/create?parent_id=10');
    expect(screen.getByRole('link', { name: 'بازگشت' })).toHaveAttribute(
      'href',
      '/wizard'
    );
  });

  /**
   * Renders empty children state
   */
  it('renders empty children state when no children', async () => {
    get({
      isSuccess: true,
      data: parent({ wizard_type: 'answer', enabled: false, children: [] }),
    });
    renderPage();
    expect(
      await screen.findByText('هیچ ویزارد فرزند یافت نشد.')
    ).toBeInTheDocument();
  });

  /**
   * Delete triggers confirmation and mutation (optimistic)
   */
  it('delete flow: confirm → delete mutation → success toast', async () => {
    get({ isSuccess: true, data: parent({ children: [child()] }) });
    const deleteWizard = del(
      jest.fn(() => ({ unwrap: () => Promise.resolve() }))
    );
    confirm.mockImplementation(({ onConfirm }) => onConfirm());

    renderPage();
    userEvent.click(await screen.findByRole('button', { name: 'delete' }));

    await waitFor(() => expect(confirm).toHaveBeenCalled());
    await waitFor(() => expect(deleteWizard).toHaveBeenCalledWith(1));
    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith('ویزارد با موفقیت حذف شد')
    );
  });

  /**
   * Delete error → error toast + revert to data
   */
  it('delete flow: confirm → delete fails → error toast', async () => {
    get({ isSuccess: true, data: parent({ children: [child()] }) });
    del(jest.fn(() => ({ unwrap: () => Promise.reject(new Error('fail')) })));
    confirm.mockImplementation(({ onConfirm }) => onConfirm());

    renderPage();
    userEvent.click(await screen.findByRole('button', { name: 'delete' }));

    await waitFor(() =>
      expect(notify.error).toHaveBeenCalledWith('خطا در حذف ویزارد')
    );
    expect(await screen.findByText('Child 1')).toBeInTheDocument();
  });

  /**
   * Toggle triggers update mutation with FULL payload + optimistic UI
   */
  it('toggle flow: update mutation payload + success toast', async () => {
    const c = child({ foo: 'bar' });
    get({ isSuccess: true, data: parent({ children: [c] }) });
    const updateWizard = upd(
      jest.fn(() => ({ unwrap: () => Promise.resolve() }))
    );

    renderPage();
    userEvent.click(await screen.findByRole('button', { name: 'toggle' }));

    await waitFor(() =>
      expect(updateWizard).toHaveBeenCalledWith({
        id: 1,
        data: { ...c, enabled: false },
      })
    );
    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith(
        'وضعیت ویزارد با موفقیت تغییر کرد'
      )
    );
  });

  /**
   * Toggle error → error toast (detail msg fallback)
   */
  it('toggle flow: update fails → toast error msg', async () => {
    get({
      isSuccess: true,
      data: parent({ children: [child({ enabled: false })] }),
    });
    upd(
      jest.fn(() => ({
        unwrap: () => Promise.reject({ data: { detail: [{ msg: 'BAD' }] } }),
      }))
    );

    renderPage();
    userEvent.click(await screen.findByRole('button', { name: 'toggle' }));

    await waitFor(() => expect(notify.error).toHaveBeenCalledWith('BAD'));
  });
});
