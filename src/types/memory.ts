export interface UserMemoryFacts {
  name?: string;
  age?: number;
  nationality?: string;
  country_of_residence?: string;
  religion?: string;
  marital_status?: string;
  spouse_name?: string;
  children?: Array<{ name: string; age?: number; notes?: string }>;
  dependents?: Array<{ name: string; relationship: string; notes?: string }>;
  assets?: Array<{ type: string; description: string; location?: string }>;
  has_existing_will?: boolean;
  existing_will_details?: string;
  preferred_executor?: string;
  preferred_guardian?: string;
  specific_bequests?: Array<{ beneficiary: string; asset: string }>;
  charitable_wishes?: string;
  islamic_faraid_applicable?: boolean;
  primary_concerns?: string[];
  planning_goals?: string;
  preferred_language?: string;
}

export interface ConversationSummaryRow {
  summary: string;
  message_count: number;
}
