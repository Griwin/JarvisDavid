# JarvisDavid Agent Guidance

## Project purpose

JarvisDavid is a learning project for building a modular local-AI assistant.

The application provides user-facing AI capabilities such as translation,
text summarization, PDF processing, and request history.

The project is also used to experiment with agentic software development.

Favor maintainability, consistency, explicit architectural decisions,
and incremental changes over unnecessary sophistication.

---

## Stack

### Backend

- PHP 8.2+
- Symfony 7.4
- API Platform
- Doctrine ORM
- PostgreSQL

### Frontend

- Angular 21
- Standalone components
- Angular Material
- SSR
- Strict TypeScript

### AI

- Ollama
- Local models such as Gemma

### Infrastructure

- Docker Compose
- Nginx
- PostgreSQL
- pgAdmin

The Angular development server runs separately during development.

The frontend communicates with Symfony through the HTTP API.

---

## General working principles

Before modifying code:

1. understand the requested outcome;
2. inspect the relevant existing implementation;
3. identify the conventions already used;
4. reuse existing patterns whenever appropriate;
5. determine the smallest coherent change that satisfies the request.

Prefer consistency with the existing codebase over introducing a
theoretically better but different pattern.

Do not introduce speculative abstractions for hypothetical future needs.

Do not silently change architectural conventions.

If a significant architectural change appears justified, explain the
reason and request approval before implementing it.

---

## Architecture

Preserve the existing Symfony / Angular separation.

Implement user-facing capabilities as vertical slices when they span
multiple layers:

1. API contract;
2. backend behavior;
3. frontend service;
4. user interface;
5. routing when required;
6. automated tests.

Before creating a new:

- service;
- abstraction;
- interface;
- directory;
- module;
- shared utility;
- architectural layer;

search the repository for an existing equivalent or established pattern.

Extend existing patterns whenever possible.

Do not introduce a new architectural pattern, layer, module, or project
when the existing architecture already provides an appropriate solution.

Avoid unnecessary indirection.

A working implementation that fragments the architecture is not considered
complete.

---

## Backend rules

Keep Symfony controllers thin.

Controllers should primarily:

- receive and validate HTTP input;
- delegate application behavior;
- return HTTP responses.

Put AI-provider communication and substantial processing in dedicated
services.

Keep persistence concerns in the appropriate Doctrine infrastructure.

Do not expose Doctrine entities directly as API contracts when dedicated
request or response models are more appropriate.

Use dependency injection instead of manually constructing application
services.

Follow existing namespace and directory conventions.

Avoid duplicating:

- business logic;
- validation;
- mapping;
- persistence logic;
- AI-provider integration.

---

## Frontend rules

Use Angular standalone components.

Use strongly typed request and response models.

Do not introduce new `any` types.

Keep HTTP communication inside appropriate Angular services rather than
directly inside UI components.

Keep components focused on presentation and user interaction.

Reuse existing:

- Angular Material components;
- layout patterns;
- form patterns;
- error handling;
- loading states;
- application services.

Do not introduce another state-management, styling, or component framework
without explicit approval.

---

## AI rules

Keep AI-provider-specific behavior isolated from unrelated application
logic.

Do not present fixtures, mocks, hard-coded responses, or simulations as
real AI-generated results.

When simulation is intentionally used, make it explicit in both code and UI.

Do not unnecessarily couple application features to a specific model.

Preserve the ability to replace the underlying model or AI provider without
rewriting unrelated application features.

Treat model output as untrusted data when it is consumed programmatically.

---

## Security and repository hygiene

Never commit:

- API keys;
- passwords;
- credentials;
- secrets;
- local environment files containing secrets;
- user-uploaded documents;
- generated dependencies;
- Symfony cache files;
- Angular cache files;
- build artifacts.

Do not log sensitive user content unless explicitly required.

Treat uploaded files, AI prompts, model responses, and user input as
untrusted input.

