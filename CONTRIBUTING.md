# Contributing

This POC is a learning tool. Here's how to extend it.

## Adding New Intentional Bugs

1. Create or modify a file in `src/` with a commented-out bug
2. Add a clear `// INTENTIONAL BUG` comment explaining the purpose
3. Ensure the bug is detectable by either Jest (test failure) or ESLint (lint error)
4. Add a corresponding test in `tests/` if it's a logic bug
5. Verify the baseline still passes with the bug commented out:
   ```bash
   npm test && npm run lint
   ```

## Extending the Workflow

The CI workflow is in `.github/workflows/auto-bug-detect.yml`. To add new analysis steps:

1. Add a new step after the lint step with `continue-on-error: true`
2. Capture output to a file (e.g., `my-analysis-output.txt`)
3. Include the output in the issue body by reading the file in the `create-issue` step
4. Update the conditional logic if the new step should trigger issue creation

## Configuring Jira Sync

The Jira sync step requires three repository secrets:

| Secret | Value |
|--------|-------|
| `JIRA_BASE_URL` | Your Atlassian instance URL (e.g., `https://your-domain.atlassian.net`) |
| `JIRA_TOKEN` | Base64-encoded `email:api-token` |
| `JIRA_PROJECT_KEY` | Target Jira project key (e.g., `PROJ`) |

To generate a Jira API token:

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Create a new token
3. Base64-encode `your-email@example.com:your-api-token`
4. Add as the `JIRA_TOKEN` repository secret

## Modifying ESLint Rules

The ESLint configuration is in `eslint.config.mjs`. It uses the flat config format (ESLint v9+).

Current rules:
- `no-unused-vars`: error
- `no-console`: warn
- `eqeqeq`: error

To add a new rule for a new intentional bug type, add it to the `rules` object and create a corresponding commented-out violation in a source file.

## Running Locally

```bash
npm install       # Install dependencies
npm test          # Run Jest tests
npm run lint      # Run ESLint
```
