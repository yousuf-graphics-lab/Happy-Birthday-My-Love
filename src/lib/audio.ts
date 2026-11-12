// ---------------------------------------------------------------------------
// Audio Engine — original ambient music + sound effects, synthesized live
// with the Web Audio API. No external audio files are required.
//
// Design notes:
//  - Music never starts before the first user interaction (browser policy
//    and the experience design both require it).
//  - Music + SFX have separate gain controls with smooth transitions.
//  - Preferences persist in localStorage.
//  - Audio suspends when the tab is hidden and resumes when visible.
// ---------------------------------------------------------------------------

export type SfxName =
  | "sparkle"
  | "envelope"
  | "blow"
  | "celebration"
  | "bloom"
  | "chime"
  | "click";

type AudioPreferences = {
  music: boolean;
  sfx: boolean;
  musicVolume: number;
  sfxVolume: number;
};

const PREFS_KEY = "samiya-audio-prefs";

const DEFAULT_PREFS: AudioPreferences = {
  music: true,
  sfx: true,
  musicVolume: 0.55,
  sfxVolume: 0.8,
};

// Frequencies (Hz) for the romantic pad progression: Am – F – C – G
const PAD_CHORDS: number[][] = [
  [220.0, 261.63, 329.63, 440.0], // Am
  [174.61, 220.0, 261.63, 349.23], // F
  [261.63, 329.63, 392.0, 523.25], // C
  [196.0, 246.94, 293.66, 392.0], // G
];

