# fnfbn — Forming Nature, Formed by Nature

Single-page bilingual (DE/EN) exhibition site.

## Stack

- **Astro 6** with built-in i18n (DE default at `/`, EN at `/en`)
- **Keystatic** CMS — bilingual fields per item (`de`/`en` object pattern)
- **GSAP + ScrollTrigger** for scroll-driven animations
- **Vanilla CSS** with design tokens (`src/styles/tokens.css`)
- **Netlify** static deploy + Netlify Forms for the contact form

## Commands

```bash
pnpm dev        # local dev (Astro + Keystatic admin at /keystatic)
pnpm build      # production build → dist/
pnpm preview    # preview the built site
```

## Content model

- **Singletons** in `src/content/_singletons/` — hero, about, team-intro, locations-section, contributors-section, contact, footer
- **Collections** in `src/content/locations/` and `src/content/contributors/`
- All bilingual fields are `{ de, en }` objects
- Asset uploads land in `public/uploads/`

## Deploy

Push to `main` on GitHub → Netlify auto-builds. Initial domain: `fnfbn.netlify.app`.

## Contact form

Uses Netlify Forms. The detection stub in `public/forms.html` registers the form
name + fields with Netlify at deploy time. Keep its field names in sync with
the live form component.
