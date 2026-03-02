# Accessibility Audit Report - KAN-13

## Summary
- **Story ID:** KAN-13
- **URL:** https://futbolbuggy.geekqa.net/
- **Overall Status:** FAILED (WCAG 2.2 AA Compliance)
- **Breakpoints Tested:** 375px (Mobile), 768px (Tablet), 1440px (Desktop)

## Automated Findings (axe-core)
| Violation | Impact | Nodes | Help |
|-----------|--------|-------|------|
| **button-name** | Critical | 2 | Buttons must have discernible text (Pagination arrows). |
| **select-name** | Critical | 2 | Select element must have an accessible name (Filters). |
| **color-contrast** | Serious | 24 | Elements must meet minimum contrast ratio thresholds. |
| **heading-order** | Moderate | 1 | Heading levels should only increase by one (Skips H2). |

## Manual Review
- **Heading Hierarchy:** ❌ FAILED. Page skips from H1 (Site Title) to H3 (Team Names).
- **Alt Text:** ✅ PASSED. Team images have appropriate alt attributes.
- **Focus Visibility:** ✅ PASSED. Interactive elements show a clear focus state.
- **Target Size:** ✅ PASSED. Mobile tap targets are large enough.

## Recommendations
1. Add `aria-label` to the pagination buttons (Prev/Next).
2. Add `<label>` elements or `aria-label` to the League and Country filter selects.
3. Review the color palette for the dark theme to ensure text contrast meets 4.5:1 ratio.
4. Correct heading structure by adding an H2 level or adjusting team names to H2.
