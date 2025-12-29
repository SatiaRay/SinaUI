import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CreateWizardPage from '../../../../pages/wizard/CreateWizard/CreateWizardPage';
import { useCreateWizardMutation } from 'store/api/ai-features/wizardApi';
import { notify } from '../../../../components/ui/toast';

/**
 * Mocks
 */
jest.mock('store/api/ai-features/wizardApi', () => ({
  useCreateWizardMutation: jest.fn(),
}));
jest.mock('../../../../components/ui/toast', () => ({
  notify: { success: jest.fn(), error: jest.fn() },
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
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
        onClick={() => onChange({}, { getData: () => '<p>CTX</p>' })}
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
      <CreateWizardPage />
    </MemoryRouter>
  );

describe('CreateWizardPage', () => {
  const nav = jest.fn();
  const sp = (parent_id = null) => [
    new URLSearchParams(parent_id ? { parent_id } : {}),
    jest.fn(),
  ];

  const create = (state = {}, fn = jest.fn()) => (
    useCreateWizardMutation.mockReturnValue([
      fn,
      {
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
        ...state,
      },
    ]),
    fn
  );

  beforeEach(() => {
    jest.clearAllMocks();
    rrd.useNavigate.mockReturnValue(nav);
    rrd.useSearchParams.mockReturnValue(sp(null));
    create();
  });

  /**
   * Renders wizard editor with correct initial data (create mode)
   */
  it('renders initial empty form', () => {
    renderPage();
    expect(screen.getByPlaceholderText('عنوان ویزارد')).toHaveValue('');
    expect(screen.getByTestId('wizard-type')).toHaveTextContent('answer');
    expect(screen.getByTestId('ckeditor-data')).toHaveTextContent('');
  });

  /**
   * Handles changes and updates schema (form state)
   */
  it('updates type + context via mocks', () => {
    renderPage();
    userEvent.click(screen.getByTestId('wizard-type')); // answer -> question
    userEvent.click(screen.getByRole('button', { name: 'ck-change' })); // context -> CTX
    expect(screen.getByTestId('wizard-type')).toHaveTextContent('question');
    expect(screen.getByTestId('ckeditor-data')).toHaveTextContent('<p>CTX</p>');
  });

  /**
   * Save button triggers mutation with correct payload
   */
  it('calls create mutation with full wizard payload', () => {
    const createWizard = create({}, jest.fn());
    renderPage();

    userEvent.type(screen.getByPlaceholderText('عنوان ویزارد'), 'T');
    userEvent.click(screen.getByRole('button', { name: 'ck-change' })); // context
    userEvent.click(screen.getByTestId('wizard-type')); // -> question
    userEvent.click(screen.getByRole('button', { name: 'ذخیره' }));

    expect(createWizard).toHaveBeenCalledWith({
      title: 'T',
      context: '<p>CTX</p>',
      wizard_type: 'question',
      parent_id: null,
    });
  });

  /**
   * Error → toast error (validation)
   */
  it('blocks submit when title/context empty', () => {
    const createWizard = create({}, jest.fn());
    renderPage();

    userEvent.click(screen.getByRole('button', { name: 'ذخیره' }));

    expect(notify.error).toHaveBeenCalledWith('لطفاً تمام فیلدها را پر کنید');
    expect(createWizard).not.toHaveBeenCalled();
  });

  /**
   * Success → toast + navigate back
   */
  it('on success: toast + navigate(/wizard) when no parent', async () => {
    rrd.useSearchParams.mockReturnValue(sp(null));
    create({ isSuccess: true });

    renderPage();

    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith('ویزارد با موفقیت ایجاد شد!')
    );
    expect(nav).toHaveBeenCalledWith('/wizard');
  });

  /**
   * Success → toast + navigate back (to parent)
   */
  it('on success: toast + navigate(/wizard/:parent) when parent_id exists', async () => {
    rrd.useSearchParams.mockReturnValue(sp('99'));
    create({ isSuccess: true });

    renderPage();

    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith('ویزارد با موفقیت ایجاد شد!')
    );
    expect(nav).toHaveBeenCalledWith('/wizard/99');
  });

  /**
   * Error state shows error component
   */
  it('renders mutation error message when isError', () => {
    create({ isError: true, error: { data: { message: 'ERR' } } });

    renderPage();
    expect(screen.getByText('ERR')).toBeInTheDocument();
  });

  /**
   * Cancel/back button navigates away
   */
  it('back link points to /wizard', () => {
    renderPage();
    expect(screen.getByRole('link', { name: 'بازگشت' })).toHaveAttribute(
      'href',
      '/wizard'
    );
  });
});
