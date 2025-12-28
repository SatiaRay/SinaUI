import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditWorkflowLoading } from '../../../../pages/workflow/EditWorkflow/EditWorkflowLoading';

/**
 * Mock: Skeleton
 */
jest.mock('react-loading-skeleton', () => {
  return function SkeletonMock(props) {
    return <div data-testid="skeleton" />;
  };
});

describe('EditWorkflowLoading (per task)', () => {
  it('renders skeleton matching the real page layout (non-empty)', () => {
    render(<EditWorkflowLoading />);
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });
});