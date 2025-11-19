import { PersonalInfo, WorkoutRoutine, WorkoutDay, Exercise } from '@/types/fitness';
import { exercises } from './exercises';

export function generatePersonalizedRoutine(
  personalInfo: PersonalInfo,
  goal: 'emagrecimento' | 'ganho de massa' | 'manutenção',
  location: 'casa' | 'academia' | 'ambos',
  level: 'iniciante' | 'intermediário' | 'avançado'
): WorkoutRoutine {
  const { trainingDays, experience, injuries = [] } = personalInfo;

  // Filtrar exercícios baseado no nível, local e lesões
  const availableExercises = exercises.filter(ex => {
    const matchesLocation = location === 'ambos' || ex.location === location || ex.location === 'ambos';
    const matchesLevel = ex.difficulty === level || 
                        (level === 'intermediário' && ex.difficulty === 'iniciante') ||
                        (level === 'avançado' && (ex.difficulty === 'iniciante' || ex.difficulty === 'intermediário'));
    
    // Evitar exercícios que possam agravar lesões
    const isSafe = !injuries.some(injury => {
      const injuryLower = injury.toLowerCase();
      if (injuryLower.includes('joelho') && ex.muscleGroup === 'pernas') return true;
      if (injuryLower.includes('ombro') && ex.muscleGroup === 'ombros') return true;
      if (injuryLower.includes('costas') && ex.muscleGroup === 'costas') return true;
      return false;
    });

    return matchesLocation && matchesLevel && isSafe;
  });

  // Definir divisão de treino baseado nos dias disponíveis
  let workoutDays: WorkoutDay[] = [];

  if (trainingDays <= 2) {
    // Full Body 2x por semana
    workoutDays = generateFullBodySplit(availableExercises, 2, goal, level);
  } else if (trainingDays === 3) {
    // ABC ou Full Body 3x
    workoutDays = generateABCSplit(availableExercises, goal, level);
  } else if (trainingDays === 4) {
    // Upper/Lower ou ABCD
    workoutDays = generateUpperLowerSplit(availableExercises, goal, level);
  } else if (trainingDays >= 5) {
    // Divisão por grupo muscular (Bro Split)
    workoutDays = generateBroSplit(availableExercises, trainingDays, goal, level);
  }

  return {
    id: `routine_${Date.now()}`,
    name: `Treino Personalizado - ${goal}`,
    description: `Rotina de ${trainingDays}x por semana, nível ${level}, focado em ${goal}`,
    days: workoutDays,
    createdAt: new Date().toISOString(),
  };
}

function generateFullBodySplit(
  exercises: Exercise[],
  days: number,
  goal: string,
  level: string
): WorkoutDay[] {
  const muscleGroups = ['peito', 'costas', 'pernas', 'ombros', 'biceps', 'triceps', 'abdomen'];
  const workoutDays: WorkoutDay[] = [];

  for (let i = 0; i < days; i++) {
    const dayExercises = muscleGroups.map(muscle => {
      const muscleExercises = exercises.filter(ex => ex.muscleGroup === muscle);
      return muscleExercises[Math.floor(Math.random() * muscleExercises.length)];
    }).filter(Boolean);

    workoutDays.push({
      day: `Dia ${i + 1}`,
      focus: 'Corpo Inteiro',
      exercises: dayExercises.slice(0, level === 'iniciante' ? 6 : 8).map(ex => ({
        exerciseId: ex.id,
        sets: level === 'iniciante' ? 3 : goal === 'ganho de massa' ? 4 : 3,
        reps: goal === 'emagrecimento' ? '12-15' : goal === 'ganho de massa' ? '8-12' : '10-12',
        rest: goal === 'emagrecimento' ? '45s' : '60-90s',
      })),
    });
  }

  return workoutDays;
}

function generateABCSplit(
  exercises: Exercise[],
  goal: string,
  level: string
): WorkoutDay[] {
  const splits = [
    { day: 'A', focus: 'Peito, Ombros e Tríceps', muscles: ['peito', 'ombros', 'triceps'] },
    { day: 'B', focus: 'Costas e Bíceps', muscles: ['costas', 'biceps'] },
    { day: 'C', focus: 'Pernas e Abdômen', muscles: ['pernas', 'gluteos', 'abdomen'] },
  ];

  return splits.map(split => {
    const dayExercises = split.muscles.flatMap(muscle => {
      const muscleExercises = exercises.filter(ex => ex.muscleGroup === muscle);
      const count = muscle === 'peito' || muscle === 'costas' || muscle === 'pernas' ? 3 : 2;
      return muscleExercises.slice(0, count);
    });

    return {
      day: split.day,
      focus: split.focus,
      exercises: dayExercises.map(ex => ({
        exerciseId: ex.id,
        sets: goal === 'ganho de massa' ? 4 : 3,
        reps: goal === 'emagrecimento' ? '12-15' : goal === 'ganho de massa' ? '8-12' : '10-12',
        rest: goal === 'emagrecimento' ? '45s' : '60-90s',
      })),
    };
  });
}

