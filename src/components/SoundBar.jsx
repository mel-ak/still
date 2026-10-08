import React, { useState } from 'react';
import { Volume2, VolumeX, Waves, CloudRain, Radio } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function SoundBar() {
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.35);

  const toggleSound = (type) => {
    if (activeSound === type) {
      soundEngine.stopAmbient();
      setActiveSound(null);
    } else {
      soundEngine.playAmbient(type);
      setActiveSound(type);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
  };

  const stopAll = () => {
    soundEngine.stopAmbient();
    setActiveSound(null);
  };

  return (
    <div className="still-audio-strip" role="region" aria-label="Ambient sound">
      <div className="audio-buttons-row">
        <button
          id="sound-brownian"
          className={`audio-chip ${activeSound === 'brownian' ? 'active' : ''}`}
          onClick={() => toggleSound('brownian')}
          title="Brownian Noise — Deep soft rumble"
        >
          <Waves size={13} />
          <span>Brownian</span>
        </button>

        <button
          id="sound-rain"
          className={`audio-chip ${activeSound === 'rain' ? 'active' : ''}`}
          onClick={() => toggleSound('rain')}
          title="Rainfall — Gentle steady drops"
        >
          <CloudRain size={13} />
          <span>Rain</span>
        </button>

        <button
          id="sound-drone"
          className={`audio-chip ${activeSound === 'drone' ? 'active' : ''}`}
          onClick={() => toggleSound('drone')}
          title="Harmonics — 432Hz ambient chord"
        >
          <Radio size={13} />
          <span>Harmonics</span>
        </button>
      </div>

      {activeSound && (
        <div className="audio-slider-inline">
          <input
            id="sound-volume"
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Sound volume"
          />
          <button
            type="button"
            className="nav-icon-btn"
            style={{ width: '26px', height: '26px' }}
            onClick={stopAll}
            title="Silence"
            aria-label="Silence ambient sound"
          >
            <VolumeX size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
