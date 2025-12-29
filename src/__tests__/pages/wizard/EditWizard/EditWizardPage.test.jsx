import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import EditWizardPage from '../../../../pages/wizard/UpdateWizard/EditWizardPage';
import {
  useGetWizardQuery,
  useUpdateWizardMutation,
} from 'store/api/ai-features/wizardApi';
import { notify } from '../../../../components/ui/toast';

/**
 * Mocks
 */
jest.mock('store/api/ai-features/wizardApi', () => ({
  useGetWizardQuery: jest.fn(),
  useUpdateWizardMutation: jest.fn(),
}));
jest.mock('../../../../components/ui/toast', () => ({
  notify: { success: jest.fn(), error: jest.fn() },
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock('../../../../pages/wizard/UpdateWizard/EditWizardLoading', () => ({
  EditWizardLoading: () => <div data-testid="edit-wizard-loading" />,
}));
jest.mock('../../../../components/ui/sppiner', () => ({
  Sppiner: () => <span data-testid="spinner" />,
}));
jest.mock(
  '../../../../components/ui/CustomDropdown',
  () =>
    ({ value, onChange }) => (
      <button
        type="button"
        data-testid="wizard-type"
        onClick={() => onChange(value === 'answer' ? 'question' : 'answer')}
      >
        {value}
      </button>
    )
);
jest.mock('@ckeditor/ckeditor5-react', () => ({
  CKEditor: ({ data, onChange }) => (
    <div>
      <div data-testid="ckeditor-data">{data}</div>
      <button
        type="button"
        onClick={() => onChange({}, { getData: () => '<p>NEW</p>' })}
      >
        ck-change
      </button>
    </div>
  ),
}));
jest.mock('@ckeditor/ckeditor5-build-classic', () => ({}));
jest.mock('../../../../configs', () => ({ ckEditorConfig: {} }));

const rrd = require('react-router-dom');
const renderPage = () =>
  render(
    <MemoryRouter>
      <EditWizardPage />
    </MemoryRouter>
  );

describe('EditWizardPage', () => {
  const nav = jest.fn();
  const get = (o = {}) =>
    useGetWizardQuery.mockReturnValue({
      data: null,
      isSuccess: false,
      isLoading: false,
      isError: false,
      error: null,
      ...o,
    });
  const upd = (s = {}, fn = jest.fn()) => (
    useUpdateWizardMutation.mockReturnValue([
      fn,
      { isLoading: false, isSuccess: false, isError: false, ...s },
    ]),
    fn
  );
  const wizard = (x = {}) => ({
    title: 'T',
    context: '<p>C</p>',
    wizard_type: 'answer',
    ...x,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    rrd.useParams.mockReturnValue({ wizard_id: '7' });
    rrd.useNavigate.mockReturnValue(nav);
    upd();
  });

  /**
   * Renders wizard editor with correct initial data (edit mode)
   */
  it('renders loading until wizard state is ready', () => {
    get({ isLoading: true });
    renderPage();
    expect(screen.getByTestId('edit-wizard-loading')).toBeInTheDocument();
  });

  /**
   * Renders wizard editor with correct initial data (edit mode)
   */
  it('fills form from fetched data', async () => {
    get({ isSuccess: true, data: wizard() });
    renderPage();

    expect(await screen.findByDisplayValue('T')).toBeInTheDocument();
    expect(screen.getByTestId('wizard-type')).toHaveTextContent('answer');
    expect(screen.getByTestId('ckeditor-data')).toHaveTextContent('<p>C</p>');
  });

  /**
   * Handles changes and updates schema (form state)
   */
  it('updates type + context via mocks', async () => {
    get({ isSuccess: true, data: wizard() });
    renderPage();
    await screen.findByDisplayValue('T');

    userEvent.click(screen.getByTestId('wizard-type'));
    userEvent.click(screen.getByRole('button', { name: 'ck-change' }));

    expect(screen.getByTestId('wizard-type')).toHaveTextContent('question');
    expect(screen.getByTestId('ckeditor-data')).toHaveTextContent('<p>NEW</p>');
  });

  /**
   * Save button triggers mutation with correct payload
   */
  it('calls update mutation with correct payload', async () => {
    get({ isSuccess: true, data: wizard() });
    const updateWizard = upd({}, jest.fn());

    renderPage();
    await screen.findByDisplayValue('T');

    userEvent.type(screen.getByPlaceholderText('عنوان ویزارد'), '2');
    userEvent.click(screen.getByTestId('wizard-type'));
    userEvent.click(screen.getByRole('button', { name: 'ck-change' }));
    userEvent.click(screen.getByRole('button', { name: 'ذخیره' }));

    await waitFor(() =>
      expect(updateWizard).toHaveBeenCalledWith({
        id: '7',
        data: { title: 'T2', context: '<p>NEW</p>', wizard_type: 'question' },
      })
    );
  });

  /**
   * Success → toast + navigate back
   */
  it('on update success: toast + navigate(/wizard)', async () => {
    get({ isSuccess: true, data: wizard() });
    upd({ isSuccess: true });

    renderPage();
    await screen.findByDisplayValue('T');

    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith('ویزارد با موفقیت ویرایش شد!')
    );
    expect(nav).toHaveBeenCalledWith('/wizard');
  });

  /**
   * Error → toast error (validation)
   */
  it('shows validation error when title is empty', async () => {
    get({ isSuccess: true, data: wizard({ title: '' }) });
    const updateWizard = upd({}, jest.fn());

    renderPage();
    await screen.findByPlaceholderText('عنوان ویزارد');
    userEvent.click(screen.getByRole('button', { name: 'ذخیره' }));

    expect(notify.error).toHaveBeenCalledWith('لطفاً عنوان را وارد کنید');
    expect(updateWizard).not.toHaveBeenCalled();
  });

  /**
   * Error → toast error (mutation UI error block)
   */
  it('shows update error block when isUpdateError', async () => {
    get({
      isSuccess: true,
      data: wizard(),
      error: { data: { message: 'UPD_ERR' } },
    });
    upd({ isError: true });

    renderPage();
    await screen.findByDisplayValue('T');
    expect(screen.getByText('UPD_ERR')).toBeInTheDocument();
  });

  /**
   * Cancel/back button navigates away
   */
  it('back button navigates -1 when history length > 1', async () => {
    get({ isSuccess: true, data: wizard() });
    Object.defineProperty(window, 'history', {
      value: { length: 2 },
      writable: true,
    });

    renderPage();
    await screen.findByDisplayValue('T');
    userEvent.click(screen.getByRole('link', { name: 'بازگشت' }));

    expect(nav).toHaveBeenCalledWith(-1);
  });

  /**
   * Cancel/back button navigates away
   */
  it('back button navigates /wizard with replace when no history', async () => {
    get({ isSuccess: true, data: wizard() });
    Object.defineProperty(window, 'history', {
      value: { length: 1 },
      writable: true,
    });

    renderPage();
    await screen.findByDisplayValue('T');
    userEvent.click(screen.getByRole('link', { name: 'بازگشت' }));

    expect(nav).toHaveBeenCalledWith('/wizard', { replace: true });
  });
});