// Gentle pentatonic arpeggio notes for the music box layer.
const ARPEGGIO: number[] = [
  523.25, 587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33,
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private arpStep = 0;
  private chordIndex = 0;
  private nextArpTime = 0;
  private musicVoices: OscillatorNode[] = [];
  private musicStarted = false;

  private prefs: AudioPreferences = DEFAULT_PREFS;
  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window !== "undefined") {
      this.prefs = this.loadPrefs();
    }
  }

  // -- preferences ----------------------------------------------------------

  private loadPrefs(): AudioPreferences {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
    return DEFAULT_PREFS;
  }

  private savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(this.prefs));
    } catch {
      /* ignore */
    }
  }

  getPreferences() {
    return { ...this.prefs };
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // -- context lifecycle ---------------------------------------------------

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 1;
      this.master.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.prefs.music ? this.prefs.musicVolume : 0;
      this.musicGain.connect(this.master);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.prefs.sfx ? this.prefs.sfxVolume : 0;
      this.sfxGain.connect(this.master);
    }
    return this.ctx;
  }

  /** Must be called from a user gesture. */
  unlock() {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
  }

  // -- music ---------------------------------------------------------------

  startMusic() {
    if (this.musicStarted) return;
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") void ctx.resume();
    this.musicStarted = true;
    this.chordIndex = 0;
    this.arpStep = 0;
    this.nextArpTime = ctx.currentTime + 0.2;
    this.startPad();
    this.musicTimer = setInterval(() => this.scheduleArp(), 40);
    this.applyMusicGain();
  }

  stopMusic() {
    if (!this.musicStarted) return;
    this.musicStarted = false;
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    this.stopPad();
    this.applyMusicGain();
  }

  private applyMusicGain() {
    if (!this.musicGain || !this.ctx) return;
    const target =
      this.musicStarted && this.prefs.music ? this.prefs.musicVolume : 0;
    const now = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
    this.musicGain.gain.linearRampToValueAtTime(target, now + 1.2);
  }

  private applySfxGain() {
    if (!this.sfxGain || !this.ctx) return;
    const target = this.prefs.sfx ? this.prefs.sfxVolume : 0;
    const now = this.ctx.currentTime;
    this.sfxGain.gain.cancelScheduledValues(now);
    this.sfxGain.gain.setValueAtTime(this.sfxGain.gain.value, now);
    this.sfxGain.gain.linearRampToValueAtTime(target, now + 0.4);
  }

  // Slow detuned sine pad — one oscillator pair per chord tone.
  private startPad() {
    if (!this.ctx || !this.musicGain) return;
    const ctx = this.ctx;
    const chord = PAD_CHORDS[this.chordIndex % PAD_CHORDS.length];
    const now = ctx.currentTime;
    const padOut = ctx.createGain();
    padOut.gain.value = 0;
    padOut.gain.linearRampToValueAtTime(0.16, now + 2.5);
    padOut.gain.setValueAtTime(0.16, now + 16);
    padOut.gain.linearRampToValueAtTime(0, now + 18.5);
    padOut.connect(this.musicGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.6;
    filter.connect(padOut);

    chord.forEach((freq, i) => {
      [0, 1].forEach((detune, k) => {
        const osc = ctx.createOscillator();
        osc.type = k === 0 ? "sine" : "triangle";
        osc.frequency.value = freq;
        osc.detune.value = detune === 0 ? -4 : 5;
        const g = ctx.createGain();
        g.gain.value = 0.5 / chord.length;
        osc.connect(g);
        g.connect(filter);
        osc.start(now);
        osc.stop(now + 19);
        this.musicVoices.push(osc);
      });
      void i;
    });

    // Crossfade into the next chord before this one fades out.
    setTimeout(() => {
      this.chordIndex++;
      if (this.musicStarted) this.startPad();
    }, 16000);
  }

  private stopPad() {
    this.musicVoices.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    });
    this.musicVoices = [];
  }

  // Music-box arpeggio, scheduled ahead of time for sample-accurate timing.
  private scheduleArp() {
    if (!this.ctx || !this.musicGain || !this.musicStarted) return;
    const ctx = this.ctx;
    const lookahead = 0.1;
    while (this.nextArpTime < ctx.currentTime + lookahead) {
      const note = ARPEGGIO[this.arpStep % ARPEGGIO.length];
      this.playArpNote(note, this.nextArpTime);
      this.nextArpTime += 0.42;
      this.arpStep++;
    }
  }

  private playArpNote(freq: number, time: number) {
    if (!this.ctx || !this.musicGain) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = freq * 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.05, time + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.9);
    const pan = ctx.createStereoPanner();
    pan.pan.value = (Math.sin(this.arpStep * 0.7) * 0.35);
    osc.connect(g);
    osc2.connect(g);
    g.connect(pan);
    pan.connect(this.musicGain);
    osc.start(time);
    osc2.start(time);
    osc.stop(time + 1);
    osc2.stop(time + 1);
  }

  // -- sound effects --------------------------------------------------------

  playSfx(name: SfxName) {
    if (!this.prefs.sfx) return;
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") void ctx.resume();
    if (!this.sfxGain) return;
    switch (name) {
      case "sparkle":
        this.sparkle(ctx);
        break;
      case "envelope":
        this.envelope(ctx);
        break;
      case "blow":
        this.blow(ctx);
        break;
      case "celebration":
        this.celebration(ctx);
        break;
      case "bloom":
        this.bloom(ctx);
        break;
      case "chime":
        this.chime(ctx);
        break;
      case "click":
        this.click(ctx);
        break;
    }
  }

  private env(
    ctx: AudioContext,
    gain: GainNode,
    peak: number,
    attack: number,
    decay: number,
    time: number
  ) {
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(peak, time + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + attack + decay);
  }

  private sparkle(ctx: AudioContext) {
    const time = ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const freq = 1318.5 + Math.random() * 700;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      this.env(ctx, g, 0.09, 0.005, 0.35 + Math.random() * 0.2, time + i * 0.04);
      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 0.8 - 0.4;
      osc.connect(g);
      g.connect(pan);
      pan.connect(this.sfxGain!);
      osc.start(time + i * 0.04);
      osc.stop(time + i * 0.04 + 0.7);
    }
  }

  private envelope(ctx: AudioContext) {
    const time = ctx.currentTime;
    // Soft paper rustle: filtered noise sweep.
    const noise = this.noiseBuffer(ctx, 0.6);
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(400, time);
    bp.frequency.exponentialRampToValueAtTime(1800, time + 0.4);
    bp.Q.value = 0.8;
    const g = ctx.createGain();
    this.env(ctx, g, 0.12, 0.05, 0.5, time);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.sfxGain!);
    src.start(time);
    src.stop(time + 0.7);
    // Sealing wax crack: short noise burst + low thump.
    const src2 = ctx.createBufferSource();
    src2.buffer = this.noiseBuffer(ctx, 0.15);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const g2 = ctx.createGain();
    this.env(ctx, g2, 0.2, 0.005, 0.12, time + 0.45);
    src2.connect(lp);
    lp.connect(g2);
    g2.connect(this.sfxGain!);
    src2.start(time + 0.45);
    src2.stop(time + 0.7);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(160, time + 0.45);
    osc.frequency.exponentialRampToValueAtTime(70, time + 0.6);
    const g3 = ctx.createGain();
    this.env(ctx, g3, 0.15, 0.005, 0.2, time + 0.45);
    osc.connect(g3);
    g3.connect(this.sfxGain!);
    osc.start(time + 0.45);
    osc.stop(time + 0.75);
  }

  private blow(ctx: AudioContext) {
    const time = ctx.currentTime;
    // Breath: filtered noise with a downward sweep.
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(ctx, 0.5);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(2600, time);
    bp.frequency.exponentialRampToValueAtTime(500, time + 0.4);
    bp.Q.value = 1.2;
    const g = ctx.createGain();
    this.env(ctx, g, 0.14, 0.05, 0.45, time);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.sfxGain!);
    src.start(time);
    src.stop(time + 0.6);
  }

  private celebration(ctx: AudioContext) {
    const time = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      this.env(ctx, g, 0.08, 0.01, 0.9, time + i * 0.09);
      const pan = ctx.createStereoPanner();
      pan.pan.value = (i - 2) * 0.2;
      osc.connect(g);
      g.connect(pan);
      pan.connect(this.sfxGain!);
      osc.start(time + i * 0.09);
      osc.stop(time + i * 0.09 + 1.1);
    });
    setTimeout(() => this.sparkle(ctx), 350);
  }

  private bloom(ctx: AudioContext) {
    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, time);
    osc.frequency.exponentialRampToValueAtTime(880, time + 0.4);
    const g = ctx.createGain();
    this.env(ctx, g, 0.07, 0.05, 0.6, time);
    osc.connect(g);
    g.connect(this.sfxGain!);
    osc.start(time);
    osc.stop(time + 0.8);
    setTimeout(() => this.sparkle(ctx), 120);
  }

  private chime(ctx: AudioContext) {
    const time = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      this.env(ctx, g, 0.07, 0.01, 2.2, time + i * 0.06);
      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(time + i * 0.06);
      osc.stop(time + i * 0.06 + 2.5);
    });
  }

  private click(ctx: AudioContext) {
    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 880;
    const g = ctx.createGain();
    this.env(ctx, g, 0.05, 0.003, 0.08, time);
    osc.connect(g);
    g.connect(this.sfxGain!);
    osc.start(time);
    osc.stop(time + 0.15);
  }

  private noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // -- controls -------------------------------------------------------------

  setMusicEnabled(enabled: boolean) {
    this.prefs.music = enabled;
    this.savePrefs();
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    this.emit();
  }

  setSfxEnabled(enabled: boolean) {
    this.prefs.sfx = enabled;
    this.savePrefs();
    this.applySfxGain();
    this.emit();
  }

  setMusicVolume(v: number) {
    this.prefs.musicVolume = v;
    this.savePrefs();
    this.applyMusicGain();
    this.emit();
  }

  setSfxVolume(v: number) {
    this.prefs.sfxVolume = v;
    this.savePrefs();
    this.applySfxGain();
    this.emit();
  }

  // -- visibility -----------------------------------------------------------

  suspend() {
    if (this.ctx && this.ctx.state === "running") {
      void this.ctx.suspend();
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended" && this.musicStarted) {
      void this.ctx.resume();
    }
  }
}

export const audioEngine = new AudioEngine();
