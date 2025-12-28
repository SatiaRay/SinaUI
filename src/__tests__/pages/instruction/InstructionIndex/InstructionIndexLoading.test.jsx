/**
 * InstructionIndexLoading unit tests
 * Ensures skeleton renders with correct rows/cols based on display hook values.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

import { InstructionIndexLoading } from '../../../../pages/instruction/InstructionIndex/InstructionIndexLoading';
import { useDisplay } from '../../../../hooks/display';

jest.mock('../../../../hooks/display', () => ({ useDisplay: jest.fn() }));

let mockSkeletonProps;
/**
 * SkeletonLoading mock to capture props passed from InstructionIndexLoading
 */
jest.mock('../../../../components/ui/loading/skeletonLoading', () => ({
  SkeletonLoading: (props) => {
    mockSkeletonProps = mockSkeletonProps || [];
    mockSkeletonProps.push(props);
    return <div data-testid="skeleton" />;
  },
}));

describe('InstructionIndexLoading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSkeletonProps = [];
  });

  /**
   * Renders title and two skeleton blocks (button + grid)
   */
  it('renders title and skeletons', () => {
    useDisplay.mockReturnValue({ height: 600, isLargeDisplay: true });

    render(<InstructionIndexLoading />);

    expect(screen.getByText('دستورالعمل‌ها')).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton')).toHaveLength(2);

    expect(mockSkeletonProps[0]).toEqual(
      expect.objectContaining({
        height: 45,
        width: 110,
        containerClassName: 'inline',
      })
    );

    expect(mockSkeletonProps[1]).toEqual(
      expect.objectContaining({
        height: 150,
        containerClassName: 'flex flex-row my-3',
        className: 'md:mx-2',
      })
    );
  });

  /**
   * Uses 3 columns on large displays
   */
  it('sets cols=3 when isLargeDisplay is true', () => {
    useDisplay.mockReturnValue({ height: 600, isLargeDisplay: true });

    render(<InstructionIndexLoading />);

    expect(mockSkeletonProps[1].cols).toBe(3);
  });

  /**
   * Uses 1 column on small displays
   */
  it('sets cols=1 when isLargeDisplay is false', () => {
    useDisplay.mockReturnValue({ height: 600, isLargeDisplay: false });

    render(<InstructionIndexLoading />);

    expect(mockSkeletonProps[1].cols).toBe(1);
  });

  /**
   * Calculates rows from height
   */
  it('calculates rows based on height', () => {
    useDisplay.mockReturnValue({ height: 760, isLargeDisplay: true });

    render(<InstructionIndexLoading />);

    expect(mockSkeletonProps[1].rows).toBe(Math.floor(760 / 150) - 1);
  });
});
