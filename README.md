# Automated Bug Detection and Fix Loop POC

A proof-of-concept demonstrating an automated bug detection and fix loop using GitHub-native tooling.

## Architecture

```
Push/PR ──> GitHub Actions ──> Jest + ESLint
                                    │
                              Failure? ──> Check Dedup ──> Create Issue ──> (Optional) Jira Sync
                                                                │
                                                          Copilot Workspace
                                                                │
                                                           Draft PR ──> CI Re-runs
                                                                │
                                                          Human Review & Merge
```

**How it works:**

1. **Push/PR triggers CI** - GitHub Actions runs tests and linting on every push to non-main branches
2. **Failure detection** - If tests or linting fail, the workflow captures the output
3. **Duplicate check** - Searches open issues to avoid creating duplicates for the same branch
4. **Issue creation** - Creates a labeled GitHub Issue with failure details and commit context
5. **Copilot Workspace** - Developer opens the issue in Copilot Workspace to get an AI-proposed fix
6. **PR and re-verification** - The fix is submitted as a PR, CI re-runs to verify
7. **Human review** - Developer reviews and merges the fix

## Project Structure

| Path | Purpose |
|------|---------|
| `src/` | Sample application source code |
| `tests/` | Jest test files |
| `.github/workflows/auto-bug-detect.yml` | CI workflow (detection + issue + Jira) |
| `.github/ISSUE_TEMPLATE/auto-bug-report.md` | Reference template for auto-created issues |
| `eslint.config.mjs` | ESLint configuration |
| `package.json` | Node.js project definition |
| `specs/001-auto-bug-loop/` | Feature specification and design artifacts |

## Prerequisites

- GitHub account with access to the repository
- GitHub Copilot Enterprise license (for Copilot Workspace)
- Node.js 20+ installed locally
- Git installed

## Setup

```bash
git clone <repository-url>
cd poc-automated-fixes
npm install
```

Verify the baseline:

```bash
npm test        # All tests should pass (15 tests)
npm run lint    # No lint errors
```

## Quick Exercises

### Exercise 1: Trigger a Test Failure

1. Open `tests/math.test.js`
2. Uncomment the `INTENTIONAL BUG` test block at the bottom
3. Commit and push to a non-main branch
4. Watch the **Actions** tab - a GitHub Issue will be auto-created

### Exercise 2: Trigger a Lint Error

1. Open `src/string-utils.js`
2. Uncomment the `INTENTIONAL BUG` function at the bottom
3. Commit and push to a non-main branch
4. Watch the **Actions** tab - a GitHub Issue will be auto-created

### Exercise 3: Use Copilot Workspace

1. Open the auto-created issue
2. Click **"Open in Workspace"** to launch Copilot Workspace
3. Review the AI-proposed fix
4. Create a PR from the workspace
5. CI re-runs on the PR to verify the fix

### Exercise 4: Optional Jira Sync

Configure these repository secrets to enable one-way Jira sync:

- `JIRA_BASE_URL`: Your Atlassian URL (e.g., `https://your-domain.atlassian.net`)
- `JIRA_TOKEN`: Base64-encoded `email:api-token`
- `JIRA_PROJECT_KEY`: Target Jira project key

## Cleanup

```bash
git checkout -- tests/math.test.js src/string-utils.js
git commit -am "Revert intentional bugs"
git push
```

## Design Documents

Detailed specifications and design artifacts are in `specs/001-auto-bug-loop/`:

- [spec.md](specs/001-auto-bug-loop/spec.md) - Feature specification
- [plan.md](specs/001-auto-bug-loop/plan.md) - Implementation plan
- [research.md](specs/001-auto-bug-loop/research.md) - Technical decisions
- [data-model.md](specs/001-auto-bug-loop/data-model.md) - Entity definitions
- [quickstart.md](specs/001-auto-bug-loop/quickstart.md) - Detailed exercise guide
- [contracts/](specs/001-auto-bug-loop/contracts/) - Workflow and issue schemas

## License

MIT
