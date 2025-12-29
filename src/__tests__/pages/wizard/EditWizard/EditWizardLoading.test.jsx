import React from 'react';
import { render } from '@testing-library/react';
import { EditWizardLoading } from '../../../../pages/wizard/UpdateWizard/EditWizardLoading';
import { SkeletonLoading } from '../../../../components/ui/loading/skeletonLoading';

/**
 * Mocks
 */
jest.mock('../../../../components/ui/loading/skeletonLoading', () => ({
  SkeletonLoading: jest.fn(() => null),
}));

describe('EditWizardLoading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Loading Components
   * Renders appropriate skeleton (table or cards) matching real layout
   */
  it('renders expected skeleton blocks with key props', () => {
    render(<EditWizardLoading />);

    expect(SkeletonLoading).toHaveBeenCalledTimes(9);

    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ height: 30, width: 160 }),
      {}
    );

    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ height: 30, width: 100 }),
      {}
    );
    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ height: 45, className: 'w-full' }),
      {}
    );

    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      6,
      expect.objectContaining({ height: 30, width: 120 }),
      {}
    );
    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      7,
      expect.objectContaining({ height: 100, className: 'w-full' }),
      {}
    );

    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      8,
      expect.objectContaining({
        height: 45,
        containerClassName: 'w-1/2 md:w-[80px]',
        className: 'inline',
      }),
      {}
    );
    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      9,
      expect.objectContaining({
        height: 45,
        containerClassName: 'w-1/2 md:w-[110px]',
        className: 'inline',
      }),
      {}
    );
  });

  /**
   * Responsive behavior consistent with loaded state
   */
  it('renders consistently', () => {
    render(<EditWizardLoading />);
    expect(SkeletonLoading).toHaveBeenCalled();
  });
});
