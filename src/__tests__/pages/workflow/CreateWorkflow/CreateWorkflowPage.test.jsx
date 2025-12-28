import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

/**
 * Mock: toast notifications (success / error)
 */
jest.mock('../../../../components/ui/toast', () => ({
  notify: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

/**
 * Mock: react-router-dom
 */
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...rest }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

/**
 * Mock: Spinner
 */
jest.mock('../../../../components/ui/sppiner', () => ({
  Sppiner: ({ size }) => <div data-testid="spinner">spinner-{size}</div>,
}));

/**
 * Mock: CustomDropdown
 */
jest.mock('../../../../components/ui/CustomDropdown', () => (props) => (
  <div data-testid="dropdown">
    <button onClick={() => props.onChange('0')}>set-inactive</button>
    <div>value:{props.value}</div>
  </div>
));

/**
 * Mock: RTK Query mutation hook
 */
let mockMutationState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  data: null,
};

const mockStoreWorkflow = jest.fn();

jest.mock('store/api/ai-features/workflowApi', () => ({
  useStoreWorkflowMutation: () => [mockStoreWorkflow, mockMutationState],
}));

/**
 * Import component AFTER mocks so it uses mocked deps.
 */
const CreateWorkflowPage =
  require('../../../../pages/workflow/CreateWorkflow/CreateWorkflowPage').default;

/**
 * Helper: render with router context (MemoryRouter)
 */
const renderPage = () =>
  render(
    <MemoryRouter>
      <CreateWorkflowPage />
    </MemoryRouter>
  );

beforeEach(() => {
  /**
   * Reset all mocks between tests
   */
  jest.clearAllMocks();

  /**
   * Reset RTK state between tests
   */
  mockMutationState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,
  };

  /**
   * Reset mutation function calls
   */
  mockStoreWorkflow.mockReset();
});

describe('CreateWorkflowPage (per task)', () => {
  /**
   * Renders base UI
   */
  test('renders base UI', () => {
    renderPage();

    expect(screen.getByText('افزودن گردش کار جدید')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('نام گردش کار')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ذخیره' })).toBeInTheDocument();
    expect(screen.getByText('بازگشت')).toBeInTheDocument();

    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    expect(screen.getByText('value:1')).toBeInTheDocument();
  });

  /**
   * Controlled input
   */
  test('updates name input state', async () => {
    renderPage();

    const input = screen.getByPlaceholderText('نام گردش کار');
    await userEvent.type(input, 'My Workflow');

    expect(input).toHaveValue('My Workflow');
  });

  /**
   * Dropdown
   */
  test('updates status via dropdown (calls onChange)', async () => {
    renderPage();

    expect(screen.getByText('value:1')).toBeInTheDocument();

    await userEvent.click(screen.getByText('set-inactive'));
    expect(screen.getByText('value:0')).toBeInTheDocument();
  });

  /**
   * Save button triggers mutation with correct payload
   */
  test('save button triggers mutation with correct payload', async () => {
    renderPage();

    await userEvent.type(screen.getByPlaceholderText('نام گردش کار'), 'WF-1');

    await userEvent.click(screen.getByText('set-inactive'));

    await userEvent.click(screen.getByRole('button', { name: 'ذخیره' }));

    await waitFor(() => expect(mockStoreWorkflow).toHaveBeenCalledTimes(1));

    const payload = mockStoreWorkflow.mock.calls[0][0];

    expect(payload).toEqual({
      data: expect.objectContaining({
        name: 'WF-1',
        status: '0',
        flow: expect.any(Array),
      }),
    });

    expect(payload.data.flow[0]).toEqual(
      expect.objectContaining({
        id: '1',
        type: 'start',
        label: 'شروع',
      })
    );
  });

  /**
   * Loading state
   */
  test('loading state shows spinner instead of "ذخیره"', () => {
    mockMutationState.isLoading = true;
    renderPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText('ذخیره')).not.toBeInTheDocument();
  });

  /**
   * Success flow: toast success and navigate to /workflow/:id
   */
  test('success → toast + navigate to /workflow/:id', async () => {
    const { notify } = require('../../../../components/ui/toast');

    const { rerender } = renderPage();

    mockMutationState.isSuccess = true;
    mockMutationState.data = { id: 357 };

    rerender(
      <MemoryRouter>
        <CreateWorkflowPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(notify.success).toHaveBeenCalledWith(
        'گردش کار با موفقیت اضافه شد !'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/workflow/357');
    });
  });

  /**
   * Back button should link to workflow index page
   */
  test('cancel/back button links to workflow index', () => {
    renderPage();

    expect(screen.getByText('بازگشت').closest('a')).toHaveAttribute(
      'href',
      '/workflow'
    );
  });
});
