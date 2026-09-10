/**
 * Default starter diagram data — a small example UML diagram.
 */

export const defaultNodes = [
  {
    id: 'class-1',
    type: 'classNode',
    position: { x: 100, y: 80 },
    data: {
      name: 'Animal',
      stereotype: 'abstract',
      attributes: [
        { id: 'a1', visibility: '#', name: 'name', type: 'String' },
        { id: 'a2', visibility: '#', name: 'age', type: 'int' },
      ],
      methods: [
        { id: 'm1', visibility: '+', name: 'speak', params: '', returnType: 'void', methodType: 'abstract' },
        { id: 'm2', visibility: '+', name: 'getName', params: '', returnType: 'String', methodType: 'standard' },
      ],
    },
  },
  {
    id: 'class-2',
    type: 'classNode',
    position: { x: 50, y: 420 },
    data: {
      name: 'Dog',
      stereotype: 'class',
      attributes: [
        { id: 'a3', visibility: '-', name: 'breed', type: 'String' },
      ],
      methods: [
        { id: 'm3', visibility: '+', name: 'speak', params: '', returnType: 'void', methodType: 'standard' },
        { id: 'm4', visibility: '+', name: 'fetch', params: 'String item', returnType: 'void', methodType: 'standard' },
      ],
    },
  },
  {
    id: 'class-3',
    type: 'classNode',
    position: { x: 420, y: 420 },
    data: {
      name: 'Cat',
      stereotype: 'class',
      attributes: [
        { id: 'a4', visibility: '-', name: 'indoor', type: 'boolean' },
      ],
      methods: [
        { id: 'm5', visibility: '+', name: 'speak', params: '', returnType: 'void', methodType: 'standard' },
        { id: 'm6', visibility: '+', name: 'purr', params: '', returnType: 'void', methodType: 'standard' },
      ],
    },
  },
  {
    id: 'class-4',
    type: 'classNode',
    position: { x: 500, y: 80 },
    data: {
      name: 'Serializable',
      stereotype: 'interface',
      attributes: [],
      methods: [
        { id: 'm7', visibility: '+', name: 'serialize', params: '', returnType: 'String', methodType: 'abstract' },
      ],
    },
  },
];

export const defaultEdges = [
  {
    id: 'edge-1',
    source: 'class-2',
    target: 'class-1',
    sourceHandle: 'top',
    targetHandle: 'bottom',
    type: 'relationship',
    reconnectable: true,
    data: { relationshipType: 'inheritance', routing: 'step', controlPoint: null, sourceMultiplicity: '', targetMultiplicity: '' },
  },
  {
    id: 'edge-2',
    source: 'class-3',
    target: 'class-1',
    sourceHandle: 'top',
    targetHandle: 'bottom',
    type: 'relationship',
    reconnectable: true,
    data: { relationshipType: 'inheritance', routing: 'step', controlPoint: null, sourceMultiplicity: '', targetMultiplicity: '' },
  },
  {
    id: 'edge-3',
    source: 'class-1',
    target: 'class-4',
    sourceHandle: 'right',
    targetHandle: 'left',
    type: 'relationship',
    reconnectable: true,
    data: { relationshipType: 'implementation', routing: 'step', controlPoint: null, sourceMultiplicity: '', targetMultiplicity: '' },
  },
];
