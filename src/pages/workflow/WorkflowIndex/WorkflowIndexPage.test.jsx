import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import WorkflowIndexPage from './WorkflowIndexPage';
import {
  useGetAllWorkflowsQuery,
  useExportWorkflowMutation,
  useImportWorkflowMutation,
  useDeleteWorkflowMutation,
} from 'store/api/ai-features/workflowApi';
import Swal from 'sweetalert2';
import { notify } from '../../../components/ui/toast';

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
 * Mocks: Swal + toast
 */
jest.mock('sweetalert2', () => ({ fire: jest.fn(), showLoading: jest.fn(), close: jest.fn() }));
jest.mock('../../../components/ui/toast', () => ({ notify: { success: jest.fn(), error: jest.fn() } }));

/**
 * UI Mocks: Keep DOM small and stable for assertions
 */
jest.mock('./WorkflowIndexLoading', () => ({
  WorkflowIndexLoading: () => <div data-testid="index-loading">loading...</div>,
}));
jest.mock('../../../components/Error', () => (p) => (
  <div data-testid="error">
    error <button onClick={p.onRetry}>retry</button>
  </div>
));
jest.mock('../../../components/ui/Icon', () => () => <span data-testid="icon" />);
jest.mock('../../../components/workflow/WorkflowCard', () => ({ workflow, handleDelete, handleDownload }) => (
  <div data-testid="workflow-card">
    <div>{workflow.name}</div>
    <button onClick={() => handleDownload(workflow.id)}>download</button>
    <button onClick={() => handleDelete(workflow.id)}>delete</button>
  </div>
));

/**
 * @function renderPage
 * @returns {ReturnType<render>}
 */
const renderPage = () =>
  render(
    <MemoryRouter>
      <WorkflowIndexPage />
    </MemoryRouter>
  );

/**
 * @function getFileInput
 * @returns {HTMLInputElement}
 */
const getFileInput = () => document.querySelector('input[type="file"]');

/**
 * @function withUnwrap
 * @param {Function} mutate - RTK mutation fn
 * @param {{resolve?: any, reject?: any}} payload
 */
const withUnwrap = (mutate, { resolve, reject } = {}) =>
  mutate.mockReturnValue({
    unwrap: reject ? jest.fn().mockRejectedValue(reject) : jest.fn().mockResolvedValue(resolve),
  });

/**
 * @function setup
 * @param {Object} options
 * @param {Array} options.workflows
 * @param {Object} options.query
 * @param {Function} options.refetch
 * @returns {{exportFn: jest.Mock, importFn: jest.Mock, deleteFn: jest.Mock, refetch: jest.Mock}}
 */
const setup = ({ workflows = [], query = {}, refetch = jest.fn() } = {}) => {
  useGetAllWorkflowsQuery.mockReturnValue({
    data: workflows,
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: null,
    refetch,
    ...query,
  });

  const exportFn = jest.fn();
  const importFn = jest.fn();
  const deleteFn = jest.fn();
  useExportWorkflowMutation.mockReturnValue([exportFn]);
  useImportWorkflowMutation.mockReturnValue([importFn]);
  useDeleteWorkflowMutation.mockReturnValue([deleteFn]);

  renderPage();
  return { exportFn, importFn, deleteFn, refetch };
};

/**
 * @function uploadJson
 * @param {any} obj
 */
const uploadJson = (obj = { a: 1 }) =>
  userEvent.upload(getFileInput(), new File([JSON.stringify(obj)], 'wf.json', { type: 'application/json' }));

beforeEach(() => {
  jest.clearAllMocks();
  global.URL.createObjectURL = jest.fn(() => 'blob:mock');
  global.URL.revokeObjectURL = jest.fn();
  jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
});

afterEach(() => {
  HTMLAnchorElement.prototype.click.mockRestore?.();
});

