/**
 * Plan Data V2 Library
 *
 * Stores will-planning information extracted from conversations.
 * Testator data uses normal columns.
 * Repeatable will sections use JSONB.
 */

import { createClient } from '@/lib/supabase/server';

type JsonObject = Record<string, unknown>;

export interface PlanData {
  // Testator
  user_name?: string | null;
  birthdate?: string | null;
  phone?: string | null;
  email?: string | null;
  gender?: string | null;
  address?: string | null;

  identity_number?: string | null;
  identity_country?: string | null;
  identity_type?: string | null;

  religion?: string | null;
  marital_status?: string | null;
  dependents_count?: number | null;
  dependents_label?: string | null;

  // Structured will data
  executors?: JsonObject[] | null;
  guardians?: JsonObject[] | null;
  assets?: JsonObject[] | null;
  beneficiaries?: JsonObject[] | null;
  residue_estate?: JsonObject | null;
  witnesses?: JsonObject[] | null;
}

export type PlanDataInput =
  | Partial<PlanData>
  | Record<string, unknown>;

/**
 * Check whether a value is a plain JSON object.
 */
function isObject(value: unknown): value is JsonObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

/**
 * Remove empty values from an incoming JSON patch.
 *
 * This prevents AI responses such as:
 *
 * {
 *   name: "",
 *   address: "Shah Alam"
 * }
 *
 * from deleting an already saved name.
 */
function cleanObject(value: JsonObject): JsonObject {
  const cleaned: JsonObject = {};

  for (const [key, item] of Object.entries(value)) {
    if (item === undefined || item === null) {
      continue;
    }

    if (
      typeof item === 'string' &&
      item.trim().length === 0
    ) {
      continue;
    }

    cleaned[key] = item;
  }

  return cleaned;
}

/**
 * Convert unknown JSONB value into an array of objects.
 */
function toObjectArray(value: unknown): JsonObject[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map((item) => ({
      ...item,
    }));
}

/**
 * Merge executor records.
 *
 * Supports:
 * - primary executor
 * - secondary executor
 *
 * Primary and secondary are treated as individual roles,
 * so follow-up information updates the same executor.
 */
function mergeExecutors(
  existing: unknown,
  incoming: unknown
): JsonObject[] {
  const result = toObjectArray(existing);
  const incomingArray = toObjectArray(incoming);

  for (const rawExecutor of incomingArray) {
    const newExecutor = cleanObject(rawExecutor);

    const type = String(
      newExecutor.type ?? ''
    ).toLowerCase();

    const name = String(
      newExecutor.name ?? ''
    )
      .trim()
      .toLowerCase();

    const identityNumber = String(
      newExecutor.identity_number ?? ''
    )
      .trim()
      .toLowerCase();

    let index = -1;

    // 1. Match by NRIC/passport
    if (identityNumber) {
      index = result.findIndex((executor) => {
        return (
          String(
            executor.identity_number ?? ''
          )
            .trim()
            .toLowerCase() === identityNumber
        );
      });
    }

    // 2. Match same role + same name
    if (index === -1 && name) {
      index = result.findIndex((executor) => {
        return (
          String(executor.type ?? '').toLowerCase() ===
            type &&
          String(executor.name ?? '')
            .trim()
            .toLowerCase() === name
        );
      });
    }

    // 3. Primary / secondary are unique roles
    if (
      index === -1 &&
      (type === 'primary' || type === 'secondary')
    ) {
      index = result.findIndex(
        (executor) =>
          String(executor.type ?? '').toLowerCase() ===
          type
      );
    }

    if (index >= 0) {
      result[index] = {
        ...result[index],
        ...newExecutor,
      };
    } else {
      result.push(newExecutor);
    }
  }

  return result;
}

/**
 * Merge guardian records.
 *
 * Supports:
 * - one primary guardian
 * - multiple substitute guardians
 */
