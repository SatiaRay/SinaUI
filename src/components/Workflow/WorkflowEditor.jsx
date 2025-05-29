import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import StartNode from './nodes/StartNode';
import ProcessNode from './nodes/ProcessNode';
import DecisionNode from './nodes/DecisionNode';
import EndNode from './nodes/EndNode';
import FunctionNode from './nodes/FunctionNode';
import ResponseNode from './nodes/ResponseNode';
import NodeDetails from './NodeDetails';
import PageViewer from './PageViewer';

const nodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
  end: EndNode,
  function: FunctionNode,
  response: ResponseNode,
};

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
        closeOnAction: false
      }
    },
  },
];

const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const onConnect = useCallback(
    (params) => {
      // Find the source node
      const sourceNode = nodes.find(node => node.id === params.source);
      
      // If it's a start node, force the handle position to be on the right
      if (sourceNode?.type === 'start') {
        params.sourceHandle = 'right';
      }
      
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, nodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    
    // اگر نود دارای تنظیمات صفحه باشد، آن را نمایش می‌دهیم
    if (node.data.pageConfig?.showPage) {
      setActivePage(node.data.pageConfig);
    }
  }, []);

  const onNodeUpdate = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );

    // Update edges based on connections
    if (newData.connections) {
      const newEdges = newData.connections.map((conn) => ({
        id: `${nodeId}-${conn.targetId}`,
        source: nodeId,
        target: conn.targetId,
        label: conn.label,
        type: 'step',
      }));
      
      setEdges((eds) => {
        // Remove old edges for this node
        const filteredEdges = eds.filter((edge) => edge.source !== nodeId);
        // Add new edges
        return [...filteredEdges, ...newEdges];
      });
    }

    // اگر تنظیمات صفحه تغییر کرده باشد، آن را به‌روزرسانی می‌کنیم
    if (newData.pageConfig) {
      setActivePage(newData.pageConfig);
    }
  }, [setNodes, setEdges]);

  const addNode = (type) => {
    const lastNode = nodes[nodes.length - 1];
    const xOffset = 250; // Horizontal spacing between nodes
    
    const newNode = {
      id: `${nodes.length + 1}`,
      type,
      position: { 
        x: lastNode ? lastNode.position.x + xOffset : 50,
        y: 250 // Keep all nodes at the same height
      },
      data: {
        label: type === 'start' ? 'شروع' :
               type === 'process' ? 'فرآیند' :
               type === 'decision' ? 'تصمیم' :
               type === 'function' ? 'تابع' :
               type === 'response' ? 'پاسخ' : 'پایان',
        description: '',
        connections: [],
        conditions: type === 'decision' ? [''] : [],
        jsonConfig: null,
        pageConfig: {
          showPage: false,
          pageUrl: '',
          closeOnAction: false
        }
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handlePageClose = useCallback(() => {
    setActivePage(null);
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedEdge(null);
  }, []);

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

  // Function to generate JSON output
  const generateWorkflowJson = useCallback(() => {
    const workflowSteps = nodes
      .filter(node => node.type !== 'end') // Exclude end nodes from steps
      .map(node => {
        const step = {
          id: node.id,
          label: node.data.label, // Include label for all step types
        };

        // Map internal node type to workflow step type
        switch (node.type) {
          case 'start':
            step.type = 'start';
            break;
          case 'process':
          case 'function':
          case 'response':
            step.type = 'action';
            step.description = node.data.description; // Add description for action types
            break;
          case 'decision':
            step.type = 'decision';
            // Get outgoing edges for this decision node
            const outgoingEdges = edges.filter(edge => edge.source === node.id);
            // Create conditions object mapping condition to target node
            step.conditions = outgoingEdges.reduce((acc, edge) => {
              acc[edge.sourceHandle] = edge.target;
              return acc;
            }, {});
            break;
          default:
            step.type = 'unknown';
        }

        // Add next field only for non-decision nodes
        if (node.type !== 'decision') {
          const outgoingEdges = edges.filter(edge => edge.source === node.id);
          if (outgoingEdges.length > 0) {
            step.next = outgoingEdges[0].target; // For non-decision nodes, just use the first target
          } else if (node.type !== 'end') {
            step.next = null;
          }
        }

        return step;
      });

    // Structure the final JSON
    const workflowData = {
      steps: workflowSteps,
    };

    console.log('Workflow JSON:', JSON.stringify(workflowData, null, 2));

  }, [nodes, edges]);

  return (
    <div className="h-screen w-full">
      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => addNode('start')}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          افزودن شروع
        </button>
        <button
          onClick={() => addNode('process')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          افزودن فرآیند
        </button>
        <button
          onClick={() => addNode('decision')}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          افزودن تصمیم
        </button>
        <button
          onClick={() => addNode('function')}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          افزودن تابع
        </button>
        <button
          onClick={() => addNode('response')}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          افزودن پاسخ
        </button>
        <button
          onClick={() => addNode('end')}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          افزودن پایان
        </button>
        <button
          onClick={generateWorkflowJson}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          ذخیره گردش کار
        </button>
      </div>

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
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      {selectedNode && (
        <NodeDetails
          node={selectedNode}
          onUpdate={onNodeUpdate}
          onClose={() => setSelectedNode(null)}
          onDelete={deleteNode}
        />
      )}

      {activePage && (
        <PageViewer
          pageConfig={activePage}
          onClose={handlePageClose}
        />
      )}

      {/* Confirmation Dialog for Node Deletion (keep this) */}
      {showDeleteConfirm && selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              تایید حذف
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              آیا از حذف این {selectedNode.type === 'start' ? 'شروع' :
                            selectedNode.type === 'process' ? 'فرآیند' :
                            selectedNode.type === 'decision' ? 'تصمیم' :
                            selectedNode.type === 'function' ? 'تابع' :
                            selectedNode.type === 'response' ? 'پاسخ' : 'پایان'} اطمینان دارید؟
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
    </div>
  );
};

export default WorkflowEditor; 