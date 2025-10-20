# AstrOb → PKMer 风格迁移方案

> **原则：** 渐进式迁移，每步可验证，可回滚，不污染现有代码

---

## 📋 迁移路线图

```
[阶段 0] 准备工作 (5分钟)
   ↓
[阶段 1] CSS 变量基础设施 (10分钟) ← 当前建议开始
   ↓
[阶段 2] 固定顶部导航栏 (20分钟)
   ↓
[阶段 3] 三栏文档布局 (30分钟)
   ↓
[阶段 4] 左侧目录树 (20分钟)
   ↓
[阶段 5] 右侧工具栏+TOC (20分钟)
   ↓
[阶段 6] 交互优化 (15分钟)
```

**总计：** 约 2 小时完成完整迁移

---

## 🎯 阶段 0：准备工作

### 任务清单
- [x] 创建迁移计划文档
- [ ] 切换到 AstrOb-Orgin 分支
- [ ] 提交基线版本

### 执行命令
```bash
# 1. 切换到 AstrOb-Orgin 分支
cd F:/IOTO-Doc/AstrOb
git checkout AstrOb-Orgin

# 2. 确认当前分支
git branch
# 应该显示 * AstrOb-Orgin

# 3. 确认当前能正常运行
npm run dev
# 访问 http://localhost:4321 确认无误

# 4. 提交当前状态作为基线（如果有未提交的更改）
git add -A
git commit -m "chore: PKMer风格迁移 - 基线版本"
```

> **说明：** 使用现有的 `AstrOb-Orgin` 分支进行迁移，`main` 分支保持原样作为备份

### 验收标准
✅ 项目能正常启动  
✅ 页面可以访问  
✅ 有 Git 备份点可回滚

---

## 🎨 阶段 1：CSS 变量基础设施

### 目标
添加 PKMer 风格的 CSS 变量系统，**不修改现有组件**

### 影响范围
- ✅ 只修改 CSS 文件
- ✅ 不影响现有布局
- ✅ 为后续迁移打基础

### 任务清单
- [ ] 创建 `src/styles/pkmer-variables.css`
- [ ] 在 `global.css` 中引入新变量
- [ ] 验证页面无变化

### 文件操作
```
新增文件：
  src/styles/pkmer-variables.css     (PKMer 配色方案)

修改文件：
  src/styles/global.css              (引入新变量)
```

### 验收标准
✅ 页面显示无变化  
✅ 开发者工具可以看到新的 CSS 变量  
✅ 暗色模式切换仍然正常

### 回滚方案
```bash
git checkout src/styles/global.css
git clean -fd src/styles/pkmer-variables.css
```

---

## 🔝 阶段 2：固定顶部导航栏

### 目标
创建 PKMer 风格的固定导航栏，替换原有导航

### 影响范围
- ⚠️ 修改页面头部
- ✅ 不影响内容区域
- ✅ 可通过 CSS 临时隐藏

### 任务清单
- [ ] 创建 `src/components/Header/Navbar.astro`
- [ ] 创建 `src/components/Header/MegaMenu.astro`
- [ ] 创建 `src/styles/navbar.css`
- [ ] 集成到 `[...slug].astro`
- [ ] 添加响应式菜单

### 文件操作
```
新增文件：
  src/components/Header/Navbar.astro
  src/components/Header/MegaMenu.astro
  src/styles/navbar.css

修改文件：
  src/pages/[...slug].astro          (添加新导航栏)
```

### 验收标准
✅ 顶部显示固定导航栏  
✅ 滚动时导航栏保持固定  
✅ 下拉菜单可以正常展开  
✅ 移动端显示汉堡菜单  
✅ 搜索和主题切换按钮正常

### 回滚方案
```bash
git checkout src/pages/[...slug].astro
git clean -fd src/components/Header
git clean -fd src/styles/navbar.css
```

---

## 📐 阶段 3：三栏文档布局

### 目标
创建左中右三栏布局结构，但暂时使用占位内容

### 影响范围
- ⚠️ 重构文档页面布局
- ⚠️ 原有内容会移动位置
- ✅ 内容本身不变

### 任务清单
- [ ] 创建 `src/layouts/DocumentLayout.astro`
- [ ] 创建三栏 Grid 布局
- [ ] 添加响应式断点
- [ ] 集成到文档页面

### 文件操作
```
新增文件：
  src/layouts/DocumentLayout.astro

修改文件：
  src/pages/[...slug].astro          (使用新布局)
  src/styles/global.css              (添加布局样式)
```

### 验收标准
✅ 桌面端显示三栏布局  
✅ 平板端隐藏右侧栏  
✅ 移动端单栏显示  
✅ 文章内容正常显示在中间区域

### 回滚方案
```bash
git checkout src/pages/[...slug].astro
git checkout src/styles/global.css
git clean -fd src/layouts/DocumentLayout.astro
```

---

## 🌲 阶段 4：左侧目录树

### 目标
创建可折叠的文档目录树，替换左侧占位内容

### 影响范围
- ✅ 只影响左侧边栏
- ✅ 不影响其他区域

