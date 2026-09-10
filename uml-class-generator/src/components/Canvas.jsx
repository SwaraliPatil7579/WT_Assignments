import { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ClassNode from './ClassNode';
import RelationshipEdge from './RelationshipEdge';
import { SVG_MARKERS } from '../utils/edgeStyles';

const nodeTypes = { classNode: ClassNode };
const edgeTypes = { relationship: RelationshipEdge };

/**
 * SVG Marker Definitions — injected into the React Flow SVG layer
 */
function MarkerDefs() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        {Object.values(SVG_MARKERS).map((marker) => (
          <marker
            key={marker.id}
            id={marker.id}
            viewBox={marker.viewBox}
            refX={marker.refX}
            refY={marker.refY}
            markerWidth={marker.markerWidth}
            markerHeight={marker.markerHeight}
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path
              d={marker.path}
              fill={marker.fill}
              stroke="currentColor"
              strokeWidth={marker.strokeWidth}
              strokeLinejoin="round"
            />
          </marker>
        ))}
      </defs>
    </svg>
  );
}

export default function Canvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onReconnect,
  onNodeClick,
  onPaneClick,
  reactFlowInstance,
}) {
  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'relationship',
      animated: false,
      reconnectable: true,
    }),
    []
  );

  return (
    <div className="canvas-container">
      <MarkerDefs />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        edgesReconnectable={true}
        reconnectRadius={25}
        connectionMode="loose"
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={(instance) => {
          reactFlowInstance.current = instance;
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode="Shift"
        snapToGrid={true}
        snapGrid={[12, 12]}
        connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '4 4' }}
        connectionLineType="smoothstep"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="#272b36"
        />
        <Controls
          className="canvas-controls"
          showInteractive={false}
        />
        <MiniMap
          className="canvas-minimap"
          nodeColor={(n) => {
            const stereotype = n.data?.stereotype;
            if (stereotype === 'interface') return '#06b6d4';
            if (stereotype === 'abstract') return '#8b5cf6';
            if (stereotype === 'enum') return '#f59e0b';
            return '#3b82f6';
          }}
          maskColor="rgba(11, 13, 17, 0.85)"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
