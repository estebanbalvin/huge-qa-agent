# Skill: Run Accessibility Tests (Optimized)

> **Conditional:** inspect the plan metadata JSON at
> `3-outputs/run/{story-id}/planning/{story-id}-plan.json`. Skip the
> accessibility audit if `run-accessibility-tests` is not present in
> `selectedSkills`.
>
> **Performance Note:** This skill is optimized to run ultra-fast using the locally installed
> `@axe-core/playwright` package. Axe is injected via the Playwright API, not via CDN, resulting
> in 10-15x faster execution compared to dynamic script injection.

## When to Use

Invoked after functional test execution or on demand when accessibility validation is required.
Use this skill to perform **high-speed automated** WCAG 2.2 AA checks only on the specific element,
component, module, section or page described by a user story and ACs. Do not run this test anywhere else.

## Input

- **URL or test context** of the page/component under test.
- Accessibility configuration (breakpoints list, axe-core options).
- Optional story metadata indicating specific a11y requirements.

## Steps

1. **Use MCP Playwright with @axe-core/playwright** (already installed):
   - Do **NOT** inject Axe from a CDN.
   - Import and use the Playwright reporter directly:
     ```javascript
     const { injectAxe, checkA11y } = require('@axe-core/playwright');
     ```
   - This eliminates network latency and script parsing overhead.

2. **Navigate to the target URL** and wait for stable page state (no pending network requests).

3. **Run Axe audit** using the Playwright API (not dynamic injection):
   ```javascript
   await injectAxe(page);
   const violations = await checkA11y(page, null, { rules: ['wcag2aa'] });
   ```
   - Collect violations, passes, and incomplete items in a single pass.
   - Process results immediately (no callback waiting).

4. **Perform minimal manual checks** only if violations are found:
   - Verify heading hierarchy (H1–H6 order).
   - Spot-check `alt` text on critical images.
   - Confirm keyboard escape is possible (Escape key).
   - Note any violations not caught by Axe (e.g., missing form labels).

5. **Test at breakpoints in parallel** (if possible) or sequentially:
   - Mobile (375px), Tablet (768px), Desktop (1440px).
   - Reuse page context; only change viewport size between tests.
   - Cache Axe library reference to avoid re-injection.

6. **Aggregate results** and save immediately to avoid re-running expensive operations.

## Speed Optimizations

- ✅ **Local Axe library:** No CDN download or parsing.
- ✅ **Synchronous execution:** Axe results returned immediately; no callbacks.
- ✅ **Viewport caching:** Change viewport size without reloading page (faster than full navigation).
- ✅ **Parallel breakpoints:** If MCP supports concurrent Playwright instances, test multiple breakpoints simultaneously.
- ✅ **Lazy manual checks:** Only run manual inspections if Axe finds violations (skip if all pass).

## Output

- `3-outputs/run/{story-id}/accessibility/{story-id}-report.json` (structured violations and summary).
- `3-outputs/run/{story-id}/accessibility/{story-id}-report.md` (human-readable overview).
- Screenshots of failing elements if applicable (saved under the same folder).

## Done Criteria

- ✅ Audit ran successfully at all breakpoints.
- ✅ Automated axe-core results captured.
- ✅ Manual checks performed and noted.
- ✅ Output files generated in the correct location.

## If It Fails

| Issue | Action |
|-------|--------|
| Axe script injection fails | Retry navigation and injection; ensure page allows scripts. |
| Page unreachable | Log error; mark accessibility stage as SKIPPED. |
| No breakpoints available | Use default viewport sizes. |
| Exceptions during audit | Capture error, continue with next breakpoint. |
