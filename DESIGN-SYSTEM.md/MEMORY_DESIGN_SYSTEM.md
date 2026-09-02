# MEMORY Design System

> Version 1.0  
> Product: MEMORY  
> Platform: Mobile / iPhone 16  
> Viewport reference: 402 × 874 px  
> Language: Chinese-first, English supported  
> Design direction: Calm productivity / personal memory / lightweight life management

---

## 1. Product Design Positioning

MEMORY is a personal productivity and memory-management application that combines:

- Daily planning
- Tasks
- Habit / exercise tracking
- Study records
- Notes and journal entries
- Web bookmarks
- Personal spaces / projects
- Lightweight time and progress tracking

The visual language should communicate:

**calm · warm · clear · lightweight · organized · personal**

The interface should feel closer to a polished personal productivity tool than a traditional enterprise management system.

### Core principles

1. **Content first**
   - User information is more important than decoration.
   - Keep visual hierarchy obvious.
   - Avoid unnecessary borders and excessive controls.

2. **Soft but structured**
   - Use warm off-white backgrounds.
   - Use rounded cards to divide information.
   - Use color to distinguish functions rather than creating visual noise.

3. **One screen, one main task**
   - Each page should have one obvious primary purpose.
   - Secondary actions should remain visually quiet.

4. **Small interactions, strong feedback**
   - Checkboxes, progress bars, streaks, selected dates and completion states should respond immediately.
   - Use subtle animation rather than dramatic transitions.

5. **Personal rather than corporate**
   - Small emoji/illustration accents are allowed.
   - Cards can use friendly colors.
   - Avoid excessive gradients, glassmorphism, neon effects or futuristic UI.

---

# 2. Canvas & Layout

## Base viewport

Primary design target:

```text
Width: 402 px
Height: 874 px
```

The interface should also remain usable on approximately:

```text
375 × 812
390 × 844
402 × 874
430 × 932
```

## Safe areas

Respect iOS-style safe areas.

Recommended:

```text
Top safe area: approximately 44 px
Bottom safe area: approximately 34 px
```

The application content should not visually collide with the status bar or home indicator.

## Horizontal page padding

Primary:

```text
16 px
```

Secondary compact layouts:

```text
12 px
```

Do not routinely use less than 12 px on the main page.

## Content width

For a 402 px viewport:

```text
402 - 16 - 16 = 370 px
```

Cards normally occupy the available content width.

---

# 3. Spacing System

Use an 4 px base spacing unit.

| Token | Value | Usage |
|---|---:|---|
| space-1 | 4 px | Tiny icon/text gap |
| space-2 | 8 px | Compact internal spacing |
| space-3 | 12 px | Small component spacing |
| space-4 | 16 px | Standard padding |
| space-5 | 20 px | Card / section spacing |
| space-6 | 24 px | Major section spacing |
| space-8 | 32 px | Large page separation |
| space-10 | 40 px | Large visual separation |

### Default rules

- Page horizontal padding: `16 px`
- Card internal padding: `16 px`
- Small cards: `12 px`
- Gap between cards: `8–12 px`
- Gap between major sections: `20–24 px`
- Gap between title and subtitle: `4–8 px`

Avoid arbitrary spacing values unless required by a specific composition.

---

# 4. Color System

MEMORY uses a warm neutral base with colorful functional accents.

## 4.1 Base colors

```css
--color-bg: #F7F5F2;
--color-surface: #FFFFFF;
--color-surface-soft: #F1EFEB;

--color-text-primary: #151515;
--color-text-secondary: #6F6F6F;
--color-text-tertiary: #9A9A9A;

--color-border: #E7E4DF;
```

### Background

Main application background:

```text
#F7F5F2
```

The background should feel slightly warm rather than pure white.

### Cards

Default cards:

```text
#FFFFFF
```

Do not use dark cards as the default surface.

---

## 4.2 Functional colors

### Blue — Learning / Knowledge

```css
--color-blue: #4E86E8;
--color-blue-soft: #DDEAFF;
```

Usage:

- Learning
- English
- Knowledge spaces
- Study records
- Information cards

### Green — Health / Completed

