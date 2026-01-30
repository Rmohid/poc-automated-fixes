# Data Model: Automated Bug Detection and Fix Loop POC

**Branch**: `001-auto-bug-loop` | **Date**: 2026-01-30

## Entities

### CI Workflow (`auto-bug-detect.yml`)

The central orchestrator. Not a data entity in the traditional sense, but a stateful pipeline with defined inputs, transitions, and outputs.

**Inputs**:
- `push` event (all branches except main/master)
- `pull_request` event (all branches except main/master)

**Internal State**:
- `tests.outcome`: `success` | `failure` (from Jest step)
- `lint.outcome`: `success` | `failure` (from ESLint step)
- `test-output.txt`: Captured stdout/stderr from test run (up to full output)
- `lint-output.txt`: Captured stdout/stderr from lint run (up to full output)

**Transitions**:
1. Start → Run Tests → Run Lint → Evaluate Outcomes
2. If both pass → Done (no issue created)
3. If either fails → Check for Duplicate → Create Issue (or skip if duplicate found)
4. If Jira configured → Mirror to Jira (independent of issue creation outcome)

**Outputs**:
- GitHub Issue (if failure detected and no duplicate)
- Jira Ticket (optional, if configured)

---

### Auto-Created Issue (GitHub Issue)

**Attributes**:

| Field       | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| title       | string   | `[Auto] Build failure: <short-sha>`              |
| labels      | string[] | `["auto-fix", "bug"]`                            |
| body        | markdown | Structured report (see Issue Template contract)  |
| state       | enum     | `open` (created) → `closed` (after fix merged)   |
| created_by  | string   | `github-actions[bot]`                            |

**Identity/Uniqueness**: One open issue per branch (enforced by dedup check on `auto-fix` label + branch name in body).

**Lifecycle**:
1. Created by CI workflow on failure detection
2. Opened by developer in Copilot Workspace
3. PR created from workspace
4. CI verifies fix on PR
5. Human reviews and merges PR
6. Issue closed manually or via PR linking (`Fixes #N`)

---

### Jira Mirror Ticket

**Attributes**:

| Field      | Type     | Description                                              |
|------------|----------|----------------------------------------------------------|
| project    | string   | Configured via `JIRA_PROJECT_KEY` secret                 |
| summary    | string   | `[Auto-Fix] Build failure <full-sha>`                    |
| issuetype  | string   | `Bug`                                                    |
| labels     | string[] | `["auto-detected", "github-managed"]`                    |

**Identity/Uniqueness**: No dedup on Jira side (one-way sync; Jira tickets are informational mirrors). Duplicate Jira tickets may occur if GitHub dedup is bypassed.

**Lifecycle**:
1. Created by CI workflow after GitHub Issue creation (if Jira configured)
2. Managed manually in Jira (no automatic state sync back to GitHub)

---

### Sample Application Modules

**`math.js`**:

| Export       | Type     | Description                          |
|--------------|----------|--------------------------------------|
| `add(a, b)`  | function | Returns sum of two numbers           |
| `multiply(a, b)` | function | Returns product of two numbers  |

**`string-utils.js`**:

| Export              | Type     | Description                          |
|---------------------|----------|--------------------------------------|
| `capitalize(str)`   | function | Capitalizes first letter of string   |
| `reverse(str)`      | function | Reverses a string                    |

**Intentional Bug Scenarios** (commented out by default):

| Module           | Bug Type    | Trigger                                  | Expected Failure       |
|------------------|-------------|------------------------------------------|------------------------|
| `math.test.js`   | Test failure | Uncomment test that asserts `add(2,2) === 5` | Jest test failure    |
| `string-utils.js`| Lint error  | Uncomment line using `==` instead of `===` | ESLint `eqeqeq` error |

## Relationships

```
push/PR event
    │
    ▼
CI Workflow ──► runs ──► Sample Application (Jest + ESLint)
    │
    ├── on failure ──► creates ──► Auto-Created Issue (GitHub)
    │                                   │
    │                                   ├── opened in ──► Copilot Workspace
    │                                   │                      │
    │                                   │                      ▼
    │                                   │               Draft PR ──► CI re-runs
    │                                   │
    │                                   └── (optional) mirrored to ──► Jira Mirror Ticket
    │
    └── on success ──► no action
```
