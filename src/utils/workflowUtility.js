/**
 * Extracts nodes from schema object
 * @param {object} schema
 */
export function extractNodes(schema) {
  return  schema.map((step) => ({
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
