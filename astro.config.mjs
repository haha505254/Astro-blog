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
	output: 'server', // 使用 server 模式以支持動態 API
	adapter: netlify(), // 使用 Netlify 適配器
	integrations: [mdx(), sitemap(), react(), tailwind()],
});