```css
--color-green: #32C86A;
--color-green-soft: #DDF7E7;
```

Usage:

- Health
- Exercise
- Completed state
- Positive progress
- Success

### Purple — Work / Personal space

```css
--color-purple: #7950C8;
--color-purple-soft: #E8DDF8;
```

Usage:

- Work
- Personal projects
- Creative functions
- Secondary spaces

### Yellow — Attention / Important

```css
--color-yellow: #F4C84A;
--color-yellow-soft: #FFF2C7;
```

Usage:

- Important information
- Reminders
- Highlights

### Orange — Action / Warm accent

```css
--color-orange: #F28A43;
--color-orange-soft: #FCE4D4;
```

Usage:

- Active tasks
- Writing
- Quick actions
- Warm highlights

### Pink — Web / Saved content

```css
--color-pink: #F2A7C4;
--color-pink-soft: #FBE4ED;
```

Usage:

- Web bookmarks
- Saved inspiration
- Personal collections

---

# 5. Color Rules

Color should primarily communicate **category and state**.

### Good

```text
Blue = study
Green = health
Purple = work
Pink = saved web content
Yellow = important
Orange = action
```

### Avoid

- Using every accent color on one card.
- Random gradients.
- Neon colors.
- Strong shadows combined with saturated gradients.
- Large areas of saturated color unless the component is specifically a space/category card.

---

# 6. Typography

Use a clean modern sans-serif system font.

Recommended CSS:

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "SF Pro Display",
  "SF Pro Text",
  "PingFang SC",
  "Microsoft YaHei",
  sans-serif;
```

## Type scale

| Role | Size | Weight | Line Height |
|---|---:|---:|---:|
| Display | 28 px | 700 | 34 px |
| Page title | 22 px | 700 | 28 px |
| Section title | 16 px | 700 | 22 px |
| Card title | 15 px | 600 | 20 px |
| Body | 14 px | 400 | 20 px |
| Secondary | 12 px | 400 | 17 px |
| Caption | 10–11 px | 400 | 15 px |

## Typography rules

Page titles should be visually strong.

Example:

```text
任务
今日瞬间
网页收藏
我的空间
```

Use bold/semibold rather than oversized text.

Do not make every piece of text bold.

---

# 7. Corner Radius

MEMORY uses generous rounded corners.

## Radius tokens

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-xxl: 24px;
--radius-pill: 999px;
```

### Recommended

- Small button: `10–12 px`
- Tag: `999 px`
- Standard card: `16–20 px`
- Large feature card: `20–24 px`
- Bottom sheet: `24 px` top corners
- Floating action button: circular

Avoid sharp 0–4 px corners in normal content components.

---

# 8. Shadows

Shadows should be soft and subtle.

Default card:

```css
box-shadow:
  0 2px 10px rgba(0, 0, 0, 0.05);
```

Elevated component:

```css
box-shadow:
  0 6px 20px rgba(0, 0, 0, 0.08);
```

Avoid:

- Hard black shadows
- Large dramatic shadows
- Excessive elevation
- Neumorphism

Borders can be omitted when the background contrast already separates the card.

---

# 9. Cards

Cards are one of the most important components in MEMORY.

## Standard card

```text
background: white
radius: 16–20 px
padding: 16 px
shadow: subtle
```

Typical structure:

```text
[Icon]  Title
        Description / metadata

        Progress / status
```

## Feature card

Used for:

- Daily statistics
- Study space
- Health streak
- Large content previews

Feature cards can use a saturated functional background.

Example:

```text
Blue → Learning
Green → Health
Purple → Work
Pink → Web / Collection
```

Keep text readable and preserve strong contrast.

---

# 10. Space Cards

The “我的空间” page uses colorful space cards.

Each space should have:

```text
Category color
+
small icon/illustration
+
space name
+
metadata
```

Example:

```text
学习
7 pages · Updated today
```

Recommended layout:

```text
┌────────────────────┐
│                    │
│      illustration  │
│                    │
│────────────────────│
│ 学习               │
│ 7 pages · Updated  │
└────────────────────┘
```

Grid:

```text
2 columns
gap: 8 px
```

---

# 11. Quick Actions

