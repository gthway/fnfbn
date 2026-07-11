import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bilingual = z.object({ de: z.string(), en: z.string() });

const locations = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/locations' }),
  schema: z.object({
    title: bilingual,
    date: bilingual,
    time: bilingual,
    routeUrl: z.string().optional(),
    order: z.number().default(0),
  }),
});

const contributors = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/contributors' }),
  schema: z.object({
    name: z.string(),
    roles: z.array(z.enum(['organizer', 'artist', 'scientist','zine','illustration'])).default([]),
    photo: z.string().optional(),
    links: z.array(z.object({
      label: z.string(),
      url: z.string(),
    })).default([]),
    order: z.number().default(0),
  }),
});

export const collections = { locations, contributors };
