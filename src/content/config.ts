import { defineCollection } from 'astro:content';
import { schemas } from '../utils/content-schemas.mjs';

export const collections = {
  members: defineCollection({ type: 'content', schema: schemas.members }),
  papers: defineCollection({ type: 'content', schema: schemas.papers }),
  courses: defineCollection({ type: 'content', schema: schemas.courses }),
  awards: defineCollection({ type: 'content', schema: schemas.awards }),
  join: defineCollection({ type: 'content', schema: schemas.join }),
  life: defineCollection({ type: 'content', schema: schemas.life }),
};
