# 🚀 AstrOb + Supabase MVP 集成方案

> 分阶段实施，逐步增强，从最小 MVP 开始

---

## 📋 方案总览

### 集成策略

本方案采用**渐进式集成**策略，每个阶段都是**独立可用**的功能模块：

```
阶段 1: 阅读统计 (MVP)        ⏱️ 1-2小时  ⭐⭐⭐⭐⭐
    ↓ 验证通过，继续
阶段 2: 点赞功能              ⏱️ 1小时    ⭐⭐⭐⭐☆
    ↓ 验证通过，继续  
阶段 3: 评论系统              ⏱️ 2-3小时  ⭐⭐⭐⭐☆
    ↓ 可选扩展
阶段 4: 高级功能（可选）      ⏱️ 按需     ⭐⭐⭐☆☆
```

### 核心优势

- ✅ **即时可见**：每个阶段都有立即可见的效果
- ✅ **独立运行**：每个功能模块独立，不相互依赖
- ✅ **随时停止**：任何阶段都可以停止，已实现功能继续工作
- ✅ **保留静态**：保持 Markdown 内容管理优势

---

## 🎯 阶段 1：阅读统计（MVP）

**为什么选这个作为 MVP？**
- ⏱️ 最简单：只需 1 张数据表
- 👁️ 即时价值：立刻看到文章热度
- 🔧 最少代码：约 150 行代码
- 🎓 最佳起点：熟悉 Supabase 工作流程

### 1.1 前期准备

#### 注册 Supabase 账号

