# Quickstart: Automated Bug Detection and Fix Loop POC

**Branch**: `001-auto-bug-loop` | **Date**: 2026-01-30

## Prerequisites

- GitHub account with access to the repository
- GitHub Copilot Enterprise license (for Copilot Workspace)
- Node.js 20+ installed locally (for running tests/lint locally)
- Git installed

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd poc-automated-fixes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify the baseline passes:
   ```bash
   npm test        # All tests should pass
   npm run lint    # No lint errors
   ```

## Exercise 1: Trigger a Test Failure

1. Open `tests/math.test.js`
2. Find the commented-out intentional failure block
3. Uncomment it (the test asserts `add(2, 2) === 5`, which will fail)
4. Commit and push:
   ```bash
   git add tests/math.test.js
   git commit -m "Introduce intentional test failure for POC demo"
   git push
   ```
5. Navigate to the repository's **Actions** tab and watch the workflow run
6. When it completes, check the **Issues** tab for a new issue labeled `auto-fix` and `bug`
7. Open the issue and click **"Open in Workspace"** to launch Copilot Workspace
8. Review the proposed fix, create a PR, and watch CI re-run

## Exercise 2: Trigger a Lint Error

1. Open `src/string-utils.js`
2. Find the commented-out intentional lint error block
3. Uncomment it (uses `==` instead of `===`, violating the `eqeqeq` rule)
4. Commit and push:
   ```bash
   git add src/string-utils.js
   git commit -m "Introduce intentional lint error for POC demo"
   git push
   ```
5. Follow the same observation steps as Exercise 1

## Exercise 3: Verify Duplicate Detection

1. With the test failure from Exercise 1 still present (issue still open), push another commit to the same branch:
   ```bash
   echo "// trigger rebuild" >> src/math.js
   git add src/math.js
   git commit -m "Trigger rebuild to test dedup"
   git push
   ```
2. Observe that CI runs again but does **not** create a second issue (the existing open issue for this branch is detected)

## Exercise 4: Optional Jira Sync

1. Configure repository secrets:
   - `JIRA_BASE_URL`: Your Atlassian instance URL (e.g., `https://your-domain.atlassian.net`)
   - `JIRA_TOKEN`: Base64-encoded `email:api-token`
   - `JIRA_PROJECT_KEY`: Target Jira project key
2. Trigger a failure (repeat Exercise 1 or 2)
3. Check your Jira project for a new Bug ticket labeled `auto-detected` and `github-managed`

## Architecture Overview

```
Push/PR ──► GitHub Actions ──► Jest + ESLint
                                    │
                              Failure? ──► Check Dedup ──► Create Issue ──► (Optional) Jira Sync
                                                                │
                                                          Copilot Workspace
                                                                │
                                                           Draft PR ──► CI Re-runs
                                                                │
                                                          Human Review & Merge
```

## Project Structure

| Path | Purpose |
|------|---------|
| `src/` | Sample application source code |
| `tests/` | Jest test files |
| `.github/workflows/auto-bug-detect.yml` | CI workflow (detection + issue + Jira) |
| `eslint.config.mjs` | ESLint configuration |
| `package.json` | Node.js project definition |
| `specs/001-auto-bug-loop/` | Feature specification and design artifacts |

## Cleanup

To revert intentional bugs after exercising the loop:
```bash
git checkout -- tests/math.test.js src/string-utils.js
git commit -am "Revert intentional bugs after POC demo"
git push
```

Close any open auto-fix issues manually or via PR linking (`Fixes #N` in commit message).
