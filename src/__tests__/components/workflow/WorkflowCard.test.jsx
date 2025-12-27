import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WorkflowCard from '../../../components/workflow/WorkflowCard';

/**
 * Mock: Icon + Router navigation
 */
jest.mock('../../../components/ui/Icon', () => () => <span data-testid="icon" />);
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * @function setup
 * @param {Object} overrides
 * @returns {{workflow: any, handleDelete: jest.Mock, handleDownload: jest.Mock}}
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
  render(<WorkflowCard {...props} />);
  return props;
};

beforeEach(() => jest.clearAllMocks());

describe('WorkflowCard', () => {
  /**
   * Rendering: name fallback + status badge
   */
  test('renders fallback name when empty', () => {
    setup({ workflow: { name: '' } });
    expect(screen.getByText('بدون نام')).toBeInTheDocument();
  });

  test.each([
    ['active', true, 'فعال', 'غیرفعال'],
    ['inactive', false, 'غیرفعال', 'فعال'],
  ])('shows %s badge based on status', (_, status, shown, hidden) => {
    setup({ workflow: { status } });
    expect(screen.getByText(shown)).toBeInTheDocument();
    expect(screen.queryByText(hidden)).not.toBeInTheDocument();
  });

  /**
   * Navigation: card click and edit click
   */
  test('card click navigates to /workflow/:id', async () => {
    setup({ workflow: { id: '10', name: 'WF X' } });
    await userEvent.click(screen.getByText('WF X'));
    expect(mockNavigate).toHaveBeenCalledWith('/workflow/10');
  });

  test('"ویرایش" navigates and does not call handlers', async () => {
    const { handleDelete, handleDownload } = setup({ workflow: { id: '5' } });
    await userEvent.click(screen.getByText('ویرایش'));

    expect(mockNavigate).toHaveBeenCalledWith('/workflow/5');
    expect(handleDelete).not.toHaveBeenCalled();
    expect(handleDownload).not.toHaveBeenCalled();
  });

  /**
   * Actions: delete / download call handlers and do not navigate
   */
  test('"حذف" calls handleDelete(id) only', async () => {
    const { handleDelete } = setup({ workflow: { id: '7' } });
    await userEvent.click(screen.getByText('حذف'));

    expect(handleDelete).toHaveBeenCalledWith('7');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('"دریافت خروجی" calls handleDownload(id) only', async () => {
    const { handleDownload } = setup({ workflow: { id: '9' } });
    await userEvent.click(screen.getByText('دریافت خروجی'));

    expect(handleDownload).toHaveBeenCalledWith('9');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /**
   * Mobile: icon buttons exist (title attributes)
   */
  test('mobile icon buttons exist (by title)', () => {
    setup();
    ['دریافت خروجی', 'ویرایش', 'حذف'].forEach((t) =>
      expect(screen.getByTitle(t)).toBeInTheDocument()
    );
  });
});
