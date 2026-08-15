-- Migration: Add raw_data column to plan_data + expand ai_prompts prompt types
-- Run this in the Supabase SQL Editor against the LIVE database.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Add raw_data JSONB column to plan_data (if it doesn't exist)
--    Fixes PGRST204: "Could not find the 'raw_data' column of 'plan_data'"
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'plan_data'
      AND column_name = 'raw_data'
  ) THEN
    ALTER TABLE public.plan_data
      ADD COLUMN raw_data JSONB DEFAULT '{}';
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Expand ai_prompts.prompt_type check constraint to include will-planning types
--    Currently only allows: character, sop, company_info, services, other
--    Add: testator, executor, guardian, asset, beneficiary, residue_estate,
--         witness, pdf_preview
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.ai_prompts
  DROP CONSTRAINT IF EXISTS ai_prompts_prompt_type_check;

ALTER TABLE public.ai_prompts
  ADD CONSTRAINT ai_prompts_prompt_type_check
  CHECK (prompt_type IN (
    'character', 'sop', 'company_info', 'services', 'other',
    'testator', 'executor', 'guardian', 'asset', 'beneficiary',
    'residue_estate', 'witness', 'pdf_preview'
  ));
