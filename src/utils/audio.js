// Calm Web Audio synthesizer for background ambient noise and gentle singing bowl chimes
// Zero external mp3 dependencies, 100% offline and low latency.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientNode = null;
    this.ambientGain = null;
    this.masterGain = null;
    this.currentSoundType = null;
    this.volume = 0.35;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.ambientNode) {
            try { this.ambientNode.stop(); } catch (_) {}
            try { this.ambientNode.disconnect(); } catch (_) {}
            this.ambientNode = null;
          }
          if (this.ambientGain) {
            try { this.ambientGain.disconnect(); } catch (_) {}
            this.ambientGain = null;
          }
        }, 550);
      } catch (_) {
        this.ambientNode = null;
        this.ambientGain = null;
      }
    }
    this.currentSoundType = null;
  }

  playAmbient(type) {
    this.init();
    if (this.currentSoundType === type) {
      this.stopAmbient();
      return false; // stopped
    }

    this.stopAmbient();

    setTimeout(() => {
      if (type === 'brownian') {
        this.startBrownNoise();
      } else if (type === 'rain') {
        this.startRainNoise();
      } else if (type === 'drone') {
        this.startGentleDrone();
      }
    }, 100);

    this.currentSoundType = type;
    return true; // started
  }

  startBrownNoise() {
    if (!this.ctx) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to warm deep rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.6, this.ctx.currentTime + 1.2);

    whiteNoise.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    whiteNoise.start();
    this.ambientNode = whiteNoise;
  }

  startRainNoise() {
    if (!this.ctx) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.5, this.ctx.currentTime + 1.0);

    rainSource.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    rainSource.start();
    this.ambientNode = rainSource;
  }

  startGentleDrone() {
    if (!this.ctx) return;
    // Soothing warm harmonic chord
    const freqs = [108, 162, 216]; // Root, Fifth, Octave in warm 432-series
    const oscs = freqs.map(freq => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      return osc;
    });

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 2.0);

    oscs.forEach(osc => {
      osc.connect(gain);
      osc.start();
    });

    gain.connect(this.masterGain);
    this.ambientGain = gain;
    this.ambientNode = {
      stop: () => oscs.forEach(o => { try { o.stop(); } catch(_) {} }),
      disconnect: () => oscs.forEach(o => { try { o.disconnect(); } catch(_) {} })
    };
  }

  // Plays a resonant Tibetan singing bowl chime (rich harmonics, gentle warm fade)
  playSingingBowl() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 216; // Warm calm frequency
    const harmonics = [
      { ratio: 1.0, gain: 0.5, decay: 4.5 },
      { ratio: 2.01, gain: 0.3, decay: 3.8 },
      { ratio: 3.02, gain: 0.15, decay: 2.9 },
      { ratio: 4.04, gain: 0.08, decay: 2.0 },
    ];

    harmonics.forEach(({ ratio, gain: partGain, decay }) => {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      // Subtle vibrato/beating
      osc.frequency.linearRampToValueAtTime(baseFreq * ratio + 0.8, now + decay);

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(partGain * 0.4, now + 0.08); // gentle strike
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });
  }

  // Play a soft gentle transition ping
  playSoftPing() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now); // 528 Hz calm tone
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  startSleepTimer(minutes, onFinish) {
    if (this.sleepTimerId) clearTimeout(this.sleepTimerId);
    const totalMs = minutes * 60 * 1000;
    this.sleepTimerId = setTimeout(() => {
      this.stopAmbient();
      this.sleepTimerId = null;
      if (onFinish) onFinish();
    }, totalMs);
  }

  cancelSleepTimer() {
    if (this.sleepTimerId) {
      clearTimeout(this.sleepTimerId);
      this.sleepTimerId = null;
    }
  }
}

export const soundEngine = new SoundEngine();