describe('WorkflowIndexPage', () => {
  /**
   * Loading: renders skeleton
   */
  test('loading state', () => {
    setup({ query: { isLoading: true, isSuccess: false } });
    expect(screen.getByTestId('index-loading')).toBeInTheDocument();
  });

  /**
   * Error: renders error UI and retry triggers refetch
   */
  test('error state + retry', async () => {
    const refetch = jest.fn();
    setup({ query: { isError: true, isSuccess: false, error: { status: 500 } }, refetch });

    expect(screen.getByTestId('error')).toBeInTheDocument();
    await userEvent.click(screen.getByText('retry'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  /**
   * Empty: shows empty state + create CTA
   */
  test('empty state', async () => {
    setup({ workflows: [] });
    expect(await screen.findByText('هیچ گردش کار ثبت شده‌ای یافت نشد.')).toBeInTheDocument();
    expect(screen.getByText('گردش کار جدید').closest('a')).toHaveAttribute('href', '/workflow/create');
  });

  /**
   * List: renders cards from data
   */
  test('renders workflow cards', async () => {
    setup({ workflows: [{ id: '1', name: 'WF 1' }, { id: '2', name: 'WF 2' }] });
    expect(await screen.findAllByTestId('workflow-card')).toHaveLength(2);
    expect(screen.getByText('WF 1')).toBeInTheDocument();
    expect(screen.getByText('WF 2')).toBeInTheDocument();
  });

  /**
   * Import: button clicks hidden input
   */
  test('import button clicks hidden input', async () => {
    setup();
    const input = getFileInput();
    const spy = jest.spyOn(input, 'click');

    await userEvent.click(screen.getByText('بارگذاری گردش کار'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  /**
   * Import: rejects non-JSON files
   */
  test('import rejects non-json', async () => {
    const { importFn } = setup();
    await userEvent.upload(getFileInput(), new File(['x'], 'bad.txt', { type: 'text/plain' }));

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'خطا!', text: 'لطفاً فقط فایل‌های JSON انتخاب کنید.', icon: 'error' })
    );
    expect(importFn).not.toHaveBeenCalled();
  });

  /**
   * Import: success flow => loading Swal, unwrap, success Swal, refetch
   */
  test('import success flow', async () => {
    const refetch = jest.fn();
    const { importFn } = setup({ refetch });
    withUnwrap(importFn, { resolve: { ok: true } });

    await uploadJson();

    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'در حال بارگذاری...' }));
    await waitFor(() => expect(importFn).toHaveBeenCalled());
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'موفق!', icon: 'success' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  /**
   * Download: success => export, blob url, anchor click, Swal close, toast success
   */
  test('download success', async () => {
    const { exportFn } = setup({ workflows: [{ id: '10', name: 'WF X' }] });
    withUnwrap(exportFn, { resolve: { schema: { nodes: [] } } });

    await screen.findByText('WF X');
    await userEvent.click(screen.getByText('download'));

    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'در حال آماده‌سازی فایل...' }));
    await waitFor(() => {
      expect(exportFn).toHaveBeenCalledWith({ id: '10' });
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
      expect(Swal.close).toHaveBeenCalled();
      expect(notify.success).toHaveBeenCalledWith('فایل با موفقیت دانلود شد');
    });
  });

  /**
   * Download: error => Swal close + toast error
   */
  test('download error', async () => {
    const { exportFn } = setup({ workflows: [{ id: '10', name: 'WF X' }] });
    withUnwrap(exportFn, { reject: new Error('fail') });

    await screen.findByText('WF X');
    await userEvent.click(screen.getByText('download'));

    await waitFor(() => {
      expect(Swal.close).toHaveBeenCalled();
      expect(notify.error).toHaveBeenCalledWith('خطا در دانلود فایل');
    });
  });

  /**
   * Delete: confirm => optimistic remove + mutation + toast success
   */
  test('delete confirm', async () => {
    const { deleteFn } = setup({ workflows: [{ id: '1', name: 'WF 1' }, { id: '2', name: 'WF 2' }] });
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    withUnwrap(deleteFn, { resolve: { ok: true } });

    await screen.findByText('WF 1');
    await userEvent.click(screen.getAllByText('delete')[0]);

    await waitFor(() => expect(screen.queryByText('WF 1')).not.toBeInTheDocument());
    expect(deleteFn).toHaveBeenCalledWith({ id: '1' });
    expect(notify.success).toHaveBeenCalledWith('گردش کاری حذف شد');
  });

  /**
   * Delete: cancel => no mutation, item stays
   */
  test('delete cancel', async () => {
    const { deleteFn } = setup({ workflows: [{ id: '1', name: 'WF 1' }] });
    Swal.fire.mockResolvedValue({ isConfirmed: false });

    await screen.findByText('WF 1');
    await userEvent.click(screen.getByText('delete'));

    expect(deleteFn).not.toHaveBeenCalled();
    expect(screen.getByText('WF 1')).toBeInTheDocument();
  });

  /**
   * Delete: error => toast error + rollback keeps item
   */
  test('delete error rollback', async () => {
    const { deleteFn } = setup({ workflows: [{ id: '1', name: 'WF 1' }, { id: '2', name: 'WF 2' }] });
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    withUnwrap(deleteFn, { reject: new Error('delete failed') });

    await screen.findByText('WF 1');
    await userEvent.click(screen.getAllByText('delete')[0]);

    await waitFor(() => expect(deleteFn).toHaveBeenCalledWith({ id: '1' }));
    expect(notify.error).toHaveBeenCalledWith('خطا در حذف گردش کار! لطفاً دوباره تلاش کنید');
    expect(screen.getByText('WF 1')).toBeInTheDocument();
  });
});
