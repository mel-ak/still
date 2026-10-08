import React, { useState, useEffect } from 'react';
import { X, Check, Play, Pause, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function WorryWindowModal({ 
  isOpen, 
  onClose, 
  worries, 
  onDeleteWorry, 
  onClearAllWorries 
}) {
  const [timerSeconds, setTimerSeconds] = useState(10 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            soundEngine.playSingingBowl();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  if (!isOpen) return null;

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Worry Window">
      <div className="modal-sheet">
        <div className="modal-sheet-header">
          <h2 className="modal-sheet-title">Worry Window</h2>
          <button 
            id="btn-close-worry"
            className="nav-icon-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Dedicated 10-minute window to review thoughts deliberately outside of focus hours.
        </p>

        {/* Minimal 10m Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1rem',
          background: 'var(--bg-surface-subtle)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Contained Timer
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-main)' }}>
              {formatTimer(timerSeconds)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              id="btn-toggle-worry-timer"
              className="btn-still-secondary"
              style={{ padding: '0.45rem 0.85rem' }}
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? <Pause size={13} /> : <Play size={13} />}
              <span>{isTimerRunning ? 'Pause' : 'Start 10m'}</span>
            </button>
            <button
              id="btn-reset-worry-timer"
              className="nav-icon-btn"
              onClick={() => { setIsTimerRunning(false); setTimerSeconds(10 * 60); }}
              title="Reset"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Worries List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Parked Thoughts ({worries.length})
            </span>
            {worries.length > 0 && (
              <button
                id="btn-clear-worries"
                className="nav-link-btn"
                style={{ fontSize: '0.75rem' }}
                onClick={onClearAllWorries}
              >
                Clear all
              </button>
            )}
          </div>

          {worries.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'var(--text-dim)',
              fontSize: '0.86rem',
              border: '1px dashed var(--border-hairline)',
              borderRadius: 'var(--radius-md)'
            }}>
              No thoughts parked. Mind is clear.
            </div>
          ) : (
            worries.map((item) => (
              <div 
                key={item.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.85rem',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '0.5rem',
                  gap: '0.75rem'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{item.text}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <button
                  className="nav-icon-btn"
                  style={{ width: '28px', height: '28px' }}
                  onClick={() => onDeleteWorry(item.id)}
                  title="Mark as handled"
                >
                  <Check size={13} style={{ color: 'var(--accent)' }} />
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            id="btn-done-worry-modal"
            className="btn-still-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
