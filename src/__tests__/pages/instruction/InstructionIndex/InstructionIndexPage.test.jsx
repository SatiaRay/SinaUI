/**
 * InstructionIndexPage unit tests (Jest + React Testing Library)
 * Covers loading, error, empty, list rendering, link navigation, and delete flow with RTK Query mocking.
 */
import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import InstructionIndexPage from '../../../../pages/instruction/InstructionIndex/InstructionIndexPage';
import {
  useDeleteInstructionMutation,
  useGetInstructionsQuery,
} from 'store/api/ai-features/instructionApi';
import { confirm } from '../../../../components/ui/alert/confirmation';
import { notify } from '../../../../components/ui/toast';

jest.mock('store/api/ai-features/instructionApi', () => ({
  useGetInstructionsQuery: jest.fn(),
  useDeleteInstructionMutation: jest.fn(),
}));

jest.mock('../../../../components/ui/alert/confirmation', () => ({ confirm: jest.fn() }));
jest.mock('../../../../components/ui/toast', () => ({
  notify: { error: jest.fn(), success: jest.fn(), info: jest.fn() },
}));
jest.mock('../../../../pages/instruction/InstructionIndex/InstructionIndexLoading', () => ({
  InstructionIndexLoading: () => <div data-testid="index-loading" />,
}));
jest.mock('../../../../components/ui/Icon', () => () => null);

let paginationProps;
/**
 * Pagination mock to capture props (JSON.stringify drops functions)
 */
jest.mock('../../../../components/ui/pagination', () => ({
  Pagination: (props) => ((paginationProps = props), <div data-testid="pagination" />),
}));

/**
 * InstructionCard mock with a delete trigger
 */
jest.mock('../../../../components/instruction/InstructionCard', () => (p) => (
  <div data-testid="instruction-card">
    <div>{p.instruction.name}</div>
    <button type="button" onClick={() => p.handleDelete(p.instruction.id)}>
      delete
    </button>
  </div>
));

/**
 * Shared API payload fixture
 */
const baseData = {
  items: [
    { id: 1, name: 'INS-1' },
    { id: 2, name: 'INS-2' },
  ],
  instructions: [
    { id: 1, name: 'INS-1' },
    { id: 2, name: 'INS-2' },
  ],
  pages: 3,
  total: 40,
};

/**
 * Render helper with router wrapper
 */
const renderPage = () =>
  render(
    <MemoryRouter>
      <InstructionIndexPage />
    </MemoryRouter>
  );

/**
 * RTK Query list hook mock helper
 */
const q = (v) => useGetInstructionsQuery.mockReturnValue(v);

/**
 * RTK mutation hook helper (component destructures always)
 */
const mockDelete = (unwrapImpl) => {
  const unwrap = jest.fn();
  if (unwrapImpl) unwrapImpl(unwrap);
  const mutate = jest.fn(() => ({ unwrap }));
  useDeleteInstructionMutation.mockReturnValue([mutate]);
  return { mutate, unwrap };
};

/**
 * Silence known noisy warnings to keep tests clean
 */
const noisy = (s) =>
  [
    'ReactDOMTestUtils.act',
    'React Router Future Flag Warning',
    'unique "key" prop',
    'Cannot update a component',
    'rendering',
  ].some((k) => s.includes(k));

