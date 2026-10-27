import { useMemo, useState } from 'react';
import type { Story } from '../data/stories';
import { click, fail, success, tone } from '../lib/audio';

function Hint({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return <div><button className="btn ghost small" onClick={() => { click(); setShow(!show); }}>{show ? '收起提示' : '需要提示？'}</button>{show && <p className="muted">💡 {text}</p>}</div>;
}
function Result({ ok, msg, onSolved }: { ok: boolean | null; msg: string; onSolved: () => void }) {
  if (ok === null) return null;
  return <div className="card" style={{ marginTop: 12, borderColor: ok ? '#8fe3b8' : '#ff9a8a' }}>
    <p>{msg}</p>
    {ok && <button className="btn" onClick={() => { success(); onSolved(); }}>继续剧情 →</button>}
  </div>;
}

function StarPuzzle({ story, onSolved }: { story: Story; onSolved: () => void }) {
  const [rings, setRings] = useState([0, 0, 0]); const [ok, setOk] = useState<boolean | null>(null); const [msg, setMsg] = useState(''); const [tries, setTries] = useState(0);
  const target = [60, 180, 300];
  const check = () => { if (rings.every((r, i) => r === target[i])) { setOk(true); setMsg('星盘对齐了！星光重新聚成星座。'); success(); } else { setOk(false); setTries(tries + 1); setMsg(`还没对齐（第 ${tries + 1} 次尝试）。亮起的环越多越接近，再转转看。`); fail(); } };
  return <div>
    <p className="muted">点下面的按钮旋转每一环。目标：内环 60°、中环 180°、外环 300°（提示里有完整答案，卡住就看提示）。</p>
    <svg viewBox="0 0 300 300" style={{ width: '100%', maxWidth: 380, display: 'block', margin: '0 auto' }}>
      {[130, 95, 60].map((r, i) => <g key={r} transform={`rotate(${rings[i]} 150 150)`}><circle cx="150" cy="150" r={r} fill="none" stroke="#d8b36a" strokeOpacity=".6" /><circle cx="150" cy={150 - r} r="7" fill={rings[i] === target[i] ? '#8fe3b8' : '#f2dca6'} /><circle cx={150 + r * 0.7} cy={150 - r * 0.7} r="4" fill="#e8ecff" /></g>)}
      <circle cx="150" cy="150" r="10" fill="#f2dca6" />
    </svg>
    <div className="row">{rings.map((r, i) => <button key={i} className="btn ghost small" onClick={() => { click(); const n = [...rings]; n[i] = (n[i] + 60) % 360; setRings(n); setOk(null); }}>{['内环', '中环', '外环'][i]}：{r}°（点我旋转）</button>)}</div>
    <div className="row" style={{ marginTop: 10 }}><button className="btn" onClick={check}>检查星盘</button><Hint text={story.puzzleHint} /></div>
    <Result ok={ok} msg={msg} onSolved={onSolved} />
  </div>;
}

function WatchPuzzle({ story, onSolved }: { story: Story; onSolved: () => void }) {
  const [hour, setHour] = useState(12); const [min, setMin] = useState(0); const [gear, setGear] = useState(''); const [ok, setOk] = useState<boolean | null>(null); const [msg, setMsg] = useState('');
  const check = () => { if (hour === 11 && min === 47 && gear === '铜+银') { setOk(true); setMsg('滴答、滴答——怀表重新走动了！'); success(); } else { setOk(false); setMsg('还没完全对：时间应为 11:47，齿轮应为铜+银。再对照线索调整。'); fail(); } };
  const ha = ((hour % 12) + min / 60) * 30 - 90; const ma = min * 6 - 90;
  return <div>
    <svg viewBox="0 0 200 200" style={{ width: 220, display: 'block', margin: '0 auto' }}><circle cx="100" cy="100" r="90" fill="#1d214f" stroke="#d8b36a" strokeWidth="4" /><line x1="100" y1="100" x2={100 + 50 * Math.cos(ha * Math.PI / 180)} y2={100 + 50 * Math.sin(ha * Math.PI / 180)} stroke="#f2dca6" strokeWidth="6" strokeLinecap="round" /><line x1="100" y1="100" x2={100 + 75 * Math.cos(ma * Math.PI / 180)} y2={100 + 75 * Math.sin(ma * Math.PI / 180)} stroke="#fff" strokeWidth="3" strokeLinecap="round" /><circle cx="100" cy="100" r="6" fill="#d8b36a" /></svg>
    <p style={{ textAlign: 'center' }}>当前时间：{hour}:{String(min).padStart(2, '0')}</p>
    <div className="row"><button className="btn ghost small" onClick={() => { click(); setHour(hour === 1 ? 12 : hour - 1); }}>时针 -1</button><button className="btn ghost small" onClick={() => { click(); setHour(hour === 12 ? 1 : hour + 1); }}>时针 +1</button><button className="btn ghost small" onClick={() => { click(); setMin((min + 59) % 60); }}>分针 -1</button><button className="btn ghost small" onClick={() => { click(); setMin((min + 1) % 60); }}>分针 +1</button></div>
    <p style={{ marginTop: 14 }}>选择齿轮组合：</p>
    <div className="row">{['铜+银', '铜+铜', '银+银', '铁+铜'].map(g => <button key={g} className={gear === g ? 'btn small' : 'btn ghost small'} onClick={() => { click(); setGear(g); }}>{g}</button>)}</div>
    <div className="row" style={{ marginTop: 12 }}><button className="btn" onClick={check}>上弦并检查</button><Hint text={story.puzzleHint} /></div>
    <Result ok={ok} msg={msg} onSolved={onSolved} />
  </div>;
}

function PhotoPuzzle({ story, onSolved }: { story: Story; onSolved: () => void }) {
  const [board, setBoard] = useState<number[]>([2, 5, 0, 7, 1, 8, 3, 6, 4]);
  const [sel, setSel] = useState<number | null>(null); const [hiddenFound, setHiddenFound] = useState(false);
  const solved = board.every((v, i) => v === i);
  const tap = (i: number) => { click(); if (sel === null) setSel(i); else { const n = [...board]; [n[sel], n[i]] = [n[i], n[sel]]; setBoard(n); setSel(null); } };
  return <div>
    <p className="muted">点一块碎片，再点另一块交换位置。碎片上的图案拼成完整的月亮纹时即拼对（数字是碎片编号，拼对后数字会按 1–9 顺序排列）。手机点按即可，也支持反复重试。</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, maxWidth: 360 }}>
      {board.map((v, i) => <button key={i} className={`tile ${sel === i ? 'sel' : ''}`} onClick={() => tap(i)}>{v + 1}<span style={{ fontSize: 11, display: 'block' }}>{['月', '亮', '下', '的', '家', '人', '笑', '着', '站'][v]}</span></button>)}
    </div>
    {solved && !hiddenFound && <div className="card" style={{ marginTop: 12 }}><p>拼好了！现在找隐藏细节：点右下角的放大镜。</p><button className="btn" onClick={() => { success(); setHiddenFound(true); }}>🔍 点这里：右下角隐藏签名</button></div>}
    {hiddenFound && <Result ok={true} msg="找到了！碎片角落藏着一行小字：“站远一点也能拍到。”照片完整了。" onSolved={onSolved} />}
    <div style={{ marginTop: 12 }}><Hint text={story.puzzleHint} /></div>
  </div>;
}

