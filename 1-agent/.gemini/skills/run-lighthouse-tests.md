# Skill: Run Lighthouse Tests

> **Conditional:** read `planning/{story-id}-plan.json` from the run
> folder and proceed only if `run-lighthouse-tests` appears in
> `selectedSkills`. Otherwise, log that the lighthouse stage is skipped.

## When to Use

Invoke this skill when you need performance, accessibility, best practices, or SEO audits for a specific page or component.
Typically runs after functional test execution or can be triggered independently.

## Input

- **URL** of the page under test (from story or test context).
- Lighthouse configuration options (emulated device, categories to run).

## Steps

1. **Prepare environment**: ensure Node and lighthouse CLI or library are available.
2. **Execute Lighthouse audit** using `lighthouse <URL> --output=json --output-path=<path>` or programmatic API.
3. **Capture report data** for the requested categories (performance, SEO, etc.).
4. **Optionally convert JSON to HTML or markdown** for readability.
5. **Save raw and formatted reports** to `3-outputs/run/{story-id}/lighthouse/`

## Output

- `3-outputs/run/{story-id}/lighthouse/{story-id}-report.json` (Lighthouse JSON output).
- `3-outputs/run/{story-id}/lighthouse/{story-id}-report.html` (optional human-readable report).


## Done Criteria

- ✅ Lighthouse executed without errors.
- ✅ Report contains results for configured categories.
- ✅ Results saved in the appropriate output folder.

## If It Fails

| Issue | Action |
|-------|--------|
| Lighthouse not installed | Install via `npm install -g lighthouse` or dependency. |
| URL unreachable | Log and mark audit as SKIPPED. |
| Audit timed out | Increase timeout or retry later. |
| Report cannot be written | Check file permissions and available disk space. |