1. 访问 [Supabase](https://supabase.com)
2. 使用 GitHub 账号登录
3. 创建新项目：
   ```yaml
   名称: astrob-blog
   数据库密码: [生成强密码并保存]
   区域: Southeast Asia (Singapore)
   计划: Free
   ```

#### 获取 API 密钥

进入项目 Dashboard → Settings → API，复制：
- **Project URL**: `https://xxxxx.supabase.co`
- **anon/public key**: `eyJhbGci...` (可在前端使用)

### 1.2 数据库设置

进入 **SQL Editor**，执行以下 SQL：

```sql
-- 创建文章统计表
CREATE TABLE article_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_article_stats_slug ON article_stats(slug);

-- 自动更新 updated_at
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

-- 配置权限策略
ALTER TABLE article_stats ENABLE ROW LEVEL SECURITY;

-- 所有人可读
CREATE POLICY "Anyone can view article stats"
  ON article_stats FOR SELECT
  USING (true);

-- 所有人可创建和更新（用于增加浏览量）
CREATE POLICY "Anyone can insert article stats"
  ON article_stats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update article stats"
  ON article_stats FOR UPDATE
  USING (true);
```

### 1.3 项目配置

#### 安装依赖

```bash
cd F:/IOTO-Doc/AstrOb
npm install @supabase/supabase-js
```

#### 配置环境变量

创建 `.env` 文件：

```env
# Supabase 配置
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 更新 Astro 配置

编辑 `astro.config.ts`：

```typescript
import { defineConfig } from 'astro/config';
import { astroSpaceship } from 'astro-spaceship';
import websiteConfig from 'astro-spaceship/config';

export default defineConfig({
  output: 'hybrid',  // 🔥 关键：启用 hybrid 模式支持 API 路由
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

### 1.4 创建 Supabase 客户端

创建 `src/lib/supabase.ts`：

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);
```

### 1.5 创建 API 端点

创建 `src/pages/api/stats/[slug].ts`：

```typescript
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false; // 禁用预渲染

// 获取统计数据
export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 查询统计
    const { data, error } = await supabase
      .from('article_stats')
      .select('slug, views')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // 如果不存在，返回初始值
    if (!data) {
      return new Response(JSON.stringify({ slug, views: 0 }), {
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
export const POST: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400
    });
  }

  try {
    // 先查询是否存在
    const { data: existing } = await supabase
      .from('article_stats')
      .select('slug, views')
      .eq('slug', slug)
      .single();

    if (existing) {
      // 更新浏览量
      const { error: updateError } = await supabase
        .from('article_stats')
        .update({ views: existing.views + 1 })
        .eq('slug', slug);

      if (updateError) throw updateError;
    } else {
      // 创建新记录
      const { error: insertError } = await supabase
        .from('article_stats')
        .insert({ slug, views: 1 });

      if (insertError) throw insertError;
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

### 1.6 创建统计组件

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
    <span class="stat-label">次浏览</span>
  </div>
</div>

<style>
  .article-stats {
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--color-bg-secondary, #f9fafb);
    border-radius: 6px;
    margin: 1rem 0;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-text-secondary, #6b7280);
    font-size: 0.875rem;
  }

  .icon {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }

  .stat-value {
    font-weight: 600;
    color: var(--color-text, #1f2937);
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
        
        const viewsEl = document.getElementById('views-count');
        if (viewsEl) {
          viewsEl.textContent = data.views?.toString() || '0';
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    }

    // 增加浏览量
    async function incrementViews() {
      try {
        await fetch(`/api/stats/${slug}`, { method: 'POST' });
        // 浏览量增加后重新加载
        setTimeout(loadStats, 100);
      } catch (error) {
        console.error('Failed to increment views:', error);
      }
    }

    // 页面加载时执行
    loadStats();
    incrementViews();
  }
</script>
```

### 1.7 在文章页面中使用

编辑 `src/pages/[...slug].astro`，在合适位置添加：

```astro
---
import ArticleStats from '../components/ArticleStats.astro';

// ... 其他代码
const slug = Astro.params.slug || '';
---

<!-- 在文章标题下方添加 -->
<ArticleStats slug={slug} />
```

### 1.8 测试验证

```bash
# 启动开发服务器
npm run dev

# 访问任意文章页面
# 应该看到 "X 次浏览"
# 刷新页面，数字应该增加
```

✅ **阶段 1 完成！** 你现在已经有了一个带阅读统计的博客。

---

## 🎯 阶段 2：点赞功能

**前置条件**：完成阶段 1

### 2.1 扩展数据库

在 Supabase SQL Editor 执行：

```sql
-- 添加点赞数列
ALTER TABLE article_stats ADD COLUMN likes INTEGER DEFAULT 0;

-- 创建点赞记录表（防止重复点赞）
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  user_identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_slug, user_identifier)
);

CREATE INDEX idx_likes_article_slug ON likes(article_slug);

-- 配置权限
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create likes"
  ON likes FOR INSERT
  WITH CHECK (true);
```

### 2.2 创建点赞 API

创建 `src/pages/api/likes/[slug].ts`：

```typescript
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

// 点赞
export const POST: APIRoute = async ({ params, clientAddress }) => {
  const { slug } = params;
  const userIdentifier = clientAddress || 'anonymous';

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400
    });
  }

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
        JSON.stringify({ error: 'Already liked', liked: true }),
        { status: 400 }
      );
    }

    // 添加点赞记录
    await supabase.from('likes').insert({
      article_slug: slug,
      user_identifier: userIdentifier
    });

    // 更新点赞数
    const { data: stats } = await supabase
      .from('article_stats')
      .select('likes')
      .eq('slug', slug)
      .single();

    const newLikes = (stats?.likes || 0) + 1;
    
    await supabase
      .from('article_stats')
      .update({ likes: newLikes })
      .eq('slug', slug);

    return new Response(
      JSON.stringify({ success: true, likes: newLikes }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error liking article:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to like article' }),
      { status: 500 }
    );
  }
};

// 检查点赞状态
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

### 2.3 更新统计组件

修改 `src/components/ArticleStats.astro`，添加点赞按钮：

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
    <span class="stat-label">次浏览</span>
  </div>

  <button class="like-button" id="like-btn">
    <svg class="heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span id="likes-count">-</span>
  </button>
</div>

<style>
  .article-stats {
    display: inline-flex;
    gap: 1rem;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--color-bg-secondary, #f9fafb);
    border-radius: 6px;
    margin: 1rem 0;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-text-secondary, #6b7280);
    font-size: 0.875rem;
  }

  .icon {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }

  .stat-value {
    font-weight: 600;
    color: var(--color-text, #1f2937);
  }

  .like-button {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    color: #6b7280;
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
    width: 16px;
    height: 16px;
    stroke-width: 2;
    transition: fill 0.2s;
  }

  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }

  .like-button.animating {
    animation: heartbeat 0.3s ease;
  }
</style>

