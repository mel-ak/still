import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/audio';

export default function TransitionScreen({ onFinish }) {
  const [secondsRemaining, setSecondsRemaining] = useState(45);
  const [breathPhase, setBreathPhase] = useState('Inhale gently');

  useEffect(() => {
    const cycle = setInterval(() => {
      const elapsed = 45 - secondsRemaining;
      const mod = elapsed % 14;
      if (mod < 4) setBreathPhase('Inhale slowly');
      else if (mod < 8) setBreathPhase('Hold softly');
      else setBreathPhase('Exhale and release');
    }, 500);
    return () => clearInterval(cycle);
  }, [secondsRemaining]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          soundEngine.playSoftPing();
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <aside className="reset-overlay" role="dialog" aria-modal="true" aria-label="Pause Reset">
      <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem' }}>
        Session Complete
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 400, color: 'var(--text-main)' }}>
        Pause for 45 Seconds
      </h2>
      <p style={{ maxWidth: '440px', fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.6' }}>
        Do not rush to the next thing. Drop your shoulders, drink a sip of water, and allow your nervous system to settle.
      </p>

      <div className="reset-breath-circle" aria-hidden="true">
        <span className="reset-breath-text">{breathPhase}</span>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.75rem' }}>
        {secondsRemaining}s remaining
      </p>

      <button
        id="btn-skip-reset"
        className="btn-still-secondary"
        onClick={() => {
          soundEngine.playSoftPing();
          onFinish();
        }}
      >
        I Feel Rested
      </button>
    </aside>
  );
}
