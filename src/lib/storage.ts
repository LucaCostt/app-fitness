import { UserPreferences, UserProgress, PersonalInfo, WorkoutRoutine } from '@/types/fitness';

const STORAGE_KEYS = {
  PREFERENCES: 'fitness_preferences',
  PROGRESS: 'fitness_progress',
  FAVORITE_EXERCISES: 'fitness_favorite_exercises',
  FAVORITE_MEALS: 'fitness_favorite_meals',
  PERSONAL_INFO: 'fitness_personal_info',
  WORKOUT_ROUTINE: 'fitness_workout_routine',
};

// User Preferences
export const savePreferences = (preferences: UserPreferences): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  }
};

export const getPreferences = (): UserPreferences | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// Personal Info
export const savePersonalInfo = (info: PersonalInfo): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PERSONAL_INFO, JSON.stringify(info));
  }
};

export const getPersonalInfo = (): PersonalInfo | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.PERSONAL_INFO);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// Workout Routine
export const saveWorkoutRoutine = (routine: WorkoutRoutine): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_ROUTINE, JSON.stringify(routine));
  }
};

export const getWorkoutRoutine = (): WorkoutRoutine | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_ROUTINE);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// Progress History
export const saveProgress = (progress: UserProgress): void => {
  if (typeof window !== 'undefined') {
    const history = getProgressHistory();
    history.push(progress);
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(history));
  }
};

export const getProgressHistory = (): UserProgress[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const clearProgressHistory = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  }
};

// Favorite Exercises
export const saveFavoriteExercise = (exerciseId: string): void => {
  if (typeof window !== 'undefined') {
    const favorites = getFavoriteExercises();
    if (!favorites.includes(exerciseId)) {
      favorites.push(exerciseId);
      localStorage.setItem(STORAGE_KEYS.FAVORITE_EXERCISES, JSON.stringify(favorites));
    }
  }
};

export const removeFavoriteExercise = (exerciseId: string): void => {
  if (typeof window !== 'undefined') {
    const favorites = getFavoriteExercises().filter(id => id !== exerciseId);
    localStorage.setItem(STORAGE_KEYS.FAVORITE_EXERCISES, JSON.stringify(favorites));
  }
};

export const getFavoriteExercises = (): string[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITE_EXERCISES);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

// Favorite Meals
export const saveFavoriteMeal = (mealId: string): void => {
  if (typeof window !== 'undefined') {
    const favorites = getFavoriteMeals();
    if (!favorites.includes(mealId)) {
      favorites.push(mealId);
      localStorage.setItem(STORAGE_KEYS.FAVORITE_MEALS, JSON.stringify(favorites));
    }
  }
};

export const removeFavoriteMeal = (mealId: string): void => {
  if (typeof window !== 'undefined') {
    const favorites = getFavoriteMeals().filter(id => id !== mealId);
    localStorage.setItem(STORAGE_KEYS.FAVORITE_MEALS, JSON.stringify(favorites));
  }
};

export const getFavoriteMeals = (): string[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITE_MEALS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

// Clear all data
export const clearAllData = (): void => {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
