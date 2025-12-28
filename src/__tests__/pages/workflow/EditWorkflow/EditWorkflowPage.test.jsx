import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Mock: toast notifications
 */
jest.mock('../../../../components/ui/toast', () => ({
  notify: { success: jest.fn(), error: jest.fn() },
}));

/**
 * Mock: Router (Link / useNavigate / useParams)
 */
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ to, children, ...rest }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'wf-123' }),
}));

/**
 * Mock: Spinner component
 */
jest.mock('../../../../components/ui/sppiner', () => ({
  Sppiner: ({ size }) => <div data-testid="spinner">spinner-{size}</div>,
}));

/**
 * Mock: Dropdown
 */
jest.mock('../../../../components/ui/CustomDropdown', () => (props) => (
  <div data-testid="dropdown">
    <button onClick={() => props.onChange('1')}>set-active</button>
    <div>value:{props.value}</div>
  </div>
));

/**
 * Mock: Loading placeholder
 */
jest.mock('../../../../pages/workflow/EditWorkflow/EditWorkflowLoading', () => ({
  EditWorkflowLoading: () => <div data-testid="loading">loading</div>,
}));

/**
 * Mock: WorkflowEditor
 */
jest.mock('../../../../components/workflow/WorkflowEditor', () => (props) => (
  <div data-testid="workflow-editor">
    <div>initFlow:{props.initFlow ? 'yes' : 'no'}</div>
    <div>initFlowValue:{JSON.stringify(props.initFlow ?? null)}</div>
    <button
      onClick={() => {
        const flow = { nodes: [{ id: 'n1' }], edges: [] };
        props.setSchema(flow);
        props.onChange(flow);
      }}
    >
      editor-change
    </button>
  </div>
));

/**
 * Mock: RTK Query hooks
 */
const mockUpdateUnwrap = jest.fn();
const mockUpdateWorkflow = jest.fn();

let mockGetState = {
  data: null,
  isLoading: true,
  isSuccess: false,
  isError: false,
};

let mockUpdateState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

jest.mock('store/api/ai-features/workflowApi', () => ({
  useGetWorkflowQuery: () => mockGetState,
  useUpdateWorkflowMutation: () => [mockUpdateWorkflow, mockUpdateState],
}));

/**
 * Import after mocks
 */
const EditWorkflowPage =
  require('../../../../pages/workflow/EditWorkflow/EditWorkflowPage').default;

describe('EditWorkflowPage (per task)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetState = {
      data: null,
      isLoading: true,
      isSuccess: false,
      isError: false,
    };

    mockUpdateState = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
    };

    mockUpdateUnwrap.mockReset();
    mockUpdateUnwrap.mockResolvedValue({});

    mockUpdateWorkflow.mockReset();
    mockUpdateWorkflow.mockImplementation(() => ({ unwrap: mockUpdateUnwrap }));
  });

  /**
   * Renders workflow editor with correct initial data (edit mode)
   */
  test('renders editor with correct initial flow after fetch success', async () => {
    mockGetState = {
      data: { id: 'wf-123', name: 'WF Name', status: '1', flow: { a: 1 } },
      isLoading: false,
      isSuccess: true,
      isError: false,
    };

    render(<EditWorkflowPage />);

    expect(await screen.findByText('ویرایش گردش کار')).toBeInTheDocument();
    expect(screen.getByTestId('workflow-editor')).toBeInTheDocument();
    expect(screen.getByText('initFlow:yes')).toBeInTheDocument();
    expect(screen.getByText('initFlowValue:{"a":1}')).toBeInTheDocument();
  });

  /**
   * Handles node/edge changes and updates schema (autosave)
   */
  test('editor change triggers autosave mutation with updated flow payload', async () => {
    mockGetState = {
      data: { id: 'wf-123', name: 'WF Name', status: '1', flow: { a: 1 } },
      isLoading: false,
      isSuccess: true,
      isError: false,
    };

    render(<EditWorkflowPage />);

    await userEvent.click(await screen.findByText('editor-change'));

    await waitFor(() => {
      expect(mockUpdateWorkflow).toHaveBeenCalledTimes(1);
      expect(mockUpdateWorkflow).toHaveBeenCalledWith({
        id: 'wf-123',
        data: expect.objectContaining({
          flow: expect.objectContaining({
            nodes: expect.any(Array),
            edges: expect.any(Array),
          }),
        }),
      });
    });
  });

  /**
   * Save button triggers mutation with correct payload
   */
  test('save button triggers mutation with current workflow payload', async () => {
    mockGetState = {
      data: { id: 'wf-123', name: 'WF Name', status: '1', flow: { a: 1 } },
      isLoading: false,
      isSuccess: true,
      isError: false,
    };

    render(<EditWorkflowPage />);

    await userEvent.click(await screen.findByText('ذخیره'));

    await waitFor(() => {
      expect(mockUpdateWorkflow).toHaveBeenCalledTimes(1);
      expect(mockUpdateWorkflow).toHaveBeenCalledWith({
        id: 'wf-123',
        data: expect.objectContaining({
          name: 'WF Name',
          status: '1',
          flow: { a: 1 },
        }),
      });
    });
  });

  /**
   * Success → toast success
   */
  test('success mutation shows success toast on second success (after initial silent)', async () => {
    const { notify } = require('../../../../components/ui/toast');

    mockGetState = {
      data: { id: 'wf-123', name: 'WF Name', status: '1', flow: { a: 1 } },
      isLoading: false,
      isSuccess: true,
      isError: false,
    };

    const { rerender } = render(<EditWorkflowPage />);

    mockUpdateState.isSuccess = true;
    rerender(<EditWorkflowPage />);
    await waitFor(() => expect(notify.success).not.toHaveBeenCalled());

    mockUpdateState.isSuccess = false;
    rerender(<EditWorkflowPage />);

    mockUpdateState.isSuccess = true;
    rerender(<EditWorkflowPage />);

    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith('تغییرات ذخیره شد !')
    );
  });

  /**
   * Error → toast error
   */
  test('mutation failure shows error toast', async () => {
    const { notify } = require('../../../../components/ui/toast');

    mockGetState = {
      data: { id: 'wf-123', name: 'WF Name', status: '1', flow: { a: 1 } },
      isLoading: false,
      isSuccess: true,
      isError: false,
    };

    mockUpdateUnwrap.mockRejectedValueOnce(new Error('fail'));

    render(<EditWorkflowPage />);

    await userEvent.click(await screen.findByText('ذخیره'));

    await waitFor(() => {
      expect(notify.error).toHaveBeenCalledWith('خطا در ذخیره تغییرات');
    });
  });

  /**
   * Cancel/back button navigates away
   */
  test('back button navigates away (link to /workflow)', async () => {
    mockGetState = {
      data: { id: 'wf-123', name: 'WF Name', status: '1', flow: { a: 1 } },
      isLoading: false,
      isSuccess: true,
      isError: false,
    };

    render(<EditWorkflowPage />);

    const backLink = await screen.findByText('بازگشت');
    expect(backLink.closest('a')).toHaveAttribute('href', '/workflow');
  });
});
