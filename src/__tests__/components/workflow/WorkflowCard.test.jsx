import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WorkflowCard from '../../../components/workflow/WorkflowCard';

/**
 * Mock: Icon (avoid svg/heavy DOM)
 */
jest.mock('../../../components/ui/Icon', () => () => <span data-testid="icon" />);

/**
 * Mock: router navigation
 */
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * Helper: render card with defaults
 */
const setup = (overrides = {}) => {
  const props = {
    workflow: {
      id: '1',
      name: 'WF 1',
      status: true,
      ...(overrides.workflow || {}),
    },
    handleDelete: jest.fn(),
    handleDownload: jest.fn(),
    ...overrides,
  };

  const utils = render(<WorkflowCard {...props} />);
  return { ...utils, ...props };
};

beforeEach(() => jest.clearAllMocks());

describe('WorkflowCard (per task)', () => {
  /**
   * Displays workflow name (fallback if empty)
   */
  test('renders workflow name, fallback when empty', () => {
    setup({ workflow: { name: '' } });
    expect(screen.getByText('بدون نام')).toBeInTheDocument();
  });

  /**
   * Displays correct status badge text based on workflow.status
   */
  test.each([
    ['active', true, 'فعال', 'غیرفعال'],
    ['inactive', false, 'غیرفعال', 'فعال'],
  ])('shows %s badge based on status', (_, status, shown, hidden) => {
    setup({ workflow: { status } });
    expect(screen.getByText(shown)).toBeInTheDocument();
    expect(screen.queryByText(hidden)).not.toBeInTheDocument();
  });

  /**
   * Card click navigates to edit page route 
   */
  test('card click navigates to /workflow/:id', async () => {
    setup({ workflow: { id: '10', name: 'WF X' } });

    await userEvent.click(screen.getByText('WF X'));

    expect(mockNavigate).toHaveBeenCalledWith('/workflow/10');
  });

  /**
   * Edit action navigates to edit page and should NOT trigger delete/download handlers
   */
  test('edit button navigates to /workflow/:id only', async () => {
    const { handleDelete, handleDownload } = setup({ workflow: { id: '5' } });

    await userEvent.click(screen.getByText('ویرایش'));

    expect(mockNavigate).toHaveBeenCalledWith('/workflow/5');
    expect(handleDelete).not.toHaveBeenCalled();
    expect(handleDownload).not.toHaveBeenCalled();
  });

  /**
   * Download action triggers handler and must NOT navigate (stopPropagation)
   */
  test('download button triggers handleDownload(id) and does not navigate', async () => {
    const { handleDownload } = setup({ workflow: { id: '9' } });

    await userEvent.click(screen.getByText('دریافت خروجی'));

    expect(handleDownload).toHaveBeenCalledWith('9');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /**
   * Delete action triggers handler and must NOT navigate (stopPropagation)
   */
  test('delete button triggers handleDelete(id) and does not navigate', async () => {
    const { handleDelete } = setup({ workflow: { id: '7' } });

    await userEvent.click(screen.getByText('حذف'));

    expect(handleDelete).toHaveBeenCalledWith('7');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /**
   * Responsive layout
   */
  test('has responsive action sections (desktop + mobile)', () => {
    const { container } = setup();

    const desktopActions = container.querySelector('.hidden.sm\\:flex');
    expect(desktopActions).toBeTruthy();

    const mobileActions = container.querySelector('.sm\\:hidden');
    
    expect(mobileActions).toBeTruthy();
    ['دریافت خروجی', 'ویرایش', 'حذف'].forEach((t) =>
      expect(screen.getByTitle(t)).toBeInTheDocument()
    );
  });

  /**
   * Hover state
   */
  test('defines hover/overlay classes', () => {
    const { container } = setup();

    const root = container.querySelector('.group');
    expect(root).toBeTruthy();

    const overlay = container.querySelector('.group-hover\\:opacity-100');
    expect(overlay).toBeTruthy();
  });
});
