/**
 * Extracts nodes from schema object
 * @param {object} schema
 */
export function extractNodes(schema) {
  if (!schema) return [];
  return schema.map((step) => ({
    id: step.id,
    type: step.type === 'action' ? 'process' : step.type,
    position: {
      x: step.position?.x ?? 50,
      y: step.position?.y ?? 250,
    },
    data: {
      label: step.label,
      description: step.description || '',
      conditions:
        step.type === 'decision'
          ? (step.conditions || []).map((c) => c.label)
          : [],
      conditionTargets:
        step.type === 'decision'
          ? (step.conditions || []).reduce((acc, c) => {
              acc[c.label] = c.next;
              return acc;
            }, {})
          : {},
      jsonConfig: null,
      pageConfig: {
        showPage: false,
        pageUrl: '',
        closeOnAction: false,
      },
    },
  }));
}

/**
 * Extracts edges from schema object
 * @param {object} schema
 */
export function extractEdges(schema) {
  if (!schema) return [];
  return schema.reduce((acc, step) => {
    if (step.type === 'decision' && step.conditions) {
      step.conditions.forEach((condition) => {
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
}

/**
 * Format nodes and edges to json and compatible for send to API
 */
export function formatNodes(nodes, edges) {
  return nodes.map((node) => {
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
        step.functionName = node.data.functionData?.name;
        step.functionDescription = node.data.functionData?.description;
        step.functionParameters = node.data.functionData?.parameters;
        break;
      case 'response':
        step.type = 'response';
        break;
      case 'decision':
        step.type = 'decision';
        const outgoingEdges = edges.filter(
          (edge) =>
            edge.source === node.id &&
            edge.target &&
            node.data.conditions.includes(edge.sourceHandle)
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

    // Set next node for non-decision, non-end nodes
    if (node.type !== 'decision' && node.type !== 'end') {
      const outgoingEdges = edges.filter(
        (edge) => edge.source === node.id && edge.target
      );
      if (outgoingEdges.length > 0) {
        step.next = outgoingEdges[0].target;
      } else {
        step.next = null;
      }
    }

    return step;
  });
}
