import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const i18nText = z.object({
  zh: z.string().min(1),
  en: z.string().min(1)
});

const newsDate = z.preprocess((value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return value;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

function newsEntryId(entry: string) {
  return entry.split('\\').join('/').replace(/\.md$/i, '');
}

const news = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/news',
    generateId: ({ entry }) => newsEntryId(entry),
  }),
  schema: z.object({
    date: newsDate,
    title: i18nText,
  })
});

const papers = defineCollection({
  type: 'content',
  schema: z.object({
    year: z.number().int(),
    title: z.string().min(1),
    venue: z.string().min(1),
    authors: z.string().optional(),
    abstract: z.string().optional(),
    links: z
      .object({
        online: z.string().min(1).optional(),
        pdf: z.string().min(1).optional(),
        project: z.string().min(1).optional(),
        code: z.string().min(1).optional()
      })
      .optional(),
    bibtex: z.string().optional()
  })
});

const members = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().min(1).optional(),
    name: z.union([z.string().min(1), i18nText]),
    role: z.object({
      zh: z.string().min(1),
      en: z.string().min(1)
    }),
    status: z.union([z.string().min(1), i18nText]).optional(),
    area: z.union([z.string().min(1), i18nText]),
    avatar: z.string().min(1).optional(),
    bio: z.union([z.string().min(1), i18nText]).optional(),
    links: z
      .object({
        scholar: z.string().min(1).optional(),
        github: z.string().min(1).optional(),
        homepage: z.string().min(1).optional(),
        email: z.string().min(1).optional(),
        linkedin: z.string().min(1).optional()
      })
      .optional()
  })
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).optional(),
    tag: z.string().min(1).optional(),
    time: z.string().min(1).optional(),
    status: z.string().min(1).optional(),
    links: z
      .object({
        repo: z.string().min(1).optional(),
        demo: z.string().min(1).optional(),
        paper: z.string().min(1).optional()
      })
      .optional()
  })
});

const join = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).optional()
  })
});

const courses = defineCollection({
  type: 'content',
  schema: z.object({
    title: i18nText,
    semester: z.string().min(1),
    link: z.string().min(1),
    github: z.string().optional(),
    intro: i18nText.optional(),
    contents: z.object({ zh: z.array(z.string()), en: z.array(z.string()) }).optional()
  })
});

const awards = defineCollection({
  type: 'content',
  schema: z.object({
    title: i18nText,
    year: z.number().int(),
    month: z.string().min(1),
    students: z.array(z.string()).min(1),
    advisors: z.array(z.string()).optional(),
    source: z.string().min(1)
  })
});

export const collections = { news, papers, members, projects, join, courses, awards };
