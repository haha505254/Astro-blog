import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// 這個 API 需要在服務器端運行以支持動態參數
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '6');
  const order = url.searchParams.get('order') || 'newest';
  
  console.log('URL search params:', url.searchParams.toString());
  console.log('Parsed params:', { page, limit, order });
  
  // 獲取所有文章並過濾草稿
  const allPosts = await getCollection('blog');
  const posts = allPosts
    .filter(post => !post.data.draft)
    .sort((a, b) => {
      // 根據 order 參數決定排序方向
      if (order === 'oldest') {
        return a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
      }
      return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    });
  
  // 計算分頁
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = posts.slice(startIndex, endIndex);
  
  // 格式化數據
  const formattedPosts = paginatedPosts.map(post => {
    // 處理圖片路徑
    let imageUrl = null;
    const image = post.data.cover || post.data.heroImage;
    if (image) {
      // 如果是本地圖片對象，提取 src
      if (typeof image === 'object' && image.src) {
        imageUrl = image.src;
      } else if (typeof image === 'string') {
        imageUrl = image;
      }
    }
    
    return {
      slug: post.slug || post.id,
      title: post.data.title,
      description: post.data.description,
      excerpt: post.data.excerpt,
      pubDate: post.data.pubDate,
      author: post.data.author || 'Anonymous',
      category: post.data.category,
      tags: post.data.tags || [],
      cover: imageUrl,
      heroImage: imageUrl
    };
  });
  
  return new Response(JSON.stringify({
    posts: formattedPosts,
    hasMore: endIndex < posts.length,
    totalPosts: posts.length,
    currentPage: page,
    totalPages: Math.ceil(posts.length / limit)
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};