/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SurveyData } from '../types';

const env = (import.meta as any).env || {};
const supabaseUrl: string = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Saves survey responses into Supabase table 'survey_responses'
 */
export async function saveSurveyToSupabase(data: SurveyData): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: 'ยังไม่ได้ตั้งค่า VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY ใน Environment Variables',
    };
  }

  try {
    const payload = {
      gender: data.gender || null,
      age: data.age ? Number(data.age) : null,
      academic_year: data.academicYear || null,
      major: data.major || null,
      riding_experience: data.ridingExperience || null,
      attitude_1: data.attitude_1 || null,
      attitude_2: data.attitude_2 || null,
      attitude_3: data.attitude_3 || null,
      attitude_4: data.attitude_4 || null,
      social_1: data.social_1 || null,
      social_2: data.social_2 || null,
      social_3: data.social_3 || null,
      social_4: data.social_4 || null,
      control_1: data.control_1 || null,
      control_2: data.control_2 || null,
      control_3: data.control_3 || null,
      control_4: data.control_4 || null,
      intent_1: data.intent_1 || null,
      intent_2: data.intent_2 || null,
      intent_3: data.intent_3 || null,
      intent_4: data.intent_4 || null,
      raw_json: data,
    };

    const { error } = await supabase.from('survey_responses').insert([payload]);

    if (error) {
      console.error('Supabase insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Supabase exception:', err);
    return { success: false, error: err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' };
  }
}
