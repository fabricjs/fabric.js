// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

// 2. Define your collection(s)
const demosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    thumbnail: z.string(),
    description: z.string().optional(),
  }),
});

const docsCollection = defineCollection({
    type: 'content',
    schema: docsSchema(),
  });

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  demo: demosCollection,
  docs: docsCollection,
};