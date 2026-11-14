// Web Audio API pure synthetic sound generator (offline, zero-latency, zero external dependencies)
let audioCtx = null;

/**
 * Initializes and unlocks AudioContext reliably across modern browsers (Chrome, Edge, Safari, Firefox)
 */
const getAudioContext = async () => {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.debug('Failed to initialize AudioContext:', e);
    return null;
  }
};

// Global user interaction audio unlocker for mobile and strict autoplay browser policies
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass && !audioCtx) {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch {}
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
}

export const isSoundEnabled = () => {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem('queueflow_sound_enabled');
  return val === null ? true : val === 'true';
};

export const setSoundEnabled = (enabled) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('queueflow_sound_enabled', enabled ? 'true' : 'false');
};

/**
 * Dual-tone harmonic chime for CALL NEXT dispatch
 * Frequencies: 659.25 Hz (E5) -> 880 Hz (A5)
 */
export const playCallNextChime = async () => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.04;

    // Tone 1: 659.25 Hz (E5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.linearRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.4, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.001, now + 0.65);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.65);
  } catch (err) {
    console.debug('Call next chime error:', err);
  }
};

/**
 * Affirmative completion chime for COMPLETE SERVICE
 * Triad chord: 523.25 Hz (C5) + 659.25 Hz (E5) + 783.99 Hz (G5)
 */
export const playCompleteChime = async () => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.04;

    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.32, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.45);
    });
  } catch (err) {
    console.debug('Complete chime error:', err);
  }
};

/**
 * Subtle confirmation chime for ticket creation / actions
 */
export const playTicketChime = async () => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = await getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.03;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime?.(659.25, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (err) {
    console.debug('Ticket chime error:', err);
  }
};
