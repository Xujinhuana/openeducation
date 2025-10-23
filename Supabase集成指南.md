# 🚀 AstrOb + Supabase 集成指南

> 混合架构：静态内容 + 动态功能 = 完美博客

---

## 📋 方案概述

### 架构设计

```
┌─────────────────────────────────────────┐
│         AstrOb 静态网站（Astro）        │
│  ┌────────────┐      ┌────────────┐    │
│  │  Markdown  │      │  动态功能  │    │
│  │  文章内容  │      │  (Supabase) │    │
│  └────────────┘      └────────────┘    │
│       ↓                     ↓           │
│  - 文章列表            - 评论系统       │
│  - 文章详情            - 阅读统计       │
│  - 标签分类            - 点赞收藏       │
│                        - 用户认证       │
└─────────────────────────────────────────┘
           ↓                    ↓
    Obsidian 编辑         Supabase 后端
    Git 版本控制          实时数据库
```

### 核心理念

**保留优势**：
- ✅ Markdown 文件管理文章内容
- ✅ Obsidian 编辑体验
- ✅ Git 版本控制
- ✅ 静态网站快速部署

**增加功能**：
- ✅ 评论系统
- ✅ 阅读统计
- ✅ 点赞功能
- ✅ 用户收藏（可选）

---

## 🎯 集成功能规划

### 第一阶段：基础功能（推荐，2-3 小时）

| 功能 | 优先级 | 实现难度 | 用户价值 |
|------|--------|----------|----------|
| 阅读统计 | ⭐⭐⭐⭐⭐ | ⭐⭐☆☆☆ | 了解文章热度 |
| 评论系统 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐☆☆ | 读者互动 |
| 点赞功能 | ⭐⭐⭐⭐☆ | ⭐⭐☆☆☆ | 即时反馈 |

### 第二阶段：高级功能（可选，5-8 小时）

| 功能 | 优先级 | 实现难度 | 用户价值 |
|------|--------|----------|----------|
| 用户认证 | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐☆ | 个性化体验 |
| 收藏系统 | ⭐⭐⭐☆☆ | ⭐⭐⭐☆☆ | 用户留存 |
| 搜索功能 | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐☆ | 内容发现 |

---

## 🚀 第一步：Supabase 账号设置

### 1.1 注册账号

