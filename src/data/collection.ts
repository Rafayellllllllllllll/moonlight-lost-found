export type Item = { id: string; name: string; rarity: '普通' | '稀有' | '史诗' | '传说'; desc: string; how: string; art: string; kind: '故事' | '隐藏' | '装饰' | '梦境' };
export const ITEMS: Item[] = [
  { id: '许愿星瓶', name: '许愿星瓶', rarity: '史诗', desc: '说出口的愿望会变成一颗小星星。', how: '完成故事一，选择许愿结局', art: '✦', kind: '故事' },
  { id: '寄放的星灯', name: '寄放的星灯', rarity: '稀有', desc: '一盏不会熄灭的小灯，等主人长大。', how: '完成故事一，选择寄放结局', art: '✧', kind: '故事' },
  { id: '重新走动的怀表', name: '重新走动的怀表', rarity: '史诗', desc: '滴答声重新响起，时间开始向前。', how: '完成故事二，选择向前结局', art: '◷', kind: '故事' },
  { id: '车站的旧车票', name: '车站的旧车票', rarity: '稀有', desc: '11:47，车站，勿忘。', how: '完成故事二，选择留住记忆结局', art: '▭', kind: '故事' },
  { id: '补全的全家福', name: '补全的全家福', rarity: '史诗', desc: '那天，我们都在。', how: '完成故事三，选择补全结局', art: '▦', kind: '故事' },
  { id: '糖纸书签', name: '糖纸书签', rarity: '普通', desc: '记得味道，也是一种记得。', how: '完成故事三，选择留白结局', art: '✿', kind: '故事' },
  { id: '会唱歌的水晶鸟', name: '会唱歌的水晶鸟', rarity: '传说', desc: '它终于唱出了第一句歌。', how: '完成故事四，选择分享结局', art: '♫', kind: '故事' },
  { id: '晨光音符', name: '晨光音符', rarity: '稀有', desc: '只唱给你听的一句轻歌。', how: '完成故事四，选择私密结局', art: '♪', kind: '故事' },
  { id: '有影子的月亮', name: '有影子的月亮', rarity: '史诗', desc: '影子不是消失，是等光。', how: '完成故事五，选择留下结局', art: '☾', kind: '故事' },
  { id: '旅人的月光灯', name: '旅人的月光灯', rarity: '稀有', desc: '走到哪里，月亮都不孤单。', how: '完成故事五，选择同行结局', art: '☽', kind: '故事' },
  { id: '银河钥匙', name: '银河钥匙', rarity: '传说', desc: '星瓶与月亮相遇时，悄悄出现的一把钥匙。', how: '隐藏组合：同时拥有许愿星瓶与有影子的月亮', art: '⚿', kind: '隐藏' },
  { id: '时光信封', name: '时光信封', rarity: '传说', desc: '怀表与全家福放在一起，就会收到一封旧信。', how: '隐藏组合：同时拥有重新走动的怀表与补全的全家福', art: '✉', kind: '隐藏' },
  { id: '夜莺羽毛', name: '夜莺羽毛', rarity: '稀有', desc: '水晶鸟唱歌那晚，掉在窗台上的一根羽毛。', how: '隐藏组合：同时拥有会唱歌的水晶鸟与晨光音符', art: '❦', kind: '隐藏' },
  { id: '店主的旧钥匙', name: '店主的旧钥匙', rarity: '传说', desc: '完成全部五个故事后，店主交给你的钥匙。', how: '隐藏：完成全部 5 个故事', art: '🔑', kind: '隐藏' },
  { id: '烛光套装', name: '烛光套装', rarity: '普通', desc: '让古董店的夜晚更暖一点。', how: '在商店用 60 星尘兑换装饰', art: '🕯', kind: '装饰' },
  { id: '月光窗', name: '月光窗', rarity: '稀有', desc: '一扇永远对着月亮的窗。', how: '在商店用 120 星尘兑换装饰', art: '▣', kind: '装饰' },
  { id: '星尘地毯', name: '星尘地毯', rarity: '稀有', desc: '踩上去会泛起一点点星光。', how: '在商店用 90 星尘兑换装饰', art: '▬', kind: '装饰' },
  { id: '古董风铃', name: '古董风铃', rarity: '普通', desc: '访客进门时，会轻轻响一声。', how: '在商店用 40 星尘兑换装饰', art: '🎐', kind: '装饰' },
  { id: '梦境水晶', name: '梦境水晶', rarity: '稀有', desc: '今日梦境挑战的奖励。', how: '完成一次今日梦境挑战', art: '◆', kind: '梦境' },
  { id: '午夜访客徽章', name: '午夜访客徽章', rarity: '普通', desc: '你已经接待过第一位访客。', how: '完成任意 1 个故事', art: '✪', kind: '梦境' },
  { id: '收藏家徽章', name: '收藏家徽章', rarity: '史诗', desc: '图鉴收集超过一半的证明。', how: '图鉴解锁达到 12 件', art: '✦', kind: '梦境' },
  { id: '星尘满罐', name: '星尘满罐', rarity: '普通', desc: '攒下的星尘装满了一小罐。', how: '累计获得 200 星尘', art: '⚱', kind: '梦境' },
  { id: '失物招领所招牌', name: '失物招领所招牌', rarity: '普通', desc: '挂在门口的招牌，写着：失物，皆可寻回。', how: '开始新游戏即获得', art: '⌂', kind: '装饰' },
  { id: '午夜茶杯', name: '午夜茶杯', rarity: '普通', desc: '店主请访客喝的热茶，杯沿有月亮纹。', how: '累计接待 3 位访客（完成 3 个故事）', art: '☕', kind: '梦境' },
];
export const DECORATIONS = [
  { id: '烛光套装', cost: 60, desc: '店里多了一排暖烛光' },
  { id: '古董风铃', cost: 40, desc: '门口多了一串风铃' },
  { id: '星尘地毯', cost: 90, desc: '地面泛起星光' },
  { id: '月光窗', cost: 120, desc: '窗外月亮更亮了' },
];
export function checkHidden(unlocked: string[], completedCount: number): string[] {
  const has = (x: string) => unlocked.includes(x);
  const out: string[] = [];
  if (has('许愿星瓶') && has('有影子的月亮')) out.push('银河钥匙');
  if (has('重新走动的怀表') && has('补全的全家福')) out.push('时光信封');
  if (has('会唱歌的水晶鸟') && has('晨光音符')) out.push('夜莺羽毛');
  if (completedCount >= 5) out.push('店主的旧钥匙');
  if (completedCount >= 1) out.push('午夜访客徽章');
  if (unlocked.length >= 12 || out.length > 0) { /* badge check handled by caller count */ }
  if (completedCount >= 3) out.push('午夜茶杯');
  return out;
}
