import React, { useMemo } from 'react';
import { X, Activity, Droplets, Sparkles, Moon, Brain, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function RhythmModal({ 
  isOpen, 
  onClose,
  totalSessions = 0,
  worryCount = 0 
}) {
  if (!isOpen) return null;

  // Generate the last 7 days date keys
  const daysData = useMemo(() => {
    const list = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const dayName = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const displayDate = `${d.getMonth() + 1}/${d.getDate()}`;

      // Read checklist from localStorage
      let checklist = { water: false, focusBlock: false, brainDump: false, sleepWindDown: false, nutrition: false };
      try {
        const saved = localStorage.getItem(`gentle_focus_checklist_${dateKey}`);
        if (saved) checklist = JSON.parse(saved);
      } catch (_) {}

      // Read water glasses
      let waterCount = 0;
      try {
        const savedW = localStorage.getItem(`still_water_${dateKey}`);
        if (savedW) waterCount = parseInt(savedW, 10);
      } catch (_) {}

      // Calculate score
      const metCount = Object.values(checklist).filter(Boolean).length;
      const isMet = metCount >= 2;

      list.push({
        dateKey,
        dayName,
        displayDate,
        checklist,
        waterCount,
        metCount,
        isMet,
        isToday: i === 0
      });
    }

    return list;
  }, [isOpen]);

  const totalWeeklyWater = daysData.reduce((acc, d) => acc + (d.waterCount || 0), 0);
  const totalDaysMet = daysData.filter(d => d.isMet).length;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Weekly Rhythm">
      <div className="modal-sheet" style={{ maxWidth: '640px' }}>
        <div className="modal-sheet-header">
          <div>
            <h2 className="modal-sheet-title">Weekly Rhythm</h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              "Aim for 2–3 items — No perfection required."
            </div>
          </div>
          <button 
            id="btn-close-rhythm"
            className="nav-icon-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* 3 Gentle Highlight Cards */}
        <div className="rhythm-stats-row">
          <div className="rhythm-stat-card">
            <div className="rhythm-stat-icon" style={{ color: 'var(--accent)' }}>
              <ShieldCheck size={18} />
            </div>
            <div className="rhythm-stat-value">{totalDaysMet} of 7</div>
            <div className="rhythm-stat-label">Anchored Days (2+ wins)</div>
          </div>

          <div className="rhythm-stat-card">
            <div className="rhythm-stat-icon" style={{ color: '#60a5fa' }}>
              <Droplets size={18} />
            </div>
            <div className="rhythm-stat-value">{totalWeeklyWater}</div>
            <div className="rhythm-stat-label">Hydration Glasses Logged</div>
          </div>

          <div className="rhythm-stat-card">
            <div className="rhythm-stat-icon" style={{ color: '#c084fc' }}>
              <Sparkles size={18} />
            </div>
            <div className="rhythm-stat-value">{totalSessions}</div>
            <div className="rhythm-stat-label">Lifetime Focus Blocks</div>
          </div>
        </div>

        {/* 7-Day Timeline Ribbon */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              7-Day Compound Timeline
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              Kind to a tired brain
            </span>
          </div>

          <div className="rhythm-days-grid">
            {daysData.map((d) => (
              <div 
                key={d.dateKey} 
                className={`rhythm-day-col ${d.isToday ? 'is-today' : ''} ${d.isMet ? 'day-met' : ''}`}
              >
                <div className="rhythm-col-header">
                  <span className="rhythm-col-day">{d.dayName}</span>
                  <span className="rhythm-col-date">{d.displayDate}</span>
                </div>

                {/* Micro Anchor Beads */}
                <div className="rhythm-beads-stack">
                  <div 
                    className={`micro-bead ${d.checklist.water ? 'active' : ''}`} 
                    title="Water upon waking"
                  />
                  <div 
                    className={`micro-bead ${d.checklist.focusBlock ? 'active' : ''}`} 
                    title="15m focus block"
                  />
                  <div 
                    className={`micro-bead ${d.checklist.brainDump ? 'active' : ''}`} 
                    title="Brain dump / walk"
                  />
                  <div 
                    className={`micro-bead ${d.checklist.sleepWindDown ? 'active' : ''}`} 
                    title="Sleep wind-down"
                  />
                  <div 
                    className={`micro-bead ${d.checklist.nutrition ? 'active' : ''}`} 
                    title="Brain fuel / vitamins"
                  />
                </div>

                <div className="rhythm-col-badge">
                  {d.metCount >= 2 ? (
                    <span className="status-met">Met</span>
                  ) : d.metCount === 1 ? (
                    <span className="status-step">1 win</span>
                  ) : (
                    <span className="status-rest">Rest</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar Legend & Compassionate Reminder */}
        <div className="rhythm-legend-box">
          <div className="rhythm-legend-title">Anchor Beads:</div>
          <div className="rhythm-legend-items">
            <span>💧 Water</span>
            <span>✦ Focus Block</span>
            <span>🧠 Brain Dump</span>
            <span>☾ Sleep</span>
            <span>💊 Brain Fuel</span>
          </div>
        </div>

        <div className="rhythm-quote-callout">
          <p>
            "You don't have to fix everything at once. Improving sleep and water first naturally makes focus and calm easier. Small, kind steps compound."
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button
            id="btn-close-rhythm-footer"
            className="btn-still-secondary"
            onClick={onClose}
          >
            Close Rhythm
          </button>
        </div>
      </div>
    </div>
  );
}
