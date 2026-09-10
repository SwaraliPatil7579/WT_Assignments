import { useState } from 'react';
import {
  X, Plus, Trash2, Box, Layers, Code, Edit3, List,
} from 'lucide-react';

const VISIBILITY_OPTIONS = [
  { value: '+', label: '+ public', color: '#10b981' },
  { value: '-', label: '− private', color: '#f43f5e' },
  { value: '#', label: '# protected', color: '#f59e0b' },
  { value: '~', label: '~ package', color: '#94a3b8' },
];

const STEREOTYPE_OPTIONS = [
  { value: 'class', label: 'Class' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'interface', label: 'Interface' },
  { value: 'enum', label: 'Enum' },
];

const PREDEFINED_TYPES = [
  // Primitives
  'int', 'float', 'double', 'boolean', 'char', 'long', 'short', 'byte',
  // Core Objects
  'String', 'Object',
  // Arrays
  'int[]', 'float[]', 'double[]', 'boolean[]', 'char[]', 'long[]', 'String[]', 'Object[]',
  // Wrappers
  'Integer', 'Float', 'Double', 'Boolean', 'Character', 'Long',
  // Collections
  'List<String>', 'List<Integer>', 'ArrayList<String>',
  'Set<String>', 'HashSet<String>',
  'Map<String, Object>', 'HashMap<String, String>',
  // Date/Time
  'LocalDate', 'Date', 'LocalDateTime',
  // Special
  'void',
];

/**
 * Reusable TypeDropdown component.
 * Provides a dropdown list containing various variable types (primitives, arrays, collections, etc.)
 * with an optional custom type text input fallback.
 */
