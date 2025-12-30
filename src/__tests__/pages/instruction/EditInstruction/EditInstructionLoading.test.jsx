/**
 * EditInstructionLoading unit tests
 * Covers skeleton render count and layout classes (responsive grid matches real layout).
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

import { EditInstructionLoading } from '../../../../pages/instruction/EditInstruction/EditInstructionLoading';

jest.mock('../../../../components/ui/loading/skeletonLoading', () => ({
  SkeletonLoading: (props) => (
    <div
      data-testid="skeleton"
      data-height={String(props.height ?? '')}
      data-width={String(props.width ?? '')}
      data-container={String(props.containerClassName ?? '')}
      data-class={String(props.className ?? '')}
    />
  ),
}));

/**
 * Silence known noisy warnings
 */
const isNoisy = (msg) => String(msg).includes('ReactDOMTestUtils.act');

describe('EditInstructionLoading', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (isNoisy(args[0])) return;

      console.error(...args);
    });
  });

  afterEach(() => {
    console.error.mockRestore?.();
  });

  /**
   * Renders correct number of skeleton items (matches component structure)
   */
  it('renders correct number of skeleton items', () => {
    render(<EditInstructionLoading />);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(9);
  });

  /**
   * Responsive grid matches real layout (className assertions)
   */
  it('uses responsive grid classes consistent with the real layout', () => {
    const { container } = render(<EditInstructionLoading />);

    expect(container.firstChild).toHaveClass(
      'bg-white',
      'dark:bg-gray-800',
      'rounded-lg',
      'shadow',
      'flex',
      'flex-col',
      'h-full',
      'overflow-hidden',
      'w-full'
    );

    expect(
      container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2')
    ).toBeTruthy();

    expect(
      container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2')
    ).toBeTruthy();
  });
});
