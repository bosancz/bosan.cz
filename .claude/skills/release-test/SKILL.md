---
name: release-test
description: Release the current branch to the TEST environment by dispatching the "Deploy to TEST environment" GitHub Actions workflow (.github/workflows/deploy-test.yml) against that branch. Use when the user asks to release/deploy to TEST, ship the branch to TEST, or says "/release-test".
allowed-tools: Bash(git rev-parse:*), mcp__github__actions_run_trigger
---

# Release current branch to TEST

1. Dispatch the workflow against the current branch. Nothing else — no pre-checks, no watching the run.
   Print these lines before dispatching the workflow:

- `Releasing to TEST...`

```
mcp__github__actions_run_trigger
  method: run_workflow
  owner: bosancz
  repo: bosan.cz
  workflow_id: deploy-test.yml
  ref: <output of `git rev-parse --abbrev-ref HEAD`>
```

2. Get the workflow run URL and print these lines:

- `Workflow: <LINK TO WORKFLOW RUN>`

3. Wait for the workflow to finish and after it finishes, print these lines:

On workflow fail:

- `Failed. `

On workflow success:

- `Released to TEST.`
- `Released commit: <git sha>` (use current commit's short SHA - `git rev-parse --short=7 HEAD`)
- `Open: https://test.bosan.cz`

4. Stop.
