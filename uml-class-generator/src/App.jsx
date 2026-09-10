import { useState, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useDiagramState } from './hooks/useDiagramState';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ClassNodeEditor from './components/ClassNodeEditor';
import CodePanel from './components/CodePanel';
import './App.css';

function AppInner() {
  const {
    nodes,
    edges,
    selectedNode,
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
    addAttribute,
    removeAttribute,
    updateAttribute,
    addMethod,
    removeMethod,
    updateMethod,
    setPendingRelType,
    setSelectedNodeId,
  } = useDiagramState();

  const [codeOpen, setCodeOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState('idle'); // 'idle' | 'exporting' | 'success'

  const handleExportImage = useCallback(async () => {
    try {
      setExportStatus('exporting');

      const container = document.querySelector('.canvas-container');
      if (!container) {
        throw new Error('Canvas container not found.');
      }

      // Smoothly frame all nodes before snapshotting
      if (reactFlowInstance.current) {
        reactFlowInstance.current.fitView({ padding: 0.2, duration: 150 });
      }

      // Allow fitView transition and rendering to settle
      await new Promise((r) => setTimeout(r, 220));

      const { toPng } = await import('html-to-image');

      const dataUrl = await toPng(container, {
        backgroundColor: '#0e1117',
        pixelRatio: 2,
        cacheBust: true,
        filter: (node) => {
          if (node.classList) {
            if (
              node.classList.contains('react-flow__controls') ||
              node.classList.contains('react-flow__minimap') ||
              node.classList.contains('react-flow__attribution') ||
              node.classList.contains('edge-quick-actions') ||
              node.classList.contains('edge-control-handle')
            ) {
              return false;
            }
          }
          return true;
        },
      });

      // Trigger direct file download
      const timestamp = new Date().toISOString().slice(0, 10);
      const link = document.createElement('a');
      link.download = `uml-class-diagram-${timestamp}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2500);
    } catch (err) {
      console.error('PNG export failed:', err);
      setExportStatus('idle');
      alert('Failed to export image: ' + (err.message || 'Unknown error'));
    }
  }, [reactFlowInstance]);

  const toggleCode = useCallback(() => {
    setCodeOpen((prev) => !prev);
  }, []);

  return (
    <div className="app-layout">
      <Toolbar
        onAddClass={addClassNode}
        onDeleteSelected={deleteSelected}
        onToggleCode={toggleCode}
        onExportImage={handleExportImage}
        exportStatus={exportStatus}
        onClearAll={clearAll}
        codeOpen={codeOpen}
        pendingRelType={pendingRelType}
        onRelTypeChange={setPendingRelType}
        classCount={nodes.length}
      />

      <div className="app-body">
        <Canvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          reactFlowInstance={reactFlowInstance}
        />

        {/* Editor panel (left side) */}
        {selectedNode && (
          <div className="editor-overlay">
            <ClassNodeEditor
              node={selectedNode}
              updateNodeData={updateNodeData}
              addAttribute={addAttribute}
              removeAttribute={removeAttribute}
              updateAttribute={updateAttribute}
              addMethod={addMethod}
              removeMethod={removeMethod}
              updateMethod={updateMethod}
              deleteNode={deleteNode}
              onClose={() => setSelectedNodeId(null)}
            />
          </div>
        )}

        {/* Code panel (right side) */}
        {codeOpen && (
          <div className="code-overlay">
            <CodePanel
              nodes={nodes}
              edges={edges}
              onClose={() => setCodeOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppInner />
    </ReactFlowProvider>
  );
}
