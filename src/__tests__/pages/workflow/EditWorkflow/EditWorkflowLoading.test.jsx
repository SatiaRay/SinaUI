import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditWorkflowLoading } from '../../../../pages/workflow/EditWorkflow/EditWorkflowLoading';

/**
 * Mock: Skeleton
 * Replace heavy skeleton with a tiny div for assertions.
 */
jest.mock('react-loading-skeleton', () => {
  return function SkeletonMock(props) {
    return (
      <div
        data-testid="skeleton"
        data-width={props.width ?? ''}
        data-height={props.height ?? ''}
        data-circle={props.circle ? '1' : '0'}
      />
    );
  };
});

describe('EditWorkflowLoading', () => {
  /**
   * Test: renders editor skeleton layout (sanity)
   */
  it('renders skeleton layout', () => {
    render(<EditWorkflowLoading />);
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(20);
  });

  /**
   * Test: sidebar contains at least 8 square skeleton icons
   */
  it('renders sidebar icon skeletons', () => {
    render(<EditWorkflowLoading />);

    const icons = screen
      .getAllByTestId('skeleton')
      .filter((n) => n.dataset.width === '40' && n.dataset.height === '40');

    expect(icons.length).toBeGreaterThanOrEqual(8);
  });

  /**
   * Test: node skeleton includes circular avatar skeleton
   */
  it('renders circular node avatar skeletons', () => {
    render(<EditWorkflowLoading />);

    const circles = screen
      .getAllByTestId('skeleton')
      .filter(
        (n) =>
          n.dataset.circle === '1' &&
          n.dataset.width === '46' &&
          n.dataset.height === '46'
      );

    expect(circles.length).toBeGreaterThan(0);
  });
});
