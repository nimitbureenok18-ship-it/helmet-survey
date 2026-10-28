export interface QuestionOption {
  id: string;
  label: string;
  subtitle?: string;
  image?: string;
  icon?: string;
  score?: number;
}

export type QuestionType =
  | 'dropdown'
  | 'single_choice'
  | 'boolean'
  | 'text_input'
  | 'number_input'
  | 'multi_select'
  | 'multi_choice'
  | 'image_picker'
  | 'star_rating'
  | 'slider'
  | 'rank_order'
  | 'photo_upload'
  | 'voice_textarea'
  | 'scar_analysis'
  | 'contact_form'
  | 'textarea'
  | 'likert_scale';

export interface QuestionItem {
  id: string;
  stepNumber: number;
  section?: string;
  key: string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[];
  bannerImage?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  note?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface SurveyData {
  gender?: string | null;
  age?: string | number | null;
  academicYear?: string | null;
  major?: string | null;
  ridingExperience?: string | null;
  attitude_1?: string | null;
  attitude_2?: string | null;
  attitude_3?: string | null;
  attitude_4?: string | null;
  social_1?: string | null;
  social_2?: string | null;
  social_3?: string | null;
  social_4?: string | null;
  control_1?: string | null;
  control_2?: string | null;
  control_3?: string | null;
  control_4?: string | null;
  intent_1?: string | null;
  intent_2?: string | null;
  intent_3?: string | null;
  intent_4?: string | null;
  [key: string]: any;
}
