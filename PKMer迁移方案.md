# PKMer 风格迁移方案 - 渐进式实施

> **核心原则：** 
> - ✅ 每次只改一个功能模块
> - ✅ 每步完成后立即测试验证
> - ✅ 新功能放在新文件，不污染原代码
> - ✅ 每步都可以独立回滚

---

## 📋 迁移总览（6个独立阶段）

```
阶段 1 (15分钟) - CSS变量系统
   └─ 添加PKMer配色，不改现有样式
   
阶段 2 (20分钟) - 顶部导航栏  
   └─ 新增组件，不删除原导航
   
阶段 3 (25分钟) - 三栏布局
   └─ 创建新Layout，原Layout保留
   
阶段 4 (20分钟) - 左侧目录树
   └─ 独立组件，可选加载
   
阶段 5 (20分钟) - 右侧工具栏
   └─ 独立组件，可选加载
   
阶段 6 (15分钟) - 交互优化
   └─ 纯CSS增强，不改结构
```

**预计总时长：** 约 2 小时

---

## 🎯 阶段 1：CSS 变量基础设施（15分钟）

### 目标
添加 PKMer 风格的 CSS 变量系统，**完全不影响现有显示**

### 操作步骤

#### 步骤 1.1：创建 PKMer 配色文件

创建新文件 `src/styles/pkmer-base.css`

#### 步骤 1.2：在 global.css 中引入

只需在 `src/styles/global.css` 顶部添加一行：
```css
@import './pkmer-base.css';
```

### 验收标准
- ✅ 页面显示**完全不变**
- ✅ 浏览器开发者工具可以看到新的 CSS 变量
- ✅ 暗色模式切换正常
- ✅ 无 Console 错误

### 回滚方法
```bash
# 删除新文件
rm src/styles/pkmer-base.css

# 恢复 global.css
git checkout src/styles/global.css
```

### 提交点
```bash
git add src/styles/pkmer-base.css src/styles/global.css
git commit -m "feat: 添加PKMer CSS变量系统（不影响显示）"
```

---

## 🔝 阶段 2：固定顶部导航栏（20分钟）

### 目标
创建 PKMer 风格导航栏，**与原导航并存**，可通过 CSS 切换显示

### 操作步骤

#### 步骤 2.1：创建导航栏组件
- 创建 `src/components/PKMer/Navbar.astro`
- 创建 `src/styles/pkmer-navbar.css`

#### 步骤 2.2：在页面中添加（但默认隐藏）
在 `src/pages/[...slug].astro` 中添加新导航，但用 CSS 控制显隐

### 验收标准
- ✅ 页面显示正常（默认显示原导航）
- ✅ 可通过修改一个 CSS 类切换到新导航
- ✅ 新导航固定在顶部
- ✅ 滚动时导航栏固定不动
- ✅ 移动端响应式正常

### 回滚方法
```bash
git checkout src/pages/[...slug].astro
rm -rf src/components/PKMer
rm src/styles/pkmer-navbar.css
```

### 提交点
```bash
git add .
git commit -m "feat: 添加PKMer导航栏组件（默认隐藏）"
```

---

## 📐 阶段 3：三栏文档布局（25分钟）

### 目标
创建新的三栏布局 Layout，**不删除原 Layout**

### 操作步骤

#### 步骤 3.1：创建新布局文件
- 创建 `src/layouts/PKMerLayout.astro`
- 创建 `src/styles/pkmer-layout.css`

#### 步骤 3.2：创建布局切换开关
在 `[...slug].astro` 中用条件判断使用哪个布局

### 验收标准
- ✅ 默认使用原布局，页面正常
- ✅ 切换开关后使用新布局
- ✅ 新布局显示三栏结构
- ✅ 响应式正常（移动端单栏）

### 回滚方法
```bash
git checkout src/pages/[...slug].astro
rm src/layouts/PKMerLayout.astro
rm src/styles/pkmer-layout.css
```

### 提交点
```bash
git add .
git commit -m "feat: 添加PKMer三栏布局（可切换）"
```

---

## 🌲 阶段 4：左侧文档树（20分钟）

### 目标
创建可折叠的文档目录树组件

### 操作步骤

#### 步骤 4.1：创建组件
- 创建 `src/components/PKMer/NavTree.astro`
- 创建 `src/components/PKMer/NavItem.astro`
- 创建 `src/styles/pkmer-nav-tree.css`

#### 步骤 4.2：集成到 PKMerLayout
在左侧边栏插槽中使用 NavTree 组件

### 验收标准
- ✅ 左侧显示文档树
- ✅ 点击可折叠/展开
- ✅ 当前页面高亮
- ✅ 链接跳转正常

### 回滚方法
```bash
git checkout src/layouts/PKMerLayout.astro
rm src/components/PKMer/NavTree.astro
rm src/components/PKMer/NavItem.astro
rm src/styles/pkmer-nav-tree.css
```

### 提交点
```bash
git add .
git commit -m "feat: 添加左侧文档目录树"
```

---

## 🛠️ 阶段 5：右侧工具栏（20分钟）

### 目标
添加右侧 TOC 和快捷操作

### 操作步骤

#### 步骤 5.1：创建组件
- 创建 `src/components/PKMer/TableOfContents.astro`
- 创建 `src/components/PKMer/QuickActions.astro`
- 创建 `src/styles/pkmer-toc.css`

