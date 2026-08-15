# Task: "I wanna make a will" → website vs step-by-step + fix step-by-step flow

## Done
- [x] Analyze codebase
- [x] Confirm desired behavior (present website vs step-by-step choice)
- [x] Add Rule 7 (make-a-will choice) to system prompt
- [x] Fix assistant message persistence (after() → onFinish)
- [x] Inject will-planning prompts (testator, executor, guardian, asset, beneficiary, residue_estate, witness, pdf_preview) into system prompt via `buildPromptsSection()`
- [x] Add Rule 8 (step-by-step will collection sequence) to system prompt
- [x] Make "make a will" choice admin-configurable via SOP prompt
- [x] Make `upsertPlanData()` resilient to missing `raw_data` column (PGRST204 fallback)
- [x] Provide SQL migration for `raw_data` column + expanded ai_prompts constraint
- [x] Update schema.sql ai_prompts constraint to match

## Verify
- [x] tsc type check passes (chat route + plan-data)
- [ ] Run the migration SQL against live Supabase (manual step for user)
