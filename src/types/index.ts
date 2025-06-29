// Core application types
export interface Diagnosis {
  id: string;
  name: string;
  synonyms?: string[];
  specialty: MedicalSpecialty;
  icd10?: string;
  created_at: string;
  updated_at: string;
}

export interface HistoryTemplate {
  id: string;
  diagnosis_id: string;
  diagnosis_name: string;
  specialty: MedicalSpecialty;
  sections: HistorySection[];
  generated_by: 'llm' | 'manual';
  llm_model?: string;
  created_at: string;
  updated_at: string;
  cached: boolean;
}

export interface HistoryQuestion {
  question: string;
  hint?: string;
  clinical_rationale?: string;
}

export interface HistorySection {
  id: string;
  title: string;
  questions: (string | HistoryQuestion)[];
  order: number;
  is_specialty_specific: boolean;
}

export interface SearchResult {
  diagnosis: Diagnosis;
  template?: HistoryTemplate;
  confidence_score?: number;
}

export interface ClinicalReasoning {
  epidemiology: string;
  risk_factors: string[];
  pathophysiology_notes: string;
  clinical_features: string[];
  complications: string[];
  differentials: string[];
  red_flags: string[];
}

export interface LLMResponse {
  specialty: MedicalSpecialty;
  sections: HistorySection[];
  diagnosis_name: string;
  clinical_reasoning?: ClinicalReasoning;
  success: boolean;
  error?: string;
  model_used: string;
  tokens_used?: number;
}

export interface CachedSearch {
  id: string;
  diagnosis_name: string;
  template: HistoryTemplate;
  last_accessed: string;
  access_count: number;
}

// Medical specialties enum
export enum MedicalSpecialty {
  INTERNAL_MEDICINE = 'Internal Medicine',
  SURGERY = 'Surgery',
  PEDIATRICS = 'Pediatrics',
  OBSTETRICS_GYNECOLOGY = 'Obstetrics & Gynecology',
  PSYCHIATRY = 'Psychiatry',
  NEUROLOGY = 'Neurology',
  CARDIOLOGY = 'Cardiology',
  DERMATOLOGY = 'Dermatology',
  ORTHOPEDICS = 'Orthopedics',
  OPHTHALMOLOGY = 'Ophthalmology',
  ENT = 'ENT',
  EMERGENCY_MEDICINE = 'Emergency Medicine',
  FAMILY_MEDICINE = 'Family Medicine',
  ONCOLOGY = 'Oncology',
  ENDOCRINOLOGY = 'Endocrinology',
  GASTROENTEROLOGY = 'Gastroenterology',
  PULMONOLOGY = 'Pulmonology',
  NEPHROLOGY = 'Nephrology',
  HEMATOLOGY = 'Hematology',
  INFECTIOUS_DISEASE = 'Infectious Disease',
  RHEUMATOLOGY = 'Rheumatology',
  GENERAL = 'General',
}

// API types
export interface APIResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export interface GenerateTemplateRequest {
  diagnosis: string;
  specialty?: string;
  specialty_hint?: MedicalSpecialty;
  patient_age?: string;
  use_cache?: boolean;
}

export interface GenerateTemplateResponse extends APIResponse<HistoryTemplate> {
  from_cache?: boolean;
  generation_time?: number;
}

// UI Component types
export interface SearchInterfaceProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
}

// Removed HistoryDisplayProps as we're focusing on PC/HPC only

export interface LoadingStateProps {
  message?: string;
  showSpinner?: boolean;
}

// Utility types
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type SearchState = AsyncState<HistoryTemplate> & {
  query: string;
  hasSearched: boolean;
}; 