<script>
  const slug = document.querySelector('.article-stats')?.getAttribute('data-slug');
  const likeBtn = document.getElementById('like-btn') as HTMLButtonElement;

  if (slug && likeBtn) {
    // 加载统计
    async function loadStats() {
      try {
        const response = await fetch(`/api/stats/${slug}`);
        const data = await response.json();
        
        const viewsEl = document.getElementById('views-count');
        const likesEl = document.getElementById('likes-count');
        
        if (viewsEl) viewsEl.textContent = data.views?.toString() || '0';
        if (likesEl) likesEl.textContent = data.likes?.toString() || '0';

        // 检查点赞状态
        const likeResponse = await fetch(`/api/likes/${slug}`);
        const { liked } = await likeResponse.json();
        if (liked) {
          likeBtn.classList.add('liked');
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    }

    // 增加浏览量
    async function incrementViews() {
      try {
        await fetch(`/api/stats/${slug}`, { method: 'POST' });
      } catch (error) {
        console.error('Failed to increment views:', error);
      }
    }

    // 点赞
    likeBtn.addEventListener('click', async () => {
      if (likeBtn.classList.contains('liked')) {
        alert('您已经点赞过了！');
        return;
      }

      likeBtn.disabled = true;

      try {
        const response = await fetch(`/api/likes/${slug}`, {
          method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
          likeBtn.classList.add('liked', 'animating');
          const likesEl = document.getElementById('likes-count');
          if (likesEl) likesEl.textContent = data.likes?.toString() || '0';

          setTimeout(() => {
            likeBtn.classList.remove('animating');
          }, 300);
        } else {
          alert(data.error || '点赞失败');
        }
      } catch (error) {
        console.error('Failed to like:', error);
        alert('点赞失败，请重试');
      } finally {
        likeBtn.disabled = false;
      }
    });

    // 初始化
    loadStats();
    incrementViews();
  }
</script>
```

✅ **阶段 2 完成！** 现在文章有浏览量和点赞功能了。

---

## 🎯 阶段 3：评论系统

**前置条件**：完成阶段 1 和 2

### 3.1 创建评论表

```sql
-- 评论表
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_article_slug ON comments(article_slug);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- 权限设置
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved comments"
  ON comments FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can create comments"
  ON comments FOR INSERT
  WITH CHECK (true);
```

### 3.2 创建评论 API

创建 `src/pages/api/comments/[slug].ts`：

```typescript
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

// 获取评论列表
export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_slug', slug)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data || []), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), {
      status: 500
    });
  }
};

// 创建评论
export const POST: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  const body = await request.json();

  const { author_name, author_email, content } = body;

  if (!author_name || !content) {
    return new Response(
      JSON.stringify({ error: '昵称和内容为必填项' }),
      { status: 400 }
    );
  }

  // 简单的垃圾评论过滤
  const spamKeywords = ['viagra', 'casino', 'porn', '赌博', '色情'];
  const isSpam = spamKeywords.some(keyword =>
    content.toLowerCase().includes(keyword.toLowerCase())
  );

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        article_slug: slug,
        author_name,
        author_email,
        content,
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
      JSON.stringify({ error: '评论提交失败' }),
      { status: 500 }
    );
  }
};
```

### 3.3 创建评论组件

创建 `src/components/Comments.astro`：

```astro
---
interface Props {
  slug: string;
}

const { slug } = Astro.props;
---

<div class="comments-section" data-slug={slug}>
  <h2 class="comments-title">💬 评论</h2>

  <!-- 评论表单 -->
  <form class="comment-form" id="comment-form">
    <div class="form-row">
      <input
        type="text"
        name="author_name"
        placeholder="昵称 *"
        required
        class="form-input"
      />
      <input
        type="email"
        name="author_email"
        placeholder="邮箱（可选）"
        class="form-input"
      />
    </div>
    <textarea
      name="content"
      placeholder="说点什么..."
      required
      rows="3"
      class="form-textarea"
    ></textarea>
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
    font-size: 1.25rem;
  }

  .comment-form {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    font-family: inherit;
  }

  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #6366f1;
  }

  .form-textarea {
    resize: vertical;
    margin-bottom: 1rem;
  }

  .submit-btn {
    padding: 0.75rem 1.5rem;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
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
    padding: 1rem;
    background: white;
    border-radius: 8px;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .comment-author {
    font-weight: 600;
    color: #1f2937;
  }

  .comment-date {
    color: #6b7280;
  }

  .comment-content {
    line-height: 1.6;
    color: #374151;
  }

  .loading, .empty {
    text-align: center;
    color: #6b7280;
    padding: 2rem;
  }

  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }
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

      commentsList!.innerHTML = comments.map((comment: any) => {
        const date = new Date(comment.created_at).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });

        return `
          <div class="comment">
            <div class="comment-header">
              <span class="comment-author">${escapeHtml(comment.author_name)}</span>
              <span class="comment-date">${date}</span>
            </div>
            <div class="comment-content">${escapeHtml(comment.content)}</div>
          </div>
        `;
      }).join('');
    } catch (error) {
      console.error('Failed to load comments:', error);
      commentsList!.innerHTML = '<p class="empty">加载评论失败</p>';
    }
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
        const error = await response.json();
        alert(error.error || '评论发表失败，请重试');
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

