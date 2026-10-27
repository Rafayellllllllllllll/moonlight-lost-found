let ctx: AudioContext | null = null;
let musicTimer: number | null = null;
let musicOn = false; let sfxOn = true; let vol = 0.6;
export function setAudioSettings(m: boolean, s: boolean, v: number) { musicOn = m; sfxOn = s; vol = v; if (!m) stopMusic(); else if (m) startMusic(); }
function ac(): AudioContext { if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(); if (ctx.state === 'suspended') void ctx.resume(); return ctx; }
export function tone(freq: number, dur = 0.25, type: OscillatorType = 'sine', delay = 0) {
  if (!sfxOn) return; try { const c = ac(); const o = c.createOscillator(); const g = c.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0.0001, c.currentTime + delay); g.gain.exponentialRampToValueAtTime(0.18 * vol + 0.001, c.currentTime + delay + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + dur); o.connect(g); g.connect(c.destination); o.start(c.currentTime + delay); o.stop(c.currentTime + delay + dur + 0.05); } catch { /* 音频不可用时静默 */ }
}
export const click = () => tone(660, 0.08, 'triangle');
export const success = () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.35, 'sine', i * 0.12)); };
export const fail = () => { tone(220, 0.25, 'sawtooth'); tone(180, 0.3, 'sawtooth', 0.15); };
export function startMusic() {
  if (musicTimer !== null || !musicOn) return;
  const notes = [392, 440, 523, 659, 523, 440];
  let i = 0;
  musicTimer = window.setInterval(() => { if (!musicOn) return; try { const c = ac(); const o = c.createOscillator(); const g = c.createGain(); o.type = 'sine'; o.frequency.value = notes[i % notes.length]; g.gain.setValueAtTime(0.0001, c.currentTime); g.gain.exponentialRampToValueAtTime(0.05 * vol + 0.001, c.currentTime + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.4); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 1.5); } catch { /* ignore */ } i++; }, 1500);
}
export function stopMusic() { if (musicTimer !== null) { clearInterval(musicTimer); musicTimer = null; } }
