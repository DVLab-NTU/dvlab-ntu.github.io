import { z } from 'astro/zod';
import { roles, statuses, areas } from '../data/member-labels.mjs';

export const i18nText = z.object({
  zh: z.string().trim().min(1),
  en: z.string().trim().min(1)
});

const optionalText = z.string().trim().optional();
const optionalI18nText = z.preprocess(value =>
  value && typeof value === 'object' && Object.values(value).every(text => typeof text === 'string' && !text.trim()) ? undefined : value,
  i18nText.optional(),
);

export const papersSchema = z.object({
  year: z.number().int(),
  title: z.string().trim().min(1),
  venue: z.string().trim().min(1),
  authors: z.string().optional(),
  abstract: z.string().optional(),
  links: z
    .object({
      online: optionalText,
      pdf: optionalText,
      project: optionalText,
      code: optionalText
    })
    .optional(),
  bibtex: z.string().optional()
});

export const membersSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/),
  cohort: z.number().int().min(1).max(99).optional(),
  name: i18nText,
  role: z.enum(Object.keys(roles)),
  status: z.enum(Object.keys(statuses)),
  area: z.enum(Object.keys(areas)),
  nickname: optionalText,
  avatar: optionalText,
  avatarPosition: z.enum(['left', 'center', 'right']).optional(),
  bio: optionalI18nText,
  researchInterests: optionalI18nText,
  links: z
    .object({
      scholar: optionalText,
      github: optionalText,
      homepage: optionalText,
      email: optionalText,
      linkedin: optionalText,
      instagram: optionalText,
      linktree: optionalText,
      strava: optionalText,
      facebook: optionalText,
      researchgate: optionalText
    })
    .optional()
});

export const coursesSchema = z.object({
  title: i18nText,
  semester: z.string().regex(/^\d{2,3}-[12]$/),
  link: z.string().trim().min(1),
  github: z.string().optional(),
  intro: optionalI18nText,
  contents: z.object({ zh: z.array(z.string()), en: z.array(z.string()) }).optional()
});

export const awardsSchema = z.object({
  title: i18nText,
  year: z.number().int(),
  month: z.string().trim().min(1),
  students: z.array(z.string()).min(1),
  advisors: z.array(z.string()).optional(),
  source: z.string().trim().min(1)
});

export const lifeSchema = z.object({
  photo: z.string().trim().min(1),
  alt: i18nText,
  caption: i18nText,
  description: optionalI18nText,
  order: z.number().int(),
});
export const schemas = { members: membersSchema, papers: papersSchema, courses: coursesSchema, awards: awardsSchema, life: lifeSchema };
export const siteSchema = z.object({
  brand: z.string().trim().min(1),
  siteName: z.string().trim().min(1),
  nav: z.object(Object.fromEntries(['home', 'members', 'papers', 'courses', 'awards', 'life'].map(key => [key, z.string().trim().min(1)]))),
  home: z.object({
    intro: z.string().trim().min(1),
  }),
});
