import React, { useState, useCallback } from 'react';
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
import NodeDetails from './NodeDetails';
import PageViewer from './PageViewer';

const nodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
  end: EndNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 5 },
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
  const [activePage, setActivePage] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
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
        type: 'smoothstep',
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
    const newNode = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: 250, y: nodes.length * 100 + 100 },
      data: {
        label: type === 'start' ? 'شروع' :
               type === 'process' ? 'فرآیند' :
               type === 'decision' ? 'تصمیم' : 'پایان',
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
          onClick={() => addNode('end')}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          افزودن پایان
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
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
        />
      )}

      {activePage && (
        <PageViewer
          pageConfig={activePage}
          onClose={handlePageClose}
        />
      )}
    </div>
  );
};

export default WorkflowEditor; 