Do not weaken existing security controls to simplify implementation.

---

## Scope discipline

Implement only what is required for the current task.

Avoid unrelated refactors.

Do not rename or move unrelated files for stylistic reasons.

Do not modify unrelated behavior while implementing a feature.

Do not add production dependencies unless:

- the task explicitly requires them; or
- the user approves them.

Do not modify the database schema unless:

- the requested feature requires the change; or
- the user approves it.

Never hide unrelated cleanup inside a feature implementation.

---

## Verification

Run the narrowest relevant checks first.

### Frontend

    cd frontend/app
    npm test -- --watch=false
    npm run build

### Backend

    cd backend
    php bin/phpunit
    php bin/console lint:container

### Repository

    git diff --check

For cross-cutting changes, verify both frontend and backend.

Run existing tests before inventing new verification mechanisms.

Never claim a test, build, lint, or verification step succeeded unless it
was actually executed successfully.

If verification cannot run because dependencies, services, or the local
environment are unavailable, report that limitation explicitly.

---

## Git workflow

Never implement feature work directly on the default branch.

Start new feature work from an up-to-date `main`.

Use focused branches such as:

    feat/translation-history
    feat/pdf-summary
    fix/translation-validation

Do not stack new feature work on an unmerged feature branch.

Do not mix unrelated changes in the same branch or commit.

Use focused Conventional Commit messages.

Never stage unrelated user changes.

Never push directly to the default branch.

The user remains responsible for final pull-request approval and merge.

Detailed delivery procedures belong in `$ship-pr`.

---

## Repository skills

Repository skills define specialized workflows.

Use them proactively when the current task matches their purpose.

The user does not need to invoke a skill explicitly.

### `$plan-feature`

Use when the user describes a new feature, behavior, or significant change
at a high level and the implementation scope is not already precisely
defined.

Inspect the repository and produce a repository-aware implementation plan
before writing code.

Do not implement the feature until the plan has been presented and the user
has approved proceeding.

Skip this skill for trivial, narrowly scoped, or already well-specified
changes.

### `$add-ai-feature`

Use when implementing a user-facing AI capability that crosses backend and
frontend boundaries.

If the feature is not sufficiently specified, use `$plan-feature` first.

Reuse the existing AI integration patterns rather than introducing a
parallel implementation.

### `$architecture-review`

Use after implementing a significant feature or cross-cutting change and
before considering it ready for delivery.

Review the complete change against the existing architecture and repository
conventions.

Pay particular attention to:

- duplicated abstractions;
- unnecessary services or interfaces;
- new architectural patterns;
- inconsistent naming or structure;
- duplicated business logic;
- inappropriate dependencies;
- excessive coupling;
- unrelated modifications.

Prefer an independent review of the completed diff rather than relying only
on the reasoning used during implementation.

### `$ship-pr`

Use when the user explicitly asks to finish, deliver, publish, push, or
create a pull request.

Before delivery, ensure relevant:

- tests;
- builds;
- repository checks;
- architecture review;

have been completed.

Detailed delivery procedures belong in the Skill rather than this file.

---

## Skill selection workflow

For a high-level feature request:

    user intent
        ↓
    $plan-feature
        ↓
    user approval
        ↓
    implementation
        ↓
    $architecture-review
        ↓
    verification
        ↓
    $ship-pr when delivery is requested

Do not force this workflow onto trivial changes.

Use the smallest workflow appropriate for the task.

---

## Definition of done

A change is complete only when:

- the requested behavior is implemented;
- it follows the existing architecture;
- existing patterns were reused where appropriate;
- it does not introduce unnecessary abstractions;
- relevant tests were added or updated;
- relevant verification commands pass;
- unrelated files were not modified;
- security and repository hygiene rules are respected;
- limitations or unverified behavior are clearly reported.

Correctness alone is not sufficient.

Maintainability and architectural consistency are part of correctness.