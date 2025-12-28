/**
 * EditInstructionPage unit tests
 * Covers loading state, initial form values (edit mode), submit behavior (no validation),
 * success/error toasts + navigation, cancel link, and updating spinner.
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import EditInstructionPage from '../../../../pages/instruction/EditInstruction/EditInstructionPage';
import {
  useGetInstructionQuery,
  useUpdateInstructionMutation,
} from 'store/api/ai-features/instructionApi';
import { notify } from '../../../../components/ui/toast';

jest.mock('store/api/ai-features/instructionApi', () => ({
  useGetInstructionQuery: jest.fn(),
  useUpdateInstructionMutation: jest.fn(),
}));

jest.mock('../../../../components/ui/toast', () => ({
  notify: { success: jest.fn(), error: jest.fn() },
}));

/**
 * Loading component mock
 */
jest.mock('../../../../pages/instruction/EditInstruction/EditInstructionLoading', () => ({
  EditInstructionLoading: () => <div data-testid="edit-loading" />,
}));

/**
 * Spinner mock
 */
jest.mock('../../../../components/ui/sppiner', () => ({
  Sppiner: () => <div data-testid="spinner" />,
}));

const mockNavigate = jest.fn();
/**
 * react-router-dom mock for navigation 
 */
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderPage = (path = '/instruction/edit/10') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/instruction/edit/:id" element={<EditInstructionPage />} />
        <Route path="/instruction" element={<div data-testid="index-page" />} />
      </Routes>
    </MemoryRouter>
  );

/**
 * RTK update mutation helper
 */
const mockUpdateMutation = (
  state = { isLoading: false, isSuccess: false, isError: false }
) => {
  const mutate = jest.fn();
  useUpdateInstructionMutation.mockReturnValue([mutate, state]);
  return { mutate };
};

const mockGetQuery = (overrides = {}) =>
  useGetInstructionQuery.mockReturnValue({
    data: { label: 'A', text: 'B', status: 1, ...overrides.data },
    isSuccess: true,
    isLoading: false,
    isError: false,
    ...overrides,
  });

/**
 * Fill the edit form inputs
 */
const setForm = ({ label, text, status }) => {
  if (label !== undefined) {
    const labelInput = screen.getByPlaceholderText('برچسب دستورالعمل');
    fireEvent.change(labelInput, { target: { value: label } });
  }
  if (text !== undefined) {
    const textArea = screen.getByPlaceholderText('متن دستورالعمل...');
    fireEvent.change(textArea, { target: { value: text } });
  }
  if (status !== undefined) {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: String(status) } });
  }
};

describe('EditInstructionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Renders loading skeleton when query is loading OR instruction not ready
   */
  it('renders loading state when isLoading', () => {
    useGetInstructionQuery.mockReturnValue({
      data: undefined,
      isSuccess: false,
      isLoading: true,
      isError: false,
    });
    mockUpdateMutation();

    renderPage();
    expect(screen.getByTestId('edit-loading')).toBeInTheDocument();
  });

  /**
   * Form renders with correct initial values (edit mode)
   */
  it('renders form with initial values from API', async () => {
    mockGetQuery({ data: { label: 'LBL', text: 'TXT', status: 0 } });
    mockUpdateMutation();

    renderPage();

    expect(await screen.findByText('ویرایش دستورالعمل')).toBeInTheDocument();
    expect(screen.getByDisplayValue('LBL')).toBeInTheDocument();
    expect(screen.getByDisplayValue('TXT')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('0');
  });

  /**
   * Cancel button navigates back (Link to /instruction)
   */
  it('cancel link points to /instruction', async () => {
    mockGetQuery();
    mockUpdateMutation();

    renderPage();

    const back = await screen.findByRole('link', { name: 'بازگشت' });
    expect(back).toHaveAttribute('href', '/instruction');
  });

  /**
   * Submits even when required fields are empty (no validation implemented)
   */
  it('submits even when required fields are empty (no validation implemented)', async () => {
    mockGetQuery({ data: { label: '', text: '', status: 1 } });
    const { mutate } = mockUpdateMutation();

    renderPage();

    fireEvent.click(await screen.findByRole('button', { name: 'ذخیره' }));

    expect(mutate).toHaveBeenCalledWith({
      id: '10',
      data: { label: '', text: '', status: 1 },
    });
  });

  /**
   * Save triggers update mutation with current form data
   */
  it('submits update mutation with form values', async () => {
    mockGetQuery({ data: { label: 'OLD', text: 'OLD_TXT', status: 1 } });
    const { mutate } = mockUpdateMutation();

    renderPage();
    await screen.findByText('ویرایش دستورالعمل');

    setForm({ label: 'NEW', text: 'NEW_TXT', status: 0 });

    fireEvent.click(screen.getByRole('button', { name: 'ذخیره' }));

    expect(mutate).toHaveBeenCalledWith({
      id: '10',
      data: { label: 'NEW', text: 'NEW_TXT', status: 0 },
    });
  });

  /**
   * Success → toast + navigate back
   */
  it('shows success toast and navigates back on update success', async () => {
    mockGetQuery({ data: { label: 'A', text: 'B', status: 1 } });

    mockUpdateMutation({ isLoading: false, isSuccess: false, isError: false });
    const { rerender } = renderPage();

    await screen.findByText('ویرایش دستورالعمل');

    useUpdateInstructionMutation.mockReturnValue([
      jest.fn(),
      { isLoading: false, isSuccess: true, isError: false },
    ]);

    rerender(
      <MemoryRouter initialEntries={['/instruction/edit/10']}>
        <Routes>
          <Route path="/instruction/edit/:id" element={<EditInstructionPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith('دستورالعمل با موفقیت ویرایش شد !')
    );
    expect(mockNavigate).toHaveBeenCalledWith('/instruction');
  });

  /**
   * Error → toast error
   */
  it('shows error toast on update failure', async () => {
    mockGetQuery({ data: { label: 'A', text: 'B', status: 1 } });

    mockUpdateMutation({ isLoading: false, isSuccess: false, isError: false });
    const { rerender } = renderPage();

    await screen.findByText('ویرایش دستورالعمل');

    useUpdateInstructionMutation.mockReturnValue([
      jest.fn(),
      { isLoading: false, isSuccess: false, isError: true },
    ]);

    rerender(
      <MemoryRouter initialEntries={['/instruction/edit/10']}>
        <Routes>
          <Route path="/instruction/edit/:id" element={<EditInstructionPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(notify.error).toHaveBeenCalledWith(
        'ویرایش دستورالعمل با خطا مواجه شد. لطفا کمی بعد تر مجددا تلاش کنید.'
      )
    );
  });

  /**
   * Shows spinner while updating
   */
  it('shows spinner while updating', async () => {
    mockGetQuery({ data: { label: 'A', text: 'B', status: 1 } });
    mockUpdateMutation({ isLoading: true, isSuccess: false, isError: false });

    renderPage();

    await screen.findByText('ویرایش دستورالعمل');
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
