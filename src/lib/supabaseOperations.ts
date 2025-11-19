import { supabase, Profile, WorkoutRoutineDB, ProgressEntry, FavoriteExercise, FavoriteMeal } from './supabase';
import type { PersonalInfo, WorkoutRoutine } from '@/types/fitness';

// Profile operations
export async function createOrUpdateProfile(userId: string, data: Partial<Profile>) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .upsert({
      user_id: userId,
      ...data,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return profile;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Workout routine operations
export async function saveWorkoutRoutineDB(userId: string, routine: WorkoutRoutine) {
  const { data, error } = await supabase
    .from('workout_routines')
    .upsert({
      user_id: userId,
      name: routine.name,
      description: routine.description,
      days: routine.days,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWorkoutRoutineDB(userId: string): Promise<WorkoutRoutine | null> {
  const { data, error } = await supabase
    .from('workout_routines')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') return null;
  if (!data) return null;

  return {
    name: data.name,
    description: data.description,
    days: data.days,
  };
}

// Progress operations
export async function saveProgressDB(userId: string, entry: Omit<ProgressEntry, 'id' | 'user_id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('progress')
    .insert({
      user_id: userId,
      ...entry,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProgressHistoryDB(userId: string): Promise<ProgressEntry[]> {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Favorite exercises operations
export async function saveFavoriteExerciseDB(userId: string, exerciseId: string) {
  const { data, error } = await supabase
    .from('favorite_exercises')
    .insert({
      user_id: userId,
      exercise_id: exerciseId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFavoriteExerciseDB(userId: string, exerciseId: string) {
  const { error } = await supabase
    .from('favorite_exercises')
    .delete()
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId);

  if (error) throw error;
}

export async function getFavoriteExercisesDB(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('favorite_exercises')
    .select('exercise_id')
    .eq('user_id', userId);

  if (error) throw error;
  return data?.map(item => item.exercise_id) || [];
}

// Favorite meals operations
export async function saveFavoriteMealDB(userId: string, mealId: string) {
  const { data, error } = await supabase
    .from('favorite_meals')
    .insert({
      user_id: userId,
      meal_id: mealId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFavoriteMealDB(userId: string, mealId: string) {
  const { error } = await supabase
    .from('favorite_meals')
    .delete()
    .eq('user_id', userId)
    .eq('meal_id', mealId);

  if (error) throw error;
}

export async function getFavoriteMealsDB(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('favorite_meals')
    .select('meal_id')
    .eq('user_id', userId);

  if (error) throw error;
  return data?.map(item => item.meal_id) || [];
}

// Helper to convert Profile to PersonalInfo
export function profileToPersonalInfo(profile: Profile): PersonalInfo {
  return {
    name: profile.name,
    age: profile.age,
    gender: profile.gender,
    height: profile.height,
    weight: profile.weight,
    targetWeight: profile.target_weight,
    activityLevel: profile.activity_level,
    trainingDays: profile.training_days,
    experience: profile.experience,
    healthConditions: profile.health_conditions || [],
    injuries: profile.injuries || [],
  };
}

// Helper to convert PersonalInfo to Profile data
export function personalInfoToProfile(info: PersonalInfo, goal: string, location: string, level: string): Partial<Profile> {
  return {
    name: info.name,
    age: info.age,
    gender: info.gender,
    height: info.height,
    weight: info.weight,
    target_weight: info.targetWeight,
    activity_level: info.activityLevel,
    training_days: info.trainingDays,
    experience: info.experience,
    health_conditions: info.healthConditions,
    injuries: info.injuries,
    goal: goal as any,
    location: location as any,
    level: level as any,
  };
}
