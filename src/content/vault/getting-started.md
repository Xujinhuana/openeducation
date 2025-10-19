---
title: Getting Started  
description: 快速开始使用 Super Spiral
tags: ["入门", "指南"]
publish: true
author: Super Spiral Team
---

# Getting Started - 快速开始

让我们开始使用 Super Spiral 构建你的知识库！

## 📝 创建笔记

在 `src/content/obsidian-notes/` 目录下创建新的 `.md` 文件：

```markdown
---
title: 我的第一篇笔记
description: 这是描述
tags: ["测试"]
publish: true
---

# 我的第一篇笔记

笔记内容...
```

## 🔗 使用 Wikilink

### 基础链接
使用 `[[笔记名]]` 链接到其他笔记：

```
查看 [[Welcome]] 页面
```

### 带显示文本
使用 `[[笔记名|显示文本]]` 自定义显示：

```
阅读[[features|功能详解]]了解更多
```

## 🏷️ 使用标签

在正文中直接使用 #标签：

```
这是关于 #Obsidian 的笔记
讨论 #Web开发 和 #知识管理
```

标签会自动转换为可点击的链接。

## 📁 组织笔记

### 使用标签分类
- `tags: ["类别1", "类别2"]` - 在 frontmatter 中
- `#标签` - 在正文中

### 使用 Wikilink 关联
- 相关笔记之间互相链接
- 建立知识网络

### 使用别名
```yaml
aliases: ["别名1", "别名2"]
```

## 🎨 自定义样式

编辑 `src/styles/global.css` 自定义样式：

```css
.prose h1 {
  @apply text-purple-900;
}
```

## 🚀 部署

```bash
# 构建
npm run build

# 预览
npm run preview

# 部署到 Vercel
vercel
```

## 📚 更多资源

- [[Welcome|返回首页]]
- [[features|查看功能]]
- [[obsidian-test|语法测试]]

## 💡 提示

> 保持笔记简洁清晰  
> 多使用链接建立关联  
> 合理使用标签分类  

开始创建你的知识库吧！✨

---

**相关标签：** #入门 #指南 #Obsidian

