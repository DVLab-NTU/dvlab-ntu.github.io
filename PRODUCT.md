# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prospective graduate and undergraduate students deciding whether to approach the lab, current members and alumni, and academic or industry peers checking the lab's papers, courses, and awards. Most arrive from search or a shared link, often on a phone.

## Product Purpose

Official bilingual (Traditional Chinese default, English at `/en/`) site of the Design Verification Lab (DVLab), NTU EE, led by Prof. Chung-Yang (Ric) Huang. It introduces the lab's three research directions (AI formal methods, EDA for 3DIC, quantum design automation), its host, members, publications, courses, and awards. Success: a visitor quickly understands what the lab works on and knows how to reach the host or browse the work.

## Capabilities and Constraints

- Static Astro site, plain full-page navigation, no runtime server; every route must be indexable.
- Content lives in Markdown collections; both languages are required for user-facing copy.
- Manual and automatic dark/light theme, FOUC-safe.
- Respect `prefers-reduced-motion`; decorative motion never carries content.

## Brand Commitments

- Lab logo (magnifier inspecting a bug on a chip) and the CRA-era lab culture mottos.
- Navy + gold heritage from the 2022 site; gold is kept as the starlight accent (confirmed 2026-10-17).
- Liquid-glass controls and surfaces (user requirement).
- Dark theme: very deep midnight starry sky. Light theme: star-atlas paper (confirmed 2026-10-17).

## Evidence on Hand

Member photos (`public/member/images/`), host portrait (`public/images/host/ric.jpeg`), lab logo layers (`src/assets/legacy-logo/`), award sources, paper metadata. No testimonials or metrics exist; do not invent them.

## Product Principles

- Plain, specific language in the lab's own voice; no promotional filler.
- Content first: the work and the people are the proof.
- One control system across the site: same heights, shapes, and states.
- Mobile and desktop are both first-class.
