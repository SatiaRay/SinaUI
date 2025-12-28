/**
 * CreateInstructionPage unit tests
 * Covers initial form values, submit mutation payload, success/error toasts + navigation, and cancel link.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import CreateInstructionPage from '../../../../pages/instruction/CreateInstruction/CreateInstructionPage';
import { useCreateInstructionMutation } from 'store/api/ai-features/instructionApi';
import { notify } from '../../../../components/ui/toast';

const mockNavigate = jest.fn();

/**
 * react-router-dom mock for navigation
 */
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('store/api/ai-features/instructionApi', () => ({
  useCreateInstructionMutation: jest.fn(),
}));

jest.mock('../../../../components/ui/toast', () => ({
  notify: { success: jest.fn(), error: jest.fn() },
}));

/**
 * Spinner mock
 */
jest.mock('../../../../components/ui/sppiner', () => ({
  Sppiner: () => <div data-testid="spinner" />,
}));

/**
 * Silence known noisy warnings (React 18 act warning in RTL)
 */
const isNoisy = (msg) => String(msg).includes('ReactDOMTestUtils.act');

/**
 * Render helper (includes /instruction route for Link assertions)
 */
const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/instruction/create']}>
      <Routes>
        <Route path="/instruction/create" element={<CreateInstructionPage />} />
        <Route path="/instruction" element={<div data-testid="index-page" />} />
      </Routes>
    </MemoryRouter>
  );

/**
 * RTK create mutation helper
 */
const mockCreateMutation = ({ isLoading = false, isSuccess = false, isError = false } = {}) => {
  const mutate = jest.fn();
  useCreateInstructionMutation.mockReturnValue([
    mutate,
    { isLoading, isSuccess, isError, error: undefined },
  ]);
  return { mutate };
};

describe('CreateInstructionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (isNoisy(args[0])) return;
      // eslint-disable-next-line no-console
      console.error(...args);
    });
  });

  afterEach(() => {
    console.error.mockRestore?.();
  });

  /**
   * Form renders with correct initial values (create mode)
   */
  it('renders form with initial values', () => {
    mockCreateMutation();
    renderPage();

    expect(screen.getByText('افزودن دستورالعمل جدید')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('برچسب دستورالعمل')).toHaveValue('');
    expect(screen.getByPlaceholderText('متن دستورالعمل...')).toHaveValue('');
    expect(screen.getByRole('combobox')).toHaveValue('1'); // status default = 1
    expect(screen.getByRole('button', { name: 'ذخیره' })).toBeInTheDocument();
  });

  /**
   * Cancel button navigates back (Link to /instruction)
   */
  it('cancel link navigates back to /instruction', () => {
    mockCreateMutation();
    renderPage();

    expect(screen.getByRole('link', { name: 'بازگشت' })).toHaveAttribute('href', '/instruction');
  });

  /**
   * Submits even when required fields are empty (no validation implemented)
   */
  it('submits even when fields are empty (no validation)', async () => {
    const { mutate } = mockCreateMutation();
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'ذخیره' }));

    expect(mutate).toHaveBeenCalledWith({
      label: '',
      text: '',
      agent_type: 'both',
      status: 1,
    });
  });

  /**
   * Submits create mutation with current form values
   */
  it('submits mutation with filled values', async () => {
    const { mutate } = mockCreateMutation();
    renderPage();

    const user = userEvent;
    await user.type(screen.getByPlaceholderText('برچسب دستورالعمل'), 'LBL');
    await user.type(screen.getByPlaceholderText('متن دستورالعمل...'), 'TXT');
    await user.selectOptions(screen.getByRole('combobox'), '0');

    await user.click(screen.getByRole('button', { name: 'ذخیره' }));

    expect(mutate).toHaveBeenCalledWith({
      label: 'LBL',
      text: 'TXT',
      agent_type: 'both',
      status: 0,
    });
  });

  /**
   * Shows spinner while creating
   */
  it('shows spinner when isLoading', () => {
    mockCreateMutation({ isLoading: true });
    renderPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  /**
   * Success → toast + navigate back
   */
  it('shows success toast and navigates back on success', async () => {
    // first render: not successful yet
    mockCreateMutation({ isSuccess: false });

    const { rerender } = render(
      <MemoryRouter initialEntries={['/instruction/create']}>
        <Routes>
          <Route path="/instruction/create" element={<CreateInstructionPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('افزودن دستورالعمل جدید')).toBeInTheDocument();

    // rerender with success state
    useCreateInstructionMutation.mockReturnValue([
      jest.fn(),
      { isLoading: false, isSuccess: true, isError: false, error: undefined },
    ]);

    rerender(
      <MemoryRouter initialEntries={['/instruction/create']}>
        <Routes>
          <Route path="/instruction/create" element={<CreateInstructionPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith('دستورالعمل با موفقیت اضافه شد !')
    );
    expect(mockNavigate).toHaveBeenCalledWith('/instruction');
  });

  /**
   * Error → toast error (NOTE: component currently does not notify on isError)
   */
  it('does not show error toast (no error handler implemented)', async () => {
    mockCreateMutation({ isError: true });
    renderPage();

    // current component doesn't call notify.error anywhere
    await waitFor(() => expect(notify.error).not.toHaveBeenCalled());
  });
});
