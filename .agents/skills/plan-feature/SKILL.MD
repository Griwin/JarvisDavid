---
name: plan-feature
description: Turn a rough feature idea into a precise implementation plan grounded in the existing repository before any code is written.
---

# Plan Feature

Use this skill when the user describes a feature informally, incompletely,
or at a high level and wants to determine what should be implemented.

Examples:

- "On va ajouter les favoris."
- "Je voudrais un historique."
- "Il faudrait pouvoir résumer des PDF."
- "Ajoute un bouton pour refaire une traduction."
- "On devrait ajouter des comptes utilisateurs."

This skill is for planning.

Do not implement the feature while using this skill unless the user
explicitly asks to continue with implementation after reviewing the plan.

## Goal

Transform the user's intent into a small, precise, repository-aware
implementation specification.

Do not merely rewrite the user's request into a longer prompt.

The plan must be based on the actual repository.

## Step 1 - Understand the intent

Identify:

- the user-visible outcome;
- the problem being solved;
- explicit requirements;
- explicit constraints;
- genuinely ambiguous behavior.

Do not invent requirements that the user did not request.

When ambiguity does not materially affect architecture, security,
data integrity, or user-visible behavior, prefer a reasonable minimal
interpretation and state it.

Ask the user only when a decision materially changes the feature.

## Step 2 - Inspect the repository

Before proposing implementation details, inspect the relevant existing code.

Look for:

- similar features;
- existing API conventions;
- backend services;
- DTOs and entities;
- frontend services;
- Angular components;
- routes;
- tests;
- persistence patterns;
- naming conventions.

Prefer extending an existing pattern over introducing a new one.

Do not propose files, layers, services, abstractions, or dependencies
without first checking whether an equivalent already exists.

## Step 3 - Determine the scope

Classify the expected impact.

Possible areas include:

- frontend;
- backend;
- database;
- AI provider;
- API contract;
- routing;
- tests;
- Docker/infrastructure;
- security.

Explicitly identify areas that should NOT need modification when useful.

Avoid unrelated refactoring.

## Step 4 - Define behavior

Describe the feature through observable behavior.

Include:

- main user flow;
- important validation;
- relevant failure cases;
- persistence behavior if applicable;
- AI behavior if applicable.

Avoid specifying internal implementation details unless they follow from
the existing architecture.

## Step 5 - Propose the implementation plan

Produce a concise ordered plan.

For every step, explain:

1. what changes;
2. where it changes;
3. why it is required.

Reference existing files or patterns when possible.

Do not create speculative architecture for hypothetical future features.

## Step 6 - Acceptance criteria

Provide concrete acceptance criteria that can later be verified.

Prefer observable criteria such as:

- user can perform X;
- API returns Y for Z;
- invalid input produces the expected error;
- successful requests are persisted;
- existing behavior remains unchanged.

Avoid vague criteria such as:

- code is clean;
- UX is good;
- architecture is scalable.

## Step 7 - Verification strategy

Identify the relevant verification expected after implementation.

Examples:

- backend unit tests;
- frontend tests;
- API behavior;
- Symfony container validation;
- Angular build;
- database migration verification.

Follow the repository AGENTS.md verification rules.

## Output

Return:

### Objective

One short paragraph describing the feature.

### Existing patterns

Relevant repository conventions or existing implementations that should
be reused.

### Scope

Areas expected to change.

### Implementation plan

A short ordered list of implementation steps.

### Acceptance criteria

Concrete verifiable behavior.

### Verification

Tests and checks expected after implementation.

### Open decisions

Only decisions that genuinely require user input.

If there are no important unresolved decisions, write:

`None.`

Do not implement code during this skill unless explicitly requested.