# Skill: Report Bugs with Severity and Evidence

## When to Use

This skill is invoked after test execution is complete:
- When the execution report shows failed tests.
- When defects (unexpected behaviors) are identified during test execution.
- When evidence (screenshots, logs) must be compiled into a formal bug report.

## Input

**Execution report location:** `3-outputs/run/{story-id}/execution/execution-report.json`

**Content needed:**
- List of failed tests and their error details.
- Evidence artifacts (screenshots, logs, videos).
- Test scenario descriptions.
- Expected vs. actual results.

**Execution context:**
- Story ID and feature name.
- Test execution timestamp.
- Environment details (browser, OS, application version).

## Steps

1. **Parse execution report.**
   - Filter for tests with status = "FAILED".
   - Extract error messages and evidence paths.
   - Evidence files may reside under a hidden `.playwright-mcp/3-outputs/run/{story-id}/execution/` directory rather than the public `3-outputs` folder. If any screenshot/log path is missing in the public outputs, look in the hidden directory and copy the file into the expected location.

2. **Analyze each failure** to determine root cause and severity.
   - **Critical:** Feature is completely non-functional; blocks user workflow.
   - **High:** Major feature partially broken; workaround may exist.
   - **Medium:** Minor feature issue; cosmetic or non-blocking.
   - **Low:** Typo, UI misalignment, or documentation issue.
   - **Copy screenshots/logs:** When a failure includes evidence paths, copy those files into `bugs/evidence/` immediately and rename them according to the bug ID (e.g. `BUG-{story-id}-{nn}-screenshot-01.png`). Ensure the copied files are readable and not corrupted.

3. **Map failure to potential bug categories.**
   - Functional defect (logic error)
   - UI defect (display/layout issue)
   - Performance issue (slow response)
   - Accessibility issue (WCAG violation)
   - Security issue (data exposure, validation bypass)

4. **Create detailed bug report for each failure.**
   - Title: Clear, concise description of the issue.
   - Severity: As determined above.
   - Reproduction steps: Exact sequence to reproduce.
   - Expected behavior: What should happen.
   - Actual behavior: What actually happens.
   - Evidence: Screenshots, logs, video links.
   - Test case reference: Which test case exposed this bug.

5. **Organize and consolidate bugs.**
   - Remove duplicate bugs (same root cause).
   - Group related bugs together.
   - Assign unique bug IDs: `BUG-{story-id}-{number}`.
   - **Copy evidence files:** For each failure with screenshots/logs, locate the artifacts either in `3-outputs/run/{story-id}/execution/` or in the hidden `.playwright-mcp/3-outputs/run/{story-id}/execution/`. Copy them into the new `3-outputs/run/{story-id}/bugs/evidence/` directory using the bug‑specific filename conventions. Also mirror any screenshots into `3-outputs/run/{story-id}/execution/` so the test report renders correctly. Confirm files exist and are not empty before referencing them.

6. **Generate bug report in multiple formats.**
   - JSON format (machine-readable), making sure screenshot paths point to the copied files under `bugs/evidence/`.
   - Markdown format (human-readable, suitable for wiki or README) with relative links that render correctly when opened from the bugs folder.
7. **Create JIRA issues via MCP.**
   - For each bug identified, use the JIRA MCP skill to create a new issue in the appropriate JIRA project (e.g. `QA` or configured project key).
   - Attach evidence files (screenshots, logs) to the issue using the MCP `uploadFile` capability or equivalent.
   - Populate issue fields:
     - Summary: same as bug title.
     - Description: include reproduction steps, expected vs actual, environment and test case reference.
     - Priority/Severity: map from bug severity (Critical→Highest, High→High, Medium→Medium, Low→Low).
     - Labels: add `automation`, `bug`, and story-id.
     - Attach the JSON report as a comment or attachment if needed.
   - Record the created JIRA issue key alongside the local bug report (`"jiraKey": "PROJECT-123"`).
   - If issue creation fails, log a warning and continue; bug report still completes locally.
   - Optionally, update the test case metadata file with the JIRA key for failed cases.