function mergeGuardians(
  existing: unknown,
  incoming: unknown
): JsonObject[] {
  const result = toObjectArray(existing);
  const incomingArray = toObjectArray(incoming);

  for (const rawGuardian of incomingArray) {
    const newGuardian = cleanObject(rawGuardian);

    const type = String(
      newGuardian.type ?? ''
    ).toLowerCase();

    const name = String(
      newGuardian.name ?? ''
    )
      .trim()
      .toLowerCase();

    const identityNumber = String(
      newGuardian.identity_number ?? ''
    )
      .trim()
      .toLowerCase();

    let index = -1;

    // 1. Match by NRIC/passport
    if (identityNumber) {
      index = result.findIndex((guardian) => {
        return (
          String(
            guardian.identity_number ?? ''
          )
            .trim()
            .toLowerCase() === identityNumber
        );
      });
    }

    // 2. Match by type + name
    if (index === -1 && name) {
      index = result.findIndex((guardian) => {
        return (
          String(guardian.type ?? '').toLowerCase() ===
            type &&
          String(guardian.name ?? '')
            .trim()
            .toLowerCase() === name
        );
      });
    }

    // 3. Only ONE primary guardian
    if (index === -1 && type === 'primary') {
      index = result.findIndex(
        (guardian) =>
          String(guardian.type ?? '').toLowerCase() ===
          'primary'
      );
    }

    // 4. Follow-up answer for a substitute guardian
    // without repeating the name
    if (
      index === -1 &&
      type === 'substitute' &&
      !name &&
      !identityNumber
    ) {
      for (let i = result.length - 1; i >= 0; i--) {
        if (
          String(result[i].type ?? '').toLowerCase() ===
          'substitute'
        ) {
          index = i;
          break;
        }
      }
    }

    if (index >= 0) {
      result[index] = {
        ...result[index],
        ...newGuardian,
      };
    } else {
      // Different substitute guardian -> add new object
      result.push(newGuardian);
    }
  }

  return result;
}

/**
 * Merge beneficiaries.
 *
 * Multiple main/substitute beneficiaries are allowed.
 */
function mergeBeneficiaries(
  existing: unknown,
  incoming: unknown
): JsonObject[] {
  const result = toObjectArray(existing);
  const incomingArray = toObjectArray(incoming);

  for (const rawBeneficiary of incomingArray) {
    const newBeneficiary = cleanObject(rawBeneficiary);

    const type = String(
      newBeneficiary.type ?? ''
    ).toLowerCase();

    const name = String(
      newBeneficiary.name ?? ''
    )
      .trim()
      .toLowerCase();

    const identityNumber = String(
      newBeneficiary.identity_number ?? ''
    )
      .trim()
      .toLowerCase();

    let index = -1;

    // Match beneficiary by identity number
    if (identityNumber) {
      index = result.findIndex((beneficiary) => {
        return (
          String(
            beneficiary.identity_number ?? ''
          )
            .trim()
            .toLowerCase() === identityNumber
        );
      });
    }

    // Match by type + name
    if (index === -1 && name) {
      index = result.findIndex((beneficiary) => {
        return (
          String(
            beneficiary.type ?? ''
          ).toLowerCase() === type &&
          String(
            beneficiary.name ?? ''
          )
            .trim()
            .toLowerCase() === name
        );
      });
    }

    // Follow-up information when name is not repeated
    if (
      index === -1 &&
      type &&
      !name &&
      !identityNumber
    ) {
      for (let i = result.length - 1; i >= 0; i--) {
        if (
          String(result[i].type ?? '').toLowerCase() ===
          type
        ) {
          index = i;
          break;
        }
      }
    }

    if (index >= 0) {
      result[index] = {
        ...result[index],
        ...newBeneficiary,
      };
    } else {
      result.push(newBeneficiary);
    }
  }

  return result;
}

/**
 * Merge assets.
 *
 * If asset_number/id is available it is used as the main identifier.
 * Otherwise follow-up details are merged with the most recent asset.
 */