const NOTES = [{ n: '哆', f: 523 }, { n: '来', f: 587 }, { n: '咪', f: 659 }, { n: '索', f: 784 }, { n: '拉', f: 880 }];
const SEQS = [[0, 2, 4], [1, 3, 0, 2], [4, 2, 1, 3, 0]];
function BirdPuzzle({ story, onSolved }: { story: Story; onSolved: () => void }) {
  const [level, setLevel] = useState(0); const [input, setInput] = useState<number[]>([]); const [lit, setLit] = useState<number | null>(null); const [playing, setPlaying] = useState(false); const [msg, setMsg] = useState('先点“播放旋律”，仔细听，再按顺序点音符。');
  const play = () => { if (playing) return; setPlaying(true); setInput([]); setMsg('正在播放，请记住顺序…'); SEQS[level].forEach((n, i) => { window.setTimeout(() => { setLit(n); tone(NOTES[n].f, 0.5); }, i * 650); window.setTimeout(() => setLit(null), i * 650 + 500); }); window.setTimeout(() => { setPlaying(false); setMsg('轮到你了，按顺序点音符。'); }, SEQS[level].length * 650 + 200); };
  const tapNote = (n: number) => { if (playing) return; click(); tone(NOTES[n].f, 0.4); const next = [...input, n]; setInput(next); const seq = SEQS[level]; if (next[next.length - 1] !== seq[next.length - 1]) { fail(); setMsg('这个音不对，再听一遍，重新来。'); setInput([]); return; } if (next.length === seq.length) { if (level === 2) { success(); setMsg('三关全部通过！水晶鸟唱出来了。'); window.setTimeout(onSolved, 900); } else { success(); setMsg(`第 ${level + 1} 关通过！进入下一关。`); setLevel(level + 1); setInput([]); } } };
  return <div>
    <p className="muted">{msg}</p>
    <div className="row" style={{ margin: '14px 0' }}>{NOTES.map((nt, i) => <button key={nt.n} className={`note ${lit === i ? 'lit' : ''}`} onClick={() => tapNote(i)}>{nt.n}</button>)}</div>
    <p>第 {level + 1} / 3 关 · 本关 {SEQS[level].length} 个音 · 已点 {input.length} 个</p>
    <div className="row"><button className="btn" onClick={play} disabled={playing}>▶ 播放旋律</button><Hint text={story.puzzleHint} /></div>
  </div>;
}

