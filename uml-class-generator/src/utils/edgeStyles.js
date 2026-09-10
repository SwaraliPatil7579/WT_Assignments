/**
 * UML relationship types and their visual configurations.
 * Each type maps to SVG marker + line style for React Flow edges.
 */

export const RELATIONSHIP_TYPES = {
  ASSOCIATION: {
    id: 'association',
    label: 'Association',
    description: 'Direct association',
    lineStyle: 'solid',
    markerEnd: 'arrowOpen',
    color: '#94a3b8',
  },
  INHERITANCE: {
    id: 'inheritance',
    label: 'Inheritance',
    description: 'extends (generalization)',
    lineStyle: 'solid',
    markerEnd: 'triangleHollow',
    color: '#3b82f6',
  },
  IMPLEMENTATION: {
    id: 'implementation',
    label: 'Implementation',
    description: 'implements (realization)',
    lineStyle: 'dashed',
    markerEnd: 'triangleHollow',
    color: '#8b5cf6',
  },
  COMPOSITION: {
    id: 'composition',
    label: 'Composition',
    description: 'has-a (strong ownership)',
    lineStyle: 'solid',
    markerStart: 'diamondFilled',
    color: '#06b6d4',
  },
  AGGREGATION: {
    id: 'aggregation',
    label: 'Aggregation',
    description: 'has-a (shared reference)',
    lineStyle: 'solid',
    markerStart: 'diamondHollow',
    color: '#f59e0b',
  },
  DEPENDENCY: {
    id: 'dependency',
    label: 'Dependency',
    description: 'uses (supplier/client)',
    lineStyle: 'dashed',
    markerEnd: 'arrowOpen',
    color: '#10b981',
  },
};

/** Returns an array of all relationship type objects */
export const getAllRelationshipTypes = () => Object.values(RELATIONSHIP_TYPES);

/** Lookup a relationship config by its id string */
export const getRelationshipById = (id) =>
  Object.values(RELATIONSHIP_TYPES).find((r) => r.id === id) || RELATIONSHIP_TYPES.ASSOCIATION;

/**
 * SVG marker definitions for UML relationship endings.
 * Rendered inside a <defs> element in the SVG layer.
 */
export const SVG_MARKERS = {
  arrowOpen: {
    id: 'arrowOpen',
    viewBox: '0 0 20 20',
    refX: 18,
    refY: 10,
    markerWidth: 10,
    markerHeight: 10,
    path: 'M 2 2 L 18 10 L 2 18',
    fill: 'none',
    strokeWidth: 2,
  },
  triangleHollow: {
    id: 'triangleHollow',
    viewBox: '0 0 20 20',
    refX: 18,
    refY: 10,
    markerWidth: 12,
    markerHeight: 12,
    path: 'M 2 2 L 18 10 L 2 18 Z',
    fill: '#14171f',
    strokeWidth: 2,
  },
  diamondFilled: {
    id: 'diamondFilled',
    viewBox: '0 0 24 24',
    refX: 2,
    refY: 12,
    markerWidth: 12,
    markerHeight: 12,
    path: 'M 2 12 L 12 2 L 22 12 L 12 22 Z',
    fill: 'currentColor',
    strokeWidth: 1.5,
  },
  diamondHollow: {
    id: 'diamondHollow',
    viewBox: '0 0 24 24',
    refX: 2,
    refY: 12,
    markerWidth: 12,
    markerHeight: 12,
    path: 'M 2 12 L 12 2 L 22 12 L 12 22 Z',
    fill: '#14171f',
    strokeWidth: 2,
  },
};
