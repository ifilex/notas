import { SoundEffect } from '../types';

class RetroAudioManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Lazy initialized on first user interaction
    const saved = localStorage.getItem('win311_sound_enabled');
    if (saved !== null) {
      this.soundEnabled = saved === 'true';
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    localStorage.setItem('win311_sound_enabled', String(enabled));
  }

  private getContext(): AudioContext | null {
    if (!this.soundEnabled) return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public play(effect: SoundEffect) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      switch (effect) {
        case 'tada': {
          // Iconic Windows 3.1 TADA synth brass arpeggio: C4, E4, G4, C5 (held)
          const notes = [
            { freq: 261.63, start: 0.0, dur: 0.12 },
            { freq: 329.63, start: 0.12, dur: 0.12 },
            { freq: 392.00, start: 0.24, dur: 0.14 },
            { freq: 523.25, start: 0.38, dur: 0.7 },
            { freq: 659.25, start: 0.38, dur: 0.7 },
            { freq: 783.99, start: 0.38, dur: 0.7 },
          ];

          notes.forEach(({ freq, start, dur }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + start);

            gain.gain.setValueAtTime(0.001, now + start);
            gain.gain.exponentialRampToValueAtTime(0.18, now + start + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + start);
            osc.stop(now + start + dur + 0.05);
          });
          break;
        }

        case 'ding': {
          // Windows 3.1 DING: Crisp high sine bell
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1046.5, now); // C6

          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.65);
          break;
        }

        case 'chord': {
          // Windows 3.1 CHORD: E maj chord (E4, G#4, B4, E5)
          const freqs = [329.63, 415.30, 493.88, 659.25];
          freqs.forEach((f) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.85);
          });
          break;
        }

        case 'chimes': {
          // Windows 3.1 CHIMES: High descending sparkling notes
          const chimeNotes = [2093.0, 1760.0, 1567.98, 1318.51, 1046.5];
          chimeNotes.forEach((freq, idx) => {
            const startTime = now + idx * 0.08;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + 0.45);
          });
          break;
        }

        case 'stop': {
          // Critical Stop / Error: Dual dissonant square wave
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'square';
          osc2.type = 'sawtooth';
          osc1.frequency.setValueAtTime(140, now);
          osc2.frequency.setValueAtTime(147, now);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.4);
          osc2.stop(now + 0.4);
          break;
        }

        case 'asterisk': {
          // Dual beep
          [0, 0.1].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now + delay);
            gain.gain.setValueAtTime(0.15, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + 0.09);
          });
          break;
        }

        case 'click': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'save':
        case 'open': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(effect === 'save' ? 587.33 : 440, now);
          osc.frequency.exponentialRampToValueAtTime(effect === 'save' ? 880 : 659.25, now + 0.12);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }
      }
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }
}

export const retroAudio = new RetroAudioManager();
