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
jest.mock(
  '../../../../pages/instruction/EditInstruction/EditInstructionLoading',
  () => ({
    EditInstructionLoading: () => <div data-testid="edit-loading" />,
  })
);

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

/**
 * Render helper with router wrapper
 */
const renderApp = (path = '/instruction/edit/10') => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/instruction/edit/:id" element={<EditInstructionPage />} />
      <Route path="/instruction" element={<div data-testid="index-page" />} />
    </Routes>
  </MemoryRouter>
);

const renderPage = (path) => render(renderApp(path));

/**
 * RTK query helpers
 */
const getQ = (o = {}) =>
  useGetInstructionQuery.mockReturnValue({
    data: { label: 'A', text: 'B', status: 1, ...o.data },
    isSuccess: true,
    isLoading: false,
    isError: false,
    ...o,
  });

/**
 * RTK update mutation helper
 */
const setU = (
  state = { isLoading: false, isSuccess: false, isError: false },
  mutate = jest.fn()
) => (useUpdateInstructionMutation.mockReturnValue([mutate, state]), mutate);

/**
 * Fill the edit form inputs
 */
const setForm = (v = {}) => {
  const map = {
    label: ['برچسب دستورالعمل', 'value'],
    text: ['متن دستورالعمل...', 'value'],
    status: [null, 'value'],
  };

  if ('label' in v)
    fireEvent.change(screen.getByPlaceholderText(map.label[0]), {
      target: { value: v.label },
    });
  if ('text' in v)
    fireEvent.change(screen.getByPlaceholderText(map.text[0]), {
      target: { value: v.text },
    });
  if ('status' in v)
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: String(v.status) },
    });
};

describe('EditInstructionPage', () => {
  beforeEach(() => jest.clearAllMocks());

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
    setU();

    renderPage();
    expect(screen.getByTestId('edit-loading')).toBeInTheDocument();
  });

  /**
   * Form renders with correct initial values (edit mode)
   */
  it('renders form with initial values from API', async () => {
    getQ({ data: { label: 'LBL', text: 'TXT', status: 0 } });
    setU();

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
    getQ();
    setU();

    renderPage();

    expect(await screen.findByRole('link', { name: 'بازگشت' })).toHaveAttribute(
      'href',
      '/instruction'
    );
  });

  /**
   * Submits even when required fields are empty (no validation implemented)
   */
  it('submits even when required fields are empty (no validation implemented)', async () => {
    getQ({ data: { label: '', text: '', status: 1 } });
    const mutate = setU();

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
    getQ({ data: { label: 'OLD', text: 'OLD_TXT', status: 1 } });
    const mutate = setU();

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
    getQ({ data: { label: 'A', text: 'B', status: 1 } });
    setU({ isLoading: false, isSuccess: false, isError: false });

    const { rerender } = renderPage();
    await screen.findByText('ویرایش دستورالعمل');

    setU({ isLoading: false, isSuccess: true, isError: false });
    rerender(renderApp('/instruction/edit/10'));

    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith(
        'دستورالعمل با موفقیت ویرایش شد !'
      )
    );
    expect(mockNavigate).toHaveBeenCalledWith('/instruction');
  });

  /**
   * Error → toast error
   */
  it('shows error toast on update failure', async () => {
    getQ({ data: { label: 'A', text: 'B', status: 1 } });
    setU({ isLoading: false, isSuccess: false, isError: false });

    const { rerender } = renderPage();
    await screen.findByText('ویرایش دستورالعمل');

    setU({ isLoading: false, isSuccess: false, isError: true });
    rerender(renderApp('/instruction/edit/10'));

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
    getQ({ data: { label: 'A', text: 'B', status: 1 } });
    setU({ isLoading: true, isSuccess: false, isError: false });

    renderPage();

    await screen.findByText('ویرایش دستورالعمل');
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
