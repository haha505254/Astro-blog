import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
		// 新增欄位
		tags: z.array(z.string()).default([]),
		excerpt: z.string().optional(),
		cover: image().optional(),
		draft: z.boolean().default(false),
		// 額外的 SEO 相關欄位
		author: z.string().default('Anonymous'),
		category: z.string().optional(),
	}),
});

export const collections = { blog };
