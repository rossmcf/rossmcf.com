# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal website for Ross McFarlane, built with [Hugo](https://gohugo.io/) (static site generator). No Node.js, npm, or build pipeline — just Hugo and Markdown.

## Commands

- **Local dev server:** `hugo server -D -E -F`
- **Build for production:** `hugo`

No linting or test suite exists.

## Content

Content lives in `content/` with two sections:

- `content/blog/` — Blog posts, ordered by date. Use `highlight = "true"` in frontmatter to feature a post on the homepage.
- `content/fixed/` — Static pages (About, CV, etc.) rendered at `/:title/` rather than under `/blog/`.

Frontmatter uses TOML format (delimited by `+++`). Key fields:
- `title`, `description`, `date` — standard
- `highlight` — blog only; promotes post to homepage featured section

## Templates and Layouts

- `layouts/partials/` — Reusable components: `header.html`, `footer.html`, `nav.html`, `style.html`
- `layouts/index.html` — Homepage template
- `layouts/blog/single.html` and `layouts/fixed/single.html` — Per-section single-page templates
- `layouts/_default/list.html` — Default list template

CSS is inlined via `layouts/partials/style.html` (not loaded as an external file). Edit styles there, not in a separate stylesheet loaded at runtime.

## Configuration

`config.toml` sets the base URL, permalink structure, site params, and output formats. The site generates HTML, an Atom feed, and a JSON feed from the homepage.

Cache-busting is enabled via `cachebuster = true` in params (appends a Unix timestamp to static asset URLs).

## Deployment

Built and deployed by Netlify to AWS S3 using [s3deploy](https://github.com/bep/s3deploy). Build config is in `netlify.toml`. S3 deploy config is in `.s3deploy.yml`. Static assets (CSS, images, fonts) are cached for 20 years; HTML/XML/JSON are not cached.
