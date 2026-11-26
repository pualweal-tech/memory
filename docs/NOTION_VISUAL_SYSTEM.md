# Notion 视觉体系与设计规范深度解析 (Notion Design System Analysis)

> 本文档由 MEMOIR 团队针对 Notion (https://www.notion.com/zh-cn) 官方视觉体系深度拆解制作，作为 MEMOIR 官方网站与移动端数码手账应用的核心视觉指南。

---

## 1. 核心设计哲学 (Design Philosophy)

Notion 的设计被公认为现代工具界兼具极简美感与极高实用性的典范。其核心哲学可凝练为三点：

1. **如纸张般的亲和温度 (Tactile Warmth & Paper Metaphor)**
   - 拒绝纯白（`#FFFFFF`）带来的刺眼与冰冷，大量的界面底色采用带有极细微米黄/灰调的温润底色（如 `#F7F6F3` / `#F6F5F4`）。
   - 让数字界面像一本上等无酸纸手账本，给记录者带来书写的宁静与仪式感。

2. **耳语级结构线条 (Whisper-weight Structure)**
   - 绝不滥用粗重边框与高对比度阴影。
   - 分割线与卡片边框采用极低不透明度的 1px 细线（`rgba(55, 53, 47, 0.09)` 或 `#ECECEE`）。
   - 阴影只在悬浮与聚焦时提供多层、低弥散、透明度低于 5% 的柔和投影（`0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)`）。

3. **内容为王与积木化模块 (Content-First & Block Modularity)**
   - 界面元素克制后退，将所有焦点让位给用户写下的文字、贴上的照片与心情状态。
   - 所有元素皆为“Block（块）”，可自由拖拽、排版、转换类型。

---

## 2. 色彩系统 (Color Palette & Semantic Tokens)

Notion 拥有一套标志性的低饱和度柔和马卡龙色彩库，既能明确区分分类，又绝不会产生视觉噪音。

### 2.1 基础色 (Neutral Base)

| Token 名称 | 色值 | 用途说明 |
|---|---|---|
| `--bg-canvas` | `#FFFFFF` | 页面主体卡片、书写区域 |
| `--bg-secondary` | `#F7F6F3` | 侧边栏、背景底板、辅助容器 |
| `--bg-tertiary` | `#F1F0EC` | 按钮悬停、输入框默认底色 |
| `--text-primary` | `#37352F` | 主标题、正文（近黑微炭色，比纯黑更柔和） |
| `--text-secondary` | `#787774` | 副标题、时间戳、辅助说明 |
| `--text-tertiary` | `#9B9A97` | 占位符、失效标签、快捷提示 |
| `--border-subtle` | `rgba(55, 53, 47, 0.09)` | 1px 极细微分割线与边框 |
| `--border-default` | `rgba(55, 53, 47, 0.16)` | 卡片边框、输入框边框 |

### 2.2 Notion 经典 Callout / 高亮软色盘 (Pastel Palette)

| 语义色彩 | 浅色背景 (Light Tint) | 对应文字/边框色 | MEMOIR 对应场景 |
|---|---|---|---|
| **Gray 灰** | `#F1F1EF` | `#787774` | 归档、日常通用信息 |
| **Brown 暖褐** | `#F4EEEE` | `#976D57` | 晨间/晚间手账、复盘总结 |
| **Orange 暖橙** | `#FBEDD6` | `#D9730D` | 灵感火花、今日待办重点 |
| **Yellow 柔黄** | `#FBF3DB` | `#DFAB01` | 重要提醒、高优先级日程 |
| **Green 薄荷绿** | `#EDF3EC` | `#448361` | 运动打卡、健康目标、已完成 |
| **Blue 澄蓝** | `#E7F3F8` | `#2383E2` | 学习笔记、英语背诵、知识库 |
| **Purple 熏衣紫** | `#F4F0F7` | `#9065B0` | 工作项目、深度思考、创意手账 |
| **Pink 蜜桃粉** | `#FAF1F5` | `#C14C8A` | 心情记录、情感倾诉、美好回忆 |
| **Red 柔绯红** | `#FDEBEC` | `#D44C47` | 紧急待办、临近截止日期 |

---

## 3. 排版体系 (Typography)

- **字体族**:
  `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"`
- **字符字距 (Letter Spacing)**:
  - 针对大字号（如 Hero 标题 `40px - 56px`）采用紧缩字距 `-0.025em ~ -0.03em`，产生极具现代感的报刊杂志质感。
  - 正文（`14px - 16px`）保持正常字距，行高 `1.5 - 1.65`，确保舒适的阅读流。
- **层级梯度**:
  - `Display / Hero Title`: 48px - 56px, Bold, tracking: -0.03em
  - `Heading 1`: 28px - 32px, Semi-bold, tracking: -0.02em
  - `Heading 2`: 22px - 24px, Semi-bold, tracking: -0.01em
  - `Heading 3`: 18px - 20px, Medium
  - `Body / Paragraph`: 15px - 16px, Regular, line-height: 1.6
  - `Caption / Micro`: 12px - 13px, Regular, color: `--text-secondary`

---

## 4. 关键组件与微交互模式 (Components & Micro-Interactions)

1. **Page Header (页面封面与图标)**:
   - 顶部支持个性化 Cover（封面图）
   - 左侧悬浮大尺寸 Emoji 或专属图标，赋予每个页面独特生命力。
2. **Callout 提示块**:
   - 左侧配备 Emoji，右侧为多行文本，搭配柔和的浅色填充背景与圆角（8px）。
3. **Toggle 抽屉折叠块**:
   - 带有三角形展开箭头的折叠块，收纳详细展开项，保持界面干练不臃肿。
4. **Todo 复选框交互**:
   - 扁平圆角微方块（4px 圆角），勾选瞬间伴随柔和的颜色过渡与文字划线。
5. **Database 视图切换 (Table / Board / Calendar / Gallery)**:
   - 选项卡式胶囊切换按钮，点击即平滑切换展示形态。
6. **斜杠菜单 (`/` Slash Command)**:
   - 允许用户随手输入 `/` 呼出积木选择器（日记、待办、打卡、心情、图片等）。

---

## 5. MEMOIR 在 Notion 基础上的升级升华

MEMOIR 在完整继承 Notion 秩序感与极简风的基础上，融入了**“手账温情”**与**“情绪表达”**：
- **纸张质感可选**: 支持 Notion 极简纯白、复古牛皮纸感、浅苔绿手账、深邃夜空。
- **胶带与贴纸装饰**: 引入日式和纸胶带（Washi Tape）与个性化心情手账贴纸，兼顾排版效率与手作温度。
- **情绪量表与曲线**: 比纯记事多了 5 种情绪天平（😊 欣喜 / 🌿 治愈 / ☕ 充实 / 🌧️ 低落 / ✨ 期待）与打卡连续胜迹。
