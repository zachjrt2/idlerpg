// ============================================================================
// AEGIS ENDLESS - HIGH-FIDELITY RETRO AUDIO & SYNTHESIZER ENGINE (SFX + BGM)
// ============================================================================

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
    this.limiter = null;

    // Volume Levels (0.0 to 1.0)
    const savedSfx = localStorage.getItem('aegis_sfx_vol');
    const savedBgm = localStorage.getItem('aegis_bgm_vol');
    const savedSfxEn = localStorage.getItem('aegis_sfx_enabled');
    const savedBgmEn = localStorage.getItem('aegis_bgm_enabled');

    this.sfxVolume = savedSfx !== null ? parseFloat(savedSfx) : 0.7;
    this.bgmVolume = savedBgm !== null ? parseFloat(savedBgm) : 0.4;
    this.sfxEnabled = savedSfxEn !== null ? savedSfxEn === 'true' : true;
    this.bgmEnabled = savedBgmEn !== null ? savedBgmEn === 'true' : true;

    this.lastPlayed = {};
    this.soundCache = {};

    // BGM Sequencer State
    this.bgmRunning = false;
    this.bgmTimer = null;
    this.bgmStep = 0;

    // Ambient Fantasy Chords (Am - F - C - G)
    this.chordProgression = [
      { root: 220.00, chord: [220.00, 261.63, 329.63, 440.00] }, // A minor (A3, C4, E4, A4)
      { root: 174.61, chord: [174.61, 220.00, 261.63, 349.23] }, // F major (F3, A3, C4, F4)
      { root: 130.81, chord: [261.63, 329.63, 392.00, 523.25] }, // C major (C4, E4, G4, C5)
      { root: 196.00, chord: [196.00, 246.94, 293.66, 392.00] }  // G major (G3, B3, D4, G4)
    ];

    // Listen for first interaction to unlock audio
    const unlockAudio = () => {
      this.initContext();
      if (this.bgmEnabled && !this.bgmRunning) {
        this.startBgm();
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        
        // Master Dynamics Compressor (Limiter)
        this.limiter = this.ctx.createDynamicsCompressor();
        this.limiter.threshold.setValueAtTime(-12, this.ctx.currentTime);
        this.limiter.knee.setValueAtTime(8, this.ctx.currentTime);
        this.limiter.ratio.setValueAtTime(12, this.ctx.currentTime);
        this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.limiter.release.setValueAtTime(0.15, this.ctx.currentTime);

        // Master Volume Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.65, this.ctx.currentTime);

        // SFX Sub-Channel Gain
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxVolume : 0, this.ctx.currentTime);

        // BGM Sub-Channel Gain
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.bgmEnabled ? this.bgmVolume : 0, this.ctx.currentTime);

        // Routing:
        // SFX -> sfxGain -> limiter -> masterGain -> destination
        // BGM -> bgmGain -> masterGain -> destination
        this.sfxGain.connect(this.limiter);
        this.limiter.connect(this.masterGain);

        this.bgmGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Set SFX Volume (0.0 to 1.0)
  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('aegis_sfx_vol', this.sfxVolume);
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
  }

  // Set BGM Volume (0.0 to 1.0)
  setBgmVolume(vol) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('aegis_bgm_vol', this.bgmVolume);
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmEnabled ? this.bgmVolume : 0, this.ctx.currentTime);
    }
  }

  // Toggle SFX
  toggleSfx(enabled = null) {
    this.sfxEnabled = enabled !== null ? enabled : !this.sfxEnabled;
    localStorage.setItem('aegis_sfx_enabled', this.sfxEnabled);
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
    return this.sfxEnabled;
  }

  // Toggle BGM
  toggleBgm(enabled = null) {
    this.bgmEnabled = enabled !== null ? enabled : !this.bgmEnabled;
    localStorage.setItem('aegis_bgm_enabled', this.bgmEnabled);
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmEnabled ? this.bgmVolume : 0, this.ctx.currentTime);
    }
    if (this.bgmEnabled && !this.bgmRunning) {
      this.startBgm();
    } else if (!this.bgmEnabled && this.bgmRunning) {
      this.stopBgm();
    }
    return this.bgmEnabled;
  }

  // Start procedural 16-bit ambient fantasy BGM loop
  startBgm() {
    this.initContext();
    if (!this.ctx || this.bgmRunning) return;
    this.bgmRunning = true;
    this.bgmStep = 0;

    const stepIntervalMs = 280; // ~107 BPM 16th notes

    const bgmTick = () => {
      if (!this.bgmRunning || !this.ctx) return;
      this.playBgmStep(this.bgmStep);
      this.bgmStep = (this.bgmStep + 1) % 64;
      this.bgmTimer = setTimeout(bgmTick, stepIntervalMs);
    };

    bgmTick();
  }

  stopBgm() {
    this.bgmRunning = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // Procedural BGM Step Synthesizer
  playBgmStep(step) {
    if (!this.bgmEnabled || !this.ctx || this.bgmVolume <= 0) return;
    const now = this.ctx.currentTime;
    const chordIndex = Math.floor(step / 16) % this.chordProgression.length;
    const curChord = this.chordProgression[chordIndex];
    const subStep = step % 16;

    // 1. Warm Triangle Bassline on Beat 0, 6, 8, 12
    if (subStep === 0 || subStep === 6 || subStep === 8 || subStep === 12) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      bassOsc.type = 'triangle';
      const rootFreq = curChord.root / 2; // Sub octave
      bassOsc.frequency.setValueAtTime(rootFreq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);

      const dur = subStep === 0 ? 0.35 : 0.22;
      bassGain.gain.setValueAtTime(0.24, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(this.bgmGain);

      bassOsc.start(now);
      bassOsc.stop(now + dur);
    }

    // 2. Ambient Sine Arpeggio / Chime Notes
    const arpHarmonics = [0, 1, 2, 3, 2, 1, 3, 1];
    const noteIdx = arpHarmonics[subStep % arpHarmonics.length];
    const arpFreq = curChord.chord[noteIdx];

    if (subStep % 2 === 0 && arpFreq) {
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      arpOsc.type = 'sine';
      arpOsc.frequency.setValueAtTime(arpFreq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);

      arpGain.gain.setValueAtTime(0.08, now);
      arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      arpOsc.connect(filter);
      filter.connect(arpGain);
      arpGain.connect(this.bgmGain);

      arpOsc.start(now);
      arpOsc.stop(now + 0.24);
    }
  }

  // Pre-load custom audio samples (WAV / MP3 / OGG)
  async loadCustomSample(key, url) {
    try {
      this.initContext();
      if (!this.ctx) return;
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.soundCache[key] = audioBuffer;
    } catch (e) {
      // Fallback silently to procedural synth
    }
  }

  // Play pre-loaded audio sample if available
  playSample(key, volume = 0.5) {
    if (!this.sfxEnabled || !this.soundCache[key]) return false;
    this.initContext();
    if (!this.ctx) return false;

    const source = this.ctx.createBufferSource();
    source.buffer = this.soundCache[key];

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

    source.connect(gainNode);
    gainNode.connect(this.sfxGain || this.limiter || this.ctx.destination);
    source.start();
    return true;
  }

  // Throttle helper to avoid cacophony during high attack speeds
  shouldThrottle(key, minIntervalMs = 90) {
    const now = performance.now();
    const last = this.lastPlayed[key] || 0;
    if (now - last < minIntervalMs) return true;
    this.lastPlayed[key] = now;
    return false;
  }

  // Generate white noise buffer for realistic impacts and whooshes
  createNoiseBuffer(duration = 0.2) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Crisp Sword Slash / Swish with noise filter
  playSlash() {
    if (!this.sfxEnabled || this.shouldThrottle('slash', 80)) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Air Whoosh (Bandpass Filtered Noise)
    const noiseBuffer = this.createNoiseBuffer(0.12);
    if (noiseBuffer) {
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1400, now);
      bandpass.frequency.exponentialRampToValueAtTime(320, now + 0.1);
      bandpass.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.22, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      noiseSource.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.sfxGain || this.limiter);

      noiseSource.start(now);
      noiseSource.stop(now + 0.1);
    }

    // 2. Subtle Low Impact Thud (Sine drop)
    const thudOsc = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(120, now);
    thudOsc.frequency.exponentialRampToValueAtTime(38, now + 0.08);

    thudGain.gain.setValueAtTime(0.25, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    thudOsc.connect(thudGain);
    thudGain.connect(this.sfxGain || this.limiter);
    thudOsc.start(now);
    thudOsc.stop(now + 0.08);
  }

  // Heavy Critical Hit / Shatter Impact
  playCrit() {
    if (!this.sfxEnabled || this.shouldThrottle('crit', 110)) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Deep Sub-Bass Impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.22);

    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain || this.limiter);
    subOsc.start(now);
    subOsc.stop(now + 0.22);

    // High Impact Crunch (Filtered Noise)
    const noiseBuffer = this.createNoiseBuffer(0.18);
    if (noiseBuffer) {
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.16);
      filter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain || this.limiter);
      noiseSource.start(now);
      noiseSource.stop(now + 0.16);
    }
  }

  // Soft Liquid Bubble / Acid Drip for Poison
  playPoisonTick() {
    if (!this.sfxEnabled || this.shouldThrottle('poison', 140)) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain || this.limiter);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Crisp Warm Coin Chime (Major 3rd Bell)
  playGold() {
    if (!this.sfxEnabled || this.shouldThrottle('gold', 70)) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const pitchJitter = 1 + (Math.random() * 0.06 - 0.03);
    const baseFreqs = [1318.51 * pitchJitter, 1760.00 * pitchJitter];

    baseFreqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = now + (i * 0.035);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, delay);

      gain.gain.setValueAtTime(0.14, delay);
      gain.gain.exponentialRampToValueAtTime(0.001, delay + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.limiter);
      osc.start(delay);
      osc.stop(delay + 0.14);
    });
  }

  // Triumphant Level-Up Fanfare
  playLevelUp() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, t: 0.00 }, // C5
      { f: 659.25, t: 0.07 }, // E5
      { f: 783.99, t: 0.14 }, // G5
      { f: 1046.50, t: 0.22 } // C6
    ];

    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + n.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, start);

      gain.gain.setValueAtTime(0.22, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.limiter);
      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

  // Arcane Transmutation / Forge Swirl
  playFuse() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [329.63, 440.00, 554.37, 659.25, 880.00];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + (idx * 0.05);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, start + 0.25);

      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.38);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.limiter);
      osc.start(start);
      osc.stop(start + 0.38);
    });
  }

  // Subdued Defeat Rumble
  playDefeat() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [220, 185, 138.59, 110];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + (idx * 0.1);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, start + 0.25);

      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.limiter);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  }
}


