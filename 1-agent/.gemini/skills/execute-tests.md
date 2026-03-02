# Skill: Execute Test Cases in Browser

> **Conditional:** before performing any work, load the plan metadata
> `3-outputs/run/{story-id}/planning/{story-id}-plan.json`. If the
> `selectedSkills` array does not include `execute-tests` then immediately
> exit with a message indicating the skill has been skipped.

## When to Use

This skill is invoked after test cases are generated:
- When test files exist in `3-outputs/run/{story-id}/tests/` and are ready to be executed against a live application.
- When visual validation or user interaction simulation is required.
- When evidence (screenshots, videos, logs) must be captured during execution.

## Input

**Test files location:** `3-outputs/run/{story-id}/tests/*.spec.ts` or `3-outputs/run/{story-id}/tests/*.test.ts`

**Configuration needed:**
- Target application URL (e.g., `https://app.example.com/login`)
- Browser type (Chrome, Firefox, Safari, etc.)
- Timeout configuration (default: 30 seconds per test)
- Screenshot on failure: enabled/disabled
- MCP Playwright server connection details (host, port)

**From previous skills:**
- Story ID and feature name for organization
- Test scenarios and expected results

## Steps

1. **Validate environment setup.**
   - Check if MCP Playwright server is installed and running.
   - Verify connection to MCP Playwright server (host, port).
   - Verify application URL is accessible.
   - Confirm `3-outputs/run/{story-id}/tests/` folder exists and contains test files.

2. **Launch MCP Playwright browser instance.**
   - Connect to MCP Playwright server via configured host/port.
   - Request browser launch through MCP protocol (Chromium, Firefox, Webkit).
   - Create new browser context for test isolation via MCP Playwright.
   - Set viewport size, timeout, and other browser options through MCP.

3. **Execute each test case through MCP Playwright.**
   - Load test file from `3-outputs/run/{story-id}/tests/`.
   - Submit test execution request to MCP Playwright server.
   - For each test:
     - Navigate to application URL via MCP Playwright.
     - Execute test steps (enter input, click button, etc.) using MCP protocol.
     - Capture actual results from browser state.
     - Compare with expected results.

4. **Capture evidence during execution.**
   - **Screenshots:** On every step or on failure.
   - **Console logs:** Browser console output and errors.
   - **Network logs:** HTTP requests/responses (optional).
   - **Video/recording:** Full test execution (optional, for critical tests).

5. **Handle test failures gracefully.**
   - Capture screenshot of failure state.
   - Save browser console and network logs.
   - Store failure details for bug reporting.
   - Continue to next test instead of blocking.

6. **Generate test execution report.**
   - Summary: Total tests, passed, failed, skipped.
   - Detailed results per test case.
   - Evidence artifacts location.

## Output

**Main report location:** `3-outputs/run/{story-id}/execution/execution-report.json`

**Report structure:**
```json
{
  "executionId": "exec-20260226-143022",
  "timestamp": "2026-02-26T14:30:22Z",
  "storyId": "USER-001",
  "totalTests": 5,
  "passed": 3,
  "failed": 2,
  "skipped": 0,
  "duration": "45 seconds",
  "testResults": [
    {
      "testName": "should allow login with valid credentials",
      "status": "PASSED",
      "duration": "2.5s",
      "evidence": {
        "screenshots": ["3-outputs/run/USER-001/execution/test-001-pass.png"]
      }
    },
    {
      "testName": "should reject invalid email format: invalidemail",
      "status": "FAILED",
      "duration": "3.2s",
      "error": "Expected error message not found",
      "evidence": {
        "screenshots": [
          "3-outputs/run/USER-001/execution/test-002-fail-01.png",
          "3-outputs/run/USER-001/execution/test-002-fail-02.png"
        ],
        "consoleLogs": "3-outputs/run/USER-001/execution/test-002-console.log",
        "networkLogs": "3-outputs/run/USER-001/execution/test-002-network.har"
      }
    }
  ],
  "evidenceFolder": "3-outputs/run/USER-001/execution/"
}
```

**Evidence artifacts:**
- `3-outputs/run/{story-id}/execution/` – Contains all screenshots, logs, and recordings.

## Done Criteria

- ✅ Browser is successfully launched and connected to target application.
- ✅ All test cases from `1-qa-agent/tests/` are executed.
- ✅ Execution report is generated with summary and details.
- ✅ Screenshots captured for all failed tests.
- ✅ Console logs and browser errors are recorded.
- ✅ Test status is correctly determined (PASSED/FAILED).
- ✅ Evidence folder is organized with clear naming: `{story-id}/`.
- ✅ No hanging processes; browser is closed after execution.
- ✅ Execution time is logged for performance tracking.

## If It Fails

| Issue | Action |
|-------|--------|
| MCP Playwright server not running | Start MCP Playwright server: `mcp start playwright` or verify server is running on configured host/port. |
| Cannot connect to MCP server | Check host/port configuration; verify firewall rules; restart MCP server if needed. |
| Application URL unreachable | Check URL configuration; verify application is running; wait for startup if needed. |
| Test file syntax error | Run linter on `1-qa-agent/tests/` folder; check for missing imports or invalid code. |
| Test timeout | Increase timeout configuration in MCP request; check if application is responsive. |
| Screenshot capture fails | Verify write permissions in `3-outputs/run/{story-id}/` folder; create directory if missing; check MCP screenshot capability. |
| Browser crashes | Restart MCP Playwright browser instance; check system memory; reduce parallel test count. |
| Assertion failures (expected) | Capture failure as test result; document in report; continue to next test. |
| Network/connectivity issues | Wait and retry; log network error details; mark test as INCONCLUSIVE if persistent. |
