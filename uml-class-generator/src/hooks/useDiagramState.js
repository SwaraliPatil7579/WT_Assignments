import { useState, useCallback, useRef } from 'react';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  reconnectEdge,
} from '@xyflow/react';
import { defaultNodes, defaultEdges } from '../utils/defaultData';

let idCounter = 100;
const getId = (prefix = 'class') => `${prefix}-${idCounter++}`;
const getAttrId = () => `a-${idCounter++}`;
const getMethodId = () => `m-${idCounter++}`;

export function useDiagramState() {
  const [nodes, setNodes] = useState(defaultNodes);
  const [edges, setEdges] = useState(defaultEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [pendingRelType, setPendingRelType] = useState('association');
  const reactFlowInstance = useRef(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
    },
    []
  );

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: getId('edge'),
        type: 'relationship',
        reconnectable: true,
        data: {
          relationshipType: pendingRelType,
          routing: 'step',
          controlPoint: null,
          sourceMultiplicity: '',
          targetMultiplicity: '',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [pendingRelType]
  );

  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const addClassNode = useCallback(() => {
    // Get viewport center
    let position = { x: 250, y: 200 };
    if (reactFlowInstance.current) {
      const vp = reactFlowInstance.current.getViewport();
      const viewportCenter = reactFlowInstance.current.screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      position = {
        x: viewportCenter.x - 100 + Math.random() * 40 - 20,
        y: viewportCenter.y - 80 + Math.random() * 40 - 20,
      };
    }

    const newNode = {
      id: getId(),
      type: 'classNode',
      position,
      data: {
        name: 'NewClass',
        stereotype: 'class',
        attributes: [
          { id: getAttrId(), visibility: '-', name: 'id', type: 'int' },
          { id: getAttrId(), visibility: '-', name: 'name', type: 'String' },
        ],
        methods: [
          { id: getMethodId(), visibility: '+', name: 'getId', params: '', returnType: 'int' },
          { id: getMethodId(), visibility: '+', name: 'setName', params: 'String name', returnType: 'void' },
        ],
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(newNode.id);
  }, []);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n
      )
    );
  }, []);

  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
    setSelectedNodeId(null);
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }, [selectedNodeId]);

  const clearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  }, []);

  const updateEdgeData = useCallback((edgeId, newData) => {
    setEdges((eds) =>
      eds.map((e) =>
        e.id === edgeId ? { ...e, data: { ...e.data, ...newData } } : e
      )
    );
  }, []);

  const updateEdgeControlPoint = useCallback((edgeId, controlPoint) => {
    setEdges((eds) =>
      eds.map((e) =>
        e.id === edgeId
          ? {
              ...e,
              data: {
                ...e.data,
                controlPoint,
              },
            }
          : e
      )
    );
  }, []);

  const deleteEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
  }, []);

  const flipEdge = useCallback((edgeId) => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id !== edgeId) return e;
        return {
          ...e,
          source: e.target,
          target: e.source,
          sourceHandle: e.targetHandle,
          targetHandle: e.sourceHandle,
        };
      })
    );
  }, []);

  const addAttribute = useCallback((nodeId) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== nodeId) return n;
        return {
          ...n,
          data: {
            ...n.data,
            attributes: [
              ...n.data.attributes,
              { id: getAttrId(), visibility: '-', name: 'newField', type: 'String' },
            ],
          },
        };
      })
    );
  }, []);

  const removeAttribute = useCallback((nodeId, attrId) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== nodeId) return n;
        return {
          ...n,
          data: {
            ...n.data,
            attributes: n.data.attributes.filter((a) => a.id !== attrId),
          },
        };
      })
    );
  }, []);

  const updateAttribute = useCallback((nodeId, attrId, field, value) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== nodeId) return n;
        return {
          ...n,
          data: {
            ...n.data,
            attributes: n.data.attributes.map((a) =>
              a.id === attrId ? { ...a, [field]: value } : a
            ),
          },
        };
      })
    );
  }, []);

  const addMethod = useCallback((nodeId, initialKind = 'standard') => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== nodeId) return n;
        const name = initialKind === 'abstract' ? 'abstractMethod' : initialKind === 'static' ? 'staticMethod' : 'newMethod';
        return {
          ...n,
          data: {
            ...n.data,
            methods: [
              ...n.data.methods,
              {
                id: getMethodId(),
                visibility: '+',
                name,
                params: '',
                returnType: 'void',
                methodType: initialKind,
              },
            ],
          },
        };
      })
    );
  }, []);

  const removeMethod = useCallback((nodeId, methodId) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== nodeId) return n;
        return {
          ...n,
          data: {
            ...n.data,
            methods: n.data.methods.filter((m) => m.id !== methodId),
          },
        };
      })
    );
  }, []);

  const updateMethod = useCallback((nodeId, methodId, field, value) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== nodeId) return n;
        return {
          ...n,
          data: {
            ...n.data,
            methods: n.data.methods.map((m) =>
              m.id === methodId ? { ...m, [field]: value } : m
            ),
          },
        };
      })
    );
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return {
    nodes,
    edges,
    selectedNode,
    selectedNodeId,
    pendingRelType,
    reactFlowInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onReconnect,
    onNodeClick,
    onPaneClick,
    addClassNode,
    updateNodeData,
    deleteSelected,
    deleteNode,
    clearAll,
    updateEdgeData,
    updateEdgeControlPoint,
    deleteEdge,
    flipEdge,
    addAttribute,
    removeAttribute,
    updateAttribute,
    addMethod,
    removeMethod,
    updateMethod,
    setPendingRelType,
    setSelectedNodeId,
  };
}
