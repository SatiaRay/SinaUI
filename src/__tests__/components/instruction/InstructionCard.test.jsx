/**
 * InstructionCard unit tests
 * Covers rendering label/text/status, navigation, delete click, status toggle and hover layer existence.
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import InstructionCard from '../../../components/instruction/InstructionCard';
import { useUpdateInstructionMutation } from 'store/api/ai-features/instructionApi';
import { notify } from '../../../components/ui/toast';

const mockNavigate = jest.fn();
/**
 * react-router-dom mock for navigation
 */
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('store/api/ai-features/instructionApi', () => ({
  useUpdateInstructionMutation: jest.fn(),
}));

jest.mock('../../../components/ui/toast', () => ({
  notify: { success: jest.fn(), error: jest.fn() },
}));

/**
 * Icon mock 
 */
jest.mock('../../../components/ui/Icon', () => () => null);

const makeIns = (over = {}) => ({
  id: 7,
  label: 'عنوان دستور',
  text: 'توضیحات دستورالعمل',
  status: true,
  updated_at: '2025-01-01T00:00:00.000Z',
  ...over,
});

/**
 * Test helper to render component
 */
const setup = (instruction = makeIns(), { loading = false } = {}) => {
  const handleDelete = jest.fn();

  const unwrap = jest.fn();
  const mutate = jest.fn(() => ({ unwrap }));

  useUpdateInstructionMutation.mockReturnValue([mutate, { isLoading: loading }]);

  const utils = render(
    <InstructionCard instruction={instruction} handleDelete={handleDelete} />
  );

  return { ...utils, handleDelete, mutate, unwrap };
};

/**
 * Silences act deprecation warning 
 */
const isNoisy = (msg) => String(msg).includes('ReactDOMTestUtils.act');

describe('InstructionCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (isNoisy(args[0])) return;
      console.warn(...args);
    });
  });

  afterEach(() => {
    console.error.mockRestore?.();
  });

  /**
   * Displays instruction label, text, and status pill
   */
  it('renders instruction label, text and status', () => {
    setup(makeIns({ status: true }));

    expect(screen.getByText('عنوان دستور')).toBeInTheDocument();
    expect(screen.getByText('توضیحات دستورالعمل')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'فعال' })).toBeInTheDocument();
  });

  /**
   * Navigates to edit page when card is clicked
   */
  it('navigates to edit page on card click', () => {
    setup(makeIns({ id: 12 }));

    fireEvent.click(screen.getByText('عنوان دستور'));
    expect(mockNavigate).toHaveBeenCalledWith('/instruction/edit/12');
  });

  /**
   * Delete button calls handleDelete and stops propagation (no navigation)
   */
  it('calls delete handler and prevents navigation', () => {
    const { handleDelete } = setup(makeIns({ id: 9 }));

    fireEvent.click(screen.getByRole('button', { name: 'حذف دستورالعمل' }));

    expect(handleDelete).toHaveBeenCalledWith(9);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /**
   * Status toggle calls update mutation and shows success toast
   */
  it('toggles status and shows success toast on success', async () => {
    const { mutate, unwrap } = setup(makeIns({ id: 5, status: true }));
    unwrap.mockResolvedValue({});

    userEvent.click(screen.getByRole('button', { name: 'فعال' }));

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith({
        id: 5,
        data: expect.objectContaining({ id: 5, status: false }),
      })
    );

    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith(
        'وضعیت دستورالعمل با موفقیت تغییر کرد!'
      )
    );

    expect(screen.getByRole('button', { name: 'غیرفعال' })).toBeInTheDocument();
  });

  /**
   * Rolls back status and shows error toast on failure
   */
  it('rolls back status and shows error toast on failure', async () => {
    const { unwrap } = setup(makeIns({ status: true }));
    unwrap.mockRejectedValue(new Error('fail'));

    userEvent.click(screen.getByRole('button', { name: 'فعال' }));

    await waitFor(() =>
      expect(notify.error).toHaveBeenCalledWith('خطا در تغییر وضعیت دستورالعمل!')
    );

    expect(screen.getByRole('button', { name: 'فعال' })).toBeInTheDocument();
  });

  /**
   * Prevents toggling while loading (button disabled + mutation not called)
   */
  it('prevents status toggle while loading', () => {
    const { mutate } = setup(makeIns({ status: true }), { loading: true });

    const btn = screen.getByRole('button', { name: 'فعال' });
    expect(btn).toBeDisabled();

    fireEvent.click(btn);
    expect(mutate).not.toHaveBeenCalled();
  });

  /**
   * Hover overlay layer exists in DOM 
   */
  it('renders hover overlay layer', () => {
    const { container } = setup(makeIns());
    expect(
      container.querySelector('.group-hover\\:opacity-100')
    ).toBeTruthy();
  });
});
