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
const mockUpdateWorkflow = jest.fn(() => ({ unwrap: mockUpdateUnwrap }));

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
const EditWorkflowPage = require('../../../../pages/workflow/EditWorkflow/EditWorkflowPage').default;

describe('EditWorkflowPage', () => {
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

    mockUpdateUnwrap.mockResolvedValue({});
  });

  /**
   * Test: shows loading while fetching or workflow is not ready
   */
  test('renders loading state', () => {
    render(<EditWorkflowPage />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  /**
   * Test: renders form after data load
   */
  test('renders page and editor after fetch success', async () => {
    mockGetState = {
      data: { id: 'wf-123', name: 'WF Name', status: '1', flow: { a: 1 } },
      isLoading: false,
      isSuccess: true,
      isError: false,
    };

    render(<EditWorkflowPage />);

    expect(await screen.findByText('ویرایش گردش کار')).toBeInTheDocument();
    expect(screen.getByDisplayValue('WF Name')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('workflow-editor')).toBeInTheDocument();
  });

  /**
   * Test: typing in name updates input value (local state)
   */
  test('updates workflow name input', async () => {
    mockGetState = {
      data: { id: 'wf-123', name: 'WF Name', status: '1', flow: { a: 1 } },
      isLoading: false,
      isSuccess: true,
      isError: false,
    };

    render(<EditWorkflowPage />);

    const input = await screen.findByDisplayValue('WF Name');
    await userEvent.clear(input);
    await userEvent.type(input, 'New Name');

    expect(screen.getByDisplayValue('New Name')).toBeInTheDocument();
  });

  /**
   * Test: clicking save triggers updateWorkflow with correct id/data
   */
  test('clicking save calls updateWorkflow with current workflow data', async () => {
    mockGetState = {
      data: { id: 'wf-123', name: 'WF Name', status: '1', flow: { a: 1 } },
      isLoading: false,
      isSuccess: true,
      isError: false,
    };

    render(<EditWorkflowPage />);

    expect(await screen.findByText('ذخیره')).toBeInTheDocument();
    await userEvent.click(screen.getByText('ذخیره'));

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
   * Test: editor onChange triggers autosave (updateWorkflow)
   */
  test('editor change triggers autosave', async () => {
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
   * Test: update failure shows toast error
   */
  test('update failure shows error toast', async () => {
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
});
