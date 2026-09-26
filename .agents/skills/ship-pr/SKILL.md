---
name: ship-pr
description: Review, verify, commit, push, and publish completed JarvisDavid work as a GitHub pull request for final user approval. Use when the user asks to finish, deliver, publish, open a PR, or invokes $ship-pr; do not use for ordinary implementation or read-only review requests.
---

# Ship a pull request

Take completed, in-scope work from the current feature branch to a review-ready GitHub pull request. A request to use this skill authorizes committing the task changes, pushing the feature branch, and creating the PR. It does not authorize merging the PR.

## 1. Establish scope and branch safety

- Read `AGENTS.md`, inspect `git status`, the current branch, remotes, and the diff against the remote default branch.
- Before implementation, update the default branch, then create a new `feat/<short-name>` branch for exactly one feature.
- Never start a new feature from another feature branch. The previous PR must be merged first.
- Never ship directly from `main`, `master`, or another default branch.
- Separate pre-existing or unrelated changes from the requested work. Never stage them merely because they are present.
- Stop if ownership of overlapping changes is ambiguous and they cannot be separated safely.

## 2. Perform the code review

Review the entire PR diff, not only the last edit. Prioritize:

1. incorrect behavior and regressions;
2. authorization, secrets, injection, uploads, and unsafe data handling;
3. inconsistent Symfony/Angular API contracts;
4. missing error, loading, and boundary handling;
5. missing or misleading tests and documentation;
6. generated, cached, debug, or unrelated files.

Fix clear in-scope findings before continuing. Do not silently expand the feature to address unrelated cleanup. After fixes, review the resulting diff again.

## 3. Verify

- Run the relevant commands from the `Verification` section of `AGENTS.md`.
- Run `git diff --check` and inspect the staged diff before committing.
- Never claim an unavailable or failing check passed. If a non-critical check cannot run, state why in the PR body. Stop on a failure that makes the change unsafe to review or merge.

## 4. Commit and push

- Group files into the smallest useful number of logical commits without rewriting unrelated history.
- Use concise Conventional Commit messages.
- Push the current feature branch to `origin` and set its upstream when needed.
- Do not force-push unless the user explicitly requested it.

## 5. Create the GitHub PR

- Determine the remote default branch instead of assuming its name.
- Prefer GitHub CLI when available: verify authentication, then use `gh pr create` non-interactively.
- If GitHub CLI is unavailable, use another already-authorized GitHub capability. Never ask the user for a token in chat and never store credentials in the repository.
- If no authorized PR-creation capability exists, push the branch if authorized, provide the GitHub compare URL, and report the one-time setup still required. Do not claim the PR was created.
- Use the repository PR template when present.
- Create a regular ready-for-review PR unless the user explicitly asks for a draft.
- Do not merge, enable auto-merge, approve on the user's behalf, or dismiss review findings.

Write the title and body in French. Keep the body concise and include only:

- `## Résumé`: the user-visible outcome and important implementation choices;
- `## Vérifications`: the meaningful checks run;
- `## Points d'attention`: side effects, migrations, configuration changes, performance impact, or limitations. Omit this section when there is nothing material.

Do not narrate routine file-by-file changes or every review step.

## 6. Hand off

Return the PR link, branch name, checks performed, and whether the self-review has any remaining blocking findings. The user should only need to inspect and merge the PR.
