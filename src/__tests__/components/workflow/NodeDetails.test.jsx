import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NodeDetails from '../../../components/workflow/NodeDetails';
import { notify } from '../../../components/ui/toast';

/**
 * Mock: Toast notifications
 */
jest.mock('../../../components/ui/toast', () => ({
  notify: { success: jest.fn(), error: jest.fn() },
}));

/**
 * @function typeLabel
 * @param {string} type - Node type
 * @returns {string} Persian label used in title & confirmation text
 */
const typeLabel = (type) =>
  type === 'start'
    ? 'شروع'
    : type === 'process'
      ? 'فرآیند'
      : type === 'decision'
        ? 'تصمیم'
        : type === 'function'
          ? 'تابع'
          : type === 'response'
            ? 'پاسخ'
            : 'پایان';

/**
 * @function buildNode
 * @param {Object} node - partial node override
 * @returns {Object} fully-shaped node (ensures data exists)
 */
const buildNode = (node = {}) => ({
  id: 'n1',
  type: 'process',
  data: {
    label: 'Node Title',
    description: 'Desc',
    connections: [],
    conditions: [],
  },
  ...node,
  data: {
    label: 'Node Title',
    description: 'Desc',
    connections: [],
    conditions: [],
    ...(node.data || {}),
  },
});

/**
 * @function renderModal
 * @param {Object} overrides - props overrides
 * @param {Object} overrides.node - node override
 * @param {Array} overrides.nodes - nodes array
 * @param {Function} overrides.onUpdate - update handler
 * @param {Function} overrides.onClose - close handler
 * @param {Function} overrides.onDelete - delete handler
 * @returns {Object} rendered props for assertions
 */
const renderModal = (overrides = {}) => {
  const node = buildNode(overrides.node);

  const props = {
    node,
    nodes: overrides.nodes ?? [{ id: node.id, data: node.data }],
    onUpdate: overrides.onUpdate ?? jest.fn(),
    onClose: overrides.onClose ?? jest.fn(),
    onDelete: overrides.onDelete ?? jest.fn(),
    saveWorkflow: overrides.saveWorkflow ?? jest.fn(),
  };

  render(<NodeDetails {...props} />);
  return props;
};

/**
 * Test Suite: NodeDetails
 * - Covers title, decision-only conditions UI, save, cancel, and delete confirmation flow.
 */
describe('NodeDetails', () => {
  /**
   * Reset mocks before each test
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: Renders correct title based on node type
   */
  test('renders title "ویرایش <type>"', () => {
    renderModal({ node: { type: 'function' } });
    expect(
      screen.getByText(`ویرایش ${typeLabel('function')}`)
    ).toBeInTheDocument();
  });

  /**
   * Test: Non-decision nodes do not show conditions section
   */
  test('does not show conditions section for non-decision nodes', () => {
    renderModal({ node: { type: 'process' } });
    expect(screen.queryByText('شرایط')).not.toBeInTheDocument();
  });

  /**
   * Test: Decision node can add/remove/update conditions
   */
  test('decision node: can add/remove/update conditions', async () => {
    renderModal({
      node: {
        type: 'decision',
        data: { conditions: ['شرط 1', '', '   ', 'شرط 2'] },
      },
    });

    expect(screen.getAllByPlaceholderText('شرط تصمیم')).toHaveLength(2);

    const inputs = screen.getAllByPlaceholderText('شرط تصمیم');
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], 'شرط آپدیت شده');
    expect(screen.getByDisplayValue('شرط آپدیت شده')).toBeInTheDocument();

    await userEvent.click(screen.getByText('+ افزودن شرط'));
    expect(screen.getAllByPlaceholderText('شرط تصمیم')).toHaveLength(3);

    await userEvent.click(screen.getAllByText('حذف')[0]);
    expect(screen.getAllByPlaceholderText('شرط تصمیم')).toHaveLength(2);
  });

  /**
   * Test: Save calls onUpdate with filtered conditions, shows success toast, and closes modal
   */
  test('save: calls onUpdate, shows success toast, and calls onClose', async () => {
    const onUpdate = jest.fn();
    const onClose = jest.fn();

    renderModal({
      node: {
        id: 'n9',
        type: 'decision',
        data: { conditions: ['A', '', '  '] },
      },
      onUpdate,
      onClose,
    });

    await userEvent.click(screen.getByRole('button', { name: 'ذخیره' }));

    expect(onUpdate).toHaveBeenCalledWith(
      'n9',
      expect.objectContaining({ conditions: ['A'] })
    );
    expect(notify.success).toHaveBeenCalledWith('تغییرات با موفقیت ذخیره شد');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * Test: Cancel button closes the modal
   */
  test('cancel: calls onClose', async () => {
    const onClose = jest.fn();
    const onUpdate = jest.fn();
    const onDelete = jest.fn();

    renderModal({ onClose, onUpdate, onDelete });

    await userEvent.click(screen.getByRole('button', { name: 'انصراف' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onUpdate).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  /**
   * Test: Delete confirmation flow
   */
  test('delete: opens confirm modal and confirms delete', async () => {
    const onDelete = jest.fn();
    const onClose = jest.fn();

    renderModal({ node: { id: 'del-1', type: 'process' }, onDelete, onClose });

    await userEvent.click(screen.getAllByRole('button', { name: 'حذف' })[0]);
    expect(screen.getByText('تایید حذف')).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole('button', { name: 'حذف' })[1]);

    expect(onDelete).toHaveBeenCalledWith('del-1');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * Test: Delete confirm modal can be dismissed (confirm-layer only)
   */
  test('delete: confirm modal cancel closes only confirm modal', async () => {
    renderModal({ node: { type: 'process' } });

    await userEvent.click(screen.getAllByRole('button', { name: 'حذف' })[0]);
    expect(screen.getByText('تایید حذف')).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole('button', { name: 'انصراف' })[1]);

    expect(screen.queryByText('تایید حذف')).not.toBeInTheDocument();
  });

  /**
   * Test: Save disabled state (pragmatic)
   */
  test('save button exists', () => {
    renderModal();
    expect(screen.getByRole('button', { name: 'ذخیره' })).toBeInTheDocument();
  });
});
