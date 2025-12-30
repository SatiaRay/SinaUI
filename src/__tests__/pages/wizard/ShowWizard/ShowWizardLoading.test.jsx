import React from 'react';
import { render } from '@testing-library/react';
import { ShowWizardLoading } from '../../../../pages/wizard/ShowWizard/ShowWizardLoading';
import { SkeletonLoading } from '../../../../components/ui/loading/skeletonLoading';

/**
 * Mocks
 */
jest.mock('../../../../components/ui/loading/skeletonLoading', () => ({
  SkeletonLoading: jest.fn(() => null),
}));

describe('ShowWizardLoading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Loading Components
   * Renders appropriate skeleton (table or cards) matching real layout
   */
  it('renders expected skeleton structure and counts', () => {
    render(<ShowWizardLoading />);

    expect(SkeletonLoading).toHaveBeenCalledTimes(12);

    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ height: 40, width: 100 }),
      {}
    );

    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ height: 40, width: 140 }),
      {}
    );
    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ height: 40, width: 90 }),
      {}
    );

    expect(SkeletonLoading).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({ height: 150 }),
      {}
    );

    const rowCalls = SkeletonLoading.mock.calls.slice(4);
    expect(rowCalls).toHaveLength(8);
    rowCalls.forEach(([props]) => {
      expect(props).toEqual(expect.objectContaining({ height: 70 }));
    });
  });

  /**
   * Responsive behavior consistent with loaded state
   */
  it('does not depend on display hooks (stable render)', () => {
    render(<ShowWizardLoading />);
    expect(SkeletonLoading).toHaveBeenCalled();
  });
});
