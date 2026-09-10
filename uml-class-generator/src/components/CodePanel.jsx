import { useState, useMemo } from 'react';
import { X, Copy, Check, Download, FileCode, ChevronDown, ChevronRight } from 'lucide-react';
import { generateJavaCode } from '../utils/javaCodeGenerator';

export default function CodePanel({ nodes, edges, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);

  const files = useMemo(() => generateJavaCode(nodes, edges), [nodes, edges]);

  const copyToClipboard = async (code, index) => {
    await navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = async () => {
    const allCode = files.map((f) => `// ===== ${f.className}.java =====\n${f.code}`).join('\n\n');
    await navigator.clipboard.writeText(allCode);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadAll = async () => {
    const JSZip = (await import('jszip')).default;
    const { saveAs } = await import('file-saver');

    const zip = new JSZip();
    files.forEach((f) => {
      zip.file(`${f.className}.java`, f.code);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'uml-java-source.zip');
  };

  const currentFile = files[selectedFileIdx] || files[0];

  return (
    <div className="code-panel" aria-label="Java Code Generator">
      {/* Header */}
      <div className="code-panel-header">
        <div className="code-panel-title-area">
          <FileCode size={16} className="text-blue-400" />
          <h3 className="code-panel-title">Generated Java Sources</h3>
          <span className="code-panel-count">{files.length} {files.length === 1 ? 'file' : 'files'}</span>
        </div>
        <div className="code-panel-top-actions">
          <button
            onClick={copyAll}
            className="code-action-btn"
            title="Copy all generated Java files"
          >
            {copiedIndex === -1 ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedIndex === -1 ? 'Copied All' : 'Copy All'}</span>
          </button>
          <button
            onClick={downloadAll}
            className="code-action-btn code-action-download"
            title="Download all files as .zip"
          >
            <Download size={13} />
            <span>Download ZIP</span>
          </button>
          <button onClick={onClose} className="code-panel-close" title="Close code panel">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {files.length === 0 ? (
        <div className="code-empty">
          <p>No classes defined in diagram.</p>
          <p className="code-empty-hint">Add a class to inspect generated Java code.</p>
        </div>
      ) : (
        <div className="code-ide-layout">
          {/* File Tabs Bar */}
          <div className="code-tabs-bar">
            {files.map((file, idx) => {
              const isSelected = idx === selectedFileIdx;
              return (
                <button
                  key={file.className + idx}
                  type="button"
                  onClick={() => setSelectedFileIdx(idx)}
                  className={`code-tab-btn ${isSelected ? 'code-tab-btn-active' : ''}`}
                >
                  <span className="code-tab-dot" />
                  <span className="code-tab-name">{file.className}.java</span>
                </button>
              );
            })}
          </div>

          {/* Active File Editor View */}
          {currentFile && (
            <div className="code-editor-view">
              <div className="code-editor-meta">
                <span className="code-meta-path">src/main/java/{currentFile.className}.java</span>
                <button
                  onClick={() => copyToClipboard(currentFile.code, selectedFileIdx)}
                  className="code-copy-single-btn"
                  title="Copy this file"
                >
                  {copiedIndex === selectedFileIdx ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedIndex === selectedFileIdx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="code-scroll-pane">
                <pre className="code-block">
                  <code>{currentFile.code}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
