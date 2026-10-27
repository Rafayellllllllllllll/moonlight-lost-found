import { useEffect, useMemo, useState } from 'react';
import Starfield from './components/Starfield';
import Puzzle from './components/Puzzles';
import { STORIES } from './data/stories';
import { ITEMS, DECORATIONS, checkHidden } from './data/collection';
import { loadSave, writeSave, todayStr, type SaveData } from './lib/save';
import { click, success, setAudioSettings, startMusic } from './lib/audio';

type Screen = 'home' | 'shop' | 'story' | 'codex' | 'daily';
type Step = 'intro' | 'inspect' | 'puzzle' | 'dialogue' | 'ending';

export default function App() {
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [screen, setScreen] = useState<Screen>('home');
  const [storyId, setStoryId] = useState(STORIES[0].id);
  const [step, setStep] = useState<Step>('intro');
  const [clues, setClues] = useState<string[]>([]);
  const [endingId, setEndingId] = useState('');
  const [toast, setToast] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState('全部');
  const [dailyRings, setDailyRings] = useState([0, 0]);
  const [dailyMsg, setDailyMsg] = useState('');

  useEffect(() => { writeSave(save); setAudioSettings(save.settings.music, save.settings.sfx, save.settings.volume); }, [save]);
  const story = useMemo(() => STORIES.find(s => s.id === storyId) || STORIES[0], [storyId]);
  const ending = story.endings.find(e => e.id === endingId);
  const unlockedCount = save.unlocked.length;
  const nextStory = STORIES.find(s => !save.completed[s.id]) || STORIES[0];

  function showToast(t: string) { setToast(t); window.setTimeout(() => setToast(''), 3200); }
  function update(p: Partial<SaveData>) { setSave(s => ({ ...s, ...p })); }
  function grant(item: string, stars: number) {
    setSave(prev => {
      let unlocked = prev.unlocked.includes(item) ? prev.unlocked : [...prev.unlocked, item];
      let completedCount = Object.keys(prev.completed).length;
      const extras = checkHidden(unlocked, completedCount);
      for (const e of extras) if (!unlocked.includes(e)) unlocked.push(e);
      if (unlocked.length >= 12 && !unlocked.includes('收藏家徽章')) unlocked.push('收藏家徽章');
      if (prev.totalStardust + stars >= 200 && !unlocked.includes('星尘满罐')) unlocked.push('星尘满罐');
      return { ...prev, unlocked, stardust: prev.stardust + stars, totalStardust: prev.totalStardust + stars };
    });
  }
  function startStory(id: string) { click(); setStoryId(id); setStep('intro'); setClues([]); setEndingId(''); setScreen('story'); if (!save.visitedStories.includes(id)) update({ visitedStories: [...save.visitedStories, id] }); }
  function finishStory() {
    if (!ending) return;
    const completed = { ...save.completed, [story.id]: Array.from(new Set([...(save.completed[story.id] || []), ending.id])) };
    update({ completed });
    grant(ending.rewardItem, ending.stardust);
    success(); showToast(`获得 ${ending.rewardItem} · +${ending.stardust} 星尘`);
    setScreen('shop');
  }
  function buyDecor(d: { id: string; cost: number }) {
    if (save.decorations.includes(d.id)) { showToast('已经布置过了'); return; }
    if (save.stardust < d.cost) { showToast(`星尘不够，还差 ${d.cost - save.stardust}`); return; }
    update({ stardust: save.stardust - d.cost, decorations: [...save.decorations, d.id] });
    grant(d.id, 0); success(); showToast(`已布置：${d.id}`);
  }
  const dailyTarget = useMemo(() => { const day = new Date().getDate(); return [((day * 60) % 360), ((day * 120) % 360)]; }, []);
  function checkDaily() {
    if (dailyRings[0] === dailyTarget[0] && dailyRings[1] === dailyTarget[1]) {
      if (save.dailyDone === todayStr()) { setDailyMsg('今天已经领过奖励了，明天再来。'); return; }
      grant('梦境水晶', 30); update({ dailyDone: todayStr() }); success(); setDailyMsg('梦境挑战完成！获得梦境水晶 +30 星尘。');
    } else { setDailyMsg('还没对齐，再转转看（提示：角度和今天的日期有关）。'); }
  }
  const filtered = ITEMS.filter(i => filter === '全部' || i.kind === filter || i.rarity === filter);

  return <div className="app">
    <Starfield />
    <div className="wrap">
      <div className="topbar">
        <div className="brand" onClick={() => setScreen('home')} style={{ cursor: 'pointer' }}>月光失物招领所<small>MOONLIGHT LOST &amp; FOUND</small></div>
        <div className="row">
          <span className="pill">✦ 星尘 <b>{save.stardust}</b></span>
          <span className="pill">图鉴 <b>{unlockedCount}/{ITEMS.length}</b></span>
          <button className="btn ghost small" onClick={() => { click(); setShowSettings(true); }}>设置</button>
        </div>
      </div>

      {screen === 'home' && <div className="fadein">
        <div className="card hero">
          <div className="kicker">午夜 · 古董店 · 失物</div>
          <h1>月光失物招领所</h1>
          <p>午夜十二点，风铃会响。访客带着一件失物走进来——每件失物背后，都有一个没说完的故事。找到线索、解开谜题、做出选择，把它们好好送回去。</p>
          <div className="row" style={{ justifyContent: 'center', marginTop: 18 }}>
            {!save.started && <button className="btn" onClick={() => { click(); startMusic(); update({ started: true }); setScreen('shop'); }}>开始新游戏</button>}
            {save.started && <button className="btn" onClick={() => { click(); setScreen('shop'); }}>继续游戏</button>}
            <button className="btn ghost" onClick={() => { click(); setScreen('codex'); }}>藏品图鉴</button>
            <button className="btn ghost" onClick={() => { click(); setScreen('daily'); }}>今日梦境挑战</button>
          </div>
          <div className="card" style={{ marginTop: 18, textAlign: 'left' }}>
            <div className="row space"><span>当前进度</span><span>{unlockedCount}/{ITEMS.length} 件 · {Object.keys(save.completed).length}/5 个故事</span></div>
            <div className="progress" style={{ marginTop: 8 }}><i style={{ width: `${Math.round(unlockedCount / ITEMS.length * 100)}%` }} /></div>
            <p className="muted" style={{ marginTop: 8 }}>下一段故事：{nextStory.title} —— {nextStory.visitorDesc}</p>
            <p className="muted">今日梦境：{save.dailyDone === todayStr() ? '已完成' : '未完成，可领 30 星尘'}</p>
          </div>
        </div>
        <div className="grid grid2" style={{ marginTop: 14 }}>
          <div className="card"><h3>怎么玩</h3><p className="muted">1. 进店接待访客 → 2. 点失物上的金色圆点找线索（至少 3 条）→ 3. 解开真实谜题 → 4. 选一句对话 → 5. 迎来不同结局、领藏品和星尘。</p></div>
          <div className="card"><h3>给新玩家</h3><p className="muted">每个谜题都有提示按钮，错了可以无限重试，不会破坏存档。进度自动存在这台设备的浏览器里，刷新后点“继续游戏”即可。</p></div>
        </div>
      </div>}

      {screen === 'shop' && <div className="fadein">
        <div className="card">
          <div className="row space"><h2>午夜古董店</h2><button className="btn ghost small" onClick={() => setScreen('home')}>← 回首页</button></div>
          <p className="muted">当前目标：{save.completed[nextStory.id] ? '继续收集其他故事的结局，或用星尘布置小店' : `接待下一位访客：${nextStory.title}`}</p>
          <div className="shop-scene" style={{ marginTop: 12 }}>
            <div className="window"><div className="moon" /></div>
            <div className="candle" style={{ left: 18 }}>🕯</div>
            {save.decorations.includes('烛光套装') && <div className="candle" style={{ left: 70 }}>🕯</div>}
            {save.decorations.includes('月光窗') && <div style={{ position: 'absolute', right: 130, top: 20, color: '#f2dca6' }}>✦ 月光更亮了</div>}
            <div className="shelf shelf2" />
            <button className="item-btn floaty" style={{ left: '10%', bottom: 132 }} onClick={() => startStory('star-bottle')}><b>星光瓶</b><span>故事一</span></button>
            <button className="item-btn" style={{ left: '32%', bottom: 132 }} onClick={() => startStory('pocket-watch')}><b>怀表</b><span>故事二</span></button>
            <button className="item-btn" style={{ left: '54%', bottom: 132 }} onClick={() => startStory('old-photo')}><b>旧照片</b><span>故事三</span></button>
            <div className="shelf" />
            <button className="item-btn" style={{ left: '18%', bottom: 32 }} onClick={() => startStory('crystal-bird')}><b>水晶鸟</b><span>故事四</span></button>
            <button className="item-btn" style={{ left: '48%', bottom: 32 }} onClick={() => startStory('moon-shadow')}><b>月亮</b><span>故事五</span></button>
            <button className="item-btn" style={{ right: '8%', bottom: 32 }} onClick={() => setScreen('codex')}><b>图鉴柜</b><span>{unlockedCount} 件</span></button>
          </div>
          {save.decorations.length > 0 && <p className="muted">已布置：{save.decorations.join('、')}</p>}
        </div>
        <div className="grid" style={{ marginTop: 14 }}>
          {STORIES.map(s => <div className="card" key={s.id}>
            <div className="row space"><div><b>{s.title}</b><p className="muted">{s.visitor} · {s.visitorDesc}</p></div><button className="btn small" onClick={() => startStory(s.id)}>{save.completed[s.id] ? '再玩一次' : '接待访客'}</button></div>
            {save.completed[s.id] && <p><span className="tag">已完成结局：{save.completed[s.id].length} / {s.endings.length}</span></p>}
          </div>)}
          <div className="card"><h3>用星尘布置小店</h3><div className="grid grid2">{DECORATIONS.map(d => <div key={d.id} style={{ border: '1px solid #ffffff22', borderRadius: 12, padding: 12 }}><b>{d.id}</b><p className="muted">{d.desc} · {d.cost} 星尘</p><button className="btn small" disabled={save.decorations.includes(d.id)} onClick={() => buyDecor(d)}>{save.decorations.includes(d.id) ? '已布置' : '兑换布置'}</button></div>)}</div></div>
        </div>
      </div>}

      {screen === 'story' && <div className="fadein">
        <div className="card">
          <div className="row space"><button className="btn ghost small" onClick={() => setScreen('shop')}>← 回商店</button><span className="pill">目标：{step === 'intro' ? '读完访客的故事' : step === 'inspect' ? `找线索 ${clues.length}/3（至少 3 条）` : step === 'puzzle' ? '解开谜题' : step === 'dialogue' ? '选择一句对话' : '领取结局奖励'}</span></div>
          <h2 style={{ marginTop: 14 }}>{story.title}</h2>
          <p className="muted">{story.visitor} · {story.visitorDesc}</p>
          {step === 'intro' && <><p style={{ lineHeight: 1.9 }}>{story.intro}</p><button className="btn" style={{ marginTop: 12 }} onClick={() => { click(); setStep('inspect'); }}>仔细观察失物 →</button></>}
          {step === 'inspect' && <><p className="muted">点失物上的金色圆点找线索。已找到 {clues.length} 条，至少 3 条才能进入谜题。</p>
            <div style={{ position: 'relative', height: 240, borderRadius: 16, background: 'radial-gradient(circle at 50% 40%,#3b2a6b,#141033)', border: '1px solid #d8b36a55', marginTop: 10 }}>
              <div className="floaty" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: 64 }}>{story.art}</div>
              <div style={{ position: 'absolute', left: '50%', top: '78%', transform: 'translateX(-50%)' }}>{story.itemName}</div>
              {story.clues.map(c => <button key={c.id} className={`clue-dot ${clues.includes(c.id) ? 'found' : ''}`} style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%,-50%)' }} onClick={() => { click(); if (!clues.includes(c.id)) setClues([...clues, c.id]); }}>{clues.includes(c.id) ? '✓' : '?'}</button>)}
            </div>
            <ul className="list" style={{ marginTop: 12 }}>{story.clues.filter(c => clues.includes(c.id)).map(c => <li key={c.id}><b>{c.label}</b><p className="muted">{c.detail}</p></li>)}</ul>
            <button className="btn" style={{ marginTop: 12 }} disabled={clues.length < 3} onClick={() => { click(); setStep('puzzle'); }}>{clues.length < 3 ? `再找 ${3 - clues.length} 条线索` : '进入谜题 →'}</button></>}
          {step === 'puzzle' && <><h3>{story.puzzleTitle}</h3><Puzzle story={story} onSolved={() => setStep('dialogue')} /></>}
          {step === 'dialogue' && <><p style={{ lineHeight: 1.9 }}>{story.dialogueIntro}</p><div className="grid">{story.choices.map(ch => <button key={ch.id} className="btn ghost" style={{ textAlign: 'left', padding: 14 }} onClick={() => { click(); setEndingId(ch.endingId); setStep('ending'); }}>{ch.text}<span className="muted" style={{ display: 'block' }}>你的倾向：{ch.note}</span></button>)}</div></>}
          {step === 'ending' && ending && <><h3>{ending.title}</h3><p style={{ lineHeight: 1.9 }}>{ending.text}</p><p>奖励：<b>{ending.rewardItem}</b> · +{ending.stardust} 星尘</p><button className="btn" onClick={finishStory}>领取奖励，回到商店</button></>}
        </div>
      </div>}

      {screen === 'codex' && <div className="fadein">
        <div className="card">
          <div className="row space"><h2>藏品图鉴</h2><button className="btn ghost small" onClick={() => setScreen('home')}>← 回首页</button></div>
          <p className="muted">已收集 {unlockedCount} / {ITEMS.length} 件 · 完成度 {Math.round(unlockedCount / ITEMS.length * 100)}%</p>
          <div className="progress"><i style={{ width: `${unlockedCount / ITEMS.length * 100}%` }} /></div>
          <div className="row" style={{ marginTop: 12 }}>{['全部', '故事', '隐藏', '装饰', '梦境', '普通', '稀有', '史诗', '传说'].map(f => <button key={f} className={filter === f ? 'btn small' : 'btn ghost small'} onClick={() => { click(); setFilter(f); }}>{f}</button>)}</div>
          <ul className="list" style={{ marginTop: 12 }}>{filtered.map(it => { const has = save.unlocked.includes(it.id); return <li key={it.id} style={{ opacity: has ? 1 : 0.75 }}><div className="row space"><b>{has ? `${it.art} ${it.name}` : '？？？ 未解锁的藏品'}</b><span className={`rarity-${it.rarity}`}>{it.rarity} · {it.kind}</span></div>{has ? <p className="muted">{it.desc}</p> : <p className="muted">解锁条件：{it.how}</p>}{has && <p className="muted">获得方式：{it.how}</p>}</li>; })}</ul>
          <div className="card" style={{ marginTop: 12 }}><h3>故事完成记录</h3>{STORIES.map(s => <p key={s.id} className="muted">{s.title}：{save.completed[s.id] ? `${save.completed[s.id].length}/${s.endings.length} 个结局` : '未完成'}</p>)}</div>
        </div>
      </div>}

      {screen === 'daily' && <div className="fadein">
        <div className="card">
          <div className="row space"><h2>今日梦境挑战</h2><button className="btn ghost small" onClick={() => setScreen('home')}>← 回首页</button></div>
          <p className="muted">每天一个小星盘：旋转两环对齐今天的星座，奖励梦境水晶 +30 星尘（每天限领一次）。</p>
          <svg viewBox="0 0 300 300" style={{ width: '100%', maxWidth: 340, display: 'block', margin: '10px auto' }}>{[120, 70].map((r, i) => <g key={r} transform={`rotate(${dailyRings[i]} 150 150)`}><circle cx="150" cy="150" r={r} fill="none" stroke="#d8b36a" /><circle cx="150" cy={150 - r} r="8" fill={dailyRings[i] === dailyTarget[i] ? '#8fe3b8' : '#f2dca6'} /></g>)}</svg>
          <div className="row">{dailyRings.map((r, i) => <button key={i} className="btn ghost small" onClick={() => { click(); const n = [...dailyRings]; n[i] = (n[i] + 60) % 360; setDailyRings(n); }}>{i === 0 ? '外环' : '内环'}：{r}°</button>)}<button className="btn" onClick={checkDaily}>检查今日星盘</button></div>
          {dailyMsg && <p style={{ marginTop: 10 }}>{dailyMsg}</p>}
        </div>
      </div>}

      {showSettings && <div className="modal" onClick={() => setShowSettings(false)}><div className="card" onClick={e => e.stopPropagation()}>
        <div className="row space"><h2>设置</h2><button className="btn ghost small" onClick={() => setShowSettings(false)}>关闭</button></div>
        <p className="muted">声音需要你在页面上点一下才能开始（浏览器不允许自动播放）。点“开始音乐”后，背景音乐才会响起。</p>
        <label><input type="checkbox" checked={save.settings.music} onChange={e => update({ settings: { ...save.settings, music: e.target.checked } })} /> 背景音乐</label><br />
        <label><input type="checkbox" checked={save.settings.sfx} onChange={e => update({ settings: { ...save.settings, sfx: e.target.checked } })} /> 交互音效</label>
        <label style={{ display: 'block', marginTop: 12 }}>音量：{Math.round(save.settings.volume * 100)}%<input type="range" min="0" max="1" step="0.1" value={save.settings.volume} onChange={e => update({ settings: { ...save.settings, volume: Number(e.target.value) } })} /></label>
        <div className="row" style={{ marginTop: 12 }}><button className="btn small" onClick={() => { startMusic(); showToast('音乐已开始（如果浏览器允许）'); }}>开始音乐</button><button className="btn ghost small" onClick={() => { if (window.confirm('确定要清空全部存档，重新开始吗？')) { localStorage.clear(); location.reload(); } }}>清空存档重开</button></div>
        <p className="muted" style={{ marginTop: 10 }}>存档位置：本设备浏览器 localStorage（键名 moonlight-lost-found-save-v1）。</p>
      </div></div>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  </div>;
}