function TypeDropdown({ value, onChange, includeVoid = false }) {
  const isPredefined = PREDEFINED_TYPES.includes(value);
  const [isCustomMode, setIsCustomMode] = useState(!isPredefined && Boolean(value));
  const [customInput, setCustomInput] = useState(value || '');

  if (isCustomMode) {
    return (
      <div className="editor-type-custom-box">
        <input
          type="text"
          value={customInput}
          onChange={(e) => {
            setCustomInput(e.target.value);
            onChange(e.target.value);
          }}
          className="editor-input-type-custom"
          placeholder="CustomType"
          autoFocus
        />
        <button
          type="button"
          onClick={() => {
            setIsCustomMode(false);
            if (!PREDEFINED_TYPES.includes(customInput)) {
              onChange('String');
            }
          }}
          className="editor-type-toggle-btn"
          title="Switch to standard types dropdown"
        >
          <List size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="editor-type-select-box">
      <select
        value={isPredefined ? value : '__custom__'}
        onChange={(e) => {
          if (e.target.value === '__custom__') {
            setIsCustomMode(true);
            setCustomInput(value || '');
          } else {
            onChange(e.target.value);
          }
        }}
        className="editor-select-type"
        title="Select variable type from dropdown"
      >
        {!isPredefined && value && (
          <option value="__custom__">{value} (custom)</option>
        )}

        {includeVoid && (
          <optgroup label="Special">
            <option value="void">void</option>
          </optgroup>
        )}

        <optgroup label="Primitives">
          <option value="int">int</option>
          <option value="float">float</option>
          <option value="double">double</option>
          <option value="boolean">boolean</option>
          <option value="char">char</option>
          <option value="long">long</option>
          <option value="short">short</option>
          <option value="byte">byte</option>
        </optgroup>

        <optgroup label="Core Objects">
          <option value="String">String</option>
          <option value="Object">Object</option>
        </optgroup>

        <optgroup label="Array Types">
          <option value="int[]">int[]</option>
          <option value="float[]">float[]</option>
          <option value="double[]">double[]</option>
          <option value="boolean[]">boolean[]</option>
          <option value="char[]">char[]</option>
          <option value="long[]">long[]</option>
          <option value="String[]">String[]</option>
          <option value="Object[]">Object[]</option>
        </optgroup>

        <optgroup label="Wrapper Classes">
          <option value="Integer">Integer</option>
          <option value="Float">Float</option>
          <option value="Double">Double</option>
          <option value="Boolean">Boolean</option>
          <option value="Character">Character</option>
          <option value="Long">Long</option>
        </optgroup>

        <optgroup label="Collections">
          <option value="List<String>">List&lt;String&gt;</option>
          <option value="List<Integer>">List&lt;Integer&gt;</option>
          <option value="ArrayList<String>">ArrayList&lt;String&gt;</option>
          <option value="Set<String>">Set&lt;String&gt;</option>
          <option value="HashSet<String>">HashSet&lt;String&gt;</option>
          <option value="Map<String, Object>">Map&lt;String, Object&gt;</option>
          <option value="HashMap<String, String>">HashMap&lt;String, String&gt;</option>
        </optgroup>

        <optgroup label="Date / Time">
          <option value="LocalDate">LocalDate</option>
          <option value="Date">Date</option>
          <option value="LocalDateTime">LocalDateTime</option>
        </optgroup>

        <optgroup label="Custom">
          <option value="__custom__">✏️ Custom Type...</option>
        </optgroup>
      </select>
    </div>
  );
}

export default function ClassNodeEditor({
  node,
  updateNodeData,
  addAttribute,
  removeAttribute,
  updateAttribute,
  addMethod,
  removeMethod,
  updateMethod,
  deleteNode,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('attributes');
  const data = node.data;

  return (
    <aside className="editor-panel" aria-label="Class Inspector">
      {/* Inspector Header */}
      <div className="editor-header">
        <div className="editor-header-title">
          <Box size={16} className="text-blue-400" />
          <span className="editor-title">{data.name}</span>
          <span className="editor-tag">{data.stereotype}</span>
        </div>
        <button onClick={onClose} className="editor-close-btn" title="Close inspector">
          <X size={15} />
        </button>
      </div>

      {/* Segmented Tabs */}
      <div className="editor-tabs">
        <button
          onClick={() => setActiveTab('general')}
          className={`editor-tab ${activeTab === 'general' ? 'editor-tab-active' : ''}`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('attributes')}
          className={`editor-tab ${activeTab === 'attributes' ? 'editor-tab-active' : ''}`}
        >
          Fields ({data.attributes.length})
        </button>
        <button
          onClick={() => setActiveTab('methods')}
          className={`editor-tab ${activeTab === 'methods' ? 'editor-tab-active' : ''}`}
        >
          Methods ({data.methods.length})
        </button>
      </div>

      <div className="editor-body">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="editor-section">
            <div className="editor-field-group">
              <label className="editor-label">Class Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateNodeData(node.id, { name: e.target.value })}
                className="editor-input"
                placeholder="ClassName"
                autoFocus
              />
            </div>

            <div className="editor-field-group mt-4">
              <label className="editor-label">Stereotype</label>
              <div className="editor-radio-group">
                {STEREOTYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateNodeData(node.id, { stereotype: opt.value })}
                    className={`editor-radio-btn ${data.stereotype === opt.value ? 'editor-radio-active' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="editor-divider" />

            <button
              type="button"
              onClick={() => deleteNode(node.id)}
              className="editor-delete-btn"
            >
              <Trash2 size={14} />
              <span>Delete Class</span>
            </button>
          </div>
        )}

        {/* Attributes Tab */}
        {activeTab === 'attributes' && (
          <div className="editor-section">
            <div className="editor-col-labels">
              <span className="editor-col-vis">VIS</span>
              <span className="editor-col-type">TYPE</span>
              <span className="editor-col-name">FIELD NAME</span>
              <span className="editor-col-action" />
            </div>

            <div className="editor-items-list">
              {data.attributes.length === 0 ? (
                <div className="editor-empty-state">No fields added yet.</div>
              ) : (
                data.attributes.map((attr) => (
                  <div key={attr.id} className="editor-member-row">
                    <select
                      value={attr.visibility}
                      onChange={(e) => updateAttribute(node.id, attr.id, 'visibility', e.target.value)}
                      className="editor-select-vis"
                      title="Visibility (+, -, #, ~)"
                    >
                      {VISIBILITY_OPTIONS.map((v) => (
                        <option key={v.value} value={v.value}>{v.value}</option>
                      ))}
                    </select>

                    <TypeDropdown
                      value={attr.type}
                      onChange={(newType) => updateAttribute(node.id, attr.id, 'type', newType)}
                    />

                    <input
                      type="text"
                      value={attr.name}
                      onChange={(e) => updateAttribute(node.id, attr.id, 'name', e.target.value)}
                      className="editor-input-name"
                      placeholder="field_name"
                    />

                    <button
                      type="button"
                      onClick={() => removeAttribute(node.id, attr.id)}
                      className="editor-remove-btn"
                      title="Delete field"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => addAttribute(node.id)}
              className="editor-add-btn"
            >
              <Plus size={14} />
              <span>Add Field</span>
            </button>
          </div>
        )}

        {/* Methods Tab */}
        {activeTab === 'methods' && (
          <div className="editor-section">
            <div className="editor-col-labels">
              <span className="editor-col-vis">VIS</span>
              <span className="editor-col-type">RETURN</span>
              <span className="editor-col-name">METHOD NAME</span>
              <span className="editor-col-action" />
            </div>

            <div className="editor-items-list">
              {data.methods.length === 0 ? (
                <div className="editor-empty-state">No methods added yet.</div>
              ) : (
                data.methods.map((method) => {
                  const currentKind = method.methodType || 'standard';
                  const availableKinds = [
                    { id: 'standard', label: 'normal' },
                    { id: 'abstract', label: 'abstract' },
                    { id: 'static', label: 'static' },
                    { id: 'final', label: 'final' },
                    ...(data.stereotype === 'interface' ? [{ id: 'default', label: 'default' }] : []),
                  ];

                  return (
                    <div key={method.id} className="editor-method-card">
                      {/* Row 1: Visibility, Return Type, Name, Remove */}
                      <div className="editor-member-row">
                        <select
                          value={method.visibility}
                          onChange={(e) => updateMethod(node.id, method.id, 'visibility', e.target.value)}
                          className="editor-select-vis"
                          title="Visibility (+, -, #, ~)"
                        >
                          {VISIBILITY_OPTIONS.map((v) => (
                            <option key={v.value} value={v.value}>{v.value}</option>
                          ))}
                        </select>

                        <TypeDropdown
                          value={method.returnType}
                          onChange={(newType) => updateMethod(node.id, method.id, 'returnType', newType)}
                          includeVoid={true}
                        />

                        <input
                          type="text"
                          value={method.name}
                          onChange={(e) => updateMethod(node.id, method.id, 'name', e.target.value)}
                          className="editor-input-name"
                          placeholder="methodName"
                        />

                        <button
                          type="button"
                          onClick={() => removeMethod(node.id, method.id)}
                          className="editor-remove-btn"
                          title="Delete method"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Row 2: Method Type Modifier Selector */}
                      <div className="editor-method-kind-row">
                        <span className="editor-params-tag">type</span>
                        <div className="editor-kind-chips">
                          {availableKinds.map((k) => (
                            <button
                              key={k.id}
                              type="button"
                              onClick={() => updateMethod(node.id, method.id, 'methodType', k.id)}
                              className={`editor-kind-chip ${currentKind === k.id ? `editor-kind-chip-active-${k.id}` : ''}`}
                            >
                              {k.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Row 3: Parameters */}
                      <div className="editor-params-row">
                        <span className="editor-params-tag">params</span>
                        <input
                          type="text"
                          value={method.params}
                          onChange={(e) => updateMethod(node.id, method.id, 'params', e.target.value)}
                          className="editor-input-params"
                          placeholder="e.g. String id, int count"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Add Actions */}
            <div className="editor-add-method-group">
              <button
                type="button"
                onClick={() => addMethod(node.id, 'standard')}
                className="editor-add-btn flex-1"
              >
                <Plus size={13} />
                <span>+ Method</span>
              </button>
              <button
                type="button"
                onClick={() => addMethod(node.id, 'abstract')}
                className="editor-add-btn editor-add-btn-abstract flex-1"
                title="Add abstract method without body"
              >
                <Plus size={13} />
                <span>+ Abstract</span>
              </button>
              <button
                type="button"
                onClick={() => addMethod(node.id, 'static')}
                className="editor-add-btn editor-add-btn-static flex-1"
                title="Add class-level static method"
              >
                <Plus size={13} />
                <span>+ Static</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
