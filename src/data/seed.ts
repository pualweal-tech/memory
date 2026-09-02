import type { AppData } from '../types';
import { DATA_VERSION, IMAGES } from '../utils/constants';
import { addDays, nowISO, todayISO, uid } from '../utils/date';

export function createSeedState(today = todayISO()): AppData {
  const yesterday = addDays(today, -1);
  const now = nowISO();

  const learningId = 'space-learning';
  const fitnessId = 'space-fitness';
  const workId = 'space-work';

  const habitFitness = 'habit-fitness';
  const habitEnglish = 'habit-english';
  const habitMorning = 'habit-morning';

  const checkIns = Array.from({ length: 7 }, (_, i) => ({
    id: uid(),
    habitId: habitFitness,
    date: addDays(today, i - 6),
    createdAt: now,
  }));

  return {
    version: DATA_VERSION,
    user: {
      id: 'user-charles',
      name: 'Charles',
      greetingName: 'Charles',
    },
    settings: {
      language: 'zh',
      theme: 'light',
    },
    selectedDate: today,
    spaces: [
      {
        id: learningId,
        name: '学习',
        nameEn: 'Learning',
        color: 'blue',
        icon: '📚',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: fitnessId,
        name: '健身',
        nameEn: 'Fitness',
        color: 'green',
        icon: '🏃',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: workId,
        name: '工作',
        nameEn: 'Work',
        color: 'purple',
        icon: '💼',
        createdAt: now,
        updatedAt: addDays(today, -2) + 'T09:00:00.000Z',
      },
    ],
    notes: [
      {
        id: 'note-grammar',
        spaceId: learningId,
        title: '时态笔记 • 完成时',
        body: '现在完成时用来描述过去发生、但对现在仍有影响的事情。结构是 have / has + 过去分词。例如：I have finished today’s notes.',
        tags: ['英语', '语法'],
        date: today,
        createdAt: now,
        updatedAt: now,
        checklist: [
          { id: uid(), text: '复习Unit 5 单词', done: true },
          { id: uid(), text: '完成语法练习', done: true },
          { id: uid(), text: '听力训练 30 min', done: false },
        ],
      },
      {
        id: 'note-checkin-table',
        spaceId: learningId,
        title: '学习打卡表',
        body: '连续记录每天的学习时长、内容和完成情况。目标：每天至少 30 分钟英语。',
        tags: ['英语', '打卡'],
        date: today,
        createdAt: now,
        updatedAt: now,
        checklist: [],
      },
      {
        id: 'note-work',
        spaceId: workId,
        title: '本周节奏',
        body: '把设计作业拆成：信息架构、视觉还原、交互连通。优先完成 MEMORY 的可操作原型。',
        tags: ['工作', '设计'],
        date: yesterday,
        createdAt: now,
        updatedAt: now,
        cover: IMAGES.plan,
        checklist: [],
      },
    ],
    tasks: [
      {
        id: 'task-design',
        title: '完成设计作业 —— App UI',
        date: today,
        dueTime: '23:59',
        spaceId: learningId,
        priority: 'important',
        completed: false,
      },
      {
        id: 'task-vocab',
        title: '单词背诵 50 个',
        date: today,
        spaceId: learningId,
        priority: 'normal',
        completed: false,
      },
      {
        id: 'task-gym',
        title: '健身 — 胸背日',
        date: today,
        spaceId: fitnessId,
        priority: 'normal',
        completed: false,
      },
      {
        id: 'task-read',
        title: '早间阅读 30 min',
        date: today,
        spaceId: learningId,
        priority: 'normal',
        completed: true,
        completedAt: `${today}T08:30:00`,
      },
      {
        id: 'task-review',
        title: '整理早课笔记',
        date: today,
        spaceId: learningId,
        priority: 'normal',
        completed: true,
        completedAt: `${today}T09:15:00`,
      },
      {
        id: 'task-english-class',
        title: '英语课',
        date: addDays(today, -1),
        dueTime: '10:00',
        spaceId: learningId,
        priority: 'normal',
        completed: true,
        completedAt: `${yesterday}T10:00:00`,
      },
    ],
    habits: [
      {
        id: habitFitness,
        name: '健身训练',
        nameEn: 'Fitness training',
        kind: 'fitness',
        icon: '🏃',
        targetLabel: '今日训练',
        targetLabelEn: 'Today’s session',
      },
      {
        id: habitEnglish,
        name: '英语学习',
        nameEn: 'English study',
        kind: 'study',
        icon: '📘',
        targetLabel: '30 min',
        targetLabelEn: '30 min',
        targetMinutes: 30,
      },
      {
        id: habitMorning,
        name: '早起打卡',
        nameEn: 'Morning check-in',
        kind: 'morning',
        icon: '☀️',
        targetLabel: '7:00',
        targetLabelEn: '7:00',
        goalTime: '07:00',
      },
    ],
    checkIns,
    bookmarks: [
      {
        id: 'bm-ux',
        url: 'https://uxplanet.org/mobile-design-patterns-2025',
        domain: 'UXPLANET.ORG',
        title: 'Mobile Design Patterns for 2025',
        description: '整理移动端常见模式：导航、卡片、空状态和微交互，适合手账类 App 参考。',
        category: 'design',
        tags: ['设计', '灵感'],
        createdAt: now,
        date: today,
      },
      {
        id: 'bm-css',
        url: 'https://css-tricks.com/css-grid-subgrid',
        domain: 'CSS-TRICKS.COM',
        title: 'CSS Grid 高级布局技巧',
        description: 'Grid subgrid 实战：对齐不规则卡片、日期选择器和内容模块。',
        category: 'dev',
        tags: ['开发'],
        createdAt: now,
        date: today,
      },
      {
        id: 'bm-dribbble',
        url: 'https://dribbble.com/shots/notion-style-ui-kit',
        domain: 'DRIBBBLE.COM',
        title: 'Notion-Style UI Kit — Minimal',
        description: '极简风格手账 APP 设计参考，圆角卡片与柔和阴影很适合 MEMORY。',
        category: 'inspire',
        tags: ['设计', '灵感'],
        createdAt: now,
        date: yesterday,
      },
      {
        id: 'bm-figma',
        url: 'https://www.figma.com/community/file/auto-layout',
        domain: 'FIGMA.COM',
        title: 'Auto Layout 高级用法',
        description: '用 Auto Layout 做可复用任务卡、空间卡和底部导航。',
        category: 'design',
        tags: ['设计', '开发'],
        createdAt: now,
        date: yesterday,
      },
    ],
    moments: [
      {
        id: 'moment-notes',
        date: today,
        time: '09:15',
        title: '早课笔记',
        text: '今天的早课笔记整理完成,效率比昨天高多了🌟',
        kind: 'note',
        tint: 'blue',
        createdAt: now,
      },
      {
        id: 'moment-gym',
        date: today,
        time: '07:00',
        title: '健身打卡',
        text: '胸背日完成，状态不错。',
        image: IMAGES.exercise,
        kind: 'checkin',
        tint: 'purple',
        createdAt: now,
      },
      {
        id: 'moment-breakfast',
        date: today,
        time: '08:00',
        title: '早餐时光',
        text: '牛肉面配煎蛋，开工前补点能量。',
        image: IMAGES.breakfast,
        kind: 'photo',
        tint: 'yellow',
        createdAt: now,
      },
      {
        id: 'moment-run',
        date: yesterday,
        time: '07:20',
        title: '晨跑',
        text: '天气很好，跑完再去上课。',
        image: IMAGES.exercise,
        kind: 'checkin',
        tint: 'green',
        createdAt: now,
      },
      {
        id: 'moment-night',
        date: yesterday,
        time: '20:40',
        title: '城市夜色',
        text: '下班路上的蓝调时刻。',
        image: IMAGES.night,
        kind: 'photo',
        tint: 'blue',
        createdAt: now,
      },
    ],
    voiceNotes: [],
  };
}

export function englishMinutesForDate(data: AppData, date: string): number {
  const check = data.checkIns.find((c) => c.habitId === 'habit-english' && c.date === date);
  if (check?.minutes) return check.minutes;
  if (check) return 30;
  return date === data.selectedDate ? 20 : 0;
}