describe('InstructionIndexPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    paginationProps = undefined;

    mockDelete();

    /**
     * Console trap helper (throws on unexpected warnings/errors)
     */
    const trap = (type) =>
      jest.spyOn(console, type).mockImplementation((...a) => {
        const msg = a.map(String).join(' ');
        if (noisy(msg)) return;
        throw new Error(`Unexpected console.${type}: ${msg}`);
      });

    trap('warn');
    trap('error');
  });

  afterEach(() => {
    console.warn.mockRestore?.();
    console.error.mockRestore?.();
  });

  /**
   * Renders loading skeleton when isLoading
   */
  it('renders loading skeleton when isLoading', () => {
    q({ isLoading: true, isSuccess: false, isError: false, data: undefined, error: undefined });
    renderPage();
    expect(screen.getByTestId('index-loading')).toBeInTheDocument();
  });

  /**
   * Renders error state when isError
   */
  it('renders error state when isError', () => {
    q({ isLoading: false, isSuccess: false, isError: true, data: undefined, error: { status: 500 } });
    renderPage();
    expect(screen.getByText('مشکلی پیش آمده است 🛑')).toBeInTheDocument();
  });

  /**
   * Renders empty state when no instructions
   */
  it('renders empty state when no instructions', async () => {
    q({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: undefined,
      data: { ...baseData, items: [], instructions: [], pages: 1, total: 0 },
    });

    renderPage();

    expect(await screen.findByText('هیچ دستورالعملی ثبت شده ای یافت نشد.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ثبت دستور جدید' })).toHaveAttribute(
      'href',
      '/instruction/create'
    );
  });

  /**
   * Renders list of cards and passes pagination props
   */
  it('renders list of InstructionCards when data present and passes pagination props', async () => {
    q({ isLoading: false, isSuccess: true, isError: false, error: undefined, data: baseData });

    renderPage();

    const cards = await screen.findAllByTestId('instruction-card');
    expect(cards).toHaveLength(2);
    expect(within(cards[0]).getByText('INS-1')).toBeInTheDocument();
    expect(within(cards[1]).getByText('INS-2')).toBeInTheDocument();

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(paginationProps).toEqual(
      expect.objectContaining({ page: 1, perpage: 20, totalPages: 3, totalItems: 40 })
    );
    expect(typeof paginationProps.handlePageChange).toBe('function');
  });

  /**
   * Create button links to /instruction/create
   */
  it('create button links to /instruction/create', async () => {
    q({ isLoading: false, isSuccess: true, isError: false, error: undefined, data: baseData });

    renderPage();

    const createLink = (await screen.findAllByRole('link')).find(
      (a) => a.getAttribute('href') === '/instruction/create'
    );

    expect(createLink).toBeTruthy();
    expect(createLink).toHaveAttribute('href', '/instruction/create');
  });

  /**
   * Delete triggers confirmation and mutation, removes card optimistically
   */
  it('delete triggers confirmation and mutation, removes card optimistically', async () => {
    q({ isLoading: false, isSuccess: true, isError: false, error: undefined, data: baseData });

    const { mutate, unwrap } = mockDelete((u) => u.mockResolvedValue({}));
    confirm.mockImplementation(({ onConfirm }) => onConfirm());

    renderPage();
    expect(await screen.findAllByTestId('instruction-card')).toHaveLength(2);

    userEvent.click(
      within(screen.getAllByTestId('instruction-card')[0]).getByRole('button', { name: 'delete' })
    );

    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'حذف دستورالعمل',
        text: 'آیا از حذف این دستورالعمل مطمئن هستید؟',
        onConfirm: expect.any(Function),
      })
    );

    await waitFor(() => expect(mutate).toHaveBeenCalledWith(1));
    expect(unwrap).toHaveBeenCalled();

    await waitFor(() => expect(screen.getAllByTestId('instruction-card')).toHaveLength(1));
    expect(screen.queryByText('INS-1')).not.toBeInTheDocument();
    expect(screen.getByText('INS-2')).toBeInTheDocument();
  });

  /**
   * Delete mutation error shows toast and restores list
   */
  it('delete mutation error shows toast and restores list', async () => {
    q({ isLoading: false, isSuccess: true, isError: false, error: undefined, data: baseData });

    mockDelete((u) => u.mockRejectedValue(new Error('fail')));
    confirm.mockImplementation(({ onConfirm }) => onConfirm());

    renderPage();
    expect(await screen.findAllByTestId('instruction-card')).toHaveLength(2);

    userEvent.click(
      within(screen.getAllByTestId('instruction-card')[0]).getByRole('button', { name: 'delete' })
    );

    await waitFor(() => expect(notify.error).toHaveBeenCalledWith('خطا در حذف دستورالعمل!'));
    await waitFor(() => expect(screen.getAllByTestId('instruction-card')).toHaveLength(2));
  });
});
