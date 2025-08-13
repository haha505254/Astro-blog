// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
	site: 'https://elaborate-alfajores-21aa14.netlify.app',
	output: 'static', // 使用新的 static 模式（已包含 hybrid 功能）
	adapter: netlify(), // 仍需要適配器來處理動態 API 路由
	integrations: [mdx(), sitemap(), react(), tailwind()],
});