The home page uses a compact quick-action grid.

Each action should:

- Be visually simple.
- Use an icon.
- Have a short label.
- Have a soft colored background.
- Provide obvious tap feedback.

Recommended:

```text
4-column grid
gap: 8 px
```

Example:

```text
写笔记
拍照打卡
新建任务
网页收藏
```

---

# 12. Bottom Navigation

MEMORY uses a persistent bottom navigation bar.

Primary navigation:

```text
首页
空间
+
任务
我的
```

The center `+` is the main creation action.

## Navigation layout

```text
[首页] [空间] [  +  ] [任务] [我的]
```

The center action should be visually stronger than ordinary navigation items.

### Center action

- Approximately 44–48 px
- Rounded / circular appearance
- Dark primary surface
- Clear plus icon
- Slight elevation

### Active state

Active navigation icon/text should use the product's primary dark color.

Inactive items should use muted gray.

---

# 13. Floating / Creation Menu

The central `+` opens a creation menu.

The creation menu can contain:

```text
写笔记
拍照打卡
新建任务
保存网页
语音记录
```

Each option should be a large tappable row.

Recommended structure:

```text
┌────────────────────┐
│  ✕                 │
│                    │
│  [icon] 写笔记      │
│  [icon] 拍照打卡    │
│  [icon] 新建任务    │
│  [icon] 保存网页    │
│  [icon] 语音记录    │
└────────────────────┘
```

The menu should feel like an extension of the current interface, not a separate application.

---

# 14. Buttons

## Primary button

Use dark primary color.

```css
background: #151515;
color: #FFFFFF;
border-radius: 12px;
```

Recommended height:

```text
44–48 px
```

## Secondary button

```text
background: #F1EFEB
color: #151515
```

## Functional button

Use the appropriate functional color.

Example:

```text
学习 → blue
已打卡 → green
重要 → yellow
```

Avoid making every button colorful.

---

# 15. Tags / Chips

Tags should be compact.

```text
height: 24–28 px
padding: 0 10 px
radius: 999 px
font-size: 11–12 px
```

Examples:

```text
英语
语法
收藏
设计
工作
```

Soft background colors are preferred.

---

# 16. Progress Bars

Progress bars are frequently used in:

- Study progress
- Habit completion
- Task completion
- Streaks

Recommended:

```text
height: 4–6 px
radius: 999 px
track: #E8E6E2
fill: functional color
```

Example:

```text
████████░░
```

Do not use thick progress bars unless they are part of a large statistic card.

---

# 17. Checkboxes

Checkboxes should be visually clear but compact.

Unchecked:

```text
white / light background
subtle border
```

Completed:

```text
functional green
white check icon
```

Completion should have a subtle animation.

Recommended transition:

```text
120–180 ms
```

---

# 18. Calendar / Date Selector

The task page uses a horizontal date selector.

Recommended:

```text
5–7 visible date items
```

Each date item contains:

```text
weekday / label
day number
```

Selected date:

```text
dark background
white text
```

Unselected dates:

```text
white / transparent
dark text
```

Use compact rounded cards.

The current date should be visually recognizable but not necessarily overpower the selected date.

---

# 19. Task List

Task cards should distinguish states clearly.

## Task structure

```text
[checkbox] Task title
           metadata
                             [tag]
```

Possible states:

### Pending

Normal dark text.

### In progress

Use a subtle functional accent.

### Completed

- Green checkbox
- Muted title
- Optional strikethrough

### Important

Use a small orange/yellow indicator rather than turning the entire card red.

---

# 20. Habit / Check-in Page

The check-in page emphasizes:

```text
streak
+
today's habits
+
completion
```

The main streak card should be visually prominent.

Example:

```text
        7
      DAYS
   ─────────
  连续健康 7 天
```

Use green as the primary health color.

Small completion indicators can appear as compact green circles/checkmarks.

---

# 21. Daily Moment / Journal Page

The “今日瞬间” page is more visual.

Content can contain:

- Date
- Image / illustration
- Short text
- Mood
- Time
- Memory card

The page should feel like a lightweight personal diary.

Avoid making it look like a corporate data dashboard.

Large image/content cards can use:

