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

