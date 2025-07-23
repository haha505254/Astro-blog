# Astro + MDX 部落格

一個使用 Astro、MDX、React 和 Tailwind CSS 建立的現代化部落格模板。

## 🚀 特色功能

- ⚡️ **極致效能** - 使用 Astro 靜態生成，幾乎零 JavaScript
- 📝 **MDX 支援** - 在 Markdown 中使用 React 組件
- 🎨 **Tailwind CSS** - 實用優先的 CSS 框架
- 🌙 **深色模式** - 內建深色/淺色模式切換
- 📱 **響應式設計** - 完美適配各種裝置
- 🏷️ **標籤系統** - 文章分類與標籤功能
- 📄 **草稿功能** - 支援草稿文章管理
- 🔍 **SEO 優化** - 內建 meta 標籤和 sitemap
- 📡 **RSS 訂閱** - 自動生成 RSS feed

## 📦 專案結構

```
/
├── public/
├── src/
│   ├── assets/          # 圖片資源
│   ├── components/      # Astro/React 組件
│   ├── content/
│   │   └── blog/       # 部落格文章 (MD/MDX)
│   ├── layouts/        # 版面配置組件
│   ├── pages/          # 路由頁面
│   └── styles/         # 全域樣式
├── astro.config.mjs
├── tailwind.config.js
└── package.json
```

## 🛠️ 快速開始

### 安裝

```bash
npm install
```

### 開發

```bash
npm run dev
```

瀏覽 http://localhost:4321 查看網站。

### 建置

```bash
npm run build
```

### 預覽建置結果

```bash
npm run preview
```

## ✍️ 撰寫文章

### 建立新文章

在 `src/content/blog/` 目錄下建立新的 `.md` 或 `.mdx` 檔案：

```markdown
---
title: '文章標題'
description: '文章描述'
pubDate: 2025-07-23
author: '作者名稱'
heroImage: '../../assets/your-image.jpg'
tags: ['標籤1', '標籤2']
category: '分類'
excerpt: '文章摘要'
draft: false
---

您的文章內容...
```

### 使用 MDX

MDX 文件可以導入並使用 React 組件：

```mdx
---
title: 'MDX 範例'
---

import { Card, Alert } from '../../components/MDXComponents.jsx';

# 歡迎使用 MDX！

<Alert type="info">
  這是一個在 MDX 中使用的 React 組件。
</Alert>

<Card title="互動卡片">
  您可以在文章中加入互動式內容！
</Card>
```

### 草稿文章

將 `draft: true` 加入 frontmatter 即可將文章設為草稿：

```yaml
---
title: '草稿文章'
draft: true
---
```

草稿文章不會出現在部落格列表、RSS feed 或 sitemap 中。

## 🎨 自定義

### 修改主題顏色

編輯 `tailwind.config.js` 來自定義顏色主題。

### 新增組件

在 `src/components/` 目錄下建立新的 Astro 或 React 組件。

### 修改版面

編輯 `src/layouts/` 中的版面配置檔案。

## 🚀 部署

本專案可以部署到任何支援靜態網站的平台：

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### 其他平台

參考 [Astro 部署指南](https://docs.astro.build/en/guides/deploy/)。

## 📄 授權

MIT License

## 🤝 貢獻

歡迎提交 Pull Request 或開啟 Issue！