```text
radius: 20 px
```

---

# 22. Note / Entry Page

The writing page should prioritize readability.

Recommended structure:

```text
Top bar
↓
Breadcrumb / space
↓
Tags
↓
Date + metadata
↓
Large title
↓
Body content
↓
Checklist / attachments
↓
Editor toolbar
```

The title should be approximately:

```text
22–26 px
font-weight: 700
```

Body:

```text
14–16 px
line-height: 1.6–1.8
```

Avoid excessive UI around the writing area.

---

# 23. Web Bookmark Page

Web bookmarks use content preview cards.

Each card can contain:

```text
site / source
title
short description
tags
thumbnail / color block
```

Search field:

```text
white background
rounded pill
subtle border
```

Category filters:

```text
全部
设计
开发
灵感
...
```

Use horizontally scrollable chips if necessary.

---

# 24. Icons

Icons should be:

- Simple
- Rounded
- Consistent stroke width
- Easy to recognize at small sizes

Recommended stroke:

```text
1.5–2 px
```

Avoid mixing:

- Filled icons
- 3D icons
- Highly detailed line icons
- Different icon families

in the same navigation layer.

Functional cards may use emoji or small illustrations, but navigation icons should remain consistent.

---

# 25. Emoji / Illustration

MEMORY can use emoji and lightweight illustrations as personality elements.

Examples:

```text
📚 学习
🏃 健身
💼 工作
🌐 网页
✍️ 写笔记
🎙️ 语音
```

Rules:

- Use them selectively.
- Prefer one visual accent per component.
- Do not turn every interface element into an emoji.
- Illustrations should feel soft, friendly and slightly playful.

---

# 26. Image Treatment

Images should generally use:

```text
border-radius: 16–20 px
```

Avoid:

- Sharp rectangular image corners
- Heavy image borders
- Excessive filters
- Large drop shadows

For content cards, image and background color can work together as a visual block.

---

# 27. Page Header

Typical page header:

```text
[optional back]     title          [action]
```

Home page can use a greeting:

```text
早安，Charles ☀️
```

The greeting can be large and personal.

Secondary information should remain small.

---

# 28. Home Page Composition

The home page should follow approximately:

```text
Status bar
↓
Greeting
↓
Daily overview card
↓
Quick actions
↓
Recent / ongoing content
↓
Bottom navigation
```

The home screen should immediately answer:

1. What is happening today?
2. What needs attention?
3. What can I quickly create or record?

---

# 29. Motion & Interaction

Animations should be subtle.

Recommended durations:

```text
Micro interaction: 120–180 ms
Component transition: 180–240 ms
Page transition: 240–320 ms
```

Use:

```css
ease-out
```

for most interface interactions.

Examples:

- Checkbox completion
- Card press
- Bottom menu appearance
- Tab switching
- Progress changes

Avoid exaggerated:

- Bounce
- Elastic animation
- Long transitions
- Full-screen flashy effects

---

# 30. Interaction States

Every interactive component should have at least:

```text
Default
Pressed
Selected
Disabled
Completed
```

Buttons should visually respond immediately to tapping.

Cards can use:

```text
scale: 0.98
```

during press feedback.

---

# 31. Dark Mode

Dark mode may be supported later.

Do not simply invert the colors.

Dark mode should preserve the same semantic hierarchy.

Example:

```css
--dark-bg: #151515;
--dark-surface: #222222;
--dark-text-primary: #F7F7F7;
--dark-text-secondary: #A8A8A8;
```

Functional colors should be slightly adjusted for contrast.

---

# 32. Accessibility

Minimum recommendations:

- Primary text should have strong contrast.
- Interactive targets should generally be at least `44 × 44 px`.
- Do not communicate state through color alone.
- Completed tasks should use both checkbox state and text treatment.
- Important actions should have recognizable icons/labels.

---

# 33. Responsive Rules

The primary design is mobile-first.

For wider screens:

```text
Do not simply stretch every card.
```

Instead:

- Increase outer margins.
- Maintain readable content width.
- Use multi-column grids where appropriate.
- Preserve card proportions.
- Keep navigation coherent.

The mobile experience remains the source of truth.

---

