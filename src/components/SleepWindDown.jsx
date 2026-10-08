import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, Volume2, VolumeX, Radio, CloudRain, Check, Clock, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function SleepWindDown({ 
  onSaveBedtimeThought, 
  onLogSleepWin, 
  onShowToast 
}) {
  const [bedtime, setBedtime] = useState(() => {
    return localStorage.getItem('still_bedtime_target') || '23:00';
  });
  const [wakeTime, setWakeTime] = useState(() => {
    return localStorage.getItem('still_waketime_target') || '07:00';
  });

  const [isEditingTimes, setIsEditingTimes] = useState(false);
  const [isWindDownActive, setIsWindDownActive] = useState(false);
  const [windDownMinutes, setWindDownMinutes] = useState(45);
  const [windDownRemaining, setWindDownRemaining] = useState(45 * 60);

  // Bedtime mind dump input
  const [nightThought, setNightThought] = useState('');

  // Sleep soundscape state
  const [sleepSound, setSleepSound] = useState(null); // 'drone' | 'rain'
  const [sleepDuration, setSleepDuration] = useState(30); // 15 | 30 | 45 min
  const [isSleepSoundPlaying, setIsSleepSoundPlaying] = useState(false);

  // Save target times
  const handleSaveTimes = () => {
    localStorage.setItem('still_bedtime_target', bedtime);
    localStorage.setItem('still_waketime_target', wakeTime);
    setIsEditingTimes(false);
    onShowToast("Sleep window saved.");
  };

  // Wind-down timer tick
  useEffect(() => {
    let interval = null;
    if (isWindDownActive) {
      interval = setInterval(() => {
        setWindDownRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsWindDownActive(false);
            soundEngine.playSoftPing();
            onLogSleepWin();
            onShowToast("Wind-down complete. Time to rest.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWindDownActive, onLogSleepWin, onShowToast]);

  const toggleWindDown = (mins) => {
    if (isWindDownActive) {
      setIsWindDownActive(false);
    } else {
      setWindDownMinutes(mins);
      setWindDownRemaining(mins * 60);
      setIsWindDownActive(true);
      onLogSleepWin();
      onShowToast(`${mins}-minute wind-down begun.`);
    }
  };

  // Sleep sound toggle
  const handleToggleSleepSound = (type) => {
    if (sleepSound === type && isSleepSoundPlaying) {
      soundEngine.stopAmbient();
      soundEngine.cancelSleepTimer();
      setIsSleepSoundPlaying(false);
      setSleepSound(null);
    } else {
      soundEngine.playAmbient(type);
      soundEngine.startSleepTimer(sleepDuration, () => {
        setIsSleepSoundPlaying(false);
        setSleepSound(null);
      });
      setSleepSound(type);
      setIsSleepSoundPlaying(true);
      onShowToast(`Playing ${type === 'drone' ? 'Harmonics' : 'Night Rain'} for ${sleepDuration}m`);
    }
  };

  // Submit bedtime mind dump
  const handleSaveBedtimeDump = () => {
    if (!nightThought.trim()) return;
    onSaveBedtimeThought(nightThought.trim());
    onLogSleepWin();
    onShowToast("Thought parked safely. Let tomorrow wait.");
    setNightThought('');
  };

  const formatMinsSecs = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section className="panel sleep-sanctuary" aria-label="Sleep Wind-Down Sanctuary">
      {/* Header */}
      <div className="sleep-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="sleep-icon-mark">
            <Moon size={16} />
          </div>
          <div>
            <h2 className="sleep-title">Sleep Wind-Down</h2>
            <p className="sleep-subtitle">The biggest lever for focus &amp; clear thinking</p>
          </div>
        </div>

        <button
          className="nav-link-btn"
          style={{ fontSize: '0.78rem' }}
          onClick={() => setIsEditingTimes(!isEditingTimes)}
        >
          <Clock size={13} />
          <span>{isEditingTimes ? 'Cancel' : 'Edit Window'}</span>
        </button>
      </div>

      {/* Target Sleep Window Card */}
      <div className="sleep-window-card">
        {isEditingTimes ? (
          <div className="sleep-window-edit-row">
            <div className="time-input-group">
              <label>Target Bedtime</label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="time-field"
              />
            </div>
            <div className="time-input-group">
              <label>Wake-up Target</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="time-field"
              />
            </div>
            <button className="btn-still-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.82rem' }} onClick={handleSaveTimes}>
              Save
            </button>
          </div>
        ) : (
          <div className="sleep-window-display-row">
            <div>
              <div className="sleep-target-label">Protected Window</div>
              <div className="sleep-target-val">
                {bedtime} <span>bedtime</span> → {wakeTime} <span>wake</span>
              </div>
            </div>
            <div className="sleep-consistency-pill">
              Consistency over perfect hours
            </div>
          </div>
        )}
      </div>

      {/* Wind-Down Timer Controls */}
      <div className="wind-down-box">
        <div className="wind-down-prompt">
          30–45 min before bed: dim lights, put phone on grayscale or in another room, avoid intense scrolling.
        </div>

        {isWindDownActive ? (
          <div className="wind-down-active-state">
            <div className="wind-down-countdown">
              {formatMinsSecs(windDownRemaining)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Wind-down in progress · Unwind and dim surroundings
            </div>
            <button
              className="btn-still-secondary"
              onClick={() => setIsWindDownActive(false)}
            >
              End Wind-Down
            </button>
          </div>
        ) : (
          <div className="wind-down-choices">
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Start wind-down:</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn-still-secondary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                onClick={() => toggleWindDown(30)}
              >
                30 Minutes
              </button>
              <button
                className="btn-still-primary"
                style={{ padding: '0.45rem 1.25rem', fontSize: '0.82rem' }}
                onClick={() => toggleWindDown(45)}
              >
                45 Minutes (Recommended)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bedtime Mind Dump */}
      <div className="bedtime-dump-box">
        <div className="bedtime-dump-header">
          <label htmlFor="bedtime-thought-input" className="journal-label" style={{ marginBottom: 0 }}>
            Bedtime Mind Dump
          </label>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            If your mind races, offload it here
          </span>
        </div>

        <div className="bedtime-dump-input-row">
          <input
            id="bedtime-thought-input"
            type="text"
            className="intention-field"
            style={{ textAlign: 'left', fontSize: '0.9rem', padding: '0.5rem 0' }}
            placeholder="What is tomorrow demanding? Write it and release it..."
            value={nightThought}
            onChange={(e) => setNightThought(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveBedtimeDump();
            }}
          />
          <button
            className="btn-still-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', flexShrink: 0 }}
            onClick={handleSaveBedtimeDump}
            disabled={!nightThought.trim()}
          >
            <span>Park</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Sleep Audio & Auto-off Timer */}
      <div className="sleep-sound-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Sleep Soundscape
          </span>
          {isSleepSoundPlaying && (
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
              Auto-off in {sleepDuration}m
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              className={`audio-chip ${sleepSound === 'drone' && isSleepSoundPlaying ? 'active' : ''}`}
              onClick={() => handleToggleSleepSound('drone')}
            >
              <Radio size={13} />
              <span>432Hz Drone</span>
            </button>

            <button
              className={`audio-chip ${sleepSound === 'rain' && isSleepSoundPlaying ? 'active' : ''}`}
              onClick={() => handleToggleSleepSound('rain')}
            >
              <CloudRain size={13} />
              <span>Night Rain</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Timer:</span>
            {[15, 30, 45].map((mins) => (
              <button
                key={mins}
                className={`preset-choice ${sleepDuration === mins ? 'active' : ''}`}
                style={{ padding: '0.2rem 0.55rem', fontSize: '0.74rem' }}
                onClick={() => setSleepDuration(mins)}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
