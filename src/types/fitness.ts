export type MuscleGroup = 
  | 'peito'
  | 'costas'
  | 'ombros'
  | 'biceps'
  | 'triceps'
  | 'pernas'
  | 'abdomen'
  | 'gluteos';

export type ExerciseLocation = 'casa' | 'academia' | 'ambos';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  location: ExerciseLocation;
  description: string;
  sets: string;
  reps: string;
  difficulty: 'iniciante' | 'intermediário' | 'avançado';
  equipment?: string;
}

export interface Meal {
  id: string;
  name: string;
  category: 'café da manhã' | 'almoço' | 'jantar' | 'lanche';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
  ingredients: string[];
  goal: 'emagrecimento' | 'ganho de massa' | 'manutenção';
}

export interface UserProgress {
  date: string;
  weight?: number;
  exercises: string[];
  meals: string[];
  notes?: string;
}

export interface PersonalInfo {
  name: string;
  age: number;
  gender: 'masculino' | 'feminino' | 'outro';
  height: number; // em cm
  weight: number; // em kg
  targetWeight?: number; // em kg
  activityLevel: 'sedentário' | 'leve' | 'moderado' | 'intenso' | 'muito intenso';
  trainingDays: number; // dias por semana
  healthConditions?: string[];
  injuries?: string[];
  experience: 'nunca treinei' | 'menos de 6 meses' | '6 meses a 1 ano' | '1 a 2 anos' | 'mais de 2 anos';
}

export interface UserPreferences {
  personalInfo?: PersonalInfo;
  goal: 'emagrecimento' | 'ganho de massa' | 'manutenção';
  location: ExerciseLocation;
  level: 'iniciante' | 'intermediário' | 'avançado';
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  days: WorkoutDay[];
  createdAt: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: string;
    rest: string;
    notes?: string;
  }[];
}
