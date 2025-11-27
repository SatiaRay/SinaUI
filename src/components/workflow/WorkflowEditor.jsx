import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { notify } from '../ui/toast';
import { aiFunctionsEndpoints } from '../../utils/apis';
import NodeDetails from './NodeDetails';
import PageViewer from './PageViewer';
import WorkflowEditorSidebar from './WorkflowEditorSidebar';
import DecisionNode from './nodes/DecisionNode';
import EndNode from './nodes/EndNode';
import FunctionNode from './nodes/FunctionNode';
import ProcessNode from './nodes/ProcessNode';
import ResponseNode from './nodes/ResponseNode';
import StartNode from './nodes/StartNode';
import { useDisplay } from 'hooks/display';
import {
  extractEdges,
  extractNodes,
  formatNodes,
} from '@utils/workflowUtility';
import { useTheme } from '@contexts/ThemeContext';

/**
 * Node type definitions for ReactFlow
 * Maps node type strings to their corresponding React components
 */
const nodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
  end: EndNode,
  function: FunctionNode,
  response: ResponseNode,
};

/**
 * Initial nodes configuration for new workflow
 * Contains a single start node as the entry point
 */
const initialNodes = [
  {
    id: '1',
    type: 'start',
    position: { x: 50, y: 250 },
    data: {
      label: 'شروع',
      description: 'نقطه شروع فرآیند',
      jsonConfig: null,
      pageConfig: {
        showPage: false,
        pageUrl: '',
        closeOnAction: false,
      },
    },
  },
];

/**
 * Main workflow editor component
 *
 * @param onChange Calls only on add or remove nodes and edges
 * @param setSchema Calls after any change in workflow even moving nodes
 * @returns jsx
 */
