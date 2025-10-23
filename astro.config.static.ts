
import { defineConfig } from 'astro/config';

// 静态构建配置（用于 GitHub Pages）
// 注意：不使用 astro-spaceship integration，因为它可能强制 server 模式
// 仅用于生成静态 HTML，不支持 API 路由和 Supabase 动态功能
export default defineConfig({
  output: 'static',  // 静态站点生成
  integrations: [],  // 移除 astro-spaceship，避免强制 server 模式
  devToolbar: {
    enabled: false
  },
  site: process.env.SPACESHIP_SITE || 'http://localhost:4321',
  base: process.env.SPACESHIP_BASE || '/openeducation/'
});
