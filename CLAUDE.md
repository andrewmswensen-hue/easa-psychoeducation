# EASA Psychoeducation Interactive

An interactive web companion to the psychoeducation PDFs at
[lanecountyeasa.org/psychoeducation](https://www.lanecountyeasa.org/psychoeducation).
Turns three dense handouts into step-by-step, tap-to-reveal experiences
that users can click through at their own pace.

Built for Lane County EASA (Early Assessment and Support Alliance),
a program serving young people experiencing early signs of psychosis
in Oregon.

## What's here

Three standalone tools + a small hub page that links them:

| Folder | Tool | Source PDF |
|---|---|---|
| `/psychosis/` | Psychosis Explained | Psychosis Info with survey.pdf |
| `/attenuated-psychosis/` | Attenuated Psychosis (APS) Explained | APS Info with survey.pdf |
| `/functional-changes/` | Functional Changes | Functional Changes.pdf |
| `/` (root) | Hub — links all three | N/A |

Each tool is a single self-contained HTML page. They share styles and
interaction JS from `/shared/`.

## HIPAA / privacy posture

**Zero data collection.** No forms, no analytics, no cookies, no tracking.
Everything runs in the user's browser. The only outbound link is the
existing EASA contact page (which is already part of EASA's intake, and
thus already covered by their existing privacy/HIPAA practices).

## Design language

Pulled directly from the source PDFs:

- **Colors:** deep forest green, warm tan/camel, cream background, pale sage
- **Typography:** Nunito (friendly, rounded, high-legibility sans)
- **Shapes:** rounded cards, pill chips, generous whitespace
- **Tone:** calm, warm, plain-language — not clinical

## Interaction patterns

- **Reveal cards** — tap to expand symptom examples
- **Flip cards** — myth on front, fact on back
- **Chapter navigation** — linear progression with progress indicator
- **Crisis footer** — 988 and Lane County crisis line always visible

## Accessibility

- Semantic HTML (buttons for buttons, headings for headings)
- Keyboard navigation: Tab, Enter/Space, Arrow keys for chapters
- ARIA: `aria-expanded` on reveal cards, `aria-pressed` on flip cards
- Respects `prefers-reduced-motion`
- WCAG AA contrast targets

## Tech

- Plain HTML, CSS, vanilla JavaScript
- No build step, no dependencies
- Google Fonts: Nunito
- Deployable as static files (GitHub Pages, Cloudflare Pages, or any static host)

## File structure

```
easa-psychoeducation/
  index.html                    — hub landing page
  shared/
    styles.css                  — design system (all pages)
    components.js               — interaction logic (reveal, flip, nav)
  psychosis/
    index.html
  attenuated-psychosis/
    index.html
  functional-changes/
    index.html
```

## Embedding on the EASA site

Each tool's URL can be embedded on the EASA Squarespace site via a Code
block `<iframe>`. Each page sets its height responsively so the embed
sizes naturally.

## Source material

Original PDFs cached at `/tmp/` during development:
- psychosis_info.pdf
- aps_info.pdf
- functional_changes.pdf