# 34. Component Naming

Recommended React component naming:

```text
AppShell
TopBar
BottomNav
CreateMenu
PageHeader
SectionHeader

StatCard
FeatureCard
SpaceCard
TaskCard
NoteCard
BookmarkCard
HabitCard

QuickAction
Tag
Chip
ProgressBar
Checkbox
DateSelector
SearchBar
```

Use semantic names rather than visual names.

Good:

```text
TaskCard
```

Avoid:

```text
WhiteRoundedBox
```

---

# 35. Design Tokens

A basic implementation token set:

```css
:root {
  --color-bg: #F7F5F2;
  --color-surface: #FFFFFF;
  --color-surface-soft: #F1EFEB;

  --color-text-primary: #151515;
  --color-text-secondary: #6F6F6F;
  --color-text-tertiary: #9A9A9A;

  --color-border: #E7E4DF;

  --color-blue: #4E86E8;
  --color-blue-soft: #DDEAFF;

  --color-green: #32C86A;
  --color-green-soft: #DDF7E7;

  --color-purple: #7950C8;
  --color-purple-soft: #E8DDF8;

  --color-yellow: #F4C84A;
  --color-yellow-soft: #FFF2C7;

  --color-orange: #F28A43;
  --color-orange-soft: #FCE4D4;

  --color-pink: #F2A7C4;
  --color-pink-soft: #FBE4ED;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-xxl: 24px;
  --radius-pill: 999px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  --shadow-card:
    0 2px 10px rgba(0, 0, 0, 0.05);

  --shadow-elevated:
    0 6px 20px rgba(0, 0, 0, 0.08);
}
```

---

# 36. Cursor Implementation Rules

When implementing MEMORY from this design system:

### MUST

- Follow the color tokens.
- Follow the spacing system.
- Use rounded cards.
- Preserve the warm off-white background.
- Keep the bottom navigation consistent across pages.
- Keep the central `+` action visually prominent.
- Use functional colors consistently.
- Preserve the visual hierarchy shown in the reference designs.
- Optimize for `402 × 874`.
- Keep touch targets comfortable.
- Reuse components instead of recreating visually similar components independently.

### SHOULD

- Improve interaction logic when necessary.
- Add subtle transitions.
- Use realistic content.
- Keep pages visually polished.
- Maintain consistent card proportions.
- Make empty states and completion states feel intentional.

### MUST NOT

Do not introduce:

- Neon UI
- Glassmorphism
- Excessive gradients
- Futuristic sci-fi styling
- Excessive dark surfaces
- Sharp rectangular cards
- Random colors
- Excessive shadows
- Excessive borders
- Huge typography
- Dense enterprise dashboards
- Unrelated icon styles

Do not redesign the visual language without a clear product reason.

---

# 37. Reference Screen Hierarchy

The current reference screens establish these major patterns:

```text
HOME
├── Greeting
├── Daily overview
├── Quick actions
├── Ongoing content
└── Bottom navigation

MY SPACE
├── Page title
├── Search
├── Space grid
├── Recent content
└── Bottom navigation

CREATE
├── Close
├── Writing
├── Check-in
├── Task
├── Web
└── Voice

ENTRY
├── Breadcrumb
├── Tags
├── Date
├── Title
├── Body
├── Checklist
└── Editor toolbar

TASKS
├── Page title
├── Add
├── Date selector
├── Daily progress
├── Task list
└── Bottom navigation

CHECK-IN
├── Streak
├── Today's habits
├── Completion states
└── Next milestone

DAILY MOMENTS
├── Date
├── Visual memory
├── Short notes
├── Previous memories
└── Bottom navigation

WEB BOOKMARKS
├── Page title
├── Search
├── Category filters
├── Bookmark cards
└── Bottom navigation
```

---

# 38. Overall Visual Formula

When in doubt, use this formula:

```text
Warm off-white background
+
White rounded cards
+
16–20 px corner radius
+
subtle shadow
+
dark typography
+
one functional accent color
+
compact spacing
+
simple icons
+
small playful illustrations
```

The result should feel:

**“A calm personal operating system for everyday life.”**

Not:

**“A corporate project management dashboard.”**