function MoonPuzzle({ story, onSolved }: { story: Story; onSolved: () => void }) {
  const [light, setLight] = useState(30); const [mirror, setMirror] = useState(20); const [block, setBlock] = useState(20); const [ok, setOk] = useState<boolean | null>(null); const [msg, setMsg] = useState('');
  const good = light >= 55 && light <= 75 && mirror >= 35 && mirror <= 50 && block >= 60 && block <= 80;
  const check = () => { if (good) { setOk(true); setMsg('光束正好落在金色圆圈里，月亮的影子回来了！'); success(); } else { setOk(false); const tips: string[] = []; if (light < 55) tips.push('光源角度偏小，往大调'); if (light > 75) tips.push('光源角度偏大，往小调'); if (mirror < 35) tips.push('镜面角度偏小'); if (mirror > 50) tips.push('镜面角度偏大'); if (block < 60) tips.push('遮挡物往右移'); if (block > 80) tips.push('遮挡物往左移'); setMsg('还没照亮：' + tips.join('；') + '。'); fail(); } };
  const beamX = 30 + light; const beamY = 150 - mirror;
  return <div>
    <svg viewBox="0 0 300 180" style={{ width: '100%', maxWidth: 460, background: '#0d1233', borderRadius: 14, border: '1px solid #d8b36a55' }}>
      <line x1="20" y1="20" x2={beamX} y2={beamY} stroke="#f2dca6" strokeWidth="4" strokeOpacity=".9" />
      <line x1={beamX} y1={beamY} x2={beamX + block} y2={beamY + 20} stroke="#f2dca6" strokeWidth="3" strokeDasharray="6 4" />
      <circle cx="240" cy="120" r={good ? 26 : 20} fill={good ? '#f2dca6' : 'none'} stroke="#d8b36a" strokeWidth="2" />
      <text x="240" y="125" textAnchor="middle" fill={good ? '#241a08' : '#f2dca6'} fontSize="13">目标</text>
      <text x="20" y="16" fill="#e8ecff" fontSize="12">光源</text>
    </svg>
    <label>光源角度：{light}°<input type="range" min="0" max="180" value={light} onChange={e => setLight(Number(e.target.value))} /></label>
    <label>镜面角度：{mirror}°<input type="range" min="0" max="90" value={mirror} onChange={e => setMirror(Number(e.target.value))} /></label>
    <label>遮挡位置：{block}<input type="range" min="0" max="100" value={block} onChange={e => setBlock(Number(e.target.value))} /></label>
    <div className="row" style={{ marginTop: 12 }}><button className="btn" onClick={check}>检查光路</button><Hint text={story.puzzleHint} /></div>
    <Result ok={ok} msg={msg} onSolved={onSolved} />
  </div>;
}

export default function Puzzle({ story, onSolved }: { story: Story; onSolved: () => void }) {
  const body = useMemo(() => story.id, [story.id]);
  void body;
  if (story.id === 'star-bottle') return <StarPuzzle story={story} onSolved={onSolved} />;
  if (story.id === 'pocket-watch') return <WatchPuzzle story={story} onSolved={onSolved} />;
  if (story.id === 'old-photo') return <PhotoPuzzle story={story} onSolved={onSolved} />;
  if (story.id === 'crystal-bird') return <BirdPuzzle story={story} onSolved={onSolved} />;
  return <MoonPuzzle story={story} onSolved={onSolved} />;
}
