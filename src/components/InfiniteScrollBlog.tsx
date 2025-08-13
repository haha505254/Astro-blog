import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Post {
  slug: string;
  title: string;
  description: string;
  excerpt?: string;
  pubDate: string;
  author: string;
  category?: string;
  tags: string[];
  cover?: string;
  heroImage?: string;
}

export default function InfiniteScrollBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 加載文章
  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/posts.json?page=${page}&limit=6`);
      const data = await response.json();
      
      setPosts(prev => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // 初始加載
  useEffect(() => {
    loadPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 設置 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadPosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadPosts, hasMore, loading]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          部落格文章
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          探索最新的技術文章、教學和心得分享
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {posts.map((post, index) => {
          const displayImage = post.cover || post.heroImage;
          const isFirstPost = index === 0;
          
          return (
            <article 
              key={`${post.slug}-${index}`}
              className={`group ${isFirstPost ? 'md:col-span-2 lg:col-span-3' : ''}`}
            >
              <a href={`/blog/${post.slug}/`} className="block">
                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden ${isFirstPost ? 'md:flex' : ''}`}>
                  {displayImage && (
                    <div className={`relative overflow-hidden ${isFirstPost ? 'md:w-1/2' : ''}`}>
                      <img 
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${isFirstPost ? 'h-full min-h-[400px]' : 'h-48'}`}
                        src={displayImage}
                        alt={post.title}
                        loading="lazy"
                      />
                      {post.category && (
                        <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      )}
                    </div>
                  )}
                  <div className={`p-6 ${isFirstPost ? 'md:w-1/2' : ''}`}>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>{formatDate(post.pubDate)}</span>
                      <span className="mx-2">·</span>
                      <span>{post.author}</span>
                    </div>
                    
                    <h2 className={`font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${isFirstPost ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt || post.description}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            </article>
          );
        })}
      </div>

      {/* 無限滾動觸發點 */}
      <div ref={observerTarget} className="h-10 mt-8" />

      {/* 加載提示 */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}

      {/* 沒有更多文章 */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            已經到底了，沒有更多文章了 ✨
          </p>
        </div>
      )}

      {/* 沒有文章 */}
      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            目前還沒有發布任何文章。
          </p>
        </div>
      )}
    </div>
  );
}