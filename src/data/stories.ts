export type Clue = { id: string; label: string; detail: string; x: number; y: number };
export type Ending = { id: string; title: string; text: string; rewardItem: string; stardust: number };
export type Choice = { id: string; text: string; endingId: string; note: string };
export type Story = {
  id: string; title: string; visitor: string; visitorDesc: string; itemName: string; art: string;
  intro: string; clues: Clue[]; puzzleTitle: string; puzzleHint: string;
  dialogueIntro: string; choices: Choice[]; endings: Ending[];
};
export const STORIES: Story[] = [
  {
    id: 'star-bottle', title: '故事一：遗失星光的玻璃瓶', visitor: '戴星星发夹的小女孩', visitorDesc: '她抱着空瓶子，眼里还留着一场夏夜的梦。',
    itemName: '遗失星光的玻璃瓶', art: '✦ 瓶',
    intro: '午夜的风铃响了。小女孩把一个空玻璃瓶放在柜台上：“我把星星装进去，可是它们跑了。”瓶底还残留着一点点银色的光。',
    clues: [
      { id: 'c1', label: '瓶底的银光', detail: '瓶底有一层薄薄的银粉，形状像北斗七星的一角。星星不是消失了，是散开了。', x: 50, y: 72 },
      { id: 'c2', label: '瓶塞上的刻痕', detail: '软木塞上刻着三个小点：每次转动星盘，要先对准最亮的那颗星。', x: 50, y: 18 },
      { id: 'c3', label: '瓶身的旧标签', detail: '标签写着“给不敢许愿的人”。原来她一直没说出自己的愿望。', x: 72, y: 45 },
      { id: 'c4', label: '瓶口的风声', detail: '把瓶子靠近耳边，能听见很轻的风声——星星在等一个方向。', x: 28, y: 38 },
    ],
    puzzleTitle: '星盘谜题：旋转三层星盘', puzzleHint: '目标角度是：内环 60°、中环 180°、外环 300°。先对准最亮的星，再转其余两环。',
    dialogueIntro: '星盘亮起后，瓶子里重新聚起星光。小女孩看着你，轻声问：',
    choices: [
      { id: 'wish', text: '“把愿望说出来吧，我陪你一起许愿。”', endingId: 'wish', note: '温柔的陪伴' },
      { id: 'keep', text: '“星光先寄放在店里，等你准备好了再来取。”', endingId: 'keep', note: '克制的守护' },
    ],
    endings: [
      { id: 'wish', title: '结局：说出口的愿望', text: '她说：“我想让妈妈不再那么累。”星光轻轻一颤，化作一颗会发光的小星星，落在她的发夹上。', rewardItem: '许愿星瓶', stardust: 60 },
      { id: 'keep', title: '结局：寄放的星光', text: '她把瓶子留在店里，约定长大一点再来取。店里的灯从此多了一盏不会熄灭的小灯。', rewardItem: '寄放的星灯', stardust: 50 },
    ],
  },
  {
    id: 'pocket-watch', title: '故事二：停在午夜的怀表', visitor: '穿旧大衣的老人', visitorDesc: '他把怀表放在手心，像捧着一段不肯走的时间。',
    itemName: '停在午夜的怀表', art: '◷ 表',
    intro: '老人说，怀表在他儿子出门那天停了。他不是想让时间倒流，只是想听它再走一次。表盖内侧有一行小字。',
    clues: [
      { id: 'c1', label: '表盖内侧小字', detail: '“十一时四十七分，车站，勿忘。”这就是怀表最后记住的时刻。', x: 50, y: 28 },
      { id: 'c2', label: '齿轮的咬合', detail: '铜齿轮要配银齿轮才能平稳转动，两个同样的齿轮会卡住。', x: 30, y: 62 },
      { id: 'c3', label: '表链的磨损', detail: '表链最亮的一节，是被握得最多的地方——等待的人，一直握着它。', x: 72, y: 55 },
      { id: 'c4', label: '停住的秒针', detail: '秒针停在 12 上，像在等一声“出发”。', x: 50, y: 48 },
    ],
    puzzleTitle: '怀表谜题：调准时间与齿轮', puzzleHint: '把时针调到 11，分针调到 47，并选择“铜齿轮 + 银齿轮”。',
    dialogueIntro: '怀表重新滴答作响。老人沉默了一会儿，问你：',
    choices: [
      { id: 'forward', text: '“让它从现在开始走，不要再停在过去。”', endingId: 'forward', note: '向前走' },
      { id: 'memory', text: '“把它停在 11:47 也很好，那是你们的约定。”', endingId: 'memory', note: '留住记忆' },
    ],
    endings: [
      { id: 'forward', title: '结局：重新开始走的时间', text: '老人把表戴回胸前，脚步轻了一点。他说，明天要去车站，给儿子打一个电话。', rewardItem: '重新走动的怀表', stardust: 60 },
      { id: 'memory', title: '结局：被好好记住的时刻', text: '老人把怀表收进内袋，像收起一封信。他说，有些时刻不需要走完，只要被记住就够了。', rewardItem: '车站的旧车票', stardust: 50 },
    ],
  },
  {
    id: 'old-photo', title: '故事三：缺失人物的旧照片', visitor: '抱着相册的少女', visitorDesc: '照片里有一块空白，像有人被轻轻擦掉了。',
    itemName: '缺失人物的旧照片', art: '▦ 照片',
    intro: '少女说，这是全家最后一次合影，但照片右下角少了一个人。她不记得那是谁，只记得那天有人给她买了糖。',
    clues: [
      { id: 'c1', label: '空白处的边缘', detail: '空白边缘有淡淡的衣角轮廓，那个人站在最边上，个子不高。', x: 72, y: 68 },
      { id: 'c2', label: '背面的字迹', detail: '背面写着：“糖很甜，站远一点也能拍到。”', x: 28, y: 30 },
      { id: 'c3', label: '碎片的背面花纹', detail: '碎片背面有连续的花纹，拼对了才能看到完整的月亮纹。', x: 50, y: 50 },
      { id: 'c4', label: '相纸的气味', detail: '相纸还留着一点点糖的甜味，说明那个人离她很近。', x: 60, y: 20 },
    ],
    puzzleTitle: '照片谜题：拼好 3×3 碎片并找到隐藏细节', puzzleHint: '点一块碎片，再点一个空格把它放过去；拼对后点右下角的放大镜找隐藏签名。',
    dialogueIntro: '照片拼好后，空白处浮现出一个模糊又温柔的身影。少女问：',
    choices: [
      { id: 'name', text: '“把这张照片重新命名为：我们都在。”', endingId: 'name', note: '补全' },
      { id: 'blank', text: '“留一点空白也没关系，记得糖的味道就好。”', endingId: 'blank', note: '留白' },
    ],
    endings: [
      { id: 'name', title: '结局：我们都在', text: '她在照片背面补写了一行字：那天，我们都在。照片不再缺人了。', rewardItem: '补全的全家福', stardust: 60 },
      { id: 'blank', title: '结局：糖的味道', text: '她把照片放回相册，空白处贴了一颗糖纸。她说，记得味道，也是一种记得。', rewardItem: '糖纸书签', stardust: 50 },
    ],
  },
  {
    id: 'crystal-bird', title: '故事四：不会唱歌的水晶鸟', visitor: '提着鸟笼的少年', visitorDesc: '水晶鸟很美，只是从出生起就没有唱过歌。',
    itemName: '不会唱歌的水晶鸟', art: '♫ 鸟',
    intro: '少年说，水晶鸟每天张开翅膀，却发不出声音。他怀疑它把歌忘在了某个地方，或者，从来没人教它第一句。',
    clues: [
      { id: 'c1', label: '鸟腹的水晶纹', detail: '鸟腹有五道纹路，对应五个音：哆、来、咪、索、拉。', x: 50, y: 55 },
      { id: 'c2', label: '笼子的旧乐谱', detail: '乐谱的第一句很短，只有三个音，是练习用的开头。', x: 25, y: 35 },
      { id: 'c3', label: '鸟眼的反光', detail: '它看着月亮的时候，眼睛会亮一下——它喜欢月亮升起时的调子。', x: 62, y: 30 },
      { id: 'c4', label: '羽毛的轻响', detail: '风吹过羽毛时有很轻的“叮”声，像在提示下一个音。', x: 40, y: 70 },
    ],
    puzzleTitle: '水晶音符谜题：听旋律，依次点对音符', puzzleHint: '点“播放旋律”听一遍，再按同样顺序点水晶音符。共三关，音越来越长。',
    dialogueIntro: '水晶鸟终于唱出了第一句歌。少年眼睛亮了，问你：',
    choices: [
      { id: 'sing', text: '“让它唱给所有人听吧。”', endingId: 'sing', note: '分享' },
      { id: 'quiet', text: '“先只唱给你一个人听，也很好。”', endingId: 'quiet', note: '私密' },
    ],
    endings: [
      { id: 'sing', title: '结局：唱给夜空听', text: '水晶鸟飞到窗边，对着整条街唱了一首短歌。路过的猫都停下来听了一会儿。', rewardItem: '会唱歌的水晶鸟', stardust: 60 },
      { id: 'quiet', title: '结局：只唱给你听', text: '它只在少年耳边唱了一句很轻的歌。少年说，这就够了，以后每天早上再唱一句。', rewardItem: '晨光音符', stardust: 50 },
    ],
  },
  {
    id: 'moon-shadow', title: '故事五：没有影子的月亮', visitor: '披着斗篷的旅人', visitorDesc: '他带来一个月亮摆件，可它在灯下居然没有影子。',
    itemName: '没有影子的月亮', art: '☾ 月',
    intro: '旅人说，月亮的影子丢在了一面旧镜子里。他走过很多地方，影子却一直没跟上来。',
    clues: [
      { id: 'c1', label: '镜面的旧划痕', detail: '镜面划痕指向一个方向：光要从左上方斜着照过来。', x: 30, y: 30 },
      { id: 'c2', label: '底座的刻度', detail: '底座刻度显示，镜面角度在 35° 到 50° 之间最稳。', x: 50, y: 75 },
      { id: 'c3', label: '遮挡物的位置', detail: '遮挡物不能完全挡住光，留一条缝，影子才会出现。', x: 70, y: 50 },
      { id: 'c4', label: '月亮摆件的背面', detail: '背面写着：“影子不是消失，是等光。”', x: 50, y: 45 },
    ],
    puzzleTitle: '光影谜题：调光源、镜面与遮挡物', puzzleHint: '目标范围：光源角度 55°–75°，镜面角度 35°–50°，遮挡位置 60–80。让光束正好落在金色圆圈里。',
    dialogueIntro: '光束落在指定区域，月亮的影子慢慢回来了。旅人问：',
    choices: [
      { id: 'stay', text: '“让影子留在这里，陪着这家店。”', endingId: 'stay', note: '留下' },
      { id: 'travel', text: '“带着影子继续旅行吧。”', endingId: 'travel', note: '同行' },
    ],
    endings: [
      { id: 'stay', title: '结局：留在店里的影子', text: '月亮摆件留在柜台上，每天午夜都会在墙上投出一个安静的影子。', rewardItem: '有影子的月亮', stardust: 60 },
      { id: 'travel', title: '结局：一起上路的影子', text: '旅人带着月亮和影子走了。他说，以后走到哪里，月亮都不会再孤单。', rewardItem: '旅人的月光灯', stardust: 50 },
    ],
  },
];
