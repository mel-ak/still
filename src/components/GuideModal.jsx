import React from 'react';
import { X } from 'lucide-react';

export default function GuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const PILLARS = [
    {
      num: '1',
      title: 'Sleep — The Biggest Lever',
      desc: 'Poor sleep directly degrades attention and working memory. Protect a regular bedtime window (e.g. 10:30–11:30 pm), dim lights 30–45m before bed, and keep a consistent wake time.',
      win: 'Improve sleep by 30–45 minutes for one week.'
    },
    {
      num: '2',
      title: 'Water — Cellular Hydration',
      desc: 'Mild dehydration slows cognitive throughput. Drink a full glass first thing after waking, and take small sips throughout the day.',
      win: 'Water upon waking + a few glasses during the day.'
    },
    {
      num: '3',
      title: 'Reducing Stimulation — Calm Windows',
      desc: 'Constant inputs train attention to stay scattered. Create 2–3 low-input blocks (15–20 minutes) daily with single tabs and no phone notifications. Pause 30–60 seconds after each task.',
      win: 'One solid 15–20 minute low-stimulation block daily.'
    },
    {
      num: '4',
      title: 'Overthinking — Silencing Mental Noise',
      desc: 'Offload racing thoughts immediately to a brain dump. Set a 10-minute evening worry window. When intrusive thoughts arise, label them gently ("Overthinking") and return to breath.',
      win: 'One brain dump + one short walk when stuck in loops.'
    },
    {
      num: '5',
      title: 'Vitamins & Basic Nutrition',
      desc: 'Support brain fuel with basic vitamins (B-complex, D, magnesium, iron) and one nutrient-dense food daily (eggs, banana, nuts, greens). Close gaps without drastic diet stress.',
      win: 'Basic multivitamin or one nutrient-rich food most days.'
    }
  ];

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Still Guide">
      <div className="modal-sheet" style={{ maxWidth: '620px' }}>
        <div className="modal-sheet-header">
          <h2 className="modal-sheet-title">The Reset Guide</h2>
          <button 
            id="btn-close-guide"
            className="nav-icon-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
          "You are not lazy or broken. Your system is under strain and is asking for support. Small, kind steps compound. Progress over perfection."
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {PILLARS.map((p) => (
            <div key={p.num} style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '1rem' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {p.num}. {p.title}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.55', marginBottom: '0.45rem' }}>
                {p.desc}
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500 }}>
                Minimum win: {p.win}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            id="btn-close-guide-footer"
            className="btn-still-secondary"
            onClick={onClose}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
