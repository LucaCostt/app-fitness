import { Exercise } from '@/types/fitness';

export const exercises: Exercise[] = [
  // PEITO
  {
    id: 'ex-1',
    name: 'Flexão de Braço',
    muscleGroup: 'peito',
    location: 'ambos',
    description: 'Exercício clássico para fortalecer peito, ombros e tríceps',
    sets: '3-4',
    reps: '10-15',
    difficulty: 'iniciante',
    equipment: 'Peso corporal'
  },
  {
    id: 'ex-2',
    name: 'Supino Reto',
    muscleGroup: 'peito',
    location: 'academia',
    description: 'Exercício fundamental para desenvolvimento do peitoral',
    sets: '4',
    reps: '8-12',
    difficulty: 'intermediário',
    equipment: 'Barra e anilhas'
  },
  {
    id: 'ex-3',
    name: 'Crucifixo com Halteres',
    muscleGroup: 'peito',
    location: 'academia',
    description: 'Ótimo para alongar e trabalhar a parte interna do peito',
    sets: '3',
    reps: '12-15',
    difficulty: 'intermediário',
    equipment: 'Halteres'
  },

  // COSTAS
  {
    id: 'ex-4',
    name: 'Remada Curvada',
    muscleGroup: 'costas',
    location: 'academia',
    description: 'Excelente para desenvolver espessura nas costas',
    sets: '4',
    reps: '8-12',
    difficulty: 'intermediário',
    equipment: 'Barra e anilhas'
  },
  {
    id: 'ex-5',
    name: 'Puxada na Barra Fixa',
    muscleGroup: 'costas',
    location: 'ambos',
    description: 'Exercício completo para largura das costas',
    sets: '3-4',
    reps: '6-10',
    difficulty: 'avançado',
    equipment: 'Barra fixa'
  },
  {
    id: 'ex-6',
    name: 'Superman',
    muscleGroup: 'costas',
    location: 'casa',
    description: 'Fortalece a região lombar e eretores da espinha',
    sets: '3',
    reps: '15-20',
    difficulty: 'iniciante',
    equipment: 'Peso corporal'
  },

  // OMBROS
  {
    id: 'ex-7',
    name: 'Desenvolvimento com Halteres',
    muscleGroup: 'ombros',
    location: 'academia',
    description: 'Exercício principal para ombros completos',
    sets: '4',
    reps: '10-12',
    difficulty: 'intermediário',
    equipment: 'Halteres'
  },
  {
    id: 'ex-8',
    name: 'Elevação Lateral',
    muscleGroup: 'ombros',
    location: 'ambos',
    description: 'Isola o deltoide lateral para ombros mais largos',
    sets: '3',
    reps: '12-15',
    difficulty: 'iniciante',
    equipment: 'Halteres ou garrafas'
  },
  {
    id: 'ex-9',
    name: 'Elevação Frontal',
    muscleGroup: 'ombros',
    location: 'ambos',
    description: 'Trabalha a parte frontal dos ombros',
    sets: '3',
    reps: '12-15',
    difficulty: 'iniciante',
    equipment: 'Halteres ou garrafas'
  },

  // BÍCEPS
  {
    id: 'ex-10',
    name: 'Rosca Direta com Barra',
    muscleGroup: 'biceps',
    location: 'academia',
    description: 'Exercício clássico para volume de bíceps',
    sets: '3-4',
    reps: '10-12',
    difficulty: 'iniciante',
    equipment: 'Barra e anilhas'
  },
  {
    id: 'ex-11',
    name: 'Rosca Alternada',
    muscleGroup: 'biceps',
    location: 'ambos',
    description: 'Permite maior amplitude e concentração',
    sets: '3',
    reps: '10-12 cada',
    difficulty: 'iniciante',
    equipment: 'Halteres'
  },
  {
    id: 'ex-12',
    name: 'Rosca Martelo',
    muscleGroup: 'biceps',
    location: 'ambos',
    description: 'Trabalha bíceps e antebraços simultaneamente',
    sets: '3',
    reps: '12-15',
    difficulty: 'iniciante',
    equipment: 'Halteres'
  },

  // TRÍCEPS
  {
    id: 'ex-13',
    name: 'Tríceps Testa',
    muscleGroup: 'triceps',
    location: 'academia',
    description: 'Excelente isolamento para todas as cabeças do tríceps',
    sets: '3-4',
    reps: '10-12',
    difficulty: 'intermediário',
    equipment: 'Barra W'
  },
  {
    id: 'ex-14',
    name: 'Mergulho em Paralelas',
    muscleGroup: 'triceps',
    location: 'ambos',
    description: 'Exercício composto para força e massa',
    sets: '3',
    reps: '8-12',
    difficulty: 'intermediário',
    equipment: 'Paralelas ou cadeira'
  },
  {
    id: 'ex-15',
    name: 'Tríceps no Banco',
    muscleGroup: 'triceps',
    location: 'casa',
    description: 'Ótimo exercício com peso corporal',
    sets: '3',
    reps: '12-15',
    difficulty: 'iniciante',
    equipment: 'Banco ou cadeira'
  },

  // PERNAS
  {
    id: 'ex-16',
    name: 'Agachamento Livre',
    muscleGroup: 'pernas',
    location: 'ambos',
    description: 'Rei dos exercícios para pernas completas',
    sets: '4',
    reps: '10-15',
    difficulty: 'intermediário',
    equipment: 'Barra (opcional)'
  },
  {
    id: 'ex-17',
    name: 'Leg Press',
    muscleGroup: 'pernas',
    location: 'academia',
    description: 'Exercício seguro para trabalhar coxas com carga',
    sets: '4',
    reps: '12-15',
    difficulty: 'iniciante',
    equipment: 'Máquina leg press'
  },
  {
    id: 'ex-18',
    name: 'Afundo',
    muscleGroup: 'pernas',
    location: 'ambos',
    description: 'Trabalha pernas e glúteos unilateralmente',
    sets: '3',
    reps: '10-12 cada',
    difficulty: 'iniciante',
    equipment: 'Peso corporal ou halteres'
  },
  {
    id: 'ex-19',
    name: 'Stiff',
    muscleGroup: 'pernas',
    location: 'ambos',
    description: 'Foca em posterior de coxa e glúteos',
    sets: '3-4',
    reps: '10-12',
    difficulty: 'intermediário',
    equipment: 'Barra ou halteres'
  },

  // ABDÔMEN
  {
    id: 'ex-20',
    name: 'Prancha',
    muscleGroup: 'abdomen',
    location: 'ambos',
    description: 'Fortalece o core completo',
    sets: '3',
    reps: '30-60s',
    difficulty: 'iniciante',
    equipment: 'Peso corporal'
  },
  {
    id: 'ex-21',
    name: 'Abdominal Crunch',
    muscleGroup: 'abdomen',
    location: 'ambos',
    description: 'Exercício clássico para reto abdominal',
    sets: '3-4',
    reps: '15-20',
    difficulty: 'iniciante',
    equipment: 'Peso corporal'
  },
  {
    id: 'ex-22',
    name: 'Elevação de Pernas',
    muscleGroup: 'abdomen',
    location: 'ambos',
    description: 'Trabalha abdômen inferior',
    sets: '3',
    reps: '12-15',
    difficulty: 'intermediário',
    equipment: 'Peso corporal'
  },
  {
    id: 'ex-23',
    name: 'Bicicleta no Ar',
    muscleGroup: 'abdomen',
    location: 'ambos',
    description: 'Ativa oblíquos e reto abdominal',
    sets: '3',
    reps: '20-30',
    difficulty: 'iniciante',
    equipment: 'Peso corporal'
  },

  // GLÚTEOS
  {
    id: 'ex-24',
    name: 'Elevação Pélvica',
    muscleGroup: 'gluteos',
    location: 'ambos',
    description: 'Exercício isolado para glúteos',
    sets: '3-4',
    reps: '15-20',
    difficulty: 'iniciante',
    equipment: 'Peso corporal ou barra'
  },
  {
    id: 'ex-25',
    name: 'Cadeira Abdutora',
    muscleGroup: 'gluteos',
    location: 'academia',
    description: 'Isola glúteo médio',
    sets: '3',
    reps: '15-20',
    difficulty: 'iniciante',
    equipment: 'Máquina abdutora'
  },
  {
    id: 'ex-26',
    name: 'Agachamento Sumô',
    muscleGroup: 'gluteos',
    location: 'ambos',
    description: 'Variação que enfatiza glúteos e parte interna da coxa',
    sets: '3-4',
    reps: '12-15',
    difficulty: 'iniciante',
    equipment: 'Peso corporal ou halter'
  },
];
