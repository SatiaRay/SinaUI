import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import WorkflowIndexPage from '../../../../pages/workflow/WorkflowIndex/WorkflowIndexPage';
import {
  useGetAllWorkflowsQuery,
  useExportWorkflowMutation,
  useImportWorkflowMutation,
  useDeleteWorkflowMutation,
} from 'store/api/ai-features/workflowApi';
import Swal from 'sweetalert2';

/**
 * Mocks: RTK Query hooks
 */
jest.mock('store/api/ai-features/workflowApi', () => ({
  useGetAllWorkflowsQuery: jest.fn(),
  useExportWorkflowMutation: jest.fn(),
  useImportWorkflowMutation: jest.fn(),
  useDeleteWorkflowMutation: jest.fn(),
}));

/**
 * Mocks: Swal
 */
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn(),
}));

/**
 * Mock: router navigate
 */
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * UI Mocks
 */
jest.mock('../../../../pages/workflow/WorkflowIndex/WorkflowIndexLoading', () => ({
  WorkflowIndexLoading: () => <div data-testid="index-loading">loading...</div>,
}));
jest.mock('../../../../components/Error', () => () => (
  <div data-testid="error">error</div>
));
jest.mock('../../../../components/ui/Icon', () => () => (
  <span data-testid="icon" />
));
jest.mock(
  '../../../../components/workflow/WorkflowCard',
  () =>
    ({ workflow, handleDelete, handleDownload }) => (
      <div data-testid="workflow-card">
        <div>{workflow.name}</div>
        <button onClick={() => handleDownload(workflow.id)}>download</button>
        <button onClick={() => handleDelete(workflow.id)}>delete</button>
      </div>
    )
);

const renderPage = () =>
  render(
    <MemoryRouter>
      <WorkflowIndexPage />
    </MemoryRouter>
  );

const getFileInput = () => document.querySelector('input[type="file"]');

const withUnwrap = (mutate, { resolve, reject } = {}) =>
  mutate.mockReturnValue({
    unwrap: reject
      ? jest.fn().mockRejectedValue(reject)
      : jest.fn().mockResolvedValue(resolve),
  });

const setup = ({ workflows = [], query = {} } = {}) => {
  useGetAllWorkflowsQuery.mockReturnValue({
    data: workflows,
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: null,
    refetch: jest.fn(),
    ...query,
  });

  const exportFn = jest.fn();
  const importFn = jest.fn();
  const deleteFn = jest.fn();
  useExportWorkflowMutation.mockReturnValue([exportFn]);
  useImportWorkflowMutation.mockReturnValue([importFn]);
  useDeleteWorkflowMutation.mockReturnValue([deleteFn]);

  renderPage();
  return { exportFn, importFn, deleteFn };
};

beforeEach(() => {
  jest.clearAllMocks();

  if (!window.URL) window.URL = {};
  window.URL.createObjectURL = jest.fn(() => 'blob:mock');
  window.URL.revokeObjectURL = jest.fn();

  jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
});

afterEach(() => {
  HTMLAnchorElement.prototype.click.mockRestore?.();
});

describe('WorkflowIndexPage (per task)', () => {
  /**
   * Renders loading skeleton when isLoading
   */
  test('renders loading skeleton when isLoading', () => {
    setup({ query: { isLoading: true, isSuccess: false } });
    expect(screen.getByTestId('index-loading')).toBeInTheDocument();
  });

  /**
   * Renders when isFetching
   */
  test('renders page when isFetching', () => {
    setup({ query: { isFetching: true } });
    expect(screen.getByText('گردش کارها')).toBeInTheDocument();
  });

  /**
   * Error state shows error component
   */
  test('renders error component when isError', () => {
    setup({ query: { isError: true, isSuccess: false, error: { status: 500 } } });
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  /**
   * Renders empty state when no workflows
   */
  test('renders empty state when no workflows', async () => {
    setup({ workflows: [] });
    expect(
      await screen.findByText('هیچ گردش کار ثبت شده‌ای یافت نشد.')
    ).toBeInTheDocument();
  });

  /**
   * Renders list of workflow cards when data present
   */
  test('renders workflow cards when workflows exist', async () => {
    setup({
      workflows: [
        { id: '1', name: 'WF 1' },
        { id: '2', name: 'WF 2' },
      ],
    });

    expect(await screen.findAllByTestId('workflow-card')).toHaveLength(2);
    expect(screen.getByText('WF 1')).toBeInTheDocument();
    expect(screen.getByText('WF 2')).toBeInTheDocument();
  });

  /**
   * "گردش کار جدید" button navigates to create page
   */
  test('"گردش کار جدید" links to create page', async () => {
    setup({ workflows: [] });
    expect(screen.getByText('گردش کار جدید').closest('a')).toHaveAttribute(
      'href',
      '/workflow/create'
    );
  });

  /**
   * Import button triggers correct handler (opens file input)
   */
  test('import button triggers file input click', async () => {
    setup();

    const input = getFileInput();
    const spy = jest.spyOn(input, 'click');

    await userEvent.click(screen.getByText('بارگذاری گردش کار'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  /**
   * Export button triggers correct handler (mutation called)
   */
  test('export triggers mutation with correct payload', async () => {
    const { exportFn } = setup({ workflows: [{ id: '10', name: 'WF X' }] });
    withUnwrap(exportFn, { resolve: { schema: { nodes: [] } } });

    await screen.findByText('WF X');
    await userEvent.click(screen.getByText('download'));

    await waitFor(() => {
      expect(exportFn).toHaveBeenCalledWith({ id: '10' });
    });
  });

  /**
   * Delete triggers confirmation and mutation
   */
  test('delete confirm triggers mutation', async () => {
    const { deleteFn } = setup({
      workflows: [
        { id: '1', name: 'WF 1' },
        { id: '2', name: 'WF 2' },
      ],
    });

    Swal.fire.mockResolvedValue({ isConfirmed: true });
    withUnwrap(deleteFn, { resolve: { ok: true } });

    await screen.findByText('WF 1');
    await userEvent.click(screen.getAllByText('delete')[0]);

    await waitFor(() => {
      expect(deleteFn).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
