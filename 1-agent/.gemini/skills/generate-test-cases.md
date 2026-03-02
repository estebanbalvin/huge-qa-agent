# Skill: Generate Test Cases from Scenarios

## When to Use

This skill is invoked after scenarios are planned:
- When test scenarios have been defined and documented.
- When converting high-level scenarios into executable test code.
- When ISTQB best practices (positive/negative, boundary values, equivalence partitioning) need to be applied.

## Input

- **Plan metadata JSON:** `3-outputs/run/{story-id}/planning/{story-id}-plan.json` produced by the previous skill. Read the `selectedSkills` array to determine if this skill should run; if `generate-test-cases` is not listed simply exit with a message "skipping per plan".

- **Optional analysis HTML** (for context) may be read from the plan metadata.

- If the JSON is missing or corrupted, fall back to the old scenario file format located at `3-outputs/run/{story-id}/planning/{story-id}-scenarios.txt`.

- **Additional context:** Story ID, feature name, and any available test data.
## Steps

1. **Read the plan metadata JSON.**
   - If the `selectedSkills` array does not include `generate-test-cases`,
     return immediately with a note that the skill has been skipped.
   - Otherwise, continue.

2. **Extract scenarios** either from an embedded section of the HTML report or
   from the legacy scenarios text file (`{story-id}-scenarios.txt`).

3. **Classify each scenario** using ISTQB techniques (positive, negative,
   edge/boundary) and decide on appropriate data-driven patterns.

4. **Generate a list of test case definitions** (name, steps, expected result)
   from the classified scenarios. These do not need to be full TypeScript code; a
   tabular representation (CSV or structured text) is sufficient.

5. **Publish test cases**:
   - **Primary:** if a Google Sheets MCP server is configured (check
     `mcpServers.google-sheets` in Gemini settings or an env var), use the
     corresponding MCP tool to append each case as a new row with status
     `pending`.
   - **Fallback:** if Sheets is unavailable, write a plain text file at
     `3-outputs/run/{story-id}/planning/{story-id}-test-cases.txt` containing the
     cases in human‑readable form.

6. **Validate output** ensures at least one test case exists and the chosen
   destination has been written.

## Output

If Google Sheets was used the cases will appear in the configured spreadsheet
with state `pending`. Otherwise, the fallback file will be:

`3-outputs/run/{story-id}/planning/{story-id}-test-cases.txt`
containing a simple list or table of test case names and steps.

Example text file format:
```
USER-001 – Valid login with correct credentials
  Steps: navigate to /login, enter valid email/password, click submit
  Expected: redirect to /dashboard

USER-001 – Invalid email format
  Steps: navigate to /login, enter malformed email, ...
  Expected: show email validation error

... (other cases) ...
```

When Google Sheets is available the agent should confirm rows were appended
and mention the sheet URL in the report.
## Done Criteria

- ✅ All scenarios from the planning file are converted to test cases.
- ✅ Test cases follow Arrange-Act-Assert (AAA) pattern.
- ✅ At least one positive (happy path) test case exists.
- ✅ At least two negative test cases are included.
- ✅ ISTQB techniques applied: equivalence partitioning, boundary analysis, error guessing.
- ✅ Test data is clear and representative.
- ✅ Test file is saved in `1-qa-agent/tests/` with correct naming: `{story-id}.spec.ts`.
- ✅ All test cases are executable (no syntax errors).
- ✅ Test coverage includes main flow + at least 2 alternative/error flows.

## If It Fails

| Issue | Action |
|-------|--------|
| Scenario file not found | Log error with expected path. Ask user to run "Plan Scenarios" skill first. |
| Invalid TypeScript syntax | Use a linter (ESLint) to identify issues; auto-fix if possible. |
| Missing test data | Use placeholder or dummy data; document as `TODO: Add actual test data`. |
| Test cases too similar | Refactor using `it.each()` with data-driven approach. |
| Coverage incomplete | Re-read scenario file and add missing test cases. |
| Framework not available | Check `package.json`; install Jest or required framework. |
