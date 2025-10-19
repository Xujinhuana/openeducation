---
title: Features
description: Super Spiral 的所有功能特性
tags: ["文档", "功能", "特性"]
publish: true
author: Development Team
---

# Features - 功能特性

Super Spiral 提供了丰富的功能来管理你的知识库。

## 🌟 核心功能

### 1. Obsidian 完整支持

#### Wikilink 双向链接
- 基础链接：`[[笔记名]]`
- 带文本：`[[笔记名|显示文本]]`
- 自动解析和跳转

示例：
- 返回 [[Welcome|首页]]
- 查看 [[getting-started|入门指南]]

#### 标签系统
- Frontmatter 标签：`tags: ["标签1", "标签2"]`
- 正文标签：`#标签名`
- 嵌套标签：`#类别/子类别`

示例标签：
- #Obsidian
- #知识管理
- #Web开发

#### 图片嵌入
- 使用 `![[图片.png]]` 嵌入图片
- 图片放在 `public/images/` 目录

### 2. Markdown 增强

#### 代码块
支持多种语言的语法高亮：

```javascript
function hello() {
  console.log('Hello, World!');
}
```

```python
def greet(name):
    print(f"Hello, {name}!")
```

#### 表格
| 功能 | 状态 | 说明 |
|------|------|------|
| Wikilink | ✅ | 完整支持 |
| 标签 | ✅ | 自动识别 |
| 图片 | ✅ | 本地图片 |

#### 任务列表
- [x] 完成基础功能
- [x] 添加 Obsidian 支持
- [x] 优化样式
- [ ] 添加搜索功能
- [ ] 实现图谱可视化

#### 引用块
> 知识管理的本质是建立关联  
> — Digital Garden Philosophy

### 3. 美观的样式

- 🎨 Tailwind CSS 样式系统
- 📱 响应式设计
- 🌙 深色模式（规划中）
- ✨ 流畅的动画效果

### 4. 高性能

- ⚡ Astro 静态生成
- 🚀 零 JavaScript（默认）
- 📦 自动代码分割
- 🖼️ 图片优化

## 🛠️ 技术栈

- **框架**: Astro 5.14.5
- **内容**: astro-loader-obsidian
- **样式**: Tailwind CSS + Typography
- **部署**: Vercel SSR
- **组件**: Vue 3 + Alpine.js

## 📖 使用场景

- 📚 个人知识库
- 🌱 Digital Garden
- 📝 技术博客
- 🗂️ 文档中心
- 💼 团队 Wiki

## 🔄 工作流程

1. **编写笔记** - 在 `obsidian-notes/` 目录
2. **使用 Wikilink** - 建立笔记关联
3. **添加标签** - 分类组织
4. **自动同步** - 开发服务器热更新
5. **部署上线** - 一键发布

## 🎯 最佳实践

### 笔记组织
- 使用有意义的文件名
- 添加完整的 frontmatter
- 保持笔记简洁专注
- 多使用链接建立关联

### 标签策略
- 建立一致的标签体系
- 使用 2-3 级分类
- 避免标签过多
- 定期整理标签

### Wikilink 使用
- 链接到相关笔记
- 使用描述性文本
- 避免循环引用
- 建立知识网络

## 🔮 未来计划

### 短期
- [ ] 全文搜索
- [ ] 笔记统计
- [ ] 最近更新
- [ ] 阅读时间

### 中期
- [ ] 双向链接展示
- [ ] 知识图谱
- [ ] 评论系统
- [ ] RSS 订阅

### 长期
- [ ] 多语言支持
- [ ] CMS 集成
- [ ] 协作功能
- [ ] AI 辅助

## 📚 相关链接

- [[Welcome|返回首页]]
- [[getting-started|快速开始]]
- [[obsidian-test|语法测试]]

---

**相关标签：** #功能 #文档 #特性 #Obsidian

**开始探索吧！** 🌟

