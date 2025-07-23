# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an Astro-based blog with MDX support, React components, and Tailwind CSS. The site generates static HTML with minimal JavaScript, focusing on performance and content authoring experience.

## Development Commands

```bash
npm run dev        # Start development server at http://localhost:4321
npm run build      # Build production site to ./dist
npm run preview    # Preview production build locally
npm run astro      # Direct access to Astro CLI
```

## Architecture and Key Patterns

### Content Management
- Blog posts are stored in `src/content/blog/` as `.md` or `.mdx` files
- Content schema is defined in `src/content.config.ts` using Zod validation
- Frontmatter fields: `title`, `description`, `pubDate`, `author`, `heroImage`/`cover`, `tags`, `category`, `excerpt`, `draft`
- Draft posts (`draft: true`) are excluded from production builds

### Component Structure
- **Layouts**: `BaseLayout.astro` wraps all pages, `BlogPostLayout.astro` for blog posts
- **MDX Components**: Available in `src/components/MDXComponents.jsx` (Card, Alert, Button, CodeBlock)
- **Dynamic Routing**: Blog posts use `[...slug].astro` for URL generation
- **Styling**: Tailwind CSS with dark mode support (class-based toggle)

### Integration Stack
- `@astrojs/mdx` - MDX support for interactive content
- `@astrojs/react` - React components in Astro/MDX
- `@astrojs/tailwind` - Tailwind CSS v3 (not v4)
- `@astrojs/sitemap` - Automatic sitemap generation

### Important Configuration
- **astro.config.mjs**: Update `site` URL before deployment
- **Dark Mode**: Toggle state persists in localStorage
- **Language**: UI uses Traditional Chinese (zh-TW)
- **Typography**: Tailwind Typography plugin configured for prose content

### MDX Usage Pattern
```mdx
---
title: 'Post Title'
description: 'Post description'
pubDate: 2025-07-23
---

import { Card, Alert } from '../../components/MDXComponents.jsx';

<Alert type="info">
  MDX allows React components in markdown
</Alert>
```

### Common Tasks

When adding new blog posts:
1. Create file in `src/content/blog/` with proper frontmatter
2. Use `draft: true` for work-in-progress posts
3. Images go in `src/assets/` and are imported via relative paths
4. MDX files can import React components from `MDXComponents.jsx`

When modifying styles:
- Global styles in `src/styles/global.css` use Tailwind layers
- Component-specific styles use Tailwind utility classes
- Dark mode uses `dark:` prefix for Tailwind utilities

## Known Issues and Solutions
- Tailwind CSS v4 is incompatible; project uses v3 with `@astrojs/tailwind` integration
- When adding integrations, use `npx astro add` command for proper configuration
- Image paths in frontmatter must be relative imports, not public URLs