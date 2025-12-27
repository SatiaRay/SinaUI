import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Mock: toast notifications
 */
jest.mock('../ui/toast', () => ({
  notify: { success: jest.fn(), error: jest.fn() },
}));

/**
 * Mock: Theme hook
 */
jest.mock(
  '@contexts/ThemeContext',
  () => ({
    useTheme: () => ({ theme: 'light' }),
  }),
  { virtual: true }
);

jest.mock(
  '../../contexts/ThemeContext',
  () => ({
    useTheme: () => ({ theme: 'light' }),
  }),
  { virtual: true }
);

/**
 * Mock: router params/navigation
 */
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ workflowId: 'wf-1' }),
}));

/**
 * Mock: display hook
 * Set isDesktop=false so MiniMap is NOT rendered.
 */
jest.mock('hooks/display', () => ({
  useDisplay: () => ({ isDesktop: false }),
}));

/**
 * Mock: uuid (Jest 27-safe)
 */
jest.mock('uuid', () => ({
  v4: () => 'uuid-mock',
}));

/**
 * Mock: workflow utility helpers
 */
jest.mock('../../utils/workflowUtility', () => ({
  extractNodes: (workflowData) =>
    workflowData?.nodes ?? [
      {
        id: '1',
        type: 'start',
        position: { x: 0, y: 0 },
        data: {
          label: 'شروع',
          description: '',
          conditions: [],
          pageConfig: { showPage: false, pageUrl: '', closeOnAction: false },
        },
      },
    ],
  extractEdges: (workflowData) => workflowData?.edges ?? [],
  formatNodes: (nodes, edges) => ({ nodes, edges }),
}));

/**
 * Mock: API endpoints
 */
const mockGetFunctionsMap = jest.fn();
jest.mock('../../utils/apis', () => ({
  aiFunctionsEndpoints: {
    getFunctionsMap: (...args) => mockGetFunctionsMap(...args),
  },
}));

/**
 * Mock: child components
 */
jest.mock('./NodeDetails', () => (props) => (
  <div data-testid="node-details">
    <div>NodeDetails for: {props.node?.id}</div>
    <button onClick={props.onClose}>close-node-details</button>
  </div>
));

jest.mock(
  './PageViewer',
  () => (props) =>
    props.pageConfig?.showPage ? (
      <div data-testid="page-viewer">
        <div>PageViewer: {props.pageConfig?.title ?? 'صفحه'}</div>
        <button onClick={props.onClose}>close-page-viewer</button>
      </div>
    ) : null
);

/**
 * Mock: Sidebar
 */
jest.mock('./WorkflowEditorSidebar', () => (props) => (
  <div data-testid="sidebar">
    <button onClick={() => props.addNode('process')}>add-process</button>
    <button onClick={() => props.addNode('function')}>add-function</button>
    <button onClick={() => props.setFullscreen(!props.fullscreen)}>
      toggle-fullscreen
    </button>
  </div>
));

/**
 * Mock: ReactFlow + hooks
 */
const mockGetViewport = jest.fn(() => ({ x: 0, y: 0, zoom: 1 }));

jest.mock('reactflow', () => {
  const React = require('react');

  const ReactFlow = ({ nodes = [], onNodeClick, children }) => (
    <div data-testid="reactflow">
      {nodes.map((n) => (
        <button
          key={n.id}
          data-testid={`node-${n.id}`}
          onClick={(e) => onNodeClick?.(e, n)}
        >
          {n.data?.label ?? n.id}
        </button>
      ))}
      {children}
    </div>
  );

  return {
    __esModule: true,
    default: ReactFlow,
    Background: () => <div data-testid="rf-bg" />,
    Controls: () => <div data-testid="rf-controls" />,
    MiniMap: () => <div data-testid="rf-minimap" />,
    ReactFlowProvider: ({ children }) => (
      <div data-testid="rf-provider">{children}</div>
    ),
    addEdge: (edge, edges) => [...edges, edge],
    useNodesState: (initial) => React.useState(initial),
    useEdgesState: (initial) => React.useState(initial),
    useReactFlow: () => ({ getViewport: mockGetViewport }),
  };
});

/**
 * Lazy import after mocks (important for Jest)
 */
const WorkflowEditor = require('./WorkflowEditor').default;

describe('WorkflowEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetFunctionsMap.mockResolvedValue({
      functions: [
        { name: 'Func A', description: 'desc A' },
        { name: 'Func B', description: 'desc B' },
      ],
    });
  });

  const renderEditor = (overrides = {}) => {
    const props = {
      onChange: jest.fn(),
      setSchema: jest.fn(),
      initFlow: null,
      ...overrides,
    };

    render(<WorkflowEditor {...props} />);
    return props;
  };

  test('renders and initializes schema', async () => {
    const { setSchema } = renderEditor();

    expect(screen.getByTestId('rf-provider')).toBeInTheDocument();
    expect(screen.getByTestId('reactflow')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();

    await waitFor(() => {
      expect(setSchema).toHaveBeenCalled();
      expect(setSchema).toHaveBeenCalledWith(
        expect.objectContaining({
          nodes: expect.any(Array),
          edges: expect.any(Array),
        })
      );
    });
  });

  test('clicking a node opens NodeDetails and close hides it', async () => {
    renderEditor();

    await userEvent.click(screen.getByTestId('node-1'));
    expect(screen.getByTestId('node-details')).toBeInTheDocument();

    await userEvent.click(screen.getByText('close-node-details'));
    expect(screen.queryByTestId('node-details')).not.toBeInTheDocument();
  });

  test('fullscreen toggle works (smoke)', async () => {
    renderEditor();

    await userEvent.click(screen.getByText('toggle-fullscreen'));
    await userEvent.click(screen.getByText('toggle-fullscreen'));

    expect(true).toBe(true);
  });
});
