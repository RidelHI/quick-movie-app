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

## CI/CD (Free)

This repository uses GitHub-native automation with no paid plan:

- CI: `.github/workflows/ci.yml`
  - Runs on pull requests and pushes to `main`
  - Checks format, lint, unit tests, and production build
- CD: `.github/workflows/deploy-pages.yml`
  - Deploys automatically to GitHub Pages on pushes to `main`
- Dependency maintenance: `.github/dependabot.yml`
  - Weekly PRs for npm deps and GitHub Actions updates

## GitHub Setup Checklist

1. Push these workflow files to GitHub.
2. Go to `Settings > Pages`.
3. Set `Build and deployment > Source` to `GitHub Actions`.
4. Go to `Settings > Secrets and variables > Actions` and create repository secrets:
   - `TMDB_READ_ACCESS_TOKEN`
   - `TMDB_REDIRECT_URI`
5. For GitHub Pages, use this redirect URI format:
   - `https://<your-github-username>.github.io/<your-repo-name>/auth/callback`

## Recommended Branch Protection

For `main`, enable branch protection and require status checks before merge:

- `Lint, Test, Build` (from the CI workflow)

This enforces that no code reaches production if quality gates fail.
