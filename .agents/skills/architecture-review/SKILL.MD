---
name: architecture-review
description: Review a change or branch for architectural consistency, unnecessary abstractions, duplication, coupling, and maintainability problems.
---

# Architecture Review

Review the requested changes against the architecture and conventions
already established in the repository.

This is a review skill.

Do not modify code unless the user explicitly asks to fix findings.

## Principle

Working code is not sufficient.

The change must remain coherent with the existing application.

Prefer consistency with the established codebase over introducing a
theoretically superior but different architecture.

## Step 1 - Establish context

Read the repository AGENTS.md.

Inspect the relevant existing implementation before judging the change.

Identify the established patterns for the affected feature or layer.

## Step 2 - Inspect the complete change

Review the complete diff against the target branch.

Do not review individual files in isolation.

Understand how the change affects:

- backend;
- frontend;
- persistence;
- API contracts;
- AI integration;
- tests;
- dependencies.

## Step 3 - Architecture review

Look specifically for:

### Fragmentation

- new architectural patterns without justification;
- unnecessary projects or modules;
- inconsistent directory structures;
- alternative implementations of an existing pattern.

### Abstractions

- unnecessary interfaces;
- unnecessary factories;
- unnecessary wrappers;
- speculative generic abstractions;
- services that only forward calls without adding meaningful behavior.

### Duplication

- duplicated business logic;
- duplicated DTOs;
- duplicated mapping logic;
- duplicated validation;
- duplicated utilities.

### Boundaries

Verify that:

- Angular and Symfony responsibilities remain separated;
- controllers remain thin;
- UI components do not own backend or persistence logic;
- AI-provider-specific behavior remains isolated;
- persistence concerns remain appropriately contained.

### Coupling

Look for:

- direct dependencies on concrete AI models where avoidable;
- unnecessary cross-feature dependencies;
- circular dependencies;
- features reaching into unrelated internals.

### Consistency

Compare:

- naming;
- service structure;
- DTO conventions;
- API conventions;
- error handling;
- test organization;
- frontend patterns.

## Step 4 - Maintainability

Consider whether repeating this implementation pattern for ten more
features would keep the repository understandable.

Flag designs that work for the current feature but would progressively
fragment the application.

Do not flag differences merely because another style is personally
preferred.

## Step 5 - Scope

Identify unrelated modifications.

Check for:

- opportunistic refactors;
- unrelated renames;
- formatting noise;
- accidental generated files;
- dependencies unrelated to the requested feature.

## Output

Classify findings as:

### Blocking

Problems that should be corrected before merge.

### Important

Maintainability or consistency issues worth addressing.

### Minor

Small improvements that do not justify blocking the change.

### Positive observations

Existing conventions that were followed correctly.

For every finding include:

- affected file or area;
- concrete problem;
- why it matters;
- the existing repository pattern that should be followed when applicable.

If no meaningful architectural issue exists, explicitly state that the
change is consistent with the current architecture.

Do not invent findings merely to populate the review.