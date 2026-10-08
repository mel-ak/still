import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Maximize2, Minimize2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function FocusCanvas({ 
  onSessionComplete, 
  onOpenBrainDump,
  taskIntention,
  setTaskIntention
}) {
  const PRESETS = [
    { label: '15m', minutes: 15 },
    { label: '20m', minutes: 20 },
    { label: '25m', minutes: 25 }
  ];

  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  const totalSeconds = selectedMinutes * 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;

  const radius = 125;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressRatio * circumference);

  const timerRef = useRef(null);

  const handleSelectPreset = (minutes) => {
    if (isRunning) return;
    setSelectedMinutes(minutes);
    setTimeLeft(minutes * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            soundEngine.playSingingBowl();
            onSessionComplete(taskIntention || '15-min Calm Block', selectedMinutes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, selectedMinutes, taskIntention, onSessionComplete]);

  const toggleStartPause = () => {
    if (!isRunning && timeLeft === 0) {
      setTimeLeft(selectedMinutes * 60);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
  };

  const handleAddFiveMinutes = () => {
    setTimeLeft((prev) => prev + 300);
    setSelectedMinutes((prev) => prev + 5);
  };

  // Browser title
  useEffect(() => {
    if (isRunning) {
      document.title = `(${formatTime(timeLeft)}) Still`;
    } else {
      document.title = 'Still — Mind & Concentration';
    }
  }, [isRunning, timeLeft]);

  // Keyboard shortcut (Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleStartPause();
      } else if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, timeLeft, selectedMinutes, isZenMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className={`panel focus-sanctuary ${isZenMode ? 'zen-mode' : ''}`} aria-label="Focus Sanctuary">
      {isZenMode && (
        <button 
          id="btn-exit-zen"
          className="btn-still-secondary"
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
          onClick={() => setIsZenMode(false)}
        >
          <Minimize2 size={14} />
          <span>Exit Zen</span>
        </button>
      )}

      {/* Intention Input */}
      <div className="intention-container">
        <input
          id="focus-intention-input"
          type="text"
          className="intention-field"
          placeholder="What are you focusing on?"
          value={taskIntention}
          onChange={(e) => setTaskIntention(e.target.value)}
          disabled={isRunning}
        />
      </div>

      {/* Timer Display */}
      <div className="timer-viewport" role="timer" aria-live="polite">
        <svg className="timer-svg" viewBox="0 0 280 280">
          <circle
            className="timer-circle-track"
            cx="140"
            cy="140"
            r={radius}
          />
          <circle
            className="timer-circle-fill"
            cx="140"
            cy="140"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="timer-content">
          <div className="timer-digits">{formatTime(timeLeft)}</div>
          <div className="timer-status-caption">
            {isRunning ? 'In Presence' : timeLeft === 0 ? 'Complete' : 'Ready'}
          </div>
        </div>
      </div>

      {/* Segmented Presets */}
      {!isRunning && (
        <div className="segmented-presets" role="group" aria-label="Duration">
          {PRESETS.map((p) => (
            <button
              key={p.minutes}
              id={`preset-${p.minutes}`}
              className={`preset-choice ${selectedMinutes === p.minutes ? 'active' : ''}`}
              onClick={() => handleSelectPreset(p.minutes)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="controls-cluster">
        <button
          id="btn-toggle-timer"
          className="btn-still-primary"
          onClick={toggleStartPause}
        >
          {isRunning ? (
            <>
              <Pause size={16} />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>
                {timeLeft === 0 ? (
                  <>
                    <span className="desktop-text">Begin Another</span>
                    <span className="mobile-text">Begin</span>
                  </>
                ) : (
                  <>
                    <span className="desktop-text">Begin Stillness</span>
                    <span className="mobile-text">Begin</span>
                  </>
                )}
              </span>
            </>
          )}
        </button>

        <button
          id="btn-reset-timer"
          className="btn-still-icon"
          onClick={handleReset}
          title="Reset"
          aria-label="Reset timer"
        >
          <RotateCcw size={15} />
        </button>

        {isRunning && (
          <button
            id="btn-add-five"
            className="btn-still-secondary"
            onClick={handleAddFiveMinutes}
            title="Extend by 5 minutes"
          >
            <Plus size={14} />
            <span>5m</span>
          </button>
        )}

        <button
          id="btn-toggle-zen"
          className="btn-still-icon"
          onClick={() => setIsZenMode(!isZenMode)}
          title={isZenMode ? "Exit Zen Mode" : "Zen View"}
          aria-label="Toggle Zen mode"
        >
          {isZenMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      {/* Offload link */}
      <button
        id="btn-quick-brain-dump"
        className="offload-link"
        onClick={onOpenBrainDump}
        title="Offload intrusive thoughts"
      >
        <span>Racing thoughts? Offload to mind dump →</span>
      </button>
    </section>
  );
}
