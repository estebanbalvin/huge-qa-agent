# Skill: Log Usage Statistics

When the QA agent finishes a run, this skill is responsible for reporting the Gemini model used, the total number of tokens consumed, and an approximate cost estimate.

## Purpose
- Provide transparency about LLM resources and cost for the current execution.
- Help debugging or budgeting by keeping a record alongside test outputs.
- **Offer context** for each token category by explaining its meaning, time consumed, and which skill or tool generated it, enabling fine-grained performance analysis.

## Inputs
- `3-outputs/run/{story-id}/execution/execution-report.json` (or any run-level metadata where token counts are recorded)
- Environment/config information that specifies which Gemini model was invoked.

## Outputs
- Console log message summarizing model, token breakdown by category (with meanings, elapsed time, and skill/tool context), and cost.
- Optional file `3-outputs/run/{story-id}/usage.txt` containing the same detailed information in structured form.

## Steps
1. Locate the run directory for the current story (passed from previous stages).
2. Read the execution report or any metadata file that contains token usage. If the report does not include this, compute tokens from the LLM request/response objects stored during the run.
3. Determine the Gemini model identifier used for the agent invocation. This may come from the agent configuration or from the API response object.
4. Break down tokens into categories and record additional metadata:
   - **Input tokens** – user prompts, system messages, or context fed to the model. *(include time spent composing the prompt and which skill/tool generated it)*.
   - **Output tokens** – tokens produced by the model in its response. *(note the elapsed time for generation and which skill/tool awaited the reply)*.
   - **Reasoning tokens** – extra tokens consumed by chain‑of‑thought or internal reasoning steps if they are logged. *(capture which internal process produced them and how long each reasoning step took)*.
   - **Tool planning tokens** – tokens used when the model formulates calls to external tools or MCP instructions. *(record which tool was being planned and timestamp ranges)*.
   - **Context reload tokens** – tokens consumed when the model re‑loads or summarizes long context segments due to truncation. *(log the triggering skill and duration)*.
   - **Repository awareness tokens** – tokens spent when the model reads/references workspace files. *(track which files were accessed and which skill initiated the request)*.
   
   Each category entry in the report should now include:
   ```json
   "tokens": 8500,
   "meaning": "user prompts for generating test cases",
   "time_ms": 125,
   "relatedSkill": "generate-test-cases",
   "relatedTool": "openai-completion"
   ```
5. Calculate total tokens consumed by summing the above categories.
6. Estimate cost using Google Gemini's official pricing schedule. For example:
   - **Gemini Ultra 1.0**: $0.03 per 1k input tokens, $0.06 per 1k output tokens
   - **Gemini Nano**: $0.0015 per 1k tokens (both input+output)
   - (Prices should be pulled from configuration or updated as rates change.)
7. Print a comprehensive summary to the console such as:
   ```
   Gemini model: gpt-4o-mini
   Input tokens: 8,500  (user prompts for generating test cases, 125ms, skill: generate-test-cases)
   Output tokens: 3,845 (model response for test code, 230ms, skill: generate-test-cases)
   Reasoning tokens: 120 (internal reasoning during planning, 40ms)
   Tool planning tokens: 200 (preparing MCP tool call, 15ms, tool: github-issue-create)
   Context reload tokens: 50 (re-summarize long story text, 60ms)
   Repo awareness tokens: 50 (reading workspace files, 10ms, skill: read-and-plan-scenarios)
   Total tokens: 12,765
   Estimated cost: $0.43
   ```
8. Write the same information to `usage.txt` under the run folder so it can be reviewed later, with the breakdown included. Each category entry should contain fields for `meaning`, `time_ms`, `relatedSkill`, and `relatedTool` if available.

## When to Execute
- This skill is triggered automatically as the final step in the workflow after bug reporting (or if no bugs were found).
- It does not block or modify any other artifact; failures here should be non-critical and logged as warnings.

## Example
```json
{
  "model": "gpt-4o-mini",
  "input_tokens": 8500,
  "output_tokens": 3845,
  "reasoning_tokens": 120,
  "tool_planning_tokens": 200,
  "context_reload_tokens": 50,
  "repo_awareness_tokens": 50,
  "total_tokens": 12765,
  "estimated_cost": 0.43
}
```

This skill may run in a few milliseconds since it only reads local files and writes a small text output.
