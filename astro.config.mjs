// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: 'https://elaborate-alfajores-21aa14.netlify.app',
	integrations: [mdx(), sitemap(), react(), tailwind()],
});
