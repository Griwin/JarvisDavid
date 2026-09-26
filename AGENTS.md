# JarvisDavid agent guidance

## Project goal

JarvisDavid is a learning project for building a modular local-AI assistant. The planned capabilities are translation, text summarization, PDF summarization, and request history.

## Architecture

- `backend/`: PHP 8.2+, Symfony 7.4, API Platform, Doctrine, PostgreSQL.
- `frontend/app/`: Angular 21 standalone components, Angular Material, and SSR.
- `docker-compose.yml`: PHP, Nginx, PostgreSQL, and pgAdmin. The Angular development server runs separately.
- The browser calls the Symfony API through `http://localhost:8080/api`.

## Current state

- `/dashboard` and `/translate` exist in Angular.
- `POST /api/translate` uses the local `qwen2.5:3b` model through the Ollama Docker service and persists successful requests.
- `AiRequest` models persisted AI work with the `translate`, `summarize`, and `pdf_summary` types.
- Text summarization, PDF summarization, history UI, and authentication are not complete yet.

## Working agreements

- Preserve the Symfony/Angular separation and implement user-facing capabilities as a vertical slice: API contract, backend behavior, frontend service, page, routing, tests.
- Keep controllers thin. Put AI-provider calls and substantial processing in backend services.
- Use typed request and response shapes. Avoid introducing new `any` types in Angular.
- Never commit API keys, model credentials, generated dependencies, Angular cache files, Symfony cache files, or user documents.
- Do not claim a feature uses AI while it still returns fixtures or simulations. Make simulated behavior explicit in code and UI.
- Avoid unrelated refactors while implementing a feature.
- Ask before adding a production dependency or changing the database schema unless the requested task explicitly requires it.

## Verification

Run the narrowest relevant checks first, then the full build for cross-cutting changes.

- Frontend tests: `cd frontend/app && npm test -- --watch=false`
- Frontend build: `cd frontend/app && npm run build`
- Backend tests, when a test suite exists: `cd backend && php bin/phpunit`
- Symfony configuration and container: `cd backend && php bin/console lint:container`
- Inspect changed files with `git diff --check` before handing off.

If a command cannot run because dependencies or services are unavailable, report that clearly instead of presenting the change as verified.

## Repository skills

- Use `$add-ai-feature` when adding translation, summarization, PDF processing, history, or another AI capability across the backend and frontend.
- Use `$ship-pr` when the user asks to finish, deliver, publish, or open a pull request. It performs the final review, verification, commit, push, and GitHub PR creation.

## Delivery workflow

- Do not create a pull request for an ordinary implementation request unless the user also asks to deliver, publish, finish with a PR, or invokes `$ship-pr`.
- Before a PR, review the complete diff against the target branch for correctness, regressions, security, tests, and accidental files. Fix issues that are clearly within the requested scope, then rerun affected checks.
- Never stage unrelated user changes. If unrelated changes cannot be separated safely, stop and identify them.
- Use focused Conventional Commit messages such as `feat(frontend): add translation page`.
- Push a feature branch, never the repository default branch.
- Open the PR only after required checks pass, or clearly mark any unavailable check in the PR body.
- PR descriptions must include the purpose, principal changes, verification performed, and known limitations.
- After creating a PR, return its link and a concise review summary. The user remains responsible for final approval and merge.
