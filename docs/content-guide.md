# Content Guide

How to edit the site's content. All content is Markdown with YAML frontmatter
under `src/content/`, validated by shared Zod schemas in `src/utils/content-schemas.mjs`.
Bilingual fields are `{ zh, en }` objects — **both languages are required for
user-facing text** (CI fails otherwise).

## Common rules

- Run `npm run validate:content` (or the full `npm run verify`) after editing.
- Omit unknown optional fields. Required bilingual text needs non-empty `zh` and `en` values.
- Member photo files: `public/member/images/<id>.jpg`; the `id` must match the
  member filename.
- Course links must point to the official NTU course catalogue
  (`nol.ntu.edu.tw/nol/coursesearch/print_table.php?...`).
- Award records need a public `source` URL; keep students separate from
  advisors.

## Members (`src/content/members/<id>.md`)

```yaml
---
id: "anitalu724"            # must match filename; part of the member URL
name: { zh: "呂承樺", en: "Cheng-Hua Lu" }
role: master                        # pi / phd / master / ra / undergraduate
status: current                     # current / active / alumni / former
area: quantum                       # quantum / formal / eda / verification / architecture
cohort: 12                          # admission year 112 (2023), optional
avatar: "/member/images/anitalu724.jpg"
bio: { zh: "…", en: "…" }              # optional
links:                                # optional
  email: "…"
  github: "https://github.com/…"
  homepage: "…"
  linkedin: "…"
  scholar: "…"
---
```

Notes:
- `avatar` is optional — if omitted it resolves from `public/member/images/<id>.jpg`,
  or the default avatar if that file is missing. Explicit missing paths fail the build.
  Use local JPG/PNG/WebP images, including CMS uploads under `/uploads/`. Original files
  are retained; Astro generates responsive WebP thumbnails for list and detail pages.
- Classification and order use stable role/status/area codes, shared across languages.
  Labels live in `src/data/member-labels.mjs`; add a code there for a new category.
  Unknown cohorts are labeled explicitly, never inferred from email addresses.
  Detail pages show the bilingual bio and links.
- New members: add the Markdown file **and** the photo with the same `id`.

## Papers (`src/content/papers/<slug>.md`)

```yaml
---
year: 2024
title: "…"
venue: "IEEE QCE 2024"
authors: "A, B, C"           # plain string
abstract: |                  # optional
  …
links:                       # optional
  online: "https://doi.org/…"
  pdf: "…"
  project: "…"
  code: "…"
bibtex: |                    # optional
  @inproceedings{…}
---
```

- Papers are sorted newest first by `year`.
- Keep titles in their canonical published form (English).

## Courses (`src/content/courses/<slug>.md`)

```yaml
---
title: { zh: "網路服務程式設計", en: "Web Programming" }
semester: "114-1"            # e.g. 114-1 (2025 fall)
link: "https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?course_id=901%2034300&…&semester=114-1&lang=CH"
github: "https://github.com/…"   # optional
intro: { zh: "課程簡介", en: "Course introduction" } # optional
contents: { zh: […], en: […] }   # optional
---
```

- Courses are sorted by `semester` descending (newest first).
- When a course is offered again in a new semester, update `semester` **and**
  the `ser_no` inside the official `link` (each semester has a different
  serial number on the NTU catalogue).

## Awards (`src/content/awards/<slug>.md`)

```yaml
---
title: { zh: "2025 ICCAD CAD Contest Problem A 第一名", en: "2025 ICCAD CAD Contest Problem A First Place" }
year: 2025
month: "October"
students: ["Chen-Ching Nieh", "Chien-Tung Kuo", "Hong-Siang Wu"]
advisors: ["Prof. Chung-Yang (Ric) Huang"]   # optional
source: "https://www.iccad-contest.org/2025/Winners.html"
---
```

- Every record needs a public `source` URL.
- Students are the collaborators/recipients; the advisor is separate metadata.

## Site-wide copy (`src/data/site.{zh,en}.json`)

Brand, nav labels, and home introduction. Keys must match between the
two files; `scripts/validate-content.mjs` checks the required set
(`home`, `members`, `papers`, `courses`, `awards`, `life`).

## Lab activities (`src/content/life/`)

- Each activity has `photo` (local public path), bilingual `alt`, `caption`,
  `description`, and an integer `order`. Both languages use the same record.
- Keep the `group-hiking` entry: its photo and caption also supply the home hero.
- Keep them web-sized (~1400px wide, JPEG) to avoid bloating the bundle.

The homepage shows the team introduction, the three newest course records,
and two activity photos excluding the main hiking photo. These previews use
the same collections as their destination pages; no duplicate homepage content
needs editing. Course semesters describe the stored records, not a live course
offering. Page UI labels live in `src/data/page-copy.mjs`.

## CMS editing

When configured, `/admin/` edits members, papers, courses, awards, activities,
and site JSON. Bilingual objects stay in one file. Optional fields may be omitted.
New member IDs use lowercase letters, numbers and hyphens; existing IDs retain
their original capitalization and dots. A pre-save guard prevents renaming an
existing member ID or creating an ID that Decap would rewrite in the filename.
