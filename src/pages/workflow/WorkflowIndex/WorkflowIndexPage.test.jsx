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

jest.mock('store/api/ai-features/workflowApi', () => ({
  useGetAllWorkflowsQuery: jest.fn(),
  useExportWorkflowMutation: jest.fn(),
  useImportWorkflowMutation: jest.fn(),
  useDeleteWorkflowMutation: jest.fn(),
}));

jest.mock('sweetalert2', () => ({ fire: jest.fn(), showLoading: jest.fn(), close: jest.fn() }));
jest.mock('../../../components/ui/toast', () => ({ notify: { success: jest.fn(), error: jest.fn() } }));

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

const renderPage = () =>
  render(
    <MemoryRouter>
      <WorkflowIndexPage />
    </MemoryRouter>
  );

const fileInput = () => document.querySelector('input[type="file"]');

const setup = ({
  query = {},
  workflows = [],
  refetch = jest.fn(),
} = {}) => {
  // query mock
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

  // mutations mock
  const exportFn = jest.fn();
  const importFn = jest.fn();
  const deleteFn = jest.fn();
  useExportWorkflowMutation.mockReturnValue([exportFn]);
  useImportWorkflowMutation.mockReturnValue([importFn]);
  useDeleteWorkflowMutation.mockReturnValue([deleteFn]);

  renderPage();
  return { exportFn, importFn, deleteFn, refetch };
};

const mockUnwrap = (fn, { resolve, reject }) => {
  fn.mockReturnValue({
    unwrap: reject ? jest.fn().mockRejectedValue(reject) : jest.fn().mockResolvedValue(resolve),
  });
};

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
  test('loading state', () => {
    setup({ query: { isLoading: true, isSuccess: false } });
    expect(screen.getByTestId('index-loading')).toBeInTheDocument();
  });

  test('error state + retry', async () => {
    const refetch = jest.fn();
    setup({ query: { isError: true, isSuccess: false, error: { status: 500 } }, refetch });

    expect(screen.getByTestId('error')).toBeInTheDocument();
    await userEvent.click(screen.getByText('retry'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  test('empty state', async () => {
    setup({ workflows: [] });

    expect(await screen.findByText('هیچ گردش کار ثبت شده‌ای یافت نشد.')).toBeInTheDocument();
    expect(screen.getByText('گردش کار جدید')).toBeInTheDocument();
  });

  test('renders workflow cards', async () => {
    setup({ workflows: [{ id: '1', name: 'WF 1' }, { id: '2', name: 'WF 2' }] });

    const cards = await screen.findAllByTestId('workflow-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('WF 1')).toBeInTheDocument();
    expect(screen.getByText('WF 2')).toBeInTheDocument();
  });

  test('create link href', async () => {
    setup({ workflows: [] });

    const textEl = await screen.findByText('گردش کار جدید');
    expect(textEl.closest('a')).toHaveAttribute('href', '/workflow/create');
  });

  test('import button clicks hidden input', async () => {
    setup({ workflows: [] });

    const input = fileInput();
    const spy = jest.spyOn(input, 'click');

    await userEvent.click(screen.getByText('بارگذاری گردش کار'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('import: non-json file => Swal error + no mutation', async () => {
    const { importFn } = setup({ workflows: [] });

    await userEvent.upload(fileInput(), new File(['x'], 'bad.txt', { type: 'text/plain' }));

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'خطا!',
        text: 'لطفاً فقط فایل‌های JSON انتخاب کنید.',
        icon: 'error',
      })
    );
    expect(importFn).not.toHaveBeenCalled();
  });

  test('import success => loading Swal, unwrap, success Swal, refetch', async () => {
    const refetch = jest.fn();
    const { importFn } = setup({ workflows: [], refetch });

    mockUnwrap(importFn, { resolve: { ok: true } });

    await userEvent.upload(
      fileInput(),
      new File([JSON.stringify({ a: 1 })], 'wf.json', { type: 'application/json' })
    );

    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'در حال بارگذاری...' }));

    await waitFor(() => expect(importFn).toHaveBeenCalled());
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'موفق!', icon: 'success' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  test('download success', async () => {
    const { exportFn } = setup({ workflows: [{ id: '10', name: 'WF X' }] });
    mockUnwrap(exportFn, { resolve: { schema: { nodes: [] } } });

    await screen.findByText('WF X');
    await userEvent.click(screen.getByText('download'));

    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'در حال آماده‌سازی فایل...' }));

    await waitFor(() => {
      expect(exportFn).toHaveBeenCalledWith({ id: '10' });
      expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1);
      expect(Swal.close).toHaveBeenCalled();
      expect(notify.success).toHaveBeenCalledWith('فایل با موفقیت دانلود شد');
    });
  });

  test('download error', async () => {
    const { exportFn } = setup({ workflows: [{ id: '10', name: 'WF X' }] });
    mockUnwrap(exportFn, { reject: new Error('fail') });

    await screen.findByText('WF X');
    await userEvent.click(screen.getByText('download'));

    await waitFor(() => {
      expect(Swal.close).toHaveBeenCalled();
      expect(notify.error).toHaveBeenCalledWith('خطا در دانلود فایل');
    });
  });

  test('delete confirm => optimistic remove + mutation + toast', async () => {
    const { deleteFn } = setup({ workflows: [{ id: '1', name: 'WF 1' }, { id: '2', name: 'WF 2' }] });

    Swal.fire.mockResolvedValue({ isConfirmed: true });
    mockUnwrap(deleteFn, { resolve: { ok: true } });

    await screen.findByText('WF 1');
    await userEvent.click(screen.getAllByText('delete')[0]);

    await waitFor(() => expect(screen.queryByText('WF 1')).not.toBeInTheDocument());
    expect(deleteFn).toHaveBeenCalledWith({ id: '1' });
    expect(notify.success).toHaveBeenCalledWith('گردش کاری حذف شد');
  });

  test('delete cancel => no mutation', async () => {
    const { deleteFn } = setup({ workflows: [{ id: '1', name: 'WF 1' }] });
    Swal.fire.mockResolvedValue({ isConfirmed: false });

    await screen.findByText('WF 1');
    await userEvent.click(screen.getByText('delete'));

    expect(deleteFn).not.toHaveBeenCalled();
    expect(screen.getByText('WF 1')).toBeInTheDocument();
  });

  test('delete error => mutation + toast error + item remains', async () => {
    const { deleteFn } = setup({ workflows: [{ id: '1', name: 'WF 1' }, { id: '2', name: 'WF 2' }] });

    Swal.fire.mockResolvedValue({ isConfirmed: true });
    mockUnwrap(deleteFn, { reject: new Error('delete failed') });

    await screen.findByText('WF 1');
    await userEvent.click(screen.getAllByText('delete')[0]);

    await waitFor(() => expect(deleteFn).toHaveBeenCalledWith({ id: '1' }));
    expect(notify.error).toHaveBeenCalledWith('خطا در حذف گردش کار! لطفاً دوباره تلاش کنید');
    expect(screen.getByText('WF 1')).toBeInTheDocument();
  });
});