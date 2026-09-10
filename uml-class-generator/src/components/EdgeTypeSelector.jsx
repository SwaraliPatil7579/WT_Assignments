import { getAllRelationshipTypes } from '../utils/edgeStyles';

const REL_GLYPHS = {
  inheritance: '▷',
  implementation: '┄▷',
  association: '→',
  aggregation: '◇',
  composition: '◆',
  dependency: '⇢',
};

export default function EdgeTypeSelector({ value, onChange }) {
  const types = getAllRelationshipTypes();

  return (
    <div className="edge-selector-wrapper">
      <span className="edge-selector-caption">Tool:</span>
      <div className="edge-selector-segmented">
        {types.map((rel) => {
          const isActive = value === rel.id;
          const glyph = REL_GLYPHS[rel.id] || '─';

          return (
            <button
              key={rel.id}
              type="button"
              onClick={() => onChange(rel.id)}
              className={`edge-seg-btn ${isActive ? 'edge-seg-btn-active' : ''}`}
              title={`${rel.label} (${rel.description})`}
              style={{
                '--seg-color': rel.color,
              }}
            >
              <span className="edge-seg-glyph">{glyph}</span>
              <span className="edge-seg-label">{rel.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