const WorkflowEditorContent = ({
  onChange,
  setSchema,
  workflowData = null,
}) => {
  // Router hooks for navigation and parameters
  const { workflowId } = useParams();
  const navigate = useNavigate();

  /**
   * Using theme hook
   */
  const { theme } = useTheme();

  // State management for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(
    extractNodes(workflowData)
  );
  const [nodesCount, setNodesCount] = useState(nodes.length);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    extractEdges(workflowData)
  );
  const [edgesCount, setEdgesCount] = useState(edges.length);

  // UI state management
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFunctionModal, setShowFunctionModal] = useState(false);
  const [aiFunctions, setAiFunctions] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // React Flow instance for viewport manipulation
  const reactFlowInstance = useReactFlow();

  /**
   * Hides navbar when chat modal is open
   * Posts message to parent window to control navbar visibility
   */
  useEffect(() => {
    if (showChatModal) {
      window.parent.postMessage({ type: 'HIDE_NAVBAR' }, '*');
    }
  }, [showChatModal]);

  /**
   * Update flow through sending changes to the parent component
   * through the setSchema prop
   */
  useEffect(() => {
    setSchema(formatNodes(nodes, edges));

    if (nodes && edges) setNodesCount(nodes.length);
    setEdgesCount(edges.length);
  }, [nodes, edges]);

  /**
   * Calling onChange prop handler on nodes or edges count change
   */
  useEffect(() => {
    if (nodes && edges) onChange(formatNodes(nodes, edges));
  }, [nodesCount, edgesCount]);

  /**
   * Display util hooks
   */
  const { isDesktop } = useDisplay();

  /**
   * Fetches workflow data when component mounts or workflowId changes
   * Transforms API response into ReactFlow nodes and edges format
   */
  // useEffect(() => {
  //   if (!workflowData || !workflowId) return;

  //   try {
  //     setLoading(true);
  //     setError(null);

  //     // Transform workflow steps to ReactFlow nodes
  //     const workflowNodes = extractNodes(workflowData)

  //     // Transform workflow connections to ReactFlow edges
  //     const workflowEdges = extractEdges(workflowData)

  //     setNodes(workflowNodes);
  //     setEdges(workflowEdges);
  //   } catch (err) {
  //     error('Error processing workflow data:', err);
  //     setError('خطا در پردازش اطلاعات گردش کار');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [workflowData, workflowId, setNodes, setEdges]);

  /**
   * Convert flow to json and call setSchema handler
   */
  // useEffect(() => {
  //   setSchema(flowToJson(edges))
  // }, [edges, nodes])

  /**
   * Handles connection creation between nodes
   * Validates connection rules and creates appropriate edge
   */
  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((node) => node.id === params.source);

      // Set default handle for start nodes
      if (sourceNode?.type === 'start') {
        params.sourceHandle = 'right';
      }

      // Validate decision node connections
      if (sourceNode?.type === 'decision') {
        if (
          !params.sourceHandle ||
          !sourceNode.data.conditions.includes(params.sourceHandle)
        ) {
          console.warn(`Invalid sourceHandle: ${params.sourceHandle}`);
          return;
        }
      }

      // Prevent multiple outgoing connections from non-decision nodes
      if (sourceNode?.type !== 'decision') {
        const existingOutgoingEdges = edges.filter(
          (edge) => edge.source === params.source
        );
        if (existingOutgoingEdges.length > 0) {
          console.warn(
            'Only decision nodes can have multiple outgoing connections'
          );
          return;
        }
      }

      // Add new edge to the flow
      setEdges((eds) => {
        return addEdge(
          {
            ...params,
            id: `${params.source}-${params.sourceHandle}-${
              params.target
            }-${Date.now()}`,
            type: 'step',
            animated: true,
            style: { stroke: '#f59e0b' },
          },
          eds
        );
      });
    },
    [setEdges, nodes, edges]
  );

  /**
   * Handles node click events
   * Selects node and activates page if configured
   */
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);

    if (node.data.pageConfig?.showPage) {
      setActivePage(node.data.pageConfig);
    }
  }, []);

  /**
   * Updates node data and manages conditional edges for decision nodes
   */
  const onNodeUpdate = useCallback(
    (nodeId, newData) => {
      setNodes((nds) => {
        const updatedNodes = nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
                conditions:
                  newData.conditions?.filter((c) => c && c.trim() !== '') || [],
              },
            };
          }
          return node;
        });
        return updatedNodes;
      });

      // Handle edge management for decision nodes
      if (newData.type === 'decision') {
        setEdges((eds) => {
          const otherEdges = eds.filter((edge) => edge.source !== nodeId);
          const newConditions =
            newData.conditions?.filter((c) => c && c.trim() !== '') || [];
          const validEdges = eds.filter(
            (edge) =>
              edge.source === nodeId &&
              newConditions.includes(edge.sourceHandle)
          );
          const newEdges = newConditions
            .filter(
              (condition) =>
                !validEdges.some((edge) => edge.sourceHandle === condition)
            )
            .map((condition, index) => ({
              id: `${nodeId}-${condition}-${index}`,
              source: nodeId,
              target: null,
              sourceHandle: condition,
              type: 'step',
              animated: true,
              style: { stroke: '#f59e0b' },
            }));
          return [...otherEdges, ...validEdges, ...newEdges];
        });
      }
    },
    [setNodes, setEdges]
  );

  /**
   * Fetches available AI functions from the API
   */
  const fetchAiFunctions = useCallback(async () => {
    try {
      const data = await aiFunctionsEndpoints.getFunctionsMap();
      setAiFunctions(data.functions || []);
    } catch (err) {
      console.error('Error fetching AI functions:', err);
      notify.error('خطا در دریافت لیست توابع');
    }
  }, []);

  // Fetch AI functions on component mount
  useEffect(() => {
    fetchAiFunctions();
  }, [fetchAiFunctions]);

  /**
   * Adds a new node to the workflow
   * @param {string} type - The type of node to add
   */
  const addNode = (type) => {
    if (type === 'function') {
      setShowFunctionModal(true);
      return;
    }

    const { x, y, zoom } = reactFlowInstance.getViewport();
    const centerX = -x + window.innerWidth / 2 / zoom;
    const centerY = -y + window.innerHeight / 2 / zoom;

    const newNode = {
      id: uuidv4(),
      type,
      position: {
        x: centerX,
        y: centerY,
      },
      data: {
        label:
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
                    : 'پایان',
        description: '',
        connections: [],
        conditions: type === 'decision' ? ['شرط پیش‌فرض'] : [],
        jsonConfig: null,
        pageConfig: {
          showPage: false,
          pageUrl: '',
          closeOnAction: false,
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  /**
   * Adds a function node with specific AI function data
   * @param {Object} functionData - The AI function configuration
   */
  const addFunctionNode = (functionData) => {
    const { x, y, zoom } = reactFlowInstance.getViewport();
    const centerX = -x + window.innerWidth / 2 / zoom;
    const centerY = -y + window.innerHeight / 2 / zoom;

    const newNode = {
      id: uuidv4(),
      type: 'function',
      position: {
        x: centerX,
        y: centerY,
      },
      data: {
        label: functionData.name,
        description: functionData.description,
        functionData: functionData,
        connections: [],
        jsonConfig: null,
        pageConfig: {
          showPage: false,
          pageUrl: '',
          closeOnAction: false,
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setShowFunctionModal(false);
  };

  /**
   * Closes the active page viewer
   */
  const handlePageClose = useCallback(() => {
    setActivePage(null);
  }, []);

  /**
   * Deletes a node and its associated edges
   * @param {string} nodeId - The ID of the node to delete
   */
  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  /**
   * Handles edge selection
   */
  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
  }, []);

  /**
   * Clears selection when clicking on empty canvas area
   */
  const onPaneClick = useCallback(() => {
    setSelectedEdge(null);
  }, []);

  /**
   * Handles keyboard delete key for selected nodes/edges
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete') {
        if (selectedEdge) {
          setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
          setSelectedEdge(null);
        } else if (selectedNode) {
          deleteNode(selectedNode.id);
          setSelectedNode(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEdge, selectedNode, setEdges, deleteNode]);

  /**
   * Generates workflow JSON schema from current nodes and edges
   * @returns {Object} The workflow data structure
   */
  const generateWorkflowJson = useCallback(() => {
    const workflowschema = nodes
      .filter((node) => node.type !== 'end')
      .map((node) => {
        const step = {
          id: node.id,
          label: node.data.label,
        };

        switch (node.type) {
          case 'start':
            step.type = 'start';
            break;
          case 'process':
          case 'function':
          case 'response':
            step.type = 'action';
            step.description = node.data.description;
            break;
          case 'decision':
            step.type = 'decision';
            const outgoingEdges = edges.filter(
              (edge) => edge.source === node.id
            );
            step.conditions = outgoingEdges.reduce((acc, edge) => {
              acc[edge.sourceHandle] = edge.target;
              return acc;
            }, {});
            break;
          default:
            step.type = 'unknown';
        }

        if (node.type !== 'decision') {
          const outgoingEdges = edges.filter((edge) => edge.source === node.id);
          if (outgoingEdges.length > 0) {
            step.next = outgoingEdges[0].target;
          } else if (node.type !== 'end') {
            step.next = null;
          }
        }

        return step;
      });

    const workflowData = {
      schema: workflowschema,
    };

    return workflowData;
  }, [nodes, edges]);

  /**
   * Executes the workflow simulation with user input
   * @param {string} userInput - The input to process through the workflow
   * @returns {Object} Chat history and session ID
   */
  const executeWorkflow = async (userInput) => {
    let currentNodeId = nodes.find((node) => node.type === 'start')?.id;
    let chatHistory = [];
    let sessionId = `uuid_${uuidv4()}`;

    while (currentNodeId) {
      const currentNode = nodes.find((node) => node.id === currentNodeId);
      if (!currentNode) break;

      chatHistory.push({
        type: 'answer',
        answer: currentNode.data.label,
        timestamp: new Date(),
      });

      switch (currentNode.type) {
        case 'process':
        case 'function':
        case 'response':
          chatHistory.push({
            type: 'answer',
            answer: currentNode.data.description || 'No description',
            timestamp: new Date(),
          });
          currentNodeId = edges.find(
            (edge) => edge.source === currentNodeId
          )?.target;
          break;
        case 'decision':
          const condition =
            currentNode.data.conditions.find((cond) => {
              return userInput.toLowerCase().includes(cond.toLowerCase());
            }) || currentNode.data.conditions[0];
          const nextEdge = edges.find(
            (edge) =>
              edge.source === currentNodeId && edge.sourceHandle === condition
          );
          currentNodeId = nextEdge?.target;
          break;
        case 'end':
          chatHistory.push({
            type: 'answer',
            answer: 'Workflow ended',
            timestamp: new Date(),
          });
          currentNodeId = null;
          break;
        default:
          currentNodeId = null;
      }
    }

    return { chatHistory, sessionId };
  };

  return (
    <div
      className={`min-h-[600px] h-full w-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden z-50 ${fullscreen ? 'fixed top-0 left-0 bg-white dark:bg-gray-800 ' : 'relative'}`}
      style={{ zIndex: 10 }}
    >
      {/* Sidebar component for workflow management */}
      <WorkflowEditorSidebar
        workflowId={workflowId}
        addNode={addNode}
        setShowChatModal={setShowChatModal}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
      />

      {/* React Flow canvas for workflow visualization */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        style={{ zIndex: 10 }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
      >
        <Controls />
        {isDesktop && (
          <MiniMap
          className={'border dark:border-gray-600 border-gray-300 rounded'}
          nodeColor={theme === 'dark' ? '#374151' : '#ccc'}
            maskColor={theme === 'dark' ? '#1F2937' : '#ffffff80'}
            maskStrokeColor="#ffffff80"
          />
        )}
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      {/* Node details panel */}
      {selectedNode && (
        <NodeDetails
          node={selectedNode}
          onUpdate={onNodeUpdate}
          onClose={() => setSelectedNode(null)}
          onDelete={deleteNode}
          nodes={nodes}
          style={{ zIndex: 10 }}
        />
      )}

      {/* Page viewer for node-specific pages */}
      {activePage && (
        <PageViewer
          pageConfig={activePage}
          onClose={handlePageClose}
          style={{ zIndex: 10 }}
        />
      )}

      {/* AI function selection modal */}
      {showFunctionModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 10 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              انتخاب تابع
            </h3>
            <div className="max-h-96 overflow-y-auto">
              {aiFunctions.map((func) => (
                <div
                  key={func.name}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => addFunctionNode(func)}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {func.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {func.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowFunctionModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && selectedNode && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 10 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              تایید حذف
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              آیا از حذف این{' '}
              {selectedNode.type === 'start'
                ? 'شروع'
                : selectedNode.type === 'process'
                  ? 'فرآیند'
                  : selectedNode.type === 'decision'
                    ? 'تصمیم'
                    : selectedNode.type === 'function'
                      ? 'تابع'
                      : selectedNode.type === 'response'
                        ? 'پاسخ'
                        : 'پایان'}{' '}
              اطمینان دارید؟
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  deleteNode(selectedNode.id);
                  setSelectedNode(null);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat modal for workflow testing */}
      {/* {showChatModal && (
        <div
          className="fixed inset-0 flex p-6"
          style={{ zIndex: 10, pointerEvents: 'none' }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md h-full flex flex-col justify-between border border-gray-300 dark:border-gray-600"
            style={{ pointerEvents: 'auto' }}
          >
            <div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowChatModal(false);
                    window.parent.postMessage({ type: 'SHOW_NAVBAR' }, '*');
                  }}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
                <ChatNoHistory
                  disableHistory={true}
                  onMessage={(message) => {
                    executeWorkflow(message).then(({ chatHistory }) => {
                      if (chatHistory.length > 0) {
                        console.log(
                          'Latest response:',
                          chatHistory[chatHistory.length - 1].answer
                        );
                      }
                    });
                  }}
                  onClose={() => {
                    setShowChatModal(false);
                    window.parent.postMessage({ type: 'SHOW_NAVBAR' }, '*');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

/**
 * Workflow Editor wrapper component with ReactFlowProvider
 * Provides React Flow context to child components
 */
const WorkflowEditor = ({ onChange, setSchema, initFlow }) => {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent
        onChange={onChange}
        setSchema={setSchema}
        workflowData={initFlow}
      />
    </ReactFlowProvider>
  );
};

export default WorkflowEditor;
