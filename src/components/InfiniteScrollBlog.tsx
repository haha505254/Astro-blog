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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [autoLoadCount, setAutoLoadCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [order, setOrder] = useState<'newest' | 'oldest'>('newest');
  const observerTarget = useRef<HTMLDivElement>(null);
  const maxAutoLoads = 3;

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 載入文章
  const loadPosts = useCallback(async (page: number, orderBy: 'newest' | 'oldest' = 'newest', reset: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/posts.json?page=${page}&limit=6&order=${orderBy}`);
      const data = await response.json();
      
      if (reset) {
        setPosts(data.posts);
        setCurrentPage(1);
        setAutoLoadCount(0);
        setHasMore(data.hasMore);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // 載入更多文章
  const loadMorePosts = useCallback(() => {
    if (!hasMore || loading) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setAutoLoadCount(prev => prev + 1);
    loadPosts(nextPage, order);
  }, [currentPage, hasMore, loading, order, loadPosts]);

  // 快速跳轉
  const jumpToOldest = async () => {
    setOrder('oldest');
    await loadPosts(1, 'oldest', true);
  };

  const jumpToNewest = async () => {
    setOrder('newest');
    await loadPosts(1, 'newest', true);
  };

  // 初始載入
  useEffect(() => {
    loadPosts(1, 'newest', true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          // 只有在自動載入次數未超過限制時才自動載入
          if (autoLoadCount < maxAutoLoads) {
            loadMorePosts();
          }
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
  }, [hasMore, loading, autoLoadCount, loadMorePosts]);

  // 監聽滾動顯示回到頂部按鈕
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 頂部工具列 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">部落格文章</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              已載入 {posts.length} 篇文章
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* 快速跳轉按鈕 */}
            <div className="flex gap-2">
              <button
                onClick={jumpToNewest}
                disabled={order === 'newest' && currentPage === 1}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                最新文章
              </button>
              <button
                onClick={jumpToOldest}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                最舊文章
              </button>
            </div>
            
            {/* 瀏覽模式切換 */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">瀏覽模式：</span>
              <select
                value="infinite"
                onChange={(e) => {
                  if (e.target.value === 'paged') {
                    window.location.href = '/blog/1';
                  }
                }}
                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="infinite">無限滾動</option>
                <option value="paged">分頁瀏覽</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {posts.map((post, index) => {
          const displayImage = post.cover || post.heroImage;
          const isFirstPost = index === 0 && order === 'newest';
          
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
                      <time dateTime={post.pubDate}>
                        {formatDate(post.pubDate)}
                      </time>
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

      {/* 載入更多區域 */}
      <div ref={observerTarget} className="mt-12 text-center">
        {loading && (
          <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            載入中...
          </div>
        )}
        
        {!loading && hasMore && autoLoadCount >= maxAutoLoads && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              已自動載入 {maxAutoLoads} 次，需要查看更多嗎？
            </p>
            <button
              onClick={loadMorePosts}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              載入更多文章
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              或者 <a href="/blog/1" className="text-blue-600 dark:text-blue-400 hover:underline">使用分頁瀏覽</a>
            </div>
          </div>
        )}
        
        {!hasMore && posts.length > 0 && (
          <div className="space-y-4 py-8">
            <p className="text-gray-600 dark:text-gray-400">
              🎉 你已經看完所有 {posts.length} 篇文章了！
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={scrollToTop}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                回到頂部
              </button>
              <a
                href="/blog/1"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                分頁瀏覽
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 浮動回到頂部按鈕 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
          aria-label="回到頂部"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
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