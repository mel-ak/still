import React, { useState, useEffect } from 'react';
import { X, PenLine, History, Sparkles, Check, Trash2, Calendar } from 'lucide-react';

export default function RevisionsModal({ 
  isOpen, 
  onClose, 
  currentWeek = 1, 
  onSetCurrentWeek,
  onShowToast 
}) {
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'archive'
  
  // Overarching personal plan revisions
  const [planRevisions, setPlanRevisions] = useState(() => {
    return localStorage.getItem('still_plan_revisions') || '';
  });

  const [savedIndicator, setSavedIndicator] = useState(false);

  useEffect(() => {
    localStorage.setItem('still_plan_revisions', planRevisions);
  }, [planRevisions]);

  // Read all historical daily reflections from localStorage
  const [pastReflections, setPastReflections] = useState([]);

  const loadPastReflections = () => {
    const entries = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('gentle_focus_notes_')) {
          const dateStr = key.replace('gentle_focus_notes_', '');
          const content = localStorage.getItem(key);
          if (content && content.trim()) {
            entries.push({ date: dateStr, content });
          }
        }
      }
      entries.sort((a, b) => b.date.localeCompare(a.date));
    } catch (_) {}
    setPastReflections(entries);
  };

  useEffect(() => {
    if (isOpen) {
      loadPastReflections();
    }
  }, [isOpen]);

  const handleDeleteEntry = (dateKey) => {
    if (window.confirm(`Delete notes for ${dateKey}?`)) {
      localStorage.removeItem(`gentle_focus_notes_${dateKey}`);
      loadPastReflections();
      if (onShowToast) onShowToast("Reflection entry deleted.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Notes and Revisions">
      <div className="modal-sheet" style={{ maxWidth: '640px' }}>
        <div className="modal-sheet-header">
          <div>
            <h2 className="modal-sheet-title">My Notes &amp; Revisions</h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              "You can revise this plan anytime. Make it yours."
            </div>
          </div>
          <button 
            id="btn-close-revisions"
            className="nav-icon-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="revisions-tab-bar" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'plan'}
            className={`revisions-tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('plan')}
          >
            <PenLine size={14} />
            <span>Plan Revisions &amp; Cadence</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'archive'}
            className={`revisions-tab-btn ${activeTab === 'archive' ? 'active' : ''}`}
            onClick={() => setActiveTab('archive')}
          >
            <History size={14} />
            <span>Past Reflections ({pastReflections.length})</span>
          </button>
        </div>

        {/* Tab 1: Plan Revisions & Cadence */}
        {activeTab === 'plan' && (
          <div className="revisions-tab-content">
            {/* 2-Week Cadence Selector from Guide */}
            <div className="cadence-box">
              <div className="cadence-title">
                <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                <span>Guide Cadence Pacing</span>
              </div>
              <p className="cadence-sub">
                The guide suggests starting simple and layering habits over two weeks without overwhelm.
              </p>

              <div className="cadence-pills-row">
                <button
                  type="button"
                  className={`cadence-pill ${currentWeek === 1 ? 'active' : ''}`}
                  onClick={() => onSetCurrentWeek && onSetCurrentWeek(1)}
                >
                  <span className="cadence-pill-header">Week 1 · Foundation</span>
                  <span className="cadence-pill-body">Water upon waking + 1 focus block + sleep wind-down</span>
                </button>

                <button
                  type="button"
                  className={`cadence-pill ${currentWeek === 2 ? 'active' : ''}`}
                  onClick={() => onSetCurrentWeek && onSetCurrentWeek(2)}
                >
                  <span className="cadence-pill-header">Week 2 · Layering</span>
                  <span className="cadence-pill-body">Add brain dump habit + multivitamin &amp; brain fuel</span>
                </button>
              </div>
            </div>

            {/* Living Notebook Textarea */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <label htmlFor="plan-revisions-input" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Custom Rules &amp; Adjustments
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>
                  Autosaves to device
                </span>
              </div>
              <textarea
                id="plan-revisions-input"
                className="journal-textarea"
                style={{ minHeight: '130px', fontSize: '0.88rem' }}
                placeholder="Write what works, what doesn't, or changes you want to try:
• Revised bedtime target: 11:15pm
• Keep water bottle right next to screen
• If 20m feels long, drop to 15m without guilt..."
                value={planRevisions}
                onChange={(e) => setPlanRevisions(e.target.value)}
              />
              <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                "Cross things out, add notes, change the order — you don't have to fix everything at once."
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Past Reflections Archive */}
        {activeTab === 'archive' && (
          <div className="revisions-tab-content">
            {pastReflections.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                <History size={28} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '0.88rem', marginBottom: '0.25rem' }}>No past reflections saved yet.</p>
                <p style={{ fontSize: '0.78rem' }}>
                  Daily notes you enter in the "Notes &amp; Adjustments" box on the main screen are preserved here.
                </p>
              </div>
            ) : (
              <div className="reflections-timeline">
                {pastReflections.map((entry) => (
                  <div key={entry.date} className="reflection-card">
                    <div className="reflection-card-header">
                      <div className="reflection-date">
                        <Calendar size={13} />
                        <span>{entry.date}</span>
                      </div>
                      <button
                        className="nav-icon-btn"
                        style={{ width: '26px', height: '26px', color: 'var(--text-dim)' }}
                        onClick={() => handleDeleteEntry(entry.date)}
                        title="Delete entry"
                        aria-label={`Delete entry for ${entry.date}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="reflection-card-body">
                      {entry.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            "You are not lazy or broken. Progress over perfection."
          </span>
          <button
            id="btn-close-revisions-footer"
            className="btn-still-secondary"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
