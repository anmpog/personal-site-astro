// Import the glob loader
import { glob, file } from 'astro/loaders'
// Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content'
// Define a `loader` and `schema` for each collection
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
  }),
})

const experience = defineCollection({
  loader: file('src/data/work-experience.json'),
  schema: z.object({
    id: z.number(),
    company: z.string(),
    siteUrl: z.string(),
    jobTitle: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
    skills: z.array(z.string()),
  }),
})

export const collections = { blog, experience }
