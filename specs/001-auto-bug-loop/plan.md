# Implementation Plan: Automated Bug Detection and Fix Loop POC

**Branch**: `001-auto-bug-loop` | **Date**: 2026-01-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-auto-bug-loop/spec.md`

## Summary

Build a proof-of-concept automated bug detection and fix loop that demonstrates the GitHub-native workflow: push → CI failure detection → auto-created GitHub Issue → Copilot Workspace fix → PR → CI re-verification. The POC includes a Node.js sample application with Jest tests and ESLint, a GitHub Actions workflow for detection and issue creation with branch-level dedup, optional one-way Jira sync, and documentation for learners to exercise the full loop.

## Technical Context

**Language/Version**: JavaScript (Node.js 20 LTS), YAML (GitHub Actions workflows)
**Primary Dependencies**: Jest (testing), ESLint (linting), actions/checkout@v4, actions/github-script@v7
**Storage**: N/A (no persistent storage; state lives in GitHub Issues and Jira API)
**Testing**: Jest for unit tests, ESLint for static analysis, GitHub Actions for CI pipeline testing
**Target Platform**: GitHub Actions (ubuntu-latest runners), GitHub Issues, optional Jira Cloud
**Project Type**: Single project
**Performance Goals**: Issue creation within 5 minutes of push (governed by GitHub Actions queue time)
**Constraints**: GitHub Issue body size limit (~65,536 chars; output truncated to 3,000 chars/section), GitHub API rate limits (1,000 requests/hour for authenticated apps)
**Scale/Scope**: Single repository POC for learning; not designed for multi-repo or enterprise scale

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No project constitution has been ratified. The constitution file contains only the default template placeholders. No gates to evaluate. Proceeding without constitution constraints.

**Post-Phase 1 re-check**: No constitution violations possible (no principles defined).

## Project Structure

### Documentation (this feature)

```text
specs/001-auto-bug-loop/
├── plan.md              # This file
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - entity definitions
├── quickstart.md        # Phase 1 output - getting started guide
├── contracts/           # Phase 1 output - workflow and issue schemas
│   ├── workflow-schema.md
│   └── issue-template.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── math.js              # Sample application module (simple functions)
└── string-utils.js      # Sample application module (string utilities)

tests/
├── math.test.js         # Passing tests + commented-out intentional failure
└── string-utils.test.js # Passing tests + commented-out intentional failure

.github/
├── workflows/
│   └── auto-bug-detect.yml   # Main CI workflow (detect + issue + optional Jira)
└── ISSUE_TEMPLATE/
    └── auto-bug-report.md    # Template for auto-generated issues (reference)

.eslintrc.json               # ESLint config with intentional-error comments
package.json                 # Node.js project with test/lint scripts
```

**Structure Decision**: Single project layout. The POC is a self-contained Node.js project with the sample app source in `src/`, tests in `tests/`, and CI automation in `.github/workflows/`. No backend/frontend separation needed.

## Complexity Tracking

No constitution violations to justify. The project is minimal by design (POC scope).