### 任务清单
- [ ] 创建 `src/components/Sidebar/NavTree.astro`
- [ ] 创建 `src/components/Sidebar/NavItem.astro`
- [ ] 添加折叠/展开逻辑 (Alpine.js)
- [ ] 添加当前页面高亮
- [ ] 集成到布局

### 文件操作
```
新增文件：
  src/components/Sidebar/NavTree.astro
  src/components/Sidebar/NavItem.astro
  src/styles/sidebar.css

修改文件：
  src/layouts/DocumentLayout.astro   (使用目录树组件)
```

### 验收标准
✅ 左侧显示文档目录树  
✅ 点击可以折叠/展开分组  
✅ 当前页面高亮显示  
✅ 点击链接可以正常跳转  
✅ 移动端可以隐藏/显示侧边栏

### 回滚方案
```bash
git checkout src/layouts/DocumentLayout.astro
git clean -fd src/components/Sidebar
git clean -fd src/styles/sidebar.css
```

---

## 🛠️ 阶段 5：右侧工具栏 + TOC

### 目标
添加右侧目录（TOC）和快捷操作按钮

### 影响范围
- ✅ 只影响右侧边栏
- ✅ 不影响其他区域

### 任务清单
- [ ] 创建 `src/components/RightSidebar/TableOfContents.astro`
- [ ] 创建 `src/components/RightSidebar/QuickActions.astro`
- [ ] 添加滚动同步高亮 (Alpine.js)
- [ ] 集成社交链接区块

### 文件操作
```
新增文件：
  src/components/RightSidebar/TableOfContents.astro
  src/components/RightSidebar/QuickActions.astro
  src/styles/right-sidebar.css

修改文件：
  src/layouts/DocumentLayout.astro   (使用 TOC 组件)
```

### 验收标准
✅ 右侧显示文章目录  
✅ 滚动时目录项高亮同步  
✅ 点击目录项平滑滚动到对应章节  
✅ 显示快捷操作按钮（编辑、分享等）  
✅ 移动端隐藏右侧栏

### 回滚方案
```bash
git checkout src/layouts/DocumentLayout.astro
git clean -fd src/components/RightSidebar
git clean -fd src/styles/right-sidebar.css
```

---

## ✨ 阶段 6：交互优化

### 目标
添加细节动画和交互增强

### 影响范围
- ✅ 只增强交互体验
- ✅ 不影响功能

### 任务清单
- [ ] 添加导航栏滚动阴影
- [ ] 添加链接悬停动画
- [ ] 添加页面加载动画
- [ ] 优化移动端触摸交互
- [ ] 添加 Mega Menu 展开动画

### 文件操作
```
修改文件：
  src/styles/navbar.css              (添加动画)
  src/styles/sidebar.css             (添加过渡效果)
  src/components/Header/Navbar.astro (添加滚动监听)
```

### 验收标准
✅ 滚动时导航栏出现阴影  
✅ 链接悬停有平滑过渡  
✅ 菜单展开/折叠有动画  
✅ 页面切换流畅  
✅ 移动端滑动顺畅

### 回滚方案
```bash
git checkout src/styles/
git checkout src/components/Header/
```

---

## 🎉 完成检查清单

迁移完成后，确保以下所有功能正常：

### 功能验证
- [ ] 首页正常显示
- [ ] 文档页面三栏布局正确
- [ ] 左侧目录树可以折叠/展开
- [ ] 右侧 TOC 滚动同步
- [ ] 顶部导航栏固定
- [ ] 下拉菜单正常工作
- [ ] 搜索功能正常
- [ ] 主题切换正常
- [ ] 移动端响应式正确
- [ ] 所有链接可以跳转
- [ ] 暗色模式无闪烁

### 性能验证
- [ ] Lighthouse 性能评分 > 90
- [ ] 首屏加载 < 2s
- [ ] 交互响应 < 100ms

### 浏览器兼容
- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版
- [ ] Edge 最新版

---

## 🚨 紧急回滚

如果迁移过程中出现严重问题，可以完全回滚：

```bash
# 回到迁移前状态
git reset --hard HEAD
git clean -fd

# 重新开始
npm run dev
```

---

## 📚 参考资源

- PKMer 网站: https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian/
- Astro 文档: https://docs.astro.build/
- TailwindCSS: https://tailwindcss.com/
- Alpine.js: https://alpinejs.dev/

---

## 📝 进度跟踪

| 阶段 | 状态 | 开始时间 | 完成时间 | 备注 |
|------|------|---------|---------|------|
| 阶段 0 | ⏳ 进行中 | - | - | 准备工作 |
| 阶段 1 | ⏸️ 待开始 | - | - | CSS 变量 |
| 阶段 2 | ⏸️ 待开始 | - | - | 导航栏 |
| 阶段 3 | ⏸️ 待开始 | - | - | 三栏布局 |
| 阶段 4 | ⏸️ 待开始 | - | - | 目录树 |
| 阶段 5 | ⏸️ 待开始 | - | - | TOC |
| 阶段 6 | ⏸️ 待开始 | - | - | 优化 |

---

**下一步：** 请确认阶段 0 准备工作，然后我们开始 **阶段 1：CSS 变量基础设施**

