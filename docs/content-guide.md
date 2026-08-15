# Content Guide

How to edit the site's content. All content is Markdown with YAML frontmatter
under `src/content/`, validated by Zod schemas in `src/content/config.ts`.
Bilingual fields are `{ zh, en }` objects — **both languages are required for
user-facing text** (CI fails otherwise).

## Common rules

- Run `npm run validate:content` (or the full `npm run verify`) after editing.
- Do not remove keys — leave `""` or `{}` when a value is unknown.
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
role: { zh: "碩士生", en: "Master" }   # 教授/博士生/碩士生/專題生…
status: { zh: "在讀", en: "Current" }  # or 已畢業 / Alumni
area: { zh: "Quantum", en: "Quantum" } # research team / direction
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
- `avatar` is optional — if omitted it resolves from the name via
  `src/utils/member-avatar.ts`.
- Members list groups by `role`; the detail page shows bio, links (copy-email
  button), education and publications if present.
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
intro: { zh: |, en: | }          # optional
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

## Join (`src/content/join/recruitment/`)

- `overview_cn.md` and `overview_en.md` — bilingual recruitment text rendered
  on `/join/` (and `/en/join/`).

## Site-wide copy (`src/data/site.{zh,en}.json`)

Brand, nav labels, home intro, hero highlights. Keys must match between the
two files; `scripts/validate-content.mjs` checks the required set
(`home`, `members`, `papers`, `courses`, `awards`, `life`).

## Lab photos (`public/images/lab/`)

- `group-hiking.jpg`, `group-lunch.jpg`, `group-jogging.jpg` are referenced by
  `src/pages/life.astro` and the home hero (`index.astro`).
- Keep them web-sized (~1400px wide, JPEG) to avoid bloating the bundle.
