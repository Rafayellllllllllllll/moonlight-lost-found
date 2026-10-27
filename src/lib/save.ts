export type SaveData = {
  started: boolean; stardust: number; totalStardust: number;
  unlocked: string[]; completed: Record<string, string[]>; visitedStories: string[];
  decorations: string[]; dailyDone: string;
  settings: { music: boolean; sfx: boolean; volume: number };
};
export const SAVE_KEY = 'moonlight-lost-found-save-v1';
export const DEFAULT_SAVE: SaveData = { started: false, stardust: 40, totalStardust: 40, unlocked: ['失物招领所招牌'], completed: {}, visitedStories: [], decorations: [], dailyDone: '', settings: { music: false, sfx: true, volume: 0.6 } };
export function loadSave(): SaveData {
  try { const raw = localStorage.getItem(SAVE_KEY); if (!raw) return { ...DEFAULT_SAVE, unlocked: [...DEFAULT_SAVE.unlocked] }; const p = JSON.parse(raw) as Partial<SaveData>; return { ...DEFAULT_SAVE, ...p, unlocked: p.unlocked ?? [...DEFAULT_SAVE.unlocked], completed: p.completed ?? {}, visitedStories: p.visitedStories ?? [], decorations: p.decorations ?? [], settings: { ...DEFAULT_SAVE.settings, ...(p.settings ?? {}) } }; } catch { return { ...DEFAULT_SAVE, unlocked: [...DEFAULT_SAVE.unlocked] }; }
}
export function writeSave(s: SaveData) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch { /* 存储满时不中断游戏 */ } }
export function todayStr(): string { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
