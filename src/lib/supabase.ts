import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Profile = {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: 'masculino' | 'feminino' | 'outro';
  height: number;
  weight: number;
  target_weight?: number;
  activity_level: 'sedentário' | 'leve' | 'moderado' | 'intenso' | 'muito intenso';
  training_days: number;
  experience: 'nunca treinei' | 'menos de 6 meses' | '6 meses a 1 ano' | '1 a 2 anos' | 'mais de 2 anos';
  health_conditions?: string[];
  injuries?: string[];
  goal: 'emagrecimento' | 'ganho de massa' | 'manutenção';
  location: 'casa' | 'academia' | 'ambos';
  level: 'iniciante' | 'intermediário' | 'avançado';
  created_at: string;
  updated_at: string;
};

export type WorkoutRoutineDB = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  days: any; // JSON
  created_at: string;
  updated_at: string;
};

export type ProgressEntry = {
  id: string;
  user_id: string;
  date: string;
  weight?: number;
  notes?: string;
  exercises?: string[]; // JSON
  created_at: string;
};

export type FavoriteExercise = {
  id: string;
  user_id: string;
  exercise_id: string;
  created_at: string;
};

export type FavoriteMeal = {
  id: string;
  user_id: string;
  meal_id: string;
  created_at: string;
};