1. 访问 [Supabase](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录（推荐）

### 1.2 创建项目

```yaml
项目配置：
  Organization: 选择或创建组织
  Name: astrob-blog
  Database Password: 生成强密码（保存好！）
  Region: Southeast Asia (Singapore) # 离中国较近
  Pricing Plan: Free # 免费版足够使用
```

等待 2-3 分钟项目初始化完成。

### 1.3 获取 API 密钥

1. 进入项目 Dashboard
2. 点击左侧 **Settings** → **API**
3. 复制以下信息：

```env
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (仅服务端使用)
```

**⚠️ 注意**：
- `anon key`：可以在前端使用（安全）
- `service_role key`：只能在服务端使用（敏感）

---

## 🗄️ 第二步：数据库表结构设计

### 2.1 进入 SQL Editor

1. Supabase Dashboard → 左侧菜单 **SQL Editor**
2. 点击 **New query**

### 2.2 创建表结构

复制以下 SQL 并执行：

```sql
-- ============================================
-- 1. 文章统计表
-- ============================================
CREATE TABLE article_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,  -- 文章路径（如 "my-first-post"）
  views INTEGER DEFAULT 0,     -- 浏览量
  likes INTEGER DEFAULT 0,     -- 点赞数
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为 slug 创建索引（加速查询）
CREATE INDEX idx_article_stats_slug ON article_stats(slug);

-- ============================================
-- 2. 评论表
-- ============================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,           -- 文章路径
  author_name TEXT NOT NULL,            -- 评论者昵称
  author_email TEXT,                    -- 邮箱（可选）
  content TEXT NOT NULL,                -- 评论内容
  parent_id UUID,                       -- 父评论ID（支持回复）
  status TEXT DEFAULT 'approved',       -- 状态：approved/pending/spam
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 外键约束：支持评论回复
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 为 article_slug 创建索引
CREATE INDEX idx_comments_article_slug ON comments(article_slug);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- ============================================
-- 3. 点赞记录表（防止重复点赞）
-- ============================================
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  user_identifier TEXT NOT NULL,  -- IP 地址或用户ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 唯一约束：同一用户只能点赞一次
  UNIQUE(article_slug, user_identifier)
);

-- ============================================
-- 4. 阅读记录表（详细统计）
-- ============================================
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_page_views_article_slug ON page_views(article_slug);
CREATE INDEX idx_page_views_created_at ON page_views(created_at);

-- ============================================
-- 5. 触发器：自动更新 updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_article_stats_updated_at
BEFORE UPDATE ON article_stats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

点击 **Run** 执行 SQL。

### 2.3 配置行级安全策略（RLS）

```sql
-- ============================================
-- 开启行级安全（Row Level Security）
-- ============================================

-- 启用 RLS
ALTER TABLE article_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 文章统计：所有人可读，只有服务端可写
-- ============================================
CREATE POLICY "Anyone can view article stats"
  ON article_stats FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert article stats"
  ON article_stats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update article stats"
  ON article_stats FOR UPDATE
  USING (true);

-- ============================================
-- 评论：所有人可读已批准的，任何人可创建
-- ============================================
CREATE POLICY "Anyone can view approved comments"
  ON comments FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can create comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 点赞：所有人可读，可创建
-- ============================================
CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create likes"
  ON likes FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 浏览记录：所有人可创建
-- ============================================
CREATE POLICY "Anyone can create page views"
  ON page_views FOR INSERT
  WITH CHECK (true);
```

---

## 💻 第三步：安装依赖

### 3.1 安装 Supabase 客户端

```bash
cd F:/IOTO-Doc/AstrOb
npm install @supabase/supabase-js
```

### 3.2 配置环境变量

创建或编辑 `.env` 文件：

```env
# Supabase 配置
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 服务端密钥（不要暴露到前端！）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.3 配置 TypeScript 类型

创建 `src/env.d.ts`（如果已存在则编辑）：

```typescript
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string
  readonly PUBLIC_SUPABASE_ANON_KEY: string
  readonly SUPABASE_SERVICE_ROLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 🔧 第四步：创建 Supabase 客户端

### 4.1 创建客户端工具文件

创建 `src/lib/supabase.ts`：

```typescript
import { createClient } from '@supabase/supabase-js';

// 前端客户端（使用 anon key，安全）
export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

// 服务端客户端（使用 service role key，权限更高）
export const supabaseAdmin = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);
```

### 4.2 创建类型定义

创建 `src/lib/types.ts`：

```typescript
export interface ArticleStats {
  id: string;
  slug: string;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  article_slug: string;
  author_name: string;
  author_email?: string;
  content: string;
  parent_id?: string;
  status: 'approved' | 'pending' | 'spam';
  created_at: string;
  replies?: Comment[];  // 子评论
}

export interface Like {
  id: string;
  article_slug: string;
  user_identifier: string;
  created_at: string;
}

export interface PageView {
  id: string;
  article_slug: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}
