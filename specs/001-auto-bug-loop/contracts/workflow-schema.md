# Workflow Contract: auto-bug-detect.yml

**Branch**: `001-auto-bug-loop` | **Date**: 2026-01-30

## Trigger

```yaml
on:
  push:
    branches-ignore:
      - main
      - master
  pull_request:
    branches-ignore:
      - main
      - master
```

## Jobs

### `analyze`

**Runner**: `ubuntu-latest`

**Steps**:

| Step | ID | Action/Command | continue-on-error | Outputs |
|------|----|----------------|-------------------|---------|
| 1 | - | `actions/checkout@v4` | false | - |
| 2 | - | Setup Node.js (v20) | false | - |
| 3 | - | `npm ci` | false | - |
| 4 | `tests` | `npm test 2>&1 \| tee test-output.txt` | **true** | `outcome` |
| 5 | `lint` | `npm run lint 2>&1 \| tee lint-output.txt` | **true** | `outcome` |
| 6 | `check-duplicate` | `actions/github-script@v7` - search open issues | false | `duplicate_found` |
| 7 | `create-issue` | `actions/github-script@v7` - create issue | false | `issue_number` |
| 8 | `jira-sync` | `curl` POST to Jira REST API | true | - |

**Step Conditions**:

| Step | Condition |
|------|-----------|
| 6 (check-duplicate) | `steps.tests.outcome == 'failure' \|\| steps.lint.outcome == 'failure'` |
| 7 (create-issue) | `(steps.tests.outcome == 'failure' \|\| steps.lint.outcome == 'failure') && steps.check-duplicate.outputs.duplicate_found != 'true'` |
| 8 (jira-sync) | `steps.create-issue.outputs.issue_number && env.JIRA_BASE_URL != ''` |

## Duplicate Detection Contract

**Input**: Branch ref (`context.ref`), label filter (`auto-fix`)

**Query** (via `actions/github-script`):
```
GET /repos/{owner}/{repo}/issues
  ?state=open
  &labels=auto-fix
  &per_page=100
```

**Match criteria**: Issue body contains the string from `context.ref` (branch name).

**Output**: `duplicate_found` = `'true'` if any matching issue exists, `'false'` otherwise.

## Issue Creation Contract

**Input**: `context.sha`, `context.ref`, `test-output.txt`, `lint-output.txt`

**Output**: GitHub Issue with:
- Title: `[Auto] Build failure: {sha.substring(0,7)}`
- Labels: `["auto-fix", "bug"]`
- Body: See [issue-template.md](./issue-template.md)

## Jira Sync Contract

**Input**: `JIRA_BASE_URL`, `JIRA_TOKEN`, `JIRA_PROJECT_KEY` (from repository secrets), `context.sha`

**Request**:
```
POST {JIRA_BASE_URL}/rest/api/3/issue
Authorization: Basic {JIRA_TOKEN}
Content-Type: application/json

{
  "fields": {
    "project": {"key": "{JIRA_PROJECT_KEY}"},
    "summary": "[Auto-Fix] Build failure {context.sha}",
    "issuetype": {"name": "Bug"},
    "labels": ["auto-detected", "github-managed"]
  }
}
```

**Failure handling**: Step uses `continue-on-error: true`. Jira failure does not block workflow completion.

## Secrets Required

| Secret | Required | Purpose |
|--------|----------|---------|
| `GITHUB_TOKEN` | Auto-provided | Issue creation (default permissions) |
| `JIRA_BASE_URL` | Optional | Jira instance URL (e.g., `https://your-domain.atlassian.net`) |
| `JIRA_TOKEN` | Optional | Base64-encoded `email:api-token` for Jira auth |
| `JIRA_PROJECT_KEY` | Optional | Jira project key (e.g., `PROJ`) |