7. **Update test case records with execution results.**
   - Read the test case file at `3-outputs/run/{story-id}/planning/{story-id}-test-cases.txt` (or from Google Sheets if available).
   - For **each test case**:
     - If the test **PASSED**: Mark status as `PASS`, append execution timestamp.
     - If the test **FAILED**: Mark status as `FAIL`, link to the corresponding bug ID (`BUG-{story-id}-{nn}`), and include execution notes (error message or assertion failure reason).
   - Save updated test cases back to the same location with execution metadata.
   - Example format:
     ```
     TEST-ID: USER-001-TC01
     Name: Valid login with correct credentials
     Status: PASS
     Execution Date: 2026-02-26T14:45:00Z
     ---
     
     TEST-ID: USER-001-TC03
     Name: Reject invalid email format
     Status: FAIL
     Linked Bug: BUG-USER-001-004
     Execution Notes: Email validation not working; system accepted 'invalid-email' format
     Execution Date: 2026-02-26T14:46:30Z
     ---
     ```

## Output

**Bug report location:** `3-outputs/run/{story-id}/bugs/` (ensure evidence files are copied here from either the public execution folder or the hidden `.playwright-mcp` workspace)

**Structure:**
```
3-outputs/run/{story-id}/bugs
  ├── USER-001-bugs.json
  ├── USER-001-bugs.md
  └── evidence/
       ├── BUG-001-screenshot-01.png
       ├── BUG-001-screenshot-02.png
       ├── BUG-001-console.log
       └── BUG-002-screenshot-01.png
```

**JSON format example** (`USER-001-bugs.json`):
```json
{
  "storyId": "USER-001",
  "bugReportDate": "2026-02-26T14:45:00Z",
  "totalBugs": 2,
  "bugs": [
    {
      "bugId": "BUG-USER-001-001",
      "title": "Login button not visible on mobile viewport",
      "severity": "HIGH",
      "category": "UI Defect",
      "reproducedBy": "test: should reject invalid email format",
      "preconditions": "Mobile browser (375px width), website login page",
      "reproductionSteps": [
        "1. Open website on mobile device (375px width)",
        "2. Navigate to login page",
        "3. Scroll down to find login button",
        "4. Button is hidden behind viewport"
      ],
      "expectedBehavior": "Login button should be visible and clickable on all viewport sizes",
      "actualBehavior": "Login button is cut off at the bottom of the mobile screen",
      "evidence": {
        "screenshots": [
          "3-outputs/run/USER-001/bugs/evidence/BUG-USER-001-001-screenshot-01.png",
          "3-outputs/run/USER-001/bugs/evidence/BUG-USER-001-001-screenshot-02.png"
        ],
        "consoleLogs": "3-outputs/run/USER-001/bugs/evidence/BUG-USER-001-001-console.log"
      },
      "environment": {
        "browser": "Chrome Mobile (mobile view)",
        "os": "Windows 10",
        "applicationVersion": "v1.2.3"
      },
      "status": "NEW",
      "assignee": null
    },
    {
      "bugId": "BUG-USER-001-002",
      "title": "Password field accepts extremely long input",
      "severity": "MEDIUM",
      "category": "Functional Defect",
      "reproducedBy": "test: should handle very long email addresses",
      "preconditions": "User on login page",
      "reproductionSteps": [
        "1. Click on password field",
        "2. Paste or type 10000+ characters",
        "3. Click login button",
        "4. Password field accepts all input without truncation"
      ],
      "expectedBehavior": "Password field should have a maximum length validation (e.g., 128 characters)",
      "actualBehavior": "Password field allows unlimited input; may cause performance issues",
      "evidence": {
        "screenshots": [
          "3-outputs/run/USER-001/bugs/evidence/BUG-USER-001-002-screenshot-01.png"
        ],
        "consoleLogs": "3-outputs/run/USER-001/bugs/evidence/BUG-USER-001-002-console.log"
      },
      "environment": {
        "browser": "Chrome",
        "os": "Windows 10",
        "applicationVersion": "v1.2.3"
      },
      "status": "NEW",
      "assignee": null
    }
  ]
}
```

