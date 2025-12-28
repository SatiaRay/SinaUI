import React from 'react';
import { render, screen } from '@testing-library/react';
import { WorkflowIndexLoading } from '../../../../pages/workflow/WorkflowIndex/WorkflowIndexLoading';

/**
 * Mock: display hook
 * toggle isDesktop to validate responsive skeleton layout.
 */
let mockIsDesktop = true;
jest.mock('hooks/display', () => ({
  useDisplay: () => ({ isDesktop: mockIsDesktop }),
}));

/**
 * Mock: Skeleton
 * Replace heavy skeleton with a tiny div that exposes width/height props.
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

const getWidths = () =>
  screen.getAllByTestId('skeleton').map((n) => String(n.dataset.width || ''));

describe('WorkflowIndexLoading (per task)', () => {
  it('renders skeletons matching the real page layout (non-empty)', () => {
    mockIsDesktop = true;
    render(<WorkflowIndexLoading />);
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('desktop: renders table/list-like skeleton widths (consistent with loaded desktop layout)', () => {
    mockIsDesktop = true;
    render(<WorkflowIndexLoading />);

    const widths = getWidths();

    expect(widths).toContain('200');
    expect(widths).toContain('160');

    expect(widths).not.toContain('100');
    expect(widths).not.toContain('90');
  });

  it('mobile: renders card-like skeleton widths (consistent with loaded mobile layout)', () => {
    mockIsDesktop = false;
    render(<WorkflowIndexLoading />);

    const widths = getWidths();

    expect(widths).toContain('100');
    expect(widths).toContain('90');

    expect(widths).not.toContain('200');
    expect(widths).not.toContain('160');
  });
});
