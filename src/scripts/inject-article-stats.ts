/**
 * 动态注入文章统计组件
 * 由于使用了 astro-spaceship 主题，通过 JavaScript 动态插入统计组件
 * 
 * 注意：仅在启用 Supabase 功能时执行（Vercel 部署）
 */

// 检查是否启用 Supabase 功能
const enableSupabase = import.meta.env.PUBLIC_ENABLE_SUPABASE === 'true';

if (!enableSupabase) {
  console.log('[ArticleStats] Supabase 功能未启用，跳过统计组件注入');
  // 不执行任何操作
} else {
  console.log('[ArticleStats] Supabase 功能已启用，注入统计组件');
  
  // 添加样式
  const style = document.createElement('style');
style.textContent = `
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

  .stat-item .icon {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }

  .stat-item .stat-value {
    font-weight: 600;
    color: var(--color-text, #1f2937);
  }
`;
document.head.appendChild(style);

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
  // 获取文章 slug（从 URL 路径获取）
  const pathParts = window.location.pathname.split('/').filter(p => p && p !== 'openeducation');
  const slug = pathParts.join('/') || '';
  
  if (!slug) {
    console.log('No article slug found');
    return;
  }

  // 查找文章容器（可能需要根据实际主题结构调整选择器）
  const articleContainer = document.querySelector('article') || 
                          document.querySelector('.article') ||
                          document.querySelector('main');
  
  if (!articleContainer) {
    console.log('Article container not found');
    return;
  }

  // 创建统计组件
  const statsDiv = document.createElement('div');
  statsDiv.className = 'article-stats';
  statsDiv.setAttribute('data-slug', slug);
  statsDiv.innerHTML = `
    <div class="stat-item">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      <span class="stat-value" id="views-count">-</span>
      <span class="stat-label">次浏览</span>
    </div>
  `;

  // 插入到文章标题后（可能需要根据实际主题结构调整）
  const title = articleContainer.querySelector('h1');
  if (title) {
    title.after(statsDiv);
    console.log('Article stats component injected');
  } else {
    // 如果找不到 h1，插入到容器开头
    articleContainer.prepend(statsDiv);
  }

  // 加载并显示统计数据
  loadAndIncrementStats(slug);
});

/**
 * 加载统计数据并增加浏览量
 */
async function loadAndIncrementStats(slug: string) {
  try {
    // 先加载当前统计
    const response = await fetch(`/api/stats/${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const viewsEl = document.getElementById('views-count');
    if (viewsEl) {
      viewsEl.textContent = data.views?.toString() || '0';
    }

    // 增加浏览量（在后台进行）
    fetch(`/api/stats/${slug}`, { method: 'POST' })
      .then(() => {
        // 浏览量增加后延迟重新加载
        setTimeout(async () => {
          const newResponse = await fetch(`/api/stats/${slug}`);
          const newData = await newResponse.json();
          if (viewsEl) {
            viewsEl.textContent = newData.views?.toString() || '0';
          }
        }, 100);
      })
      .catch(error => {
        console.error('Failed to increment views:', error);
      });

  } catch (error) {
    console.error('Failed to load stats:', error);
    const viewsEl = document.getElementById('views-count');
    if (viewsEl) {
      viewsEl.textContent = '0';
    }
  }
}
} // 结束 enableSupabase 的 else 块
