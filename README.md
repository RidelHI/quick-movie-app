# Quick Movie App

Angular 21 demo app using TMDB APIs, feature-first architecture, and `@ngrx/signals`.

## Stack

- Angular 21 (standalone components)
- `@ngrx/signals` for feature stores
- Tailwind CSS v4
- Vitest + Angular TestBed

## Architecture

- `src/app/core`: global concerns (auth, http interceptor, layout)
- `src/app/shared`: shared models/config
- `src/app/features`: domain features (`home`, `movie-detail`)
  - `data-access`: API services
  - `domain`: DTOs, models, mappers
  - `state`: signal stores
  - `ui`: pages/components

## Environment setup

TMDB config is loaded from environment files:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
- `src/environments/environment.production.ts`

Use `src/environments/environment.local.example.ts` as reference and copy its values into
`src/environments/environment.development.ts` for local work.

Required:

- `tmdb.readAccessToken`
- `tmdb.redirectUri`

Without `readAccessToken`, TMDB login flow will not start.

## Scripts

```bash
bun run start
bun run build
bun run lint
bun run test -- --watch=false
```

## Routes

- `/home`: now playing list
- `/movies/:id`: movie detail
- `/auth`: TMDB auth start/logout
- `/auth/callback`: TMDB callback completion
