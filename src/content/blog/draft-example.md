---
title: '這是一篇草稿文章'
description: '這篇文章還在撰寫中，不會出現在公開的部落格列表中'
pubDate: 2025-07-23
author: '作者'
heroImage: '../../assets/blog-placeholder-5.jpg'
tags: ['草稿', '範例']
category: '未分類'
excerpt: '這是一篇草稿範例，展示草稿功能如何運作。只有將 draft 設為 false 或移除此欄位，文章才會公開發布。'
draft: true
---

# 草稿文章範例

這是一篇草稿文章的範例。因為在 frontmatter 中設定了 `draft: true`，所以這篇文章：

- ❌ 不會出現在部落格列表頁面
- ❌ 不會被包含在 RSS feed 中
- ❌ 不會出現在網站地圖中
- ❌ 無法透過 URL 直接訪問

## 如何使用草稿功能

在文章的 frontmatter 中加入 `draft: true` 即可將文章設為草稿：

```yaml
---
title: '文章標題'
draft: true
---
```

當你準備好發布文章時，只需要：
1. 將 `draft: true` 改為 `draft: false`
2. 或者完全移除 `draft` 欄位（預設為 false）

這個功能對於：
- 撰寫尚未完成的文章
- 預先準備但還不想公開的內容
- 需要審核或校對的文章

非常有用！