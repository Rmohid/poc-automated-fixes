# Research: Automated Bug Detection and Fix Loop POC

**Branch**: `001-auto-bug-loop` | **Date**: 2026-01-30

## Decision 1: GitHub Actions Workflow Design

**Decision**: Use a single workflow file (`auto-bug-detect.yml`) with `continue-on-error: true` on test and lint steps, followed by a conditional issue-creation step using `actions/github-script@v7`.

**Rationale**: A single workflow keeps the POC simple and self-contained. `continue-on-error: true` allows the workflow to proceed to the issue-creation step even when tests or linting fail. `actions/github-script@v7` provides inline JavaScript with full access to the GitHub REST API (Octokit), eliminating the need for custom actions or external scripts.

**Alternatives considered**:
- Separate workflows for test and lint: Rejected because it would create two issues for a single push and complicate dedup logic.
- Custom GitHub Action: Rejected as overengineered for a POC. Inline script is sufficient and easier to read/modify.
- Third-party CI tools (CircleCI, Jenkins): Rejected because the spec requires GitHub-native integration for Copilot Workspace compatibility.

## Decision 2: Duplicate Issue Detection

**Decision**: Before creating a new issue, query the GitHub Issues API for open issues with the `auto-fix` label whose body contains the branch name (`context.ref`). Skip creation if a match is found.

**Rationale**: Branch-level dedup is the right granularity for a POC. If a branch has an open auto-fix issue, further pushes to that branch are likely attempting to fix the same problem. This avoids flooding the issue tracker without requiring complex failure fingerprinting.

**Alternatives considered**:
- Title-based matching: Rejected because issue titles contain commit SHAs that change per push, making exact matches unreliable.
- Failure-content hashing: Rejected as overengineered. Different failures on the same branch may still be related, and content-based dedup requires normalization logic.
- No dedup: Rejected because even for a POC, duplicate issues create noise that undermines the learning experience.

## Decision 3: Node.js Sample Application Design

**Decision**: Create two simple modules (`math.js`, `string-utils.js`) with corresponding test files. Each module contains one intentional bug that is commented out by default. Learners uncomment the bug to trigger failures.

**Rationale**: Two modules provide separate failure scenarios (one for test failure, one for lint error) without coupling them. Commented-out bugs are self-documenting and reversible. The modules are simple enough that a learner can understand the entire codebase in minutes.

**Alternatives considered**:
- Single module with multiple bugs: Rejected because it conflates test and lint failures, making it harder to exercise them independently.
- External bug injection via environment variables: Rejected as too abstract for a learning tool; commented code is more visible and intuitive.
- Separate branches with bugs pre-introduced: Rejected because learners should practice the push-trigger flow themselves.

## Decision 4: ESLint Configuration

**Decision**: Use ESLint flat config (`eslint.config.mjs`) with minimal rules: `no-unused-vars` (error), `no-console` (warn), `eqeqeq` (error). The intentional lint error will be a `==` comparison (violating `eqeqeq`) in a commented-out code block.

**Rationale**: Flat config is the current ESLint standard (v9+). The chosen rules are universally understood and produce clear error messages. `eqeqeq` violations are easy to introduce and fix, making them ideal for a learning exercise.

**Alternatives considered**:
- Legacy `.eslintrc.json` config: Rejected as deprecated in ESLint v9.
- Airbnb or Standard preset: Rejected as too many rules for a POC; failures would be noisy and confusing for learners.
- Custom plugin: Rejected as unnecessary complexity.

## Decision 5: Jira Sync Approach

**Decision**: Use a conditional step in the same workflow that makes a `curl` POST to the Jira REST API v3 (`/rest/api/3/issue`). The step checks for the existence of `JIRA_BASE_URL`, `JIRA_TOKEN`, and `JIRA_PROJECT_KEY` secrets; if any are missing, the step is skipped.

**Rationale**: A single `curl` call is the simplest possible integration. No additional dependencies or GitHub Actions are needed. Secret-based conditional execution is a standard pattern.

**Alternatives considered**:
- Atlassian GitHub Marketplace action: Rejected because it adds a third-party dependency and may require configuration beyond what's needed for a POC.
- Webhook-based sync: Rejected because it requires a receiving endpoint, adding infrastructure complexity.
- GitHub-to-Jira sync app (official): Rejected because it's a full bidirectional sync tool, which is overkill for one-way POC visibility.

## Decision 6: Branch Filtering

**Decision**: Use `branches-ignore: [main, master]` in the workflow trigger to exclude the stable branches from auto-issue creation.

**Rationale**: The `branches-ignore` syntax is native to GitHub Actions and is the cleanest way to exclude specific branches. Using both `main` and `master` covers repositories that use either convention.

**Alternatives considered**:
- `branches: ['**']` with conditional step: Rejected as more complex and less readable.
- Only trigger on `feature/*` pattern: Rejected because it's too restrictive for a learning environment where learners may use any branch name.
