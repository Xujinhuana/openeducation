---
title: Obsidian 语法完整测试
description: 测试所有 Obsidian 语法功能，包括 Wikilink、标签、图片、Markdown 等
tags: ["Obsidian", "测试", "Wiki", "Markdown"]
publish: true
author: Super Spiral Team
aliases: ["OB测试", "语法测试", "完整测试"]
---

# Obsidian 语法完整测试

欢迎来到 Obsidian 语法测试笔记！本笔记包含所有 Obsidian 特有语法的完整示例。

---

## 🔗 Wikilink 双向链接测试

### 基础链接
以下是指向其他笔记的基础链接：

- 返回首页：[[Welcome]]
- 快速开始：[[getting-started]]
- 功能特性：[[features]]

### 带显示文本的链接
使用 `|` 分隔符自定义显示文本：

- 查看 [[Welcome|🏠 欢迎页面]] 了解项目
- 阅读 [[getting-started|📚 入门指南]] 开始使用
- 浏览 [[features|⚡ 功能列表]] 查看所有特性

### 链接测试要点
✅ 链接应该显示为蓝色可点击文本  
✅ 鼠标悬停显示目标 URL  
✅ 点击后跳转到对应笔记  
✅ 自定义文本正确显示  

---

## 🏷️ 标签系统测试

### Frontmatter 标签
在文档顶部的 frontmatter 中定义：
```yaml
tags: ["Obsidian", "测试", "Wiki"]
```

### 正文标签
在正文中直接使用 `#` 创建标签：

- 单个标签：#Obsidian #Markdown #知识库
- 中文标签：#测试 #入门 #文档
- 嵌套标签：#项目/前端 #学习/编程 #工具/Astro
- 组合使用：#Web开发 #TypeScript #JavaScript

### 标签测试要点
✅ 标签应该显示为紫色可点击文本  
✅ 点击后跳转到标签页 `/tags/{标签名}`  
✅ 标签页显示包含该标签的所有笔记  
✅ 支持中文和嵌套标签  

---

## 📝 Markdown 基础语法测试

### 文本格式
- **粗体文本** - 使用 `**文本**`
- *斜体文本* - 使用 `*文本*`
- ***粗斜体*** - 使用 `***文本***`
- ~~删除线~~ - 使用 `~~文本~~`
- `行内代码` - 使用 `` `代码` ``

### 标题层级
Markdown 支持 6 级标题，本笔记演示了 H1-H3。

### 有序列表
1. 第一项
2. 第二项
3. 第三项
   1. 嵌套项 3.1
   2. 嵌套项 3.2
4. 第四项

### 无序列表
- 项目 A
- 项目 B
  - 子项目 B.1
  - 子项目 B.2
    - 深层嵌套 B.2.1
- 项目 C

### 混合列表
1. 有序项
   - 无序子项
   - 另一个子项
2. 继续有序
   1. 嵌套有序
   2. 再一项

---

## 💻 代码块测试

### JavaScript
```javascript
// JavaScript 示例
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('Fibonacci(10):', fibonacci(10));
```

### TypeScript
```typescript
// TypeScript 示例
interface User {
  name: string;
  age: number;
  email?: string;
}

const user: User = {
  name: 'John Doe',
  age: 30
};
```

### Python
```python
# Python 示例
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
```

### Bash/Shell
```bash
#!/bin/bash
# Shell 脚本示例
npm run dev
npm run build
```

---

## 📊 表格测试

### 基础表格
| 功能 | 状态 | 说明 |
|------|------|------|
| Wikilink | ✅ | 完整支持 |
| 标签 | ✅ | 自动识别 |
| 图片 | ✅ | 语法支持 |
| 代码高亮 | ✅ | 多语言 |

### 对齐表格
| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:-------:|-------:|
| Left | Center | Right |
| 文本 | 文本 | 文本 |

### 复杂表格
| 框架 | 版本 | 特点 | 链接 |
|------|------|------|------|
| Astro | 5.x | 高性能 | [[features\|查看详情]] |
| Vue | 3.x | 响应式 | #Web开发 |
| Tailwind | 3.x | 实用性 | #样式 |

---

## 📋 任务列表测试

### 项目任务
- [x] 完成 Wikilink 解析
- [x] 支持标签系统
- [x] 添加代码高亮
- [x] 实现响应式设计
- [ ] 添加全文搜索
- [ ] 实现图谱可视化
- [ ] 支持评论功能