#### 步骤 5.2：集成到 PKMerLayout
在右侧边栏插槽中使用组件

### 验收标准
- ✅ 右侧显示 TOC
- ✅ 滚动时高亮同步
- ✅ 点击平滑滚动
- ✅ 快捷按钮正常

### 回滚方法
```bash
git checkout src/layouts/PKMerLayout.astro
rm src/components/PKMer/TableOfContents.astro
rm src/components/PKMer/QuickActions.astro
rm src/styles/pkmer-toc.css
```

### 提交点
```bash
git add .
git commit -m "feat: 添加右侧TOC和工具栏"
```

---

## ✨ 阶段 6：交互优化（15分钟）

### 目标
添加动画和交互增强

### 操作步骤

#### 步骤 6.1：优化已有组件的 CSS
- 为导航添加滚动阴影
- 为链接添加悬停动画
- 为菜单添加展开动画

### 验收标准
- ✅ 滚动时导航栏显示阴影
- ✅ 链接悬停平滑过渡
- ✅ 菜单展开有动画
- ✅ 性能良好，无卡顿

### 回滚方法
```bash
git checkout src/styles/pkmer-*.css
```

### 提交点
```bash
git add .
git commit -m "feat: 添加交互动画和视觉优化"
```

---

## 🔄 布局切换机制

### 实现方式

在 `src/pages/[...slug].astro` 顶部添加：

```typescript
---
// 布局切换开关
const USE_PKMER_LAYOUT = false; // 改为 true 启用 PKMer 布局

import OriginalPage from 'astro-spaceship/components/Article/Page.astro';
import PKMerLayout from '@/layouts/PKMerLayout.astro';

const PageLayout = USE_PKMER_LAYOUT ? PKMerLayout : OriginalPage;
---

<PageLayout {...Astro.props}>
  <!-- 内容 -->
</PageLayout>
```

### 优势
- ✅ 一个开关即可切换
- ✅ 两套布局并存
- ✅ 随时可回退
- ✅ 对比测试方便

---

## 🗂️ 文件结构预览

```
src/
├── components/
│   ├── PKMer/                    # 新增：PKMer组件目录
│   │   ├── Navbar.astro          # 导航栏
│   │   ├── NavTree.astro         # 目录树
│   │   ├── NavItem.astro         # 目录项
│   │   ├── TableOfContents.astro # TOC
│   │   └── QuickActions.astro    # 快捷操作
│   ├── SearchFilter.astro        # 保持原样
│   └── ThemeToggle.astro         # 保持原样
│
├── layouts/
│   └── PKMerLayout.astro         # 新增：PKMer布局
│
├── styles/
│   ├── pkmer-base.css            # 新增：基础变量
│   ├── pkmer-navbar.css          # 新增：导航样式
│   ├── pkmer-layout.css          # 新增：布局样式
│   ├── pkmer-nav-tree.css        # 新增：目录树样式
│   ├── pkmer-toc.css             # 新增：TOC样式
│   ├── global.css                # 修改：引入新CSS
│   ├── landing.css               # 保持原样
│   └── theme.config.css          # 保持原样
│
└── pages/
    └── [...slug].astro           # 修改：添加布局切换
```

---

## 🎯 每个阶段的完成标准

### 通用检查项
每完成一个阶段，都要检查：

- [ ] `npm run dev` 无报错
- [ ] 浏览器无 Console 错误
- [ ] 页面可以正常访问
- [ ] 原有功能不受影响
- [ ] 已提交 Git

### 阶段特定检查项
- **阶段 1：** 页面显示无变化
- **阶段 2：** 新导航可切换显示
- **阶段 3：** 三栏布局响应式正常
- **阶段 4：** 目录树折叠功能正常
- **阶段 5：** TOC 滚动同步正常
- **阶段 6：** 动画流畅无卡顿

---

## 🚨 如果出现问题

### 紧急回滚
```bash
# 回到上一次提交
git reset --hard HEAD~1

# 清理未追踪文件
git clean -fd

# 重启开发服务器
npm run dev
```

### 部分回滚
```bash
# 只回滚某个文件
git checkout HEAD -- src/path/to/file

# 删除某个新文件
rm src/path/to/file
```

---

## 📝 进度跟踪表

| 阶段 | 任务 | 状态 | 开始时间 | 完成时间 | 备注 |
|------|------|------|---------|---------|------|
| 1 | CSS变量系统 | ⏸️ 待开始 | - | - | - |
| 2 | 顶部导航栏 | ⏸️ 待开始 | - | - | - |
| 3 | 三栏布局 | ⏸️ 待开始 | - | - | - |
| 4 | 左侧目录树 | ⏸️ 待开始 | - | - | - |
| 5 | 右侧工具栏 | ⏸️ 待开始 | - | - | - |
| 6 | 交互优化 | ⏸️ 待开始 | - | - | - |

---

## 🎉 完成后的最终检查

- [ ] 所有页面正常访问
- [ ] 三栏布局响应式正确
- [ ] 目录树可折叠
- [ ] TOC 滚动同步
- [ ] 导航栏固定
- [ ] 主题切换正常
- [ ] 搜索功能正常
- [ ] 移动端显示正常
- [ ] 无 Console 错误
- [ ] Lighthouse 评分 > 90

---

**准备好了吗？告诉我："开始阶段 1"，我立即为你创建第一个文件！** 🚀

