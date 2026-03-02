# Skill: Run Visual Tests

> **Conditional:** the plan metadata JSON (`planning/{story-id}-plan.json`)
> determines whether this skill should execute. If `run-visual-tests` is not
> one of the `selectedSkills`, quit early and note "visual skipped by plan".

## When to Use

Use when design assets such as Figma files, mockups or screenshots are provided with the user story and a visual comparison is required.

## Input

- **Design asset path** or URL as referenced in the story input (in `2-stories/stories.txt`).
- **Rendered page screenshot** taken during test execution or via a separate browser visit.
- Tolerance thresholds for pixel differences (e.g., 0.1% change).

## Steps

1. **Determine if asset exists**; if none, this skill will be skipped.
2. **Capture screenshot** of current application state at relevant URL(s).
3. **Load the reference image** from the design asset.
4. **Compare images** using a pixel-diffing library (e.g., `pixelmatch` or `resemblejs`).
5. **Generate diff image** highlighting differences.
6. **Evaluate diff against tolerance**; mark pass/fail accordingly.

## Output

- `3-outputs/run/{story-id}/visual/diff.png` (highlighted differences).
- Summary notes (pass/fail, percent difference) in `3-outputs/run/{story-id}/visual/summary.txt`.

## Done Criteria

- ✅ Reference and actual screenshots were compared.
- ✅ Diff image or statement produced.
- ✅ Output files saved in correct directory.

## If It Fails

| Issue | Action |
|-------|--------|
| Reference image missing | Log "No visual asset" and skip skill. |
| Screenshot capture error | Retry or log error. |
| Diff library error | Ensure dependencies installed; fall back to manual review. |
