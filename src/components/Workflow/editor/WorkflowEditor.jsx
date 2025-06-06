import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StartNode from './nodes/StartNode';
import ProcessNode from './nodes/ProcessNode';
import DecisionNode from './nodes/DecisionNode';
import EndNode from './nodes/EndNode';
import FunctionNode from './nodes/FunctionNode';
import ResponseNode from './nodes/ResponseNode';
import NodeDetails from './NodeDetails';
import PageViewer from './PageViewer';
import { workflowEndpoints } from '../../../utils/apis';
import { v4 as uuidv4 } from 'uuid';

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
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workflowName, setWorkflowName] = useState('');

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!workflowId) return;

      try {
        setLoading(true);
        setError(null);
        const workflow = await workflowEndpoints.getWorkflow(workflowId);

        setWorkflowName(workflow.name || '');

        const workflowNodes = workflow.schema.map((step) => ({
          id: step.id,
          type: step.type === 'action' ? 'process' : step.type,
          position: {
            x: step.position?.x ?? 50,
            y: step.position?.y ?? 250,
          },
          data: {
            label: step.label,
            description: step.description || '',
            conditions: step.type === 'decision' ? (step.conditions || []).map(c => c.label) : [],
            conditionTargets: step.type === 'decision' ? (step.conditions || []).reduce((acc, c) => {
              acc[c.label] = c.next;
              return acc;
            }, {}) : {},
            jsonConfig: null,
            pageConfig: {
              showPage: false,
              pageUrl: '',
              closeOnAction: false
            }
          },
        }));

        const workflowEdges = workflow.schema.reduce((acc, step) => {
          if (step.type === 'decision' && step.conditions) {
            step.conditions.forEach(condition => {
              if (condition.next) {
                acc.push({
                  id: `${step.id}-${condition.next}-${condition.label}`,
                  source: step.id,
                  target: condition.next,
                  sourceHandle: condition.label,
                  type: 'step',
                  animated: true,
                  style: { stroke: '#f59e0b' },
                });
              }
            });
          } else if (step.next) {
            acc.push({
              id: `${step.id}-${step.next}`,
              source: step.id,
              target: step.next,
              type: 'step',
              animated: true,
              style: { stroke: '#f59e0b' },
            });
          }
          return acc;
        }, []);

        setNodes(workflowNodes);
        setEdges(workflowEdges);
      } catch (err) {
        console.error('Error fetching workflow:', err);
        setError('خطا در دریافت اطلاعات گردش کار');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [workflowId, setNodes, setEdges]);

  const onConnect = useCallback(
      (params) => {
        const sourceNode = nodes.find((node) => node.id === params.source);

        if (sourceNode?.type === 'start') {
          params.sourceHandle = 'right';
        }

        if (sourceNode?.type === 'decision') {
          if (!params.sourceHandle || !sourceNode.data.conditions.includes(params.sourceHandle)) {
            console.warn(`Invalid sourceHandle: ${params.sourceHandle}`);
            return;
          }
        }

        if (sourceNode?.type !== 'decision') {
          const existingOutgoingEdges = edges.filter(edge => edge.source === params.source);
          if (existingOutgoingEdges.length > 0) {
            console.warn('Only decision nodes can have multiple outgoing connections');
            return;
          }
        }

        setEdges((eds) => {
          return addEdge(
              {
                ...params,
                id: `${params.source}-${params.sourceHandle}-${params.target}-${Date.now()}`,
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

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);

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
                conditions: newData.conditions?.filter((c) => c && c.trim() !== '') || [],
              },
            };
          }
          return node;
        })
    );

    if (newData.type === 'decision') {
      setEdges((eds) => {
        // فقط edges غیرمرتبط با این نود و edges معتبر را نگه دار
        const otherEdges = eds.filter((edge) => edge.source !== nodeId);
        const newConditions = newData.conditions?.filter((c) => c && c.trim() !== '') || [];

        // فقط edges مربوط به شرایط جدید را نگه دار
        const validEdges = eds.filter(
            (edge) => edge.source === nodeId && newConditions.includes(edge.sourceHandle)
        );

        // ایجاد edges جدید برای شرایطی که هنوز target ندارند
        const newEdges = newConditions
            .filter((condition) => !validEdges.some((edge) => edge.sourceHandle === condition))
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
  }, [setNodes, setEdges]);

  const addNode = (type) => {
    const maxXNode = nodes.reduce((maxNode, node) => {
      return !maxNode || node.position.x > maxNode.position.x ? node : maxNode;
    }, null);

    const xOffset = 250;
    const newNode = {
      id: uuidv4(),
      type,
      position: {
        x: maxXNode ? maxXNode.position.x + xOffset : 50,
        y: maxXNode ? maxXNode.position.y : 250,
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

  const generateWorkflowJson = useCallback(() => {
    const workflowschema = nodes
        .filter(node => node.type !== 'end')
        .map(node => {
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
              const outgoingEdges = edges.filter(edge => edge.source === node.id);
              step.conditions = outgoingEdges.reduce((acc, edge) => {
                acc[edge.sourceHandle] = edge.target;
                return acc;
              }, {});
              break;
            default:
              step.type = 'unknown';
          }

          if (node.type !== 'decision') {
            const outgoingEdges = edges.filter(edge => edge.source === node.id);
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

    console.log('Workflow JSON:', JSON.stringify(workflowData, null, 2));
  }, [nodes, edges]);

  const importWorkflow = useCallback((jsonString) => {
    try {
      const workflowData = JSON.parse(jsonString);
      if (!workflowData.schema || !Array.isArray(workflowData.schema)) {
        throw new Error('Invalid workflow format');
      }

      const newNodes = [];
      const newEdges = [];
      const xOffset = 250;

      workflowData.schema.forEach((step, index) => {
        const node = {
          id: step.id,
          type: step.type === 'action' ? 'process' : step.type,
          position: { x: index * xOffset, y: 250 },
          data: {
            label: step.label,
            description: step.description || '',
            position: step.position,
            conditions: step.type === 'decision' ? Object.keys(step.conditions || {}) : [],
            jsonConfig: null,
            pageConfig: {
              showPage: false,
              pageUrl: '',
              closeOnAction: false
            }
          },
        };
        newNodes.push(node);

        if (step.type === 'decision' && step.conditions) {
          Object.entries(step.conditions).forEach(([condition, targetId]) => {
            newEdges.push({
              id: `${step.id}-${targetId}`,
              source: step.id,
              target: targetId,
              sourceHandle: condition,
              type: 'step',
            });
          });
        } else if (step.next) {
          newEdges.push({
            id: `${step.id}-${step.next}`,
            source: step.id,
            target: step.next,
            type: 'step',
          });
        }
      });

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error) {
      console.error('Error importing workflow:', error);
      alert('Error importing workflow: ' + error.message);
    }
  }, [setNodes, setEdges]);

  const saveWorkflow = useCallback(async () => {
    let workflowData = null;
    try {
      setLoading(true);
      setError(null);

      if (!workflowName.trim()) {
        toast.error('لطفا نام گردش کار را وارد کنید');
        setLoading(false);
        return;
      }

      workflowData = {
        name: workflowName.trim(),
        schema: nodes.map((node) => {
          const step = {
            id: node.id,
            label: node.data.label,
            description: node.data.description || null,
            position: node.position,
          };

          switch (node.type) {
            case 'start':
              step.type = 'start';
              break;
            case 'process':
              step.type = 'process';
              break;
            case 'function':
              step.type = 'function';
              break;
            case 'response':
              step.type = 'response';
              break;
            case 'decision':
              step.type = 'decision';
              const outgoingEdges = edges.filter(
                  (edge) => edge.source === node.id && edge.target && node.data.conditions.includes(edge.sourceHandle)
              );
              step.conditions = outgoingEdges.map((edge) => ({
                label: edge.sourceHandle,
                next: edge.target,
              }));
              break;
            case 'end':
              step.type = 'end';
              break;
            default:
              step.type = 'unknown';
          }

          if (node.type !== 'decision' && node.type !== 'end') {
            const outgoingEdges = edges.filter((edge) => edge.source === node.id && edge.target);
            if (outgoingEdges.length > 0) {
              step.next = outgoingEdges[0].target;
            } else {
              step.next = null;
            }
          }

          return step;
        }),
      };

      if (workflowId) {
        await workflowEndpoints.updateWorkflow(workflowId, workflowData);
        toast.success('گردش کار با موفقیت بروزرسانی شد');
      } else {
        await workflowEndpoints.createWorkflow(workflowData);
        toast.success('گردش کار با موفقیت ایجاد شد');
      }
    } catch (err) {
      console.error('Error saving workflow:', err);
      setError('خطا در ذخیره گردش کار');
      toast.error('خطا در ذخیره گردش کار');
      console.log('Workflow Data Sent:', JSON.stringify(workflowData, null, 2));
    } finally {
      setLoading(false);
    }
  }, [nodes, edges, workflowId, workflowName]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-500">{error}</div>
        </div>
    );
  }

  return (
      <div className="h-screen w-full">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
            <label htmlFor="workflow-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نام گردش کار
            </label>
            <input
                type="text"
                id="workflow-name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="نام گردش کار را وارد کنید"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
              onClick={saveWorkflow}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            {workflowId ? 'بروزرسانی گردش کار' : 'ذخیره گردش کار'}
          </button>
          <button
              onClick={() => addNode('start')}
              className="px-4 py-2 bg-cyan-500 text-white rounded-md  hover:bg-cyan-600"
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
            proOptions={{ hideAttribution: true }}
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
                saveWorkflow={saveWorkflow}
            />
        )}

        {activePage && (
            <PageViewer
                pageConfig={activePage}
                onClose={handlePageClose}
            />
        )}

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