**Markdown format example** (`USER-001-bugs.md`):
```markdown
# Bug Report: USER-001 (User Login)

**Report Date:** 2026-02-26  
**Total Bugs Found:** 2  
**Critical:** 0 | **High:** 1 | **Medium:** 1 | **Low:** 0

---

## BUG-USER-001-001: Login button not visible on mobile viewport

**Severity:** HIGH  
**Category:** UI Defect  
**Status:** NEW

### Description
Login button is not visible on mobile devices with 375px viewport width.

### Reproduction Steps
1. Open website on mobile device (375px width)
2. Navigate to login page
3. Scroll down to find login button
4. Button is hidden beyond viewport

### Expected Behavior
Login button should be visible and clickable on all viewport sizes (mobile, tablet, desktop).

### Actual Behavior
Login button is cut off at the bottom of the mobile screen and cannot be accessed.

### Evidence
- **IMPORTANT:** make sure these files are copied into the `bugs/evidence/` folder before linking, otherwise the images will be broken when viewing the report.
- [Screenshot 1](evidence/BUG-USER-001-001-screenshot-01.png)
- [Screenshot 2](evidence/BUG-USER-001-001-screenshot-02.png)
- [Console Logs](evidence/BUG-USER-001-001-console.log)

### Environment
- **Browser:** Chrome (Mobile View)
- **OS:** Windows 10
- **App Version:** v1.2.3

### Reproduced By Test Case
- `should reject invalid email format: invalidemail`

---

## BUG-USER-001-002: Password field accepts extremely long input

**Severity:** MEDIUM  
**Category:** Functional Defect  
**Status:** NEW

### Description
Password input field allows unlimited character input without validation.

### Reproduction Steps
1. Click on password field
2. Paste or type 10000+ characters
3. Click login button
4. Password field accepts all input without truncation

### Expected Behavior
Password field should enforce a maximum length validation (recommended: 128 characters max).

### Actual Behavior
Password field allows unlimited input; may cause performance issues or security concerns.

### Evidence
- **IMPORTANT:** verify the evidence file exists under `bugs/evidence` to avoid broken links.
- [Screenshot 1](evidence/BUG-USER-001-002-screenshot-01.png)
- [Console Logs](evidence/BUG-USER-001-002-console.log)

### Environment
- **Browser:** Chrome
- **OS:** Windows 10
- **App Version:** v1.2.3

### Reproduced By Test Case
- `should handle very long email addresses`

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 1     |
| Medium   | 1     |
| Low      | 0     |

**Action Items:**
- [ ] Assign BUG-USER-001-001 to UI/Frontend team
- [ ] Assign BUG-USER-001-002 to Backend/API team
- [ ] Schedule review meeting with product team
```

## Done Criteria

- ✅ All failed tests from execution report are analyzed.
- ✅ Each bug has a unique ID: `BUG-{story-id}-{number}`.
- ✅ Severity is assigned based on impact (Critical/High/Medium/Low).
- ✅ Reproduction steps are clear and detailed.
- ✅ Evidence (screenshots, logs) is properly referenced and organized.
- ✅ Bug report generated in both JSON and Markdown formats.
- ✅ Evidence artifacts are copied to `3-outputs/run/{story-id}/bugs/evidence/` with clear naming.
- ✅ Environment details (browser, OS, app version) are documented.
- ✅ Test case reference (which test found the bug) is included.
- ✅ Test case file updated with execution results (PASS/FAIL status).
- ✅ Failed test cases linked to corresponding bug IDs.
- ✅ Execution notes and error messages included in test case records.
- ✅ Test case metadata file (e.g., `{story-id}-test-cases.txt`) saved with all updates.

## If It Fails

| Issue | Action |
|-------|--------|
| Execution report not found | Check `3-outputs/run/{story-id}/execution/execution-report.json` exists; run "Execute Tests" skill first. |
| No failed tests | Report "No bugs found" and complete successfully; generate summary. |
| Evidence files missing | Log warning; create bug report anyway with note "Evidence not available"; manually investigate. |
| Evidence not linkable | Copy artifacts to `3-outputs/run/{story-id}/bugs/evidence/` and verify file existence before adding to report; adjust relative paths so links are not broken. |
| Duplicate bugs detected | Merge into single bug report; mark duplicates and reference primary bug. |
| Severity determination difficult | Use judgment based on ISTQB severity guidelines; document rationale in bug report. |
| Evidence not linkable | Copy artifacts to `3-outputs/run/{story-id}/bugs/evidence/` and verify file existence before adding to report; adjust relative paths so links are not broken. |
| Test case file not found | Log warning and continue; test case linking will be skipped but bug report still completes. |
| Google Sheets unavailable | Fall back to updating local test case file (`{story-id}-test-cases.txt`); ensure write permissions. |
| Execution notes too verbose | Truncate to first 200 characters; save full error to separate log file in `bugs/evidence/`. |
