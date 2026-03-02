# Skill: Log Results and Prepare HTML Test Report

*This skill is always executed – the one mandatory stage at the end of every
run.*

## When to Use

After all selected automated tests and audits have finished, even if some were
skipped by the plan. The output is a comprehensive HTML report with:

- Table of generated test cases and their execution status.
- Embedded screenshots for passed/failed steps.
- Summary of accessibility, lighthouse, and visual results.
- Classification of each case by test type (functional, accessibility,
  performance, visual).

## Input

- Execution report JSON
  (`3-outputs/run/{story-id}/execution/execution-report.json`).
- Accessibility, lighthouse and visual folders under the run directory.
- Plan HTML or JSON (for context).
- Any screenshots or logs produced during earlier stages.

## Steps

1. **Gather data** from all available sources (execution JSON, plan JSON,
   accessibility/lighthouse/visual folders, screenshots).
2. **Build an HTML document** containing:
   - Header with story ID, run timestamp, and selected skills.
   - A table of test cases showing name, status, type, and links to evidence.
   - Embedded or linked screenshots for failures (use `<img>` tags with
     relative paths).
   - Sections summarising results from each auxiliary audit (accessibility,
     lighthouse, visual), including key metrics and violation counts.
   - A small `script` or inline CSS for basic styling.
3. **Write the HTML file** to
   `3-outputs/run/{story-id}/test-report.html` (root of the run directory).
4. **Also create a companion JSON/markdown summary** if needed, but the HTML is
   the authoritative report.
5. **Log a brief console message** pointing to the report path and indicating
   PASS/FAIL status.
6. **Ensure the report is self‑contained** except for large attachments which
   may remain in subfolders.

## Output

- `3-outputs/run/{story-id}/test-report.html` – full HTML report with
  details described above.
- Console message indicating the location of the report and overall verdict.
- Optionally other summary files as before, but the HTML is the primary
  deliverable.

## Done Criteria

- ✅ `test-report.html` exists and is viewable in a browser.
- ✅ Report contains a table listing every generated test case and its final
  status.
- ✅ Screenshots or links to evidence accompany failed or noteworthy steps.
- ✅ Sections summarising accessibility, lighthouse and visual findings are
  present (if those skills ran).
- ✅ Console output points to the HTML report and indicates overall PASS/FAIL.
- ✅ Data remains accessible for the `report-bugs` skill if further action is
  required.

## If It Fails

| Issue | Action |
|-------|--------|
| Execution report missing | Log warning; skip summary generation. |
| Additional reports unavailable | Note absence but continue. |
| Write failure for summary log | Ensure output directory exists and is writable. |
