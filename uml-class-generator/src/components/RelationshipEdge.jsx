import { memo, useState, useCallback } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
} from '@xyflow/react';
import {
  RefreshCw, Trash2, ArrowLeftRight, CornerDownRight,
  ChevronDown,
} from 'lucide-react';
import { getRelationshipById, getAllRelationshipTypes } from '../utils/edgeStyles';

function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  source,
  target,
}) {
  const { screenToFlowPosition, setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const rel = getRelationshipById(data?.relationshipType);
  const routing = data?.routing || 'step';
  const controlPoint = data?.controlPoint || null;

  // Compute base smoothstep path for fallback and default label position
  const [defaultPath, defaultLabelX, defaultLabelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
  });

  let edgePath = defaultPath;
  let labelX = defaultLabelX;
  let labelY = defaultLabelY;

  if (controlPoint) {
    labelX = controlPoint.x;
    labelY = controlPoint.y;

    if (routing === 'curve') {
      // Quadratic curve through controlPoint (cx, cy)
      const qx = 2 * controlPoint.x - 0.5 * sourceX - 0.5 * targetX;
      const qy = 2 * controlPoint.y - 0.5 * sourceY - 0.5 * targetY;
      edgePath = `M ${sourceX} ${sourceY} Q ${qx} ${qy} ${targetX} ${targetY}`;
    } else if (routing === 'straight') {
      edgePath = `M ${sourceX} ${sourceY} L ${controlPoint.x} ${controlPoint.y} L ${targetX} ${targetY}`;
    } else {
      // Orthogonal / Stepped through waypoint
      const [leg1] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX: controlPoint.x,
        targetY: controlPoint.y,
        targetPosition: sourcePosition === 'top' || sourcePosition === 'bottom' ? 'left' : 'top',
        borderRadius: 8,
      });
      const [leg2] = getSmoothStepPath({
        sourceX: controlPoint.x,
        sourceY: controlPoint.y,
        sourcePosition: targetPosition === 'top' || targetPosition === 'bottom' ? 'left' : 'top',
        targetX,
        targetY,
        targetPosition,
        borderRadius: 8,
      });
      edgePath = `${leg1} ${leg2}`;
    }
  }

  // Waypoint drag handler
  const handlePointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      setIsDragging(true);

      const handlePointerMove = (moveEvt) => {
        const flowPos = screenToFlowPosition({
          x: moveEvt.clientX,
          y: moveEvt.clientY,
        });
        const snapped = {
          x: Math.round(flowPos.x / 10) * 10,
          y: Math.round(flowPos.y / 10) * 10,
        };

        setEdges((eds) =>
          eds.map((ed) =>
            ed.id === id
              ? {
                  ...ed,
                  data: {
                    ...ed.data,
                    controlPoint: snapped,
                  },
                }
              : ed
          )
        );
      };

      const handlePointerUp = () => {
        setIsDragging(false);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [id, screenToFlowPosition, setEdges]
  );

  const resetControlPoint = useCallback(
    (e) => {
      e.stopPropagation();
      setEdges((eds) =>
        eds.map((ed) =>
          ed.id === id
            ? {
                ...ed,
                data: {
                  ...ed.data,
                  controlPoint: null,
                },
              }
            : ed
        )
      );
    },
    [id, setEdges]
  );

  const toggleRouting = useCallback(
    (e) => {
      e.stopPropagation();
      const order = ['step', 'curve', 'straight'];
      const nextIdx = (order.indexOf(routing) + 1) % order.length;
      const nextRouting = order[nextIdx];
      setEdges((eds) =>
        eds.map((ed) =>
          ed.id === id
            ? {
                ...ed,
                data: {
                  ...ed.data,
                  routing: nextRouting,
                },
              }
            : ed
        )
      );
    },
    [id, routing, setEdges]
  );

  const flipDirection = useCallback(
    (e) => {
      e.stopPropagation();
      setEdges((eds) =>
        eds.map((ed) =>
          ed.id === id
            ? {
                ...ed,
                source: ed.target,
                target: ed.source,
                sourceHandle: ed.targetHandle,
                targetHandle: ed.sourceHandle,
              }
            : ed
        )
      );
    },
    [id, setEdges]
  );

  const deleteThisEdge = useCallback(
    (e) => {
      e.stopPropagation();
      setEdges((eds) => eds.filter((ed) => ed.id !== id));
    },
    [id, setEdges]
  );

  const changeRelType = useCallback(
    (newType) => {
      setEdges((eds) =>
        eds.map((ed) =>
          ed.id === id
            ? {
                ...ed,
                data: {
                  ...ed.data,
                  relationshipType: newType,
                },
              }
            : ed
        )
      );
    },
    [id, setEdges]
  );

  const strokeColor = selected ? '#3b82f6' : isHovered ? '#60a5fa' : rel.color;
  const strokeDash = rel.lineStyle === 'dashed' ? '6 4' : 'none';
  const showWaypoint = selected || isHovered || isDragging || controlPoint !== null;

  return (
    <>
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BaseEdge
          id={id}
          path={edgePath}
          interactionWidth={24}
          style={{
            stroke: strokeColor,
            strokeWidth: selected ? 2.5 : isHovered ? 2.2 : 1.6,
            strokeDasharray: strokeDash,
            transition: isDragging ? 'none' : 'stroke 0.15s ease, stroke-width 0.15s ease',
          }}
          markerEnd={`url(#${rel.markerEnd || ''})`}
          markerStart={rel.markerStart ? `url(#${rel.markerStart})` : undefined}
        />
      </g>

      <EdgeLabelRenderer>
        <div
          className="edge-label-container"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Label Pill */}
          <div
            className={`edge-label-badge ${selected ? 'edge-label-badge-selected' : ''}`}
            style={{
              borderColor: selected ? '#3b82f6' : `${rel.color}50`,
            }}
          >
            <span
              className="edge-label-dot"
              style={{ backgroundColor: rel.color }}
            />
            <span className="edge-label-text" style={{ color: selected ? '#93c5fd' : '#e2e8f0' }}>
              {rel.label}
            </span>
          </div>

          {/* Draggable Bend Handle (Waypoint) */}
          {showWaypoint && (
            <div
              className={`edge-control-handle ${isDragging ? 'edge-control-handle-dragging' : ''} ${
                controlPoint ? 'edge-control-handle-active' : ''
              }`}
              onPointerDown={handlePointerDown}
              onDoubleClick={resetControlPoint}
              title={
                controlPoint
                  ? 'Drag to move connection route • Double-click to reset bend'
                  : 'Drag to bend this connection'
              }
            >
              <div className="edge-control-handle-inner" />
            </div>
          )}

          {/* Floating Action Bar when edge is selected */}
          {selected && (
            <div className="edge-quick-actions">
              {/* Type selector */}
              <select
                className="edge-quick-select"
                value={data?.relationshipType || 'association'}
                onChange={(e) => changeRelType(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                title="Change relationship type"
              >
                {getAllRelationshipTypes().map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>

              {/* Route style cycle */}
              <button
                type="button"
                className="edge-action-btn"
                onClick={toggleRouting}
                title={`Route: ${routing} (Click to toggle Step/Curve/Straight)`}
              >
                <CornerDownRight size={12} />
              </button>

              {/* Flip direction */}
              <button
                type="button"
                className="edge-action-btn"
                onClick={flipDirection}
                title="Reverse connection direction"
              >
                <ArrowLeftRight size={12} />
              </button>

              {/* Reset bend */}
              {controlPoint && (
                <button
                  type="button"
                  className="edge-action-btn"
                  onClick={resetControlPoint}
                  title="Reset to straight/auto route"
                >
                  <RefreshCw size={12} />
                </button>
              )}

              {/* Delete */}
              <button
                type="button"
                className="edge-action-btn edge-action-btn-danger"
                onClick={deleteThisEdge}
                title="Delete connection"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(RelationshipEdge);