function mergeAssets(
  existing: unknown,
  incoming: unknown
): JsonObject[] {
  const result = toObjectArray(existing);
  const incomingArray = toObjectArray(incoming);

  for (const rawAsset of incomingArray) {
    const newAsset = cleanObject(rawAsset);

    const assetNumber = String(
      newAsset.asset_number ??
        newAsset.id ??
        ''
    )
      .trim()
      .toLowerCase();

    const address = String(
      newAsset.address ?? ''
    )
      .trim()
      .toLowerCase();

    const category = String(
      newAsset.category ?? ''
    )
      .trim()
      .toLowerCase();

    const type = String(
      newAsset.type ?? ''
    )
      .trim()
      .toLowerCase();

    let index = -1;

    // Match asset number/id
    if (assetNumber) {
      index = result.findIndex((asset) => {
        const existingNumber = String(
          asset.asset_number ??
            asset.id ??
            ''
        )
          .trim()
          .toLowerCase();

        return existingNumber === assetNumber;
      });
    }

    // Match exact address if available
    if (index === -1 && address) {
      index = result.findIndex((asset) => {
        return (
          String(asset.address ?? '')
            .trim()
            .toLowerCase() === address
        );
      });
    }

    // Follow-up information for the most recent asset
    if (
      index === -1 &&
      result.length > 0 &&
      !assetNumber
    ) {
      const lastIndex = result.length - 1;
      const lastAsset = result[lastIndex];

      const lastCategory = String(
        lastAsset.category ?? ''
      )
        .trim()
        .toLowerCase();

      const lastType = String(
        lastAsset.type ?? ''
      )
        .trim()
        .toLowerCase();

      // Same asset classification
      if (
        (category && category === lastCategory) ||
        (type && type === lastType) ||
        (!category && !type)
      ) {
        index = lastIndex;
      }
    }

    if (index >= 0) {
      result[index] = {
        ...result[index],
        ...newAsset,
      };
    } else {
      result.push(newAsset);
    }
  }

  return result;
}

/**
 * Merge witnesses.
 *
 * Multiple witnesses are allowed.
 */
function mergeWitnesses(
  existing: unknown,
  incoming: unknown
): JsonObject[] {
  const result = toObjectArray(existing);
  const incomingArray = toObjectArray(incoming);

  for (const rawWitness of incomingArray) {
    const newWitness = cleanObject(rawWitness);

    const name = String(
      newWitness.name ?? ''
    )
      .trim()
      .toLowerCase();

    const identityNumber = String(
      newWitness.identity_number ?? ''
    )
      .trim()
      .toLowerCase();

    let index = -1;

    if (identityNumber) {
      index = result.findIndex((witness) => {
        return (
          String(
            witness.identity_number ?? ''
          )
            .trim()
            .toLowerCase() === identityNumber
        );
      });
    }

    if (index === -1 && name) {
      index = result.findIndex((witness) => {
        return (
          String(witness.name ?? '')
            .trim()
            .toLowerCase() === name
        );
      });
    }

    // Short follow-up answer -> latest witness
    if (
      index === -1 &&
      !name &&
      !identityNumber &&
      result.length > 0
    ) {
      index = result.length - 1;
    }

    if (index >= 0) {
      result[index] = {
        ...result[index],
        ...newWitness,
      };
    } else {
      result.push(newWitness);
    }
  }

  return result;
}

/**
 * Merge residue estate information.
 */
function mergeResidueEstate(
  existing: unknown,
  incoming: unknown
): JsonObject {
  const existingObject = isObject(existing)
    ? { ...existing }
    : {};

  if (!isObject(incoming)) {
    return existingObject;
  }

  const result: JsonObject = {
    ...existingObject,
  };

  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined || value === null) {
      continue;
    }

    // Main / substitute residue beneficiaries
    if (
      (key === 'main' || key === 'substitute') &&
      Array.isArray(value)
    ) {
      // Do not overwrite existing data with []
      if (value.length === 0) {
        continue;
      }

      result[key] = mergeBeneficiaries(
        existingObject[key],
        value
      );

      continue;
    }

    if (
      typeof value === 'string' &&
      value.trim().length === 0
    ) {
      continue;
    }

    result[key] = value;
  }

  return result;
}

