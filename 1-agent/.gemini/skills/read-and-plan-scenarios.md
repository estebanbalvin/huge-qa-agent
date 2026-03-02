# Skill: Read and Create Test Analysis

## When to Use

The first skill executed for each run. It performs a **rigorous deep analysis** of the
user story, acceptance criteria, and any associated assets, then generates a **comprehensive test analysis** that
will drive the rest of the workflow. The plan includes:

- A written HTML report summarizing the analysis (requirements, risks, critical observations,
  suggested test types, early developer checks, and **detailed rationale** for skill selection).
- A JSON file listing which follow‑on skills should be executed with justification.

This allows the agent to skip unnecessary stages and minimise token usage while maintaining
**high-quality test planning**.

Log Results (Skill 7) and log-usage (skill 9) are always included regardless of selection.

## Input

- Plain text user story (from `2-stories/*stories*.txt` or a path supplied by the
  user).
- JIRA ticket numnber 
- If there are assets, attachments or other files  referenced in the folder or Jira ticket (design mockups, API contracts, data samples) take them into account in your context for the test analys

## Steps

1. **Parse the story text.** Extract ID, title, description, acceptance
   criteria and any labeled assets or URLs.
2. **Perform requirements analysis.** Identify the main user goal, business
   value, and any non‑functional annotations (performance, accessibility,
   security).
3. **Assess risks and test types** using **critical judgment**. For the given story, acceptance criteria and assets determine which of the
   following are relevant according to a **rigorous analysis** following ISTQB best practices:
   - Functional/behavioral tests (check: AC complexity, data validation needs, workflow branches).
   - Accessibility audits (check: mentions of "mobile", "users with disabilities", or visual design assets).
   - Performance/SEO audits (check: mentions of speed, load times, SEO, or Lighthouse concerns).
   - Visual regression (check: design files provided, UI changes mentioned, responsive design ACs).
   - API or backend validation (check: external service calls, database updates, data persistence).
   
   **Critical Decision Matrix:** Only select a skill if:
   - The story explicitly mentions or strongly implies the need (e.g., "must be accessible" → accessibility).
   - The AC requires it to validate completeness (e.g., visual design mocks → visual tests).
   - The risk assessment identifies gaps that the skill would cover (e.g., performance concerns → Lighthouse).
   
   **If uncertain**, proactively ask the user via console:
   ```
   - the URL or test environment
   ⚠️ Unclear Requirement - Need Clarification:
   The story mentions [feature X]. Should I include [skill Y]? (yes/no/explain)
   ```
4. **Suggest early developer tests.** Propose simple smoke checks or unit tests
   that a developer could run during feature development, e.g. API response
   validation, form input sanitisation, or component rendering.

5. **Select follow-on skills with justification.** Build a list of skill names and **include a brief explanation** for each:
   ```
   - generate-test-cases: Required because AC#2 has multiple validation rules.
   - execute-tests: Essential to validate functional flow.
   - run-accessibility-tests: Story mentions mobile viewport (375px minimum).
   - skip: run-visual-tests (no design mocks provided).
   - skip: lighthouse-audit (performance not a stated requirement).
   ```
   Always include `log-results` at the end.

6. **Generate output report (HTML).** Compose a comprehensive report containing:
   - Summary of story requirements and business context.
   - Risk assessment and criticality level (Low/Medium/High/Critical).
   - Decision matrix showing **why each skill was selected or excluded**.
   - Proposed test scenarios with sample data.
   - Early-stage developer recommendations.
   - List of selected skills with **explicit rationale**.
   
   Save as `3-outputs/run/{story-id}/planning/{story-id}-plan.html`.

7. **Save plan metadata (JSON).** Write a JSON file at
   `3-outputs/run/{story-id}/planning/{story-id}-plan.json` with keys:
   ```json
   {
     "storyId": "USER-001",
     "selectedSkills": [
       {"name": "generate-test-cases", "reason": "AC#2 requires validation of 5+ rules"},
       {"name": "execute-tests", "reason": "Functional flow must be verified end-to-end"},
       {"name": "log-results", "reason": "Always included"}
     ],
     "decisionMatrix": {
       "accessibility": {"selected": false, "reason": "No accessibility requirements mentioned"},
       "lighthouse": {"selected": false, "reason": "Performance not a stated requirement"}
     },
     "criticalityLevel": "HIGH",
     "reportPath": "planning/USER-001-plan.html"
   }
   ```

## Output

- **HTML analysis report:**
  `3-outputs/run/{story-id}/planning/{story-id}-plan.html` (full text with
  tables and risk notes).
- **Metadata JSON:**
  `3-outputs/run/{story-id}/planning/{story-id}-plan.json`.

The previous simple scenarios file is no longer required by default but may be
included in the HTML for reference.

## Done Criteria

- ✅ An HTML report describing the story, risks, applicable test types and
  early‑stage developer suggestions.
- ✅ A JSON metadata file with a non‑empty `selectedSkills` array that always
  contains `log-results`.
- ✅ Both files saved under the planning folder for the story.

## If It Fails

| Issue | Action |
|-------|--------|
| Story file not readable | Prompt user for correct path and retry. |
| Unable to determine any applicable skills | Default to
  `["generate-test-cases","log-results"]`. |
| Output write error | Ensure run directory exists and create it if missing. |
