import { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';

const Search = ({ posts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  // 設定 Fuse.js
  const fuse = new Fuse(posts, {
    keys: [
      { name: 'title', weight: 0.3 },
      { name: 'description', weight: 0.2 },
      { name: 'excerpt', weight: 0.2 },
      { name: 'tags', weight: 0.15 },
      { name: 'category', weight: 0.1 },
      { name: 'body', weight: 0.05 }
    ],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 1
  });

  useEffect(() => {
    if (searchTerm.length >= 1) {
      setIsSearching(true);
      const results = fuse.search(searchTerm);
      setSearchResults(results.slice(0, 10)); // 最多顯示 10 個結果
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // 高亮搜尋關鍵字
  const highlightText = (text, term) => {
    if (!term || !text) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">{part}</mark> : 
        part
    );
  };

  // 格式化日期
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* 搜尋輸入框 */}
      <div className="relative mb-8">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋文章標題、內容、標籤..."
            className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* 搜尋提示 - 已移除，因為現在支援單字元搜尋 */}
      </div>

      {/* 搜尋結果統計 */}
      {searchTerm.length >= 1 && (
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {searchResults.length > 0 
              ? `找到 ${searchResults.length} 篇相關文章`
              : '沒有找到相關文章'}
          </p>
        </div>
      )}

      {/* 搜尋結果列表 */}
      <div className="space-y-6">
        {searchResults.map(({ item, score }) => (
          <article 
            key={item.slug}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
          >
            <a href={`/blog/${item.slug}/`} className="block group">
              {/* 文章元信息 */}
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <time dateTime={item.pubDate}>
                  {formatDate(item.pubDate)}
                </time>
                <span className="mx-2">·</span>
                <span>{item.author}</span>
                {item.category && (
                  <>
                    <span className="mx-2">·</span>
                    <span className="text-blue-600 dark:text-blue-400">{item.category}</span>
                  </>
                )}
                {/* 相關度分數 */}
                <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  相關度: {Math.round((1 - score) * 100)}%
                </span>
              </div>

              {/* 標題 */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {highlightText(item.title, searchTerm)}
              </h2>

              {/* 描述/摘要 */}
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {highlightText(item.excerpt || item.description, searchTerm)}
              </p>

              {/* 標籤 */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      #{highlightText(tag, searchTerm)}
                    </span>
                  ))}
                </div>
              )}
            </a>
          </article>
        ))}
      </div>

      {/* 無搜尋詞時的提示 */}
      {!searchTerm && (
        <div className="text-center py-12">
          <svg 
            className="mx-auto w-24 h-24 text-gray-300 dark:text-gray-600 mb-4"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            開始搜尋
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            輸入關鍵字來搜尋文章
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;