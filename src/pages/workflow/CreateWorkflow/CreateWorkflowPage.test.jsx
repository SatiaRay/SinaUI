import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateWorkflowPage from './CreateWorkflowPage';

/**
 * Mock: router navigate
 */
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * Mock: toast notifications
 */
const mockNotifySuccess = jest.fn();

jest.mock('../../../components/ui/toast', () => ({
  notify: {
    success: (...args) => mockNotifySuccess(...args),
    error: jest.fn(),
  },
}));

/**
 * Mock: spinner component
 */
jest.mock('../../../components/ui/sppiner', () => ({
  Sppiner: ({ size }) => <div data-testid="spinner">{size}</div>,
}));

/**
 * Mock: dropdown component
 */
jest.mock('../../../components/ui/CustomDropdown', () => (props) => (
  <select
    data-testid="status-dropdown"
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
  >
    {props.options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
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
 * Helper: render page with router context
 */
const renderPage = () =>
  render(
    <MemoryRouter>
      <CreateWorkflowPage />
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();

  mockMutationState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,
  };
});

describe('CreateWorkflowPage', () => {
  /**
   * Test: smoke render + default fields
   */
  it('renders base UI', () => {
    renderPage();

    expect(screen.getByText('افزودن گردش کار جدید')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('نام گردش کار')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ذخیره' })).toBeInTheDocument();
    expect(screen.getByText('بازگشت')).toBeInTheDocument();

    expect(screen.getByTestId('status-dropdown')).toHaveValue('1');
  });

  /**
   * Test: controlled input updates state
   */
  it('updates name input state', () => {
    renderPage();

    const input = screen.getByPlaceholderText('نام گردش کار');
    fireEvent.change(input, { target: { value: 'WF-1' } });

    expect(input).toHaveValue('WF-1');
  });

  /**
   * Test: dropdown calls onChange and updates value
   */
  it('updates status via dropdown', () => {
    renderPage();

    const dropdown = screen.getByTestId('status-dropdown');
    fireEvent.change(dropdown, { target: { value: '0' } });

    expect(dropdown).toHaveValue('0');
  });

  /**
   * Test: clicking save triggers mutation with correct payload
   */
  it('clicking save calls mutation with correct payload', () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText('نام گردش کار'), {
      target: { value: 'My Workflow' },
    });

    fireEvent.change(screen.getByTestId('status-dropdown'), {
      target: { value: '0' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'ذخیره' }));

    expect(mockStoreWorkflow).toHaveBeenCalledTimes(1);

    const payload = mockStoreWorkflow.mock.calls[0][0];
    expect(payload).toEqual({
      data: expect.objectContaining({
        name: 'My Workflow',
        status: '0',
        flow: expect.any(Array),
      }),
    });

    expect(payload.data.flow[0]).toEqual(
      expect.objectContaining({ id: '1', type: 'start', label: 'شروع' })
    );
  });

  /**
   * Test: loading state shows spinner instead of "ذخیره"
   */
  it('shows spinner while loading', () => {
    mockMutationState.isLoading = true;
    renderPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText('ذخیره')).not.toBeInTheDocument();
  });

  /**
   * Test: success flow triggers toast and navigation
   */
  it('on success: shows toast + navigates to detail page', () => {
    const { rerender } = renderPage();

    act(() => {
      mockMutationState.isSuccess = true;
      mockMutationState.data = { id: 357 };
    });

    rerender(
      <MemoryRouter>
        <CreateWorkflowPage />
      </MemoryRouter>
    );

    expect(mockNotifySuccess).toHaveBeenCalledWith('گردش کار با موفقیت اضافه شد !');
    expect(mockNavigate).toHaveBeenCalledWith('/workflow/357');
  });

  /**
   * Test: when not successful, no toast and no navigation should happen
   */
  it('does not navigate when not successful', () => {
    renderPage();

    expect(mockNotifySuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