function generateUpperLowerSplit(
  exercises: Exercise[],
  goal: string,
  level: string
): WorkoutDay[] {
  const upperMuscles = ['peito', 'costas', 'ombros', 'biceps', 'triceps'];
  const lowerMuscles = ['pernas', 'gluteos', 'abdomen'];

  const upperExercises = exercises.filter(ex => upperMuscles.includes(ex.muscleGroup));
  const lowerExercises = exercises.filter(ex => lowerMuscles.includes(ex.muscleGroup));

  return [
    {
      day: 'A',
      focus: 'Superiores',
      exercises: upperExercises.slice(0, level === 'avançado' ? 8 : 6).map(ex => ({
        exerciseId: ex.id,
        sets: goal === 'ganho de massa' ? 4 : 3,
        reps: goal === 'emagrecimento' ? '12-15' : goal === 'ganho de massa' ? '8-12' : '10-12',
        rest: '60-90s',
      })),
    },
    {
      day: 'B',
      focus: 'Inferiores',
      exercises: lowerExercises.slice(0, level === 'avançado' ? 7 : 5).map(ex => ({
        exerciseId: ex.id,
        sets: goal === 'ganho de massa' ? 4 : 3,
        reps: goal === 'emagrecimento' ? '12-15' : goal === 'ganho de massa' ? '8-12' : '10-12',
        rest: '60-90s',
      })),
    },
    {
      day: 'C',
      focus: 'Superiores',
      exercises: upperExercises.slice(6, level === 'avançado' ? 14 : 12).map(ex => ({
        exerciseId: ex.id,
        sets: goal === 'ganho de massa' ? 4 : 3,
        reps: goal === 'emagrecimento' ? '12-15' : goal === 'ganho de massa' ? '8-12' : '10-12',
        rest: '60-90s',
      })),
    },
    {
      day: 'D',
      focus: 'Inferiores',
      exercises: lowerExercises.slice(5, level === 'avançado' ? 12 : 10).map(ex => ({
        exerciseId: ex.id,
        sets: goal === 'ganho de massa' ? 4 : 3,
        reps: goal === 'emagrecimento' ? '12-15' : goal === 'ganho de massa' ? '8-12' : '10-12',
        rest: '60-90s',
      })),
    },
  ];
}

function generateBroSplit(
  exercises: Exercise[],
  days: number,
  goal: string,
  level: string
): WorkoutDay[] {
  const splits = [
    { day: 'Segunda', focus: 'Peito', muscles: ['peito'] },
    { day: 'Terça', focus: 'Costas', muscles: ['costas'] },
    { day: 'Quarta', focus: 'Ombros', muscles: ['ombros'] },
    { day: 'Quinta', focus: 'Pernas', muscles: ['pernas', 'gluteos'] },
    { day: 'Sexta', focus: 'Braços e Abdômen', muscles: ['biceps', 'triceps', 'abdomen'] },
    { day: 'Sábado', focus: 'Full Body Leve', muscles: ['peito', 'costas', 'pernas'] },
  ];

  return splits.slice(0, days).map(split => {
    const dayExercises = split.muscles.flatMap(muscle => {
      const muscleExercises = exercises.filter(ex => ex.muscleGroup === muscle);
      return muscleExercises.slice(0, level === 'avançado' ? 5 : 4);
    });

    return {
      day: split.day,
      focus: split.focus,
      exercises: dayExercises.map(ex => ({
        exerciseId: ex.id,
        sets: goal === 'ganho de massa' ? 4 : 3,
        reps: goal === 'emagrecimento' ? '12-15' : goal === 'ganho de massa' ? '8-12' : '10-12',
        rest: goal === 'emagrecimento' ? '45s' : '60-90s',
        notes: split.focus.includes('Leve') ? 'Treino mais leve para recuperação ativa' : undefined,
      })),
    };
  });
}

export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
}

export function calculateCalories(personalInfo: PersonalInfo, goal: string): number {
  const { weight, height, age, gender, activityLevel } = personalInfo;

  // Fórmula de Harris-Benedict
  let bmr: number;
  if (gender === 'masculino') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  // Multiplicador de atividade
  const activityMultipliers = {
    'sedentário': 1.2,
    'leve': 1.375,
    'moderado': 1.55,
    'intenso': 1.725,
    'muito intenso': 1.9,
  };

  const tdee = bmr * activityMultipliers[activityLevel];

  // Ajustar baseado no objetivo
  if (goal === 'emagrecimento') {
    return Math.round(tdee - 500); // Déficit de 500 calorias
  } else if (goal === 'ganho de massa') {
    return Math.round(tdee + 300); // Superávit de 300 calorias
  }
  return Math.round(tdee); // Manutenção
}
