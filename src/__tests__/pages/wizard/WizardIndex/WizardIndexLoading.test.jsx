import React from 'react';
import { render, screen } from '@testing-library/react';
import { WizardIndexLoading } from '../../../../pages/wizard/WizardIndex/WizardIndexLoading';
import { useDisplay } from '../../../../hooks/display';
import { SkeletonLoading } from '../../../../components/ui/loading/skeletonLoading';

/**
 * Mocks
 */
jest.mock('../../../../hooks/display', () => ({
  useDisplay: jest.fn(),
}));

jest.mock('../../../../components/ui/loading/skeletonLoading', () => ({
  SkeletonLoading: jest.fn(() => null),
}));

describe('WizardIndexLoading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Renders appropriate skeleton (table or cards) matching real layout
   */
  it('renders header + 2 skeleton blocks with expected props', () => {
    useDisplay.mockReturnValue({ height: 600, isLargeDisplay: true });

    render(<WizardIndexLoading />);

    expect(screen.getByText('ویزاردها')).toBeInTheDocument();
    expect(SkeletonLoading).toHaveBeenCalledTimes(2);

    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        height: 45,
        width: 110,
        containerClassName: 'inline',
      }),
      {}
    );

    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        rows: Math.floor(600 / 150), 
        cols: 3,
        height: 110,
        containerClassName: 'flex flex-row my-3',
        className: 'md:mx-2',
      }),
      {}
    );
  });

  /**
   * Responsive behavior consistent with loaded state
   */
  it('uses 1 col on small display and 3 cols on large display', () => {
    useDisplay.mockReturnValue({ height: 450, isLargeDisplay: false });
    render(<WizardIndexLoading />);

    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cols: 1,
        rows: Math.floor(450 / 150), 
      }),
      {}
    );
  });
});
