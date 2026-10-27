import { useEffect, useRef } from 'react';
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return;
    let w = 0, h = 0, raf = 0; const stars: { x: number; y: number; r: number; p: number; s: number }[] = [];
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; stars.length = 0; for (let i = 0; i < 130; i++) stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.4, p: Math.random() * Math.PI * 2, s: 0.5 + Math.random() }); };
    resize(); window.addEventListener('resize', resize);
    let meteor = { x: -100, y: 0, vx: 0, vy: 0, life: 0 };
    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) { const a = 0.35 + 0.65 * Math.abs(Math.sin(t / 1000 * s.s + s.p)); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(232,236,255,${a})`; ctx.fill(); }
      if (meteor.life <= 0 && Math.random() < 0.004) { meteor = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.3, vx: 6, vy: 3, life: 60 }; }
      if (meteor.life > 0) { ctx.strokeStyle = 'rgba(242,220,166,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(meteor.x, meteor.y); ctx.lineTo(meteor.x - 60, meteor.y - 30); ctx.stroke(); meteor.x += meteor.vx; meteor.y += meteor.vy; meteor.life--; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="stars" aria-hidden="true" />;
}
