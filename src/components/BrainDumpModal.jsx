import React, { useState } from 'react';
import { X, ArrowRight, Archive } from 'lucide-react';

export default function BrainDumpModal({ 
  isOpen, 
  onClose, 
  onSaveToWorryWindow, 
  onSetFocusTask,
  onLogBrainDumpWin,
  onShowToast
}) {
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleParkWorry = () => {
    if (!content.trim()) return;
    onSaveToWorryWindow(content.trim());
    onLogBrainDumpWin();
    onShowToast("Parked for evening worry window.");
    setContent('');
    onClose();
  };

  const handleLabelAndLetGo = () => {
    onLogBrainDumpWin();
    onShowToast("Labeled: 'Overthinking'. Returned to presence.");
    setContent('');
    onClose();
  };

  const handleUseAsFocus = () => {
    if (!content.trim()) return;
    onSetFocusTask(content.trim());
    onLogBrainDumpWin();
    onShowToast("Transferred to current focus.");
    setContent('');
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Mind Dump">
      <div className="modal-sheet">
        <div className="modal-sheet-header">
          <h2 className="modal-sheet-title">Mind Dump</h2>
          <button 
            id="btn-close-dump"
            className="nav-icon-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
          An analyzing mind leaves little energy for focus. Write whatever is distracting or looping in your mind:
        </p>

        <textarea
          id="dump-textarea"
          className="journal-textarea"
          style={{ minHeight: '110px', fontSize: '0.95rem', marginBottom: '1.25rem' }}
          placeholder="Write it down, then let it rest..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
        />

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button
            id="btn-park-worry"
            className="btn-still-secondary"
            style={{ flex: 1 }}
            onClick={handleParkWorry}
            disabled={!content.trim()}
          >
            <Archive size={14} />
            <span>Park in Worry Log</span>
          </button>

          <button
            id="btn-use-focus"
            className="btn-still-primary"
            style={{ flex: 1 }}
            onClick={handleUseAsFocus}
            disabled={!content.trim()}
          >
            <span>Focus on This</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-hairline)' }}>
          <button
            id="btn-label-letgo"
            className="nav-link-btn"
            style={{ fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}
            onClick={handleLabelAndLetGo}
          >
            Label &amp; Release: <em>"That's just overthinking, returning to now."</em>
          </button>
        </div>
      </div>
    </div>
  );
}
