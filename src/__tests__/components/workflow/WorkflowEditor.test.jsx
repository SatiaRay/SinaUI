import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Mocks: toast notifications
 */
jest.mock('../../../components/ui/toast', () => ({
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
  '../../../contexts/ThemeContext',
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
 */
let mockIsDesktop = false;
jest.mock('hooks/display', () => ({
  useDisplay: () => ({ isDesktop: mockIsDesktop }),
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
jest.mock('../../../utils/workflowUtility', () => ({
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
jest.mock('../../../utils/apis', () => ({
  aiFunctionsEndpoints: {
    getFunctionsMap: (...args) => mockGetFunctionsMap(...args),
  },
}));

/**
 * Mock: child components
 */
jest.mock('../../../components/workflow/NodeDetails', () => (props) => (
  <div data-testid="node-details">
    <div>NodeDetails for: {props.node?.id}</div>
    <button onClick={props.onClose}>close-node-details</button>
  </div>
));

jest.mock('../../../components/workflow/PageViewer', () => (props) =>
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
jest.mock('../../../components/workflow/WorkflowEditorSidebar', () => (props) => (
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
jest.mock('reactflow', () => {
  const React = require('react');

  const mockGetViewport = jest.fn(() => ({
    x: 0,
    y: 0,
    zoom: 1,
  }));

  const useReactFlow = () => ({
    getViewport: mockGetViewport,
  });

  const ReactFlow = ({
    nodes = [],
    edges = [],
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    nodeTypes,
    children,
    ...props
  }) => {
    return (
      <div data-testid="reactflow" {...props}>
        {nodes.map((n) => (
          <button
            key={n.id}
            data-testid={`node-${n.id}`}
            onClick={(e) => onNodeClick?.(e, n)}
          >
            {n.data?.label ?? n.id}
          </button>
        ))}

        {edges.map((e) => (
          <div
            key={e.id}
            data-testid={`edge-${e.id}`}
            data-source={e.source}
            data-target={e.target}
          >
            {e.source}→{e.target}
          </div>
        ))}

        {children}
      </div>
    );
  };

  return {
    __esModule: true,
    default: ReactFlow,
    Background: () => <div data-testid="rf-bg" />,
    Controls: () => <div data-testid="rf-controls" />,
    MiniMap: (props) => (
      <div
        data-testid="rf-minimap"
        data-nodecolor={props.nodeColor}
        data-maskcolor={props.maskColor}
        className={props.className}
      />
    ),
    ReactFlowProvider: ({ children }) => (
      <div data-testid="rf-provider">{children}</div>
    ),
    addEdge: (edge, edges) => [...edges, edge],
    useNodesState: (initial) => React.useState(initial),
    useEdgesState: (initial) => React.useState(initial),
    useReactFlow,
    __mock: { mockGetViewport },
  };
});

/**
 * Import after mocks (important for Jest)
 */
const WorkflowEditor = require('../../../components/workflow/WorkflowEditor')
  .default;

/**
 * Helper: wait for async mount effects to settle
 */
const waitForMountEffects = async () => {
  await waitFor(() => expect(mockGetFunctionsMap).toHaveBeenCalled());
};

describe('WorkflowEditor (per task)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsDesktop = false;
    mockGetFunctionsMap.mockResolvedValue({
      functions: [
        { name: 'Func A', description: 'desc A' },
        { name: 'Func B', description: 'desc B' },
      ],
    });
  
    require('reactflow').__mock.mockGetViewport.mockReturnValue({
      x: 0,
      y: 0,
      zoom: 1,
    });
  });

  /**
   * render helper
   * @param {object} overrides - override props for specific tests
   */
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

  /**
   * Task: Nodes and edges render correctly
   */
  test('renders nodes and edges from initFlow', async () => {
    renderEditor({
      initFlow: {
        nodes: [
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
          {
            id: '2',
            type: 'process',
            position: { x: 100, y: 100 },
            data: {
              label: 'فرآیند',
              description: 'desc',
              conditions: [],
              pageConfig: { showPage: false, pageUrl: '', closeOnAction: false },
            },
          },
        ],
        edges: [{ id: 'e1-2', source: '1', target: '2', type: 'step' }],
      },
    });

    await waitForMountEffects();

    expect(screen.getByTestId('node-1')).toBeInTheDocument();
    expect(screen.getByTestId('node-2')).toBeInTheDocument();

    expect(screen.getByTestId('edge-e1-2')).toBeInTheDocument();
    expect(screen.getByText('1→2')).toBeInTheDocument();
  });

  /**
   * MiniMap visible on desktop
   */
  test('shows MiniMap on desktop', async () => {
    mockIsDesktop = true;
    renderEditor();

    await waitForMountEffects();

    expect(screen.getByTestId('rf-minimap')).toBeInTheDocument();
  });

  /**
   * Theme-aware styling (light mode)
   */
  test('passes light theme colors to MiniMap when desktop', async () => {
    mockIsDesktop = true;
    renderEditor();

    await waitForMountEffects();

    const minimap = screen.getByTestId('rf-minimap');
    expect(minimap.dataset.nodecolor).toBe('#ccc');
    expect(minimap.dataset.maskcolor).toBe('#ffffff80');
  });

  /**
   * key interactions
   * Clicking a node opens NodeDetails, clicking close hides it.
   */
  test('clicking a node opens NodeDetails and close hides it', async () => {
    renderEditor();
    await waitForMountEffects();

    await userEvent.click(screen.getByTestId('node-1'));
    expect(screen.getByTestId('node-details')).toBeInTheDocument();

    await userEvent.click(screen.getByText('close-node-details'));
    expect(screen.queryByTestId('node-details')).not.toBeInTheDocument();
  });

  /**
   * onChange callback called on modifications
   */
  test('calls onChange when nodes are modified (add node)', async () => {
    const { onChange } = renderEditor();
    await waitForMountEffects();

    await userEvent.click(screen.getByText('add-process'));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });

    const callArg = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(callArg).toEqual(
      expect.objectContaining({
        nodes: expect.any(Array),
        edges: expect.any(Array),
      })
    );

    expect(callArg.nodes.some((n) => n.id === 'uuid-mock')).toBe(true);
  });

  /**
   * setSchema called after any change (including initial render)
   */
  test('renders and initializes schema (setSchema called)', async () => {
    const { setSchema } = renderEditor();
    await waitForMountEffects();

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

  /**
   * Smoke test: fullscreen toggle exists and can be clicked
   */
  test('fullscreen toggle works (smoke)', async () => {
    renderEditor();
    await waitForMountEffects();

    await userEvent.click(screen.getByText('toggle-fullscreen'));
    await userEvent.click(screen.getByText('toggle-fullscreen'));

    expect(true).toBe(true);
  });
});
