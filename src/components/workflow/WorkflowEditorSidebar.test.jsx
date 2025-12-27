import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WorkflowEditorSidebar from './WorkflowEditorSidebar';

/**
 * Mock: Icon component
 * Render predictable test ids for icons.
 */
jest.mock('../ui/Icon', () => (props) => (
  <span data-testid={`icon-${props.name || 'Icon'}`} />
));

/**
 * Mock: useDisplay hook
 * Allows testing desktop/mobile behaviors.
 */
const mockUseDisplay = jest.fn();
jest.mock('hooks/display', () => ({
  useDisplay: () => mockUseDisplay(),
}));

/**
 * @function renderSidebar
 * @param {Object} overrides - Optional props overrides
 * @returns {Object} Render result + props for assertions
 */
const renderSidebar = (overrides = {}) => {
  const props = {
    addNode: jest.fn(),
    setShowChatModal: jest.fn(),
    fullscreen: false,
    setFullscreen: jest.fn(),
    ...overrides,
  };

  const view = render(<WorkflowEditorSidebar {...props} />);
  return { ...view, ...props };
};

describe('WorkflowEditorSidebar', () => {
  /**
   * Reset mocks and setup safe defaults per test.
   */
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDisplay.mockReturnValue({ isDesktop: true });
    window.parent.postMessage = jest.fn();
  });

  /**
   * Test: On mount, it posts SHOW_NAVBAR when fullscreen=false.
   */
  test('posts SHOW_NAVBAR on mount when fullscreen=false', () => {
    renderSidebar({ fullscreen: false });
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      { type: 'SHOW_NAVBAR' },
      '*'
    );
  });

  /**
   * Test: On mount, it posts HIDE_NAVBAR when fullscreen=true.
   */
  test('posts HIDE_NAVBAR on mount when fullscreen=true', () => {
    renderSidebar({ fullscreen: true });
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      { type: 'HIDE_NAVBAR' },
      '*'
    );
  });

  /**
   * Test: Node buttons call addNode with correct type.
   */
  test('clicking node buttons calls addNode with correct type', async () => {
    const { addNode } = renderSidebar();

    await userEvent.click(screen.getByTitle('نقطه شروع فرایند'));
    await userEvent.click(screen.getByTitle('فرایند'));
    await userEvent.click(screen.getByTitle('تصمیم'));
    await userEvent.click(screen.getByTitle('تابع'));
    await userEvent.click(screen.getByTitle('پاسخ'));
    await userEvent.click(screen.getByTitle('پایان'));

    expect(addNode).toHaveBeenNthCalledWith(1, 'start');
    expect(addNode).toHaveBeenNthCalledWith(2, 'process');
    expect(addNode).toHaveBeenNthCalledWith(3, 'decision');
    expect(addNode).toHaveBeenNthCalledWith(4, 'function');
    expect(addNode).toHaveBeenNthCalledWith(5, 'response');
    expect(addNode).toHaveBeenNthCalledWith(6, 'end');
  });

  /**
   * Test: Extend toggle changes sidebar width class.
   */
  test('toggle extend updates sidebar width class', async () => {
    const { container } = renderSidebar();

    const sidebar = container.querySelector('.border-r');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveClass('w-16');

    const toggleExtendBtn = screen
      .getByTestId('icon-PanelLeft')
      .closest('button');
    await userEvent.click(toggleExtendBtn);

    expect(sidebar).toHaveClass('w-64');
  });

  /**
   * Test: Fullscreen toggle calls setFullscreen with inverted value.
   */
  test('fullscreen toggle calls setFullscreen with inverted value', async () => {
    const setFullscreen = jest.fn();
    renderSidebar({ fullscreen: false, setFullscreen });

    const fullscreenBtn = screen
      .getByTestId('icon-Fullscreen')
      .closest('button');
    await userEvent.click(fullscreenBtn);

    expect(setFullscreen).toHaveBeenCalledWith(true);
  });

  /**
   * Test: When fullscreen=true, shows Minimize icon and toggles back to false.
   */
  test('when fullscreen=true, shows Minimize icon and toggles to false', async () => {
    const setFullscreen = jest.fn();
    renderSidebar({ fullscreen: true, setFullscreen });

    const minimizeBtn = screen.getByTestId('icon-Minimize').closest('button');
    await userEvent.click(minimizeBtn);

    expect(setFullscreen).toHaveBeenCalledWith(false);
  });

  /**
   * Test: Mobile overlay is visible only when extended && !isDesktop.
   */
  test('mobile overlay is visible only on mobile when extended=true', async () => {
    mockUseDisplay.mockReturnValue({ isDesktop: false });
    const { container } = renderSidebar();

    const overlay = container.querySelector('.backdrop-blur-sm');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('hidden');

    const toggleExtendBtn = screen
      .getByTestId('icon-PanelLeft')
      .closest('button');
    await userEvent.click(toggleExtendBtn);

    expect(overlay).not.toHaveClass('hidden');
  });
});
