import React from 'react';
import { render, screen } from '@testing-library/react';
import { WorkflowIndexLoading } from './WorkflowIndexLoading';

/**
 * Mock: display hook
 * Toggle isDesktop to validate responsive skeleton widths.
 */
let mockIsDesktop = true;
jest.mock('hooks/display', () => ({
  useDisplay: () => ({ isDesktop: mockIsDesktop }),
}));

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
      />
    );
  };
});

describe('WorkflowIndexLoading', () => {
  /**
   * Test: renders skeletons
   */
  it('renders skeleton layout', () => {
    render(<WorkflowIndexLoading />);
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(10);
  });

  /**
   * Test: desktop widths
   */
  it('uses desktop widths when isDesktop=true', () => {
    mockIsDesktop = true;
    render(<WorkflowIndexLoading />);

    const widths = screen
      .getAllByTestId('skeleton')
      .map((n) => n.dataset.width);
    expect(widths).toContain('200');
    expect(widths).toContain('160');
  });

  /**
   * Test: mobile widths
   */
  it('uses mobile widths when isDesktop=false', () => {
    mockIsDesktop = false;
    render(<WorkflowIndexLoading />);

    const widths = screen
      .getAllByTestId('skeleton')
      .map((n) => n.dataset.width);
    expect(widths).toContain('100');
    expect(widths).toContain('90');
  });
});
