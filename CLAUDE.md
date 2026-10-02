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

- `content/blog/` — Blog posts, ordered by date. Only posts with `highlight = true` (a boolean, not a string) appear on the homepage; all posts appear at `/blog/`.
- `content/fixed/` — Static pages (About, CV, etc.) rendered at `/:title/` rather than under `/blog/`.

Frontmatter uses TOML format (delimited by `+++`). Key fields:
- `title`, `description`, `date` — standard
- `highlight` — blog only; `true` shows the post in the homepage Writing section

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

Deployed to GitHub Pages by the GitHub Actions workflow in `.github/workflows/deploy.yml`, which runs on every push to `master` (or manually via `workflow_dispatch`). It builds with `hugo --minify` using the Hugo version pinned in the workflow's `HUGO_VERSION`.
