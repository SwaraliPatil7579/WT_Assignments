import {
  Plus, Trash2, Code2, Download, RotateCcw, HelpCircle, Loader2, Check,
} from 'lucide-react';
import EdgeTypeSelector from './EdgeTypeSelector';

export default function Toolbar({
  onAddClass,
  onDeleteSelected,
  onToggleCode,
  onExportImage,
  exportStatus = 'idle',
  onClearAll,
  codeOpen,
  pendingRelType,
  onRelTypeChange,
  classCount = 0,
}) {
  return (
    <header className="toolbar">
      {/* Brand area */}
      <div className="toolbar-brand">
        <div className="toolbar-logo" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="8.5" y="14" width="7" height="7" rx="1.5" />
            <path d="M6.5 10v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" />
            <path d="M12 13v1" />
          </svg>
        </div>
        <div className="toolbar-title-group">
          <span className="toolbar-title">UML Studio</span>
          <span className="toolbar-badge">Java Architecture</span>
        </div>
      </div>

      <div className="toolbar-divider" />

      {/* Relationship Selector Toolset */}
      <div className="toolbar-center">
        <EdgeTypeSelector value={pendingRelType} onChange={onRelTypeChange} />
      </div>

      {/* Actions */}
      <div className="toolbar-actions">
        <button
          onClick={onAddClass}
          className="toolbar-btn toolbar-btn-primary"
          title="Add a new UML class (or press 'A')"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Add Class</span>
        </button>

        <button
          onClick={onToggleCode}
          className={`toolbar-btn ${codeOpen ? 'toolbar-btn-active' : ''}`}
          title="Toggle Java Code Generator"
        >
          <Code2 size={15} />
          <span>Java Source</span>
          {classCount > 0 && <span className="toolbar-count-badge">{classCount}</span>}
        </button>

        <div className="toolbar-divider" />

        <button
          onClick={onExportImage}
          disabled={exportStatus === 'exporting'}
          className={`toolbar-btn ${exportStatus === 'success' ? 'toolbar-btn-success' : ''}`}
          title="Directly export and download diagram as high-resolution PNG to your PC"
        >
          {exportStatus === 'exporting' ? (
            <>
              <Loader2 size={15} className="animate-spin text-blue-400" />
              <span>Exporting...</span>
            </>
          ) : exportStatus === 'success' ? (
            <>
              <Check size={15} className="text-emerald-400" />
              <span className="text-emerald-400">PNG Saved!</span>
            </>
          ) : (
            <>
              <Download size={15} />
              <span>Export PNG</span>
            </>
          )}
        </button>

        <button
          onClick={onDeleteSelected}
          className="toolbar-btn"
          title="Delete selected class or connection"
        >
          <Trash2 size={15} />
        </button>

        <button
          onClick={onClearAll}
          className="toolbar-btn toolbar-btn-ghost"
          title="Reset canvas"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </header>
  );
}