### 3.4 在文章页面使用

编辑 `src/pages/[...slug].astro`：

```astro
---
import ArticleStats from '../components/ArticleStats.astro';
import Comments from '../components/Comments.astro';

// ... 其他代码
const slug = Astro.params.slug || '';
---

<!-- 文章内容 -->

<!-- 统计信息 -->
<ArticleStats slug={slug} />

<!-- 评论区 -->
<Comments slug={slug} />
```

✅ **阶段 3 完成！** 现在有了完整的评论系统。

---

## 🎯 阶段 4：高级功能（可选）

完成前三个阶段后，可以根据需要添加：

### 可选功能列表

1. **用户认证**
   - GitHub OAuth 登录
   - 用户个人资料
   - 时间：4-6 小时

2. **搜索功能**
   - 全文搜索
   - 搜索历史
   - 时间：3-4 小时

3. **收藏系统**
   - 用户收藏文章
   - 收藏列表页面
   - 时间：2-3 小时

4. **评论回复**
   - 嵌套评论
   - @提及用户
   - 时间：2-3 小时

5. **邮件通知**
   - 新评论通知
   - 回复通知
   - 时间：2-3 小时

---

## 📊 部署配置

### 更新 Vercel 环境变量

在 Vercel Dashboard → Settings → Environment Variables 添加：

```
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 部署命令

```bash
git add .
git commit -m "feat: 集成 Supabase 动态功能"
git push origin main
```

---

## ✅ 验证清单

### 阶段 1 验证

- [ ] 访问文章页面看到浏览量
- [ ] 刷新页面浏览量增加
- [ ] 在 Supabase 表中看到数据

### 阶段 2 验证

- [ ] 点赞按钮显示正常
- [ ] 点击后数字增加
- [ ] 刷新后仍显示已点赞状态

### 阶段 3 验证

- [ ] 评论表单可以提交
- [ ] 评论立即显示
- [ ] 评论按时间排序

---

## 🆘 常见问题

### 1. API 路由 404

**原因**：Astro 配置不是 `hybrid` 或 `server` 模式

**解决**：
```typescript
// astro.config.ts
export default defineConfig({
  output: 'hybrid',  // 或 'server'
  // ...
});
```

### 2. 环境变量未加载

**解决**：
```bash
# 重启开发服务器
npm run dev
```

### 3. CORS 错误

**解决**：确保 Supabase 项目设置中允许你的域名

### 4. 浏览量不增加

**检查**：
- 浏览器控制台是否有错误
- Supabase 表权限是否正确设置

---

## 📚 参考资源

- [Astro 官方文档 - Supabase](https://docs.astro.build/en/guides/backend/supabase/)
- [Supabase 文档](https://supabase.com/docs)
- [Astro SSR 指南](https://docs.astro.build/en/guides/server-side-rendering/)

---

## 🎉 总结

通过这个 MVP 方案，你可以：

- ✅ **快速验证**：每个阶段 1-3 小时即可完成
- ✅ **独立运行**：任何阶段都可以独立使用
- ✅ **渐进增强**：逐步添加功能，降低风险
- ✅ **保持简单**：代码清晰，易于维护

**建议顺序**：
1. 先完成阶段 1（阅读统计），验证整个流程
2. 如果顺利，继续阶段 2（点赞）
3. 确认前两个阶段稳定后，再做阶段 3（评论）
4. 阶段 4 按实际需求选择性实施

祝使用愉快！🚀