### 学习任务
- [x] 学习 Astro 基础
- [x] 掌握 Obsidian 语法
- [ ] 深入 TypeScript
- [ ] 研究性能优化

---

## 📖 引用块测试

### 基础引用
> 这是一段引用文本。
> 
> 可以包含多行内容。

### 嵌套引用
> 第一层引用
> 
> > 第二层引用
> > 
> > > 第三层引用

### 带作者的引用
> "知识管理的本质是建立连接，而不是堆积信息。"
> 
> — Digital Garden Philosophy

---

## 🔗 链接测试

### 外部链接
访问以下资源了解更多：

- [Astro 官方文档](https://docs.astro.build/)
- [Obsidian 官网](https://obsidian.md/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GitHub 仓库](https://github.com/)

### 混合链接
结合 Wikilink 和外部链接：

- 先看 [[Welcome]]，然后访问 [Astro 文档](https://docs.astro.build/)
- 学习 [[getting-started|快速入门]]，参考 [官方指南](https://help.obsidian.md/)

---

## 🖼️ 图片测试（占位）

### 图片语法
使用 Obsidian 的图片语法：

![[sample-image.png]]

**注意：** 需要将图片放在 `public/images/` 目录下。

### Markdown 图片
标准 Markdown 图片语法：

![示例图片](/images/example.png)

---

## 💡 Callout 提示框测试

### Note 提示
> [!NOTE]  
> 这是一个笔记类型的提示框，用于提供额外信息。

### Tip 提示
> [!TIP]  
> 这是一个技巧提示框，分享有用的建议。

### Important 提示
> [!IMPORTANT]  
> 这是重要信息提示框，标记关键内容。

### Warning 提示
> [!WARNING]  
> 这是警告提示框，提醒注意事项。

### Caution 提示
> [!CAUTION]  
> 这是谨慎提示框，标记需要特别注意的内容。

---

## 📐 其他 Markdown 元素

### 水平分割线
上面和下面都有分割线。

---

### 行内元素组合
这段文本包含 **粗体**、*斜体*、`代码`、[链接](https://example.com) 和 [[Wikilink]] 的组合。

### 特殊字符
- HTML 实体：&copy; &reg; &trade;
- 表情符号：😀 🎉 ✨ 🚀 📚 💡
- 箭头：← → ↑ ↓ ⇒ ⇔

---

## 🧪 综合测试区域

### 场景1：笔记关联
从这篇测试笔记，你可以：
1. 访问 [[Welcome|欢迎页]] 了解项目
2. 查看 [[features|功能列表]] 了解特性
3. 阅读 [[getting-started|入门指南]] 开始使用

### 场景2：标签导航
浏览以下标签查看相关内容：
- #Obsidian - Obsidian 相关笔记
- #测试 - 测试相关内容
- #入门 - 入门指南
- #文档 - 文档类笔记

### 场景3：代码示例
```javascript
// 实际代码示例
const notes = await getCollection('obsidian-notes');
const published = notes.filter(note => note.data.publish === true);
console.log(`找到 ${published.length} 篇已发布的笔记`);
```

---

## 📚 测试总结

### 已测试的功能
- ✅ Wikilink 基础链接
- ✅ Wikilink 带显示文本
- ✅ 标签系统（frontmatter）
- ✅ 标签系统（正文）
- ✅ Markdown 基础格式
- ✅ 代码块高亮
- ✅ 表格渲染
- ✅ 任务列表
- ✅ 引用块
- ✅ 外部链接
- ✅ Callout 提示框

### 待测试的功能
- ⏳ 图片嵌入（需要图片文件）
- ⏳ 复杂嵌套结构
- ⏳ 大型文档性能

---

## 🎯 使用建议

### 验证 Wikilink
1. 点击上面的所有 `[[链接]]`
2. 确认能跳转到对应笔记
3. 确认显示文本正确

### 验证标签
1. 点击上面的所有 `#标签`
2. 确认跳转到标签页
3. 确认标签页显示正确的笔记列表

### 验证样式
1. 检查代码块是否有背景色
2. 检查表格是否有边框
3. 检查引用块是否有左边框
4. 检查任务列表是否有复选框样式

---

## 🔗 相关笔记

- [[Welcome]] - 返回首页
- [[getting-started]] - 快速开始
- [[features]] - 功能详解

## 🏷️ 相关标签

使用以下标签查看更多内容：

浏览相关标签：#Obsidian #测试 #文档 #入门

---

**测试完成！** 如果所有功能都正常，说明你的 Obsidian 知识库系统已经完全就绪！🎉