export async function upsertPlanData(
  sessionId: string,
  userId: string,
  countryCode: string,
  data: PlanDataInput
) {
  const supabase = await createClient();

  const safeData = data as Record<string, unknown>;

  /**
   * Read existing structured data first.
   *
   * Required because JSONB arrays must be merged instead
   * of replaced.
   */
  const {
    data: existingPlan,
    error: existingError,
  } = await supabase
    .from('plan_data_v2')
    .select(
      `
        executors,
        guardians,
        assets,
        beneficiaries,
        residue_estate,
        witnesses
      `
    )
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingError) {
    console.error(
      'Failed to retrieve existing plan_data_v2:',
      existingError
    );

    throw existingError;
  }

  const toUpsert: Record<string, unknown> = {
    session_id: sessionId,
    user_id: userId,
    country_code: countryCode,
    updated_at: new Date().toISOString(),
  };

  /**
   * Normal testator columns.
   *
   * These can safely use normal overwrite behaviour because
   * each will has only one testator.
   */
  const normalKeys = [
    'user_name',
    'birthdate',
    'phone',
    'email',
    'gender',
    'address',

    'identity_number',
    'identity_country',
    'identity_type',

    'religion',
    'marital_status',
    'dependents_count',
    'dependents_label',
  ];

  for (const key of normalKeys) {
    if (safeData[key] !== undefined) {
      toUpsert[key] = safeData[key];
    }
  }

  /**
   * EXECUTORS
   */
  if (safeData.executors !== undefined) {
    toUpsert.executors = mergeExecutors(
      existingPlan?.executors,
      safeData.executors
    );

    console.log(
      '🧩 Merged executors:',
      toUpsert.executors
    );
  }

  /**
   * GUARDIANS
   */
  if (safeData.guardians !== undefined) {
    toUpsert.guardians = mergeGuardians(
      existingPlan?.guardians,
      safeData.guardians
    );

    console.log(
      '🧩 Merged guardians:',
      toUpsert.guardians
    );
  }

  /**
   * ASSETS
   */
  if (safeData.assets !== undefined) {
    toUpsert.assets = mergeAssets(
      existingPlan?.assets,
      safeData.assets
    );

    console.log(
      '🧩 Merged assets:',
      toUpsert.assets
    );
  }

  /**
   * BENEFICIARIES
   */
  if (safeData.beneficiaries !== undefined) {
    toUpsert.beneficiaries = mergeBeneficiaries(
      existingPlan?.beneficiaries,
      safeData.beneficiaries
    );

    console.log(
      '🧩 Merged beneficiaries:',
      toUpsert.beneficiaries
    );
  }

  /**
   * RESIDUE ESTATE
   */
  if (safeData.residue_estate !== undefined) {
    toUpsert.residue_estate = mergeResidueEstate(
      existingPlan?.residue_estate,
      safeData.residue_estate
    );

    console.log(
      '🧩 Merged residue estate:',
      toUpsert.residue_estate
    );
  }

  /**
   * WITNESSES
   */
  if (safeData.witnesses !== undefined) {
    toUpsert.witnesses = mergeWitnesses(
      existingPlan?.witnesses,
      safeData.witnesses
    );

    console.log(
      '🧩 Merged witnesses:',
      toUpsert.witnesses
    );
  }

  /**
   * Save final merged plan.
   */
  const {
    data: savedRow,
    error,
  } = await supabase
    .from('plan_data_v2')
    .upsert(toUpsert, {
      onConflict: 'session_id',
    })
    .select('*')
    .single();

  if (error) {
    console.error(
      'Failed to upsert plan_data_v2:',
      error
    );

    throw error;
  }

  console.log(
    '✅ plan_data_v2 saved successfully'
  );

  return savedRow;
}

export async function getPlanData(
  sessionId: string,
  userId: string
) {
  const supabase = await createClient();

  const {
    data,
    error,
  } = await supabase
    .from('plan_data_v2')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error(
      'Failed to retrieve plan_data_v2:',
      error
    );

    throw error;
  }

  return data;
}