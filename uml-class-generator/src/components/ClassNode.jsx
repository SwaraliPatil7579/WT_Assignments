import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const VISIBILITY_SYMBOLS = {
  '+': { symbol: '+', className: 'vis-public', title: 'public' },
  '-': { symbol: '−', className: 'vis-private', title: 'private' },
  '#': { symbol: '#', className: 'vis-protected', title: 'protected' },
  '~': { symbol: '~', className: 'vis-package', title: 'package' },
};

const STEREOTYPE_CONFIG = {
  class: {
    badge: null,
    borderAccent: '#3b82f6',
    headerBg: 'rgba(59, 130, 246, 0.08)',
  },
  abstract: {
    badge: '«abstract»',
    borderAccent: '#8b5cf6',
    headerBg: 'rgba(139, 92, 246, 0.08)',
  },
  interface: {
    badge: '«interface»',
    borderAccent: '#06b6d4',
    headerBg: 'rgba(6, 182, 212, 0.08)',
  },
  enum: {
    badge: '«enum»',
    borderAccent: '#f59e0b',
    headerBg: 'rgba(245, 158, 11, 0.08)',
  },
};

function ClassNode({ data, selected }) {
  const config = STEREOTYPE_CONFIG[data.stereotype] || STEREOTYPE_CONFIG.class;

  return (
    <div
      className={`class-node ${selected ? 'class-node-selected' : ''}`}
      style={{
        '--node-accent': config.borderAccent,
      }}
    >
      {/* Universal 4-way Connection Handles */}
      <Handle
        type="source"
        position={Position.Top}
        className="class-handle class-handle-top"
        id="top"
        title="Connect from top"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="class-handle class-handle-top-target"
        id="top-target"
        title="Connect to top"
      />

      <Handle
        type="source"
        position={Position.Bottom}
        className="class-handle class-handle-bottom"
        id="bottom"
        title="Connect from bottom"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="class-handle class-handle-bottom-target"
        id="bottom-target"
        title="Connect to bottom"
      />

      <Handle
        type="source"
        position={Position.Left}
        className="class-handle class-handle-left"
        id="left"
        title="Connect from left"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="class-handle class-handle-left-target"
        id="left-target"
        title="Connect to left"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="class-handle class-handle-right"
        id="right"
        title="Connect from right"
      />
      <Handle
        type="target"
        position={Position.Right}
        className="class-handle class-handle-right-target"
        id="right-target"
        title="Connect to right"
      />

      {/* Header Compartment */}
      <div
        className="class-node-header"
        style={{ backgroundColor: config.headerBg }}
      >
        {config.badge && (
          <span className="class-stereotype-badge" style={{ color: config.borderAccent }}>
            {config.badge}
          </span>
        )}
        <span
          className={`class-name ${data.stereotype === 'abstract' ? 'italic' : ''}`}
        >
          {data.name}
        </span>
      </div>

      {/* Attributes Compartment */}
      <div className="class-node-section">
        {data.attributes.length === 0 ? (
          <div className="class-empty-hint">// no fields</div>
        ) : (
          data.attributes.map((attr) => {
            const vis = VISIBILITY_SYMBOLS[attr.visibility] || VISIBILITY_SYMBOLS['+'];
            return (
              <div key={attr.id} className="class-member" title={`${vis.title} ${attr.name}: ${attr.type}`}>
                <span className={`class-visibility ${vis.className}`}>
                  {vis.symbol}
                </span>
                <span className="class-member-name">{attr.name}</span>
                <span className="class-member-colon">:</span>
                <span className="class-member-type">{attr.type}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Methods Compartment */}
      <div className="class-node-section class-node-section-methods">
        {data.methods.length === 0 ? (
          <div className="class-empty-hint">// no methods</div>
        ) : (
          data.methods.map((method) => {
            const vis = VISIBILITY_SYMBOLS[method.visibility] || VISIBILITY_SYMBOLS['+'];
            const kind = method.methodType || 'standard';
            const isAbstract = kind === 'abstract';
            const isStatic = kind === 'static';

            return (
              <div
                key={method.id}
                className={`class-member ${isAbstract ? 'method-abstract' : ''} ${isStatic ? 'method-static' : ''}`}
                title={`${vis.title} ${kind !== 'standard' ? `[${kind}] ` : ''}${method.name}(${method.params || ''}): ${method.returnType}`}
              >
                <span className={`class-visibility ${vis.className}`}>
                  {vis.symbol}
                </span>

                {kind !== 'standard' && (
                  <span className={`method-kind-badge method-kind-${kind}`}>
                    {kind === 'abstract' ? '«abs»' : kind === 'static' ? '«static»' : kind === 'final' ? '«final»' : '«default»'}
                  </span>
                )}

                <span
                  className={`class-member-name ${isAbstract ? 'italic text-purple-200' : ''} ${isStatic ? 'underline decoration-1 underline-offset-2' : ''}`}
                >
                  {method.name}
                  <span className="class-method-params">({method.params || ''})</span>
                </span>
                <span className="class-member-colon">:</span>
                <span className="class-member-type">{method.returnType}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default memo(ClassNode);
