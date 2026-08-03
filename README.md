# anime-bay

> An AniList anime browser with localStorage collections, revived on Next.js 16 + React 19 + TypeScript.

[![CI](https://github.com/zzeordyga/anime-bay/actions/workflows/ci.yml/badge.svg)](https://github.com/zzeordyga/anime-bay/actions/workflows/ci.yml)
[![Live demo](https://img.shields.io/badge/live%20demo-GitHub%20Pages-blue)](https://zzeordyga.github.io/anime-bay)

## Stack

- **Next.js 16** (Pages Router, `output: 'export'`), **React 19**, **TypeScript 5** strict
- **Apollo Client 3** against the public AniList GraphQL API
- **Emotion 11** styled components on the shared revival design system (dark/light, responsive)
- Static export → GitHub Pages (`basePath: /anime-bay`)

## Features

- Browse popular anime with debounced search, skeleton loaders, windowed pagination
- Responsive poster grid with hover-preview and score badges
- Title detail page: banner, stats sidebar, parsed description, genres, reviews, add-to-collection
- Collections persisted to `localStorage` (create / rename / delete / add / remove)
- Dark/light mode persisted, system-aware; keyboard-dismissable modals; error boundary with retry

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
npm run build        # static export to ./out
```

## Deploy

GitHub Actions builds the static export and deploys to **GitHub Pages** on green CI
(see `.github/workflows/deploy.yml`). For an AWS move, upload the `./out` directory
to S3 + CloudFront unchanged.