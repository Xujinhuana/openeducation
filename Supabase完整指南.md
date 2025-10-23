# 🚀 Supabase 集成完整指南

> AstrOb 博客的 Supabase 集成文档 - 从配置到扩展的一站式指南

---

## 📋 目录

- [当前状态](#当前状态)
- [快速开始](#快速开始)
- [已实现功能](#已实现功能)
- [扩展功能](#扩展功能)
- [常见问题](#常见问题)
- [部署配置](#部署配置)

---

## ✅ 当前状态

### 已完成的配置

#### 1. 基础架构 ✅
- **Astro 配置**：`output: 'server'` 模式
- **静态页面预渲染**：`export const prerender = true;`
- **Supabase 客户端**：`src/lib/supabase.ts`
- **依赖安装**：`@supabase/supabase-js` v2.76.1

#### 2. 已实现功能 ✅
- **阶段 1：文章阅读统计**
  - ✅ 浏览量自动统计
  - ✅ 实时显示统计数据
  - ✅ API 端点：`/api/stats/[slug]`
  - ✅ 统计组件自动注入

---

## 🚀 快速开始

### 前提条件

确保你已经：
- ✅ 注册 Supabase 账号
- ✅ 创建了 Supabase 项目

### 第 1 步：创建数据库表 🗄️

在 Supabase Dashboard 执行以下 SQL：

1. **进入 SQL Editor**
   - 左侧菜单 → SQL Editor（`</>` 图标）
   - 点击 **+ New query**

2. **执行以下 SQL**

```sql
-- ============================================
-- 创建文章统计表
-- ============================================
CREATE TABLE IF NOT EXISTS article_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_article_stats_slug ON article_stats(slug);

-- 自动更新时间戳
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_article_stats_updated_at ON article_stats;
CREATE TRIGGER update_article_stats_updated_at
BEFORE UPDATE ON article_stats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 配置行级安全
ALTER TABLE article_stats ENABLE ROW LEVEL SECURITY;

-- 访问权限策略
DROP POLICY IF EXISTS "Anyone can view article stats" ON article_stats;
CREATE POLICY "Anyone can view article stats"
  ON article_stats FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert article stats" ON article_stats;
CREATE POLICY "Anyone can insert article stats"
  ON article_stats FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update article stats" ON article_stats;
CREATE POLICY "Anyone can update article stats"
  ON article_stats FOR UPDATE
  USING (true);

-- 插入测试数据
INSERT INTO article_stats (slug, views) 
VALUES ('test-article', 1)
ON CONFLICT (slug) DO NOTHING;

-- 验证
SELECT * FROM article_stats;
```

### 第 2 步：获取 API 密钥 🔑

1. **进入设置**
   - 左侧菜单 → Settings（⚙️ 图标）
   - 点击 **API**

2. **复制以下信息**
   - **Project URL**：`https://xxxxx.supabase.co`
   - **anon public**：`eyJhbGci...`（很长的字符串）

   ⚠️ **注意**：复制 **anon public**，不是 **service_role**

### 第 3 步：配置环境变量 ⚙️

在项目根目录创建 `.env` 文件：

```env
# Supabase 配置
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**替换成你的真实配置**（从第 2 步获取）

### 第 4 步：测试运行 🧪

```bash
# 启动开发服务器
npm run dev

# 访问任意文章页面
# 应该看到 "👁️ X 次浏览"
```

### 验证成功 ✅

- [ ] 文章页面显示浏览量
- [ ] 刷新页面，数字会增加
- [ ] Supabase Table Editor 中能看到数据
- [ ] 浏览器控制台无错误

---

## 📦 已实现功能

### 阶段 1：文章阅读统计 ✅

**功能说明**：
- 每次访问文章自动增加浏览量
- 实时显示统计数据
- 数据持久化存储

**技术架构**：
```
文章页面
    ↓
自动注入统计组件 (inject-article-stats.ts)
    ↓
调用 API: GET /api/stats/[slug]  (获取浏览量)
调用 API: POST /api/stats/[slug] (增加浏览量)
    ↓
Supabase PostgreSQL
    ↓
返回更新后的数据
```

**相关文件**：
- `src/lib/supabase.ts` - Supabase 客户端
- `src/pages/api/stats/[slug].ts` - API 端点
- `src/components/ArticleStats.astro` - 统计组件
- `src/scripts/inject-article-stats.ts` - 自动注入脚本
- `src/pages/[...slug].astro` - 文章页面（已集成）

---

## 🎯 扩展功能

### 阶段 2：点赞功能 ❤️（⏱️ 1-2 小时）

**功能**：读者可以为文章点赞，防止重复点赞

**实施步骤**：

#### 2.1 扩展数据库

在 Supabase SQL Editor 执行：

```sql
-- 添加点赞数列
ALTER TABLE article_stats ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- 创建点赞记录表
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  user_identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_slug, user_identifier)
);

CREATE INDEX IF NOT EXISTS idx_likes_article_slug ON likes(article_slug);

-- 配置权限
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view likes" ON likes;
CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create likes" ON likes;
CREATE POLICY "Anyone can create likes"
  ON likes FOR INSERT WITH CHECK (true);
```

#### 2.2 创建点赞 API

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

#### 2.3 更新统计组件

更新 `src/components/ArticleStats.astro`，添加点赞按钮和逻辑。

**效果**：`👁️ 123 次浏览  ❤️ 45 点赞`

---

### 阶段 3：评论系统 💬（⏱️ 2-3 小时）

**功能**：读者可以发表评论，支持垃圾评论过滤

**数据库表**：

```sql
-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_article_slug ON comments(article_slug);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- 权限设置
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved comments" ON comments;
CREATE POLICY "Anyone can view approved comments"
  ON comments FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Anyone can create comments" ON comments;
CREATE POLICY "Anyone can create comments"
  ON comments FOR INSERT
  WITH CHECK (true);
```

**需要创建的文件**：
- `src/pages/api/comments/[slug].ts` - 评论 API
- `src/components/Comments.astro` - 评论组件

---

### 阶段 4：高级功能（可选）

| 功能 | 时间 | 难度 | 说明 |
|------|------|------|------|
| 用户认证 | 4-6h | ⭐⭐⭐⭐ | GitHub OAuth |
| 文章收藏 | 2-3h | ⭐⭐⭐ | 收藏功能 |
| 全文搜索 | 3-4h | ⭐⭐⭐⭐ | Supabase 全文搜索 |
| 评论回复 | 2-3h | ⭐⭐⭐ | 嵌套评论 |
| 邮件通知 | 2-3h | ⭐⭐⭐ | SendGrid/Resend |

详细实施方案请参考 `自定义功能清单.md`

---

## 🔧 常见问题

### 问题 1：API 返回 404

**原因**：
- Astro 配置不是 `server` 模式
- 或 API 文件的 `prerender` 没有设置为 `false`

**解决**：
```typescript
// astro.config.ts
export default defineConfig({
  output: 'server',  // 必须
  // ...
});

// src/pages/api/stats/[slug].ts
export const prerender = false;  // 必须
```

---

### 问题 2：环境变量未加载

**原因**：
- `.env` 文件位置不对
- 变量名不是以 `PUBLIC_` 开头
- 没有重启开发服务器

**解决**：
```bash
# 1. 确认 .env 在项目根目录
# 2. 确认变量名有 PUBLIC_ 前缀
# 3. 重启服务器
npm run dev
```

---

### 问题 3："Cannot read properties of undefined"

**原因**：
- 静态页面在 `server` 模式下没有预渲染

**解决**：
```typescript
// src/pages/[...slug].astro
export const prerender = true;  // 添加这一行
```

---

### 问题 4：浏览量不增加

**检查清单**：
- [ ] `.env` 文件配置正确
- [ ] Supabase 表权限设置正确（RLS 策略）
- [ ] 浏览器控制台无错误
- [ ] Network 标签显示 API 请求成功（200）

**调试**：
```javascript
// 浏览器控制台
fetch('/api/stats/test-article')
  .then(r => r.json())
  .then(console.log);
```

---

### 问题 5：CORS 错误

**解决**：
在 Supabase Dashboard → Settings → API → CORS 中添加你的域名。

---

## 🚀 部署配置

### Vercel 部署

#### 1. 配置环境变量

在 Vercel Dashboard → Settings → Environment Variables 添加：

```
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

#### 2. 部署

```bash
git add .
git commit -m "feat: 集成 Supabase"
git push origin main
```

Vercel 会自动部署。

---

### GitHub Pages 部署

⚠️ **注意**：GitHub Pages 不支持 `server` 模式的 API 路由。

**解决方案**：
- 使用 Vercel/Netlify 部署
- 或将 API 改为无服务器函数

---

## 📊 项目结构

```
AstrOb/
├─ src/
│  ├─ lib/
│  │  └─ supabase.ts              # Supabase 客户端
│  ├─ pages/
│  │  ├─ api/
│  │  │  ├─ stats/
│  │  │  │  └─ [slug].ts          # 统计 API
│  │  │  └─ likes/                # 点赞 API（扩展）
│  │  │     └─ [slug].ts
│  │  └─ [...slug].astro          # 文章页面
│  ├─ components/
│  │  └─ ArticleStats.astro       # 统计组件
│  └─ scripts/
│     └─ inject-article-stats.ts  # 自动注入脚本
├─ .env                            # 环境变量（需创建）
├─ astro.config.ts                # Astro 配置
└─ package.json                    # 依赖
```

---

## 📚 相关资源

### 官方文档
- [Astro 官方文档 - Supabase](https://docs.astro.build/en/guides/backend/supabase/)
- [Supabase 文档](https://supabase.com/docs)
- [Astro SSR 指南](https://docs.astro.build/en/guides/server-side-rendering/)

### 项目文档
- `功能路线图.md` - 可添加的功能列表
- `自定义功能清单.md` - 30+ 种自定义功能

---

## 🎯 快速命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 同步 Astro 类型
npm run sync
```

---

## ✅ 检查清单

### 初次配置
- [ ] 创建 Supabase 项目
- [ ] 执行 SQL 创建表
- [ ] 获取 API 密钥
- [ ] 创建 `.env` 文件
- [ ] 测试本地运行
- [ ] 验证数据写入

### 部署前
- [ ] 在 Vercel 配置环境变量
- [ ] 测试 API 端点
- [ ] 检查 Supabase RLS 策略
- [ ] 确认 CORS 设置

---

## 🆘 需要帮助？

如果遇到问题：
1. 查看浏览器控制台的错误信息
2. 检查 Supabase Dashboard 的 Logs
3. 参考本文档的"常见问题"部分

想要添加更多功能？告诉我：
- "帮我添加点赞功能"
- "帮我添加评论系统"
- "我想要自定义功能"

---

**最后更新**：2024-01

祝使用愉快！🚀