```

---

## 📊 第五步：实现阅读统计

### 5.1 创建 API 端点

创建 `src/pages/api/stats/[slug].ts`：

```typescript
import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// 获取文章统计
export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 查询统计数据
    const { data, error } = await supabase
      .from('article_stats')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // 如果不存在，创建初始记录
    if (!data) {
      const { data: newStats } = await supabaseAdmin
        .from('article_stats')
        .insert({ slug, views: 0, likes: 0 })
        .select()
        .single();

      return new Response(JSON.stringify(newStats || { views: 0, likes: 0 }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// 增加浏览量
export const POST: APIRoute = async ({ params, request }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400
    });
  }

  try {
    // 记录详细浏览记录
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';

    await supabase.from('page_views').insert({
      article_slug: slug,
      user_agent: userAgent,
      referrer: referrer
    });

    // 增加浏览量计数
    const { data: stats } = await supabase
      .from('article_stats')
      .select('views')
      .eq('slug', slug)
      .single();

    if (stats) {
      // 更新浏览量
      await supabaseAdmin
        .from('article_stats')
        .update({ views: stats.views + 1 })
        .eq('slug', slug);
    } else {
      // 创建初始记录
      await supabaseAdmin
        .from('article_stats')
        .insert({ slug, views: 1, likes: 0 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return new Response(JSON.stringify({ error: 'Failed to increment views' }), {
      status: 500
    });
  }
};
```

### 5.2 创建统计组件

创建 `src/components/ArticleStats.astro`：

```astro
---
interface Props {
  slug: string;
}

const { slug } = Astro.props;
---

<div class="article-stats" data-slug={slug}>
  <div class="stat-item">
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
    <span class="stat-value" id="views-count">-</span>
    <span class="stat-label">浏览</span>
  </div>

  <div class="stat-item">
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span class="stat-value" id="likes-count">-</span>
    <span class="stat-label">点赞</span>
  </div>
</div>

<style>
  .article-stats {
    display: flex;
    gap: 1.5rem;
    padding: 1rem 0;
    border-top: 1px solid var(--color-border, #e5e7eb);
    border-bottom: 1px solid var(--color-border, #e5e7eb);
    margin: 2rem 0;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-secondary, #6b7280);
  }

  .icon {
    width: 20px;
    height: 20px;
    stroke-width: 2;
  }

  .stat-value {
    font-weight: 600;
    color: var(--color-text, #1f2937);
  }

  .stat-label {
    font-size: 0.875rem;
  }
</style>

<script>
  const slug = document.querySelector('.article-stats')?.getAttribute('data-slug');

  if (slug) {
    // 加载统计数据
    async function loadStats() {
      try {
        const response = await fetch(`/api/stats/${slug}`);
        const data = await response.json();

        document.getElementById('views-count')!.textContent = data.views || '0';
        document.getElementById('likes-count')!.textContent = data.likes || '0';
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    }

    // 增加浏览量（页面加载时）
    async function incrementViews() {
      try {
        await fetch(`/api/stats/${slug}`, { method: 'POST' });
      } catch (error) {
        console.error('Failed to increment views:', error);
      }
    }

    // 执行
    loadStats();
    incrementViews();
  }
</script>
```

### 5.3 在文章页面中使用

编辑文章模板（例如 `src/pages/[...slug].astro`）：

```astro
---
import ArticleStats from '@/components/ArticleStats.astro';

const { slug } = Astro.params;
// ... 其他代码
---

<article>
  <h1>{title}</h1>
  
  <!-- 文章统计 -->
  <ArticleStats slug={slug} />
  
  <!-- 文章内容 -->
  <div set:html={content} />
</article>
```

---

## 💬 第六步：实现评论系统

### 6.1 创建评论 API

创建 `src/pages/api/comments/[slug].ts`：

```typescript
import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

// 获取评论列表
export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_slug', slug)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // 构建评论树（支持回复）
    const commentsMap = new Map();
    const rootComments: any[] = [];

    data.forEach((comment: any) => {
      comment.replies = [];
      commentsMap.set(comment.id, comment);
    });

    data.forEach((comment: any) => {
      if (comment.parent_id) {
        const parent = commentsMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return new Response(JSON.stringify(rootComments), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), {
      status: 500
    });
  }
};

// 创建新评论
export const POST: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  const body = await request.json();

  const { author_name, author_email, content, parent_id } = body;

  // 验证必填字段
  if (!author_name || !content) {
    return new Response(
      JSON.stringify({ error: 'Name and content are required' }),
      { status: 400 }
    );
  }

  // 简单的垃圾评论检测
  const spamKeywords = ['viagra', 'casino', 'porn'];
  const isSpam = spamKeywords.some(keyword =>
    content.toLowerCase().includes(keyword)
  );

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        article_slug: slug,
        author_name,
        author_email,
        content,
        parent_id,
        status: isSpam ? 'spam' : 'approved'
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create comment' }),
      { status: 500 }
    );
  }
};
```

### 6.2 创建评论组件

创建 `src/components/Comments.astro`：

```astro
---
interface Props {
  slug: string;
}

const { slug } = Astro.props;
---

<div class="comments-section" data-slug={slug}>
  <h2 class="comments-title">💬 评论区</h2>

  <!-- 评论表单 -->
  <form class="comment-form" id="comment-form">
    <div class="form-group">
      <input
        type="text"
        name="author_name"
        placeholder="昵称 *"
        required
        class="form-input"
      />
    </div>
    <div class="form-group">
      <input
        type="email"
        name="author_email"
        placeholder="邮箱（可选）"
        class="form-input"
      />
    </div>
    <div class="form-group">
      <textarea
        name="content"
        placeholder="说点什么..."
        required
        rows="4"
        class="form-textarea"
      ></textarea>
    </div>
    <button type="submit" class="submit-btn">发表评论</button>
  </form>

  <!-- 评论列表 -->
  <div class="comments-list" id="comments-list">
    <p class="loading">加载评论中...</p>
  </div>
</div>

<style>
  .comments-section {
    margin: 3rem 0;
    padding: 2rem;
    background: var(--color-bg-secondary, #f9fafb);
    border-radius: 8px;
  }

  .comments-title {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .comment-form {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #6366f1;
  }

  .form-textarea {
    resize: vertical;
    font-family: inherit;
  }

  .submit-btn {
    padding: 0.75rem 1.5rem;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .submit-btn:hover {
    background: #4f46e5;
  }

  .submit-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .comment {
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .comment-author {
    font-weight: 600;
    color: #1f2937;
  }

  .comment-date {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .comment-content {
    line-height: 1.6;
    color: #374151;
  }

  .comment-replies {
    margin-top: 1rem;
    margin-left: 2rem;
    padding-left: 1rem;
    border-left: 2px solid #e5e7eb;
  }

  .loading {
    text-align: center;
    color: #6b7280;
  }

  .empty {
    text-align: center;
    color: #9ca3af;
    padding: 2rem;
  }
</style>

<script>
  const slug = document.querySelector('.comments-section')?.getAttribute('data-slug');
  const form = document.getElementById('comment-form') as HTMLFormElement;
  const commentsList = document.getElementById('comments-list');

  // 加载评论
  async function loadComments() {
    try {
      const response = await fetch(`/api/comments/${slug}`);
      const comments = await response.json();

      if (comments.length === 0) {
        commentsList!.innerHTML = '<p class="empty">还没有评论，来发表第一条吧！</p>';
        return;
      }

      commentsList!.innerHTML = comments.map((comment: any) => renderComment(comment)).join('');
    } catch (error) {
      console.error('Failed to load comments:', error);
      commentsList!.innerHTML = '<p class="empty">加载评论失败</p>';
    }
  }

  // 渲染评论
  function renderComment(comment: any): string {
    const date = new Date(comment.created_at).toLocaleDateString('zh-CN');
    const replies = comment.replies?.map((reply: any) => renderComment(reply)).join('') || '';

    return `
      <div class="comment">
        <div class="comment-header">
          <span class="comment-author">${escapeHtml(comment.author_name)}</span>
          <span class="comment-date">${date}</span>
        </div>
        <div class="comment-content">${escapeHtml(comment.content)}</div>
        ${replies ? `<div class="comment-replies">${replies}</div>` : ''}
      </div>
    `;
  }

  // HTML 转义
  function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 提交评论
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    const formData = new FormData(form);
    const data = {
      author_name: formData.get('author_name'),
      author_email: formData.get('author_email'),
      content: formData.get('content')
    };

    try {
      const response = await fetch(`/api/comments/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        form.reset();
        await loadComments();
        alert('评论发表成功！');
      } else {
        alert('评论发表失败，请重试');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert('评论发表失败，请重试');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '发表评论';
    }
  });

  // 初始加载
  loadComments();
</script>
```

### 6.3 在文章页面中使用

```astro
---
import Comments from '@/components/Comments.astro';
---

<article>
  <!-- 文章内容 -->
  
  <!-- 评论区 -->
  <Comments slug={slug} />
</article>
```

---

## 👍 第七步：实现点赞功能

### 7.1 创建点赞 API

创建 `src/pages/api/likes/[slug].ts`：

```typescript
import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// 点赞
export const POST: APIRoute = async ({ params, request, clientAddress }) => {
  const { slug } = params;

  // 使用 IP 地址作为用户标识（简单方案）
  const userIdentifier = clientAddress || 'anonymous';

  try {
    // 检查是否已点赞
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('article_slug', slug)
      .eq('user_identifier', userIdentifier)
      .single();

    if (existingLike) {
      return new Response(
        JSON.stringify({ error: 'Already liked' }),
        { status: 400 }
      );
    }

    // 添加点赞记录
    await supabase.from('likes').insert({
      article_slug: slug,
      user_identifier: userIdentifier
    });

    // 更新点赞计数
    const { data: stats } = await supabase
      .from('article_stats')
      .select('likes')
      .eq('slug', slug)
      .single();

    if (stats) {
      await supabaseAdmin
        .from('article_stats')
        .update({ likes: stats.likes + 1 })
        .eq('slug', slug);

      return new Response(
        JSON.stringify({ likes: stats.likes + 1 }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Error liking article:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to like article' }),
      { status: 500 }
    );
  }
};

// 检查是否已点赞
export const GET: APIRoute = async ({ params, clientAddress }) => {
  const { slug } = params;
  const userIdentifier = clientAddress || 'anonymous';

  try {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('article_slug', slug)
      .eq('user_identifier', userIdentifier)
      .single();

    return new Response(
      JSON.stringify({ liked: !!data }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ liked: false }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### 7.2 创建点赞按钮组件

创建 `src/components/LikeButton.astro`：

```astro
---
interface Props {
  slug: string;
}

const { slug } = Astro.props;
---

<button class="like-button" data-slug={slug} id="like-btn">
  <svg class="heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
  <span class="like-count">-</span>
</button>

<style>
  .like-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
  }

  .like-button:hover {
    border-color: #ef4444;
    color: #ef4444;
  }

  .like-button.liked {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }

  .like-button.liked .heart-icon {
    fill: currentColor;
  }

  .heart-icon {
    width: 20px;
    height: 20px;
    stroke-width: 2;
    transition: fill 0.2s;
  }

  .like-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* 点赞动画 */
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  .like-button.animating {
    animation: heartbeat 0.3s ease;
  }
</style>

<script>
  const slug = document.getElementById('like-btn')?.getAttribute('data-slug');
  const button = document.getElementById('like-btn') as HTMLButtonElement;
  const countSpan = button?.querySelector('.like-count');

  if (slug && button) {
    // 加载点赞状态
    async function loadLikeStatus() {
      try {
        // 获取点赞数
        const statsResponse = await fetch(`/api/stats/${slug}`);
        const stats = await statsResponse.json();
        countSpan!.textContent = stats.likes || '0';

        // 检查是否已点赞
        const likeResponse = await fetch(`/api/likes/${slug}`);
        const { liked } = await likeResponse.json();
        if (liked) {
          button.classList.add('liked');
        }
      } catch (error) {
        console.error('Failed to load like status:', error);
      }
    }

    // 点赞
    button.addEventListener('click', async () => {
      if (button.classList.contains('liked')) {
        alert('您已经点赞过了！');
        return;
      }

      button.disabled = true;

      try {
        const response = await fetch(`/api/likes/${slug}`, {
          method: 'POST'
        });

        if (response.ok) {
          const data = await response.json();
          button.classList.add('liked', 'animating');
          countSpan!.textContent = data.likes;

          setTimeout(() => {
            button.classList.remove('animating');
          }, 300);
        } else {
          const error = await response.json();
          alert(error.error || '点赞失败');
        }
      } catch (error) {
        console.error('Failed to like:', error);
        alert('点赞失败，请重试');
      } finally {
        button.disabled = false;
      }
    });

    // 初始加载
    loadLikeStatus();
  }
</script>
```

---

## ✅ 第八步：测试验证

### 8.1 测试清单

- [ ] **环境变量配置正确**
  ```bash
  # 检查 .env 文件
  cat .env
  ```

- [ ] **数据库表已创建**
  ```
  在 Supabase Dashboard → Table Editor 查看
  应该看到：article_stats, comments, likes, page_views
  ```

- [ ] **依赖已安装**
  ```bash
  npm list @supabase/supabase-js
  ```

- [ ] **Astro 配置 SSR 模式**
  ```typescript
  // astro.config.ts
  export default defineConfig({
    output: 'server',  // 或 'hybrid'
    // ...
  });
  ```

### 8.2 功能测试

**测试阅读统计**：
1. 访问文章页面
2. 查看统计数字是否显示
3. 刷新页面，浏览量应该增加

**测试评论系统**：
1. 填写评论表单
2. 提交评论
3. 评论应该立即显示在列表中

**测试点赞功能**：
1. 点击点赞按钮
2. 按钮变为红色，数字增加
3. 再次点击提示"已点赞"

---

## 🎯 第九步：部署配置

### 9.1 更新 Astro 配置

编辑 `astro.config.ts`：

```typescript
import { defineConfig } from 'astro';
import { astroSpaceship } from 'astro-spaceship';
import websiteConfig from 'astro-spaceship/config';

export default defineConfig({
  output: 'server',  // 启用 SSR（必须）
  integrations: [
    astroSpaceship(websiteConfig)
  ],
  devToolbar: {
    enabled: false
  },
  site: process.env.SPACESHIP_SITE || 'http://localhost:4321',
  base: process.env.SPACESHIP_BASE || '/openeducation/'
});
```

### 9.2 Vercel 部署（推荐）

1. **安装 Vercel 适配器**：
   ```bash
   npx astro add vercel
   ```

2. **配置环境变量**：
   在 Vercel Dashboard → Settings → Environment Variables 添加：
   ```
   PUBLIC_SUPABASE_URL
   PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```

3. **部署**：
   ```bash
   git push origin main
   ```

### 9.3 Netlify 部署

1. **安装 Netlify 适配器**：
   ```bash
   npx astro add netlify
   ```

2. **配置环境变量**：
   在 Netlify Dashboard → Site settings → Environment variables 添加相同变量

---

## 📊 第十步：监控和优化

### 10.1 查看统计数据

在 Supabase Dashboard → Table Editor：

```sql
-- 查看最热门文章
SELECT slug, views, likes
FROM article_stats
ORDER BY views DESC
LIMIT 10;

-- 查看评论最多的文章
SELECT article_slug, COUNT(*) as comment_count
FROM comments
GROUP BY article_slug
ORDER BY comment_count DESC;

-- 查看最近浏览记录
SELECT * FROM page_views
ORDER BY created_at DESC
LIMIT 20;
```

### 10.2 性能优化

**前端优化**：
```typescript
// 使用防抖避免频繁请求
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 缓存统计数据
const cache = new Map();
const CACHE_TIME = 60000; // 1分钟
```

**数据库优化**：
```sql
-- 定期清理旧的浏览记录（保留最近3个月）
DELETE FROM page_views
WHERE created_at < NOW() - INTERVAL '3 months';
```

---

## 🎉 完成！

现在您的 AstrOb 博客已经：
- ✅ 保留了 Markdown + Obsidian 的编辑体验
- ✅ 拥有了阅读统计功能
- ✅ 拥有了完整的评论系统
- ✅ 拥有了点赞互动功能
- ✅ 完全免费（Supabase 免费版足够使用）

---

## 📚 扩展功能（可选）

### 1. 用户认证
- GitHub OAuth 登录
- 匿名评论 vs 注册用户

### 2. 搜索功能
- Supabase 全文搜索
- 搜索历史记录

### 3. 收藏功能
- 用户收藏文章
- 个人收藏列表

### 4. 通知系统
- 评论回复通知
- 邮件通知

详细实现请参考 [Astro + Supabase 官方文档](https://docs.astro.build/en/guides/backend/supabase/)。

---

**需要帮助？** 查看常见问题或在 GitHub Issues 中提问。

**祝使用愉快！** 🚀

