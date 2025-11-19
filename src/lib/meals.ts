import { Meal } from '@/types/fitness';

export const meals: Meal[] = [
  // CAFÉ DA MANHÃ - EMAGRECIMENTO
  {
    id: 'meal-1',
    name: 'Omelete Proteica',
    category: 'café da manhã',
    calories: 280,
    protein: 24,
    carbs: 8,
    fats: 18,
    description: 'Omelete leve com vegetais e queijo branco',
    ingredients: [
      '3 ovos',
      '1 tomate picado',
      'Espinafre à vontade',
      '30g queijo branco',
      'Temperos a gosto'
    ],
    goal: 'emagrecimento'
  },
  {
    id: 'meal-2',
    name: 'Iogurte com Frutas Vermelhas',
    category: 'café da manhã',
    calories: 220,
    protein: 18,
    carbs: 28,
    fats: 4,
    description: 'Iogurte grego natural com frutas e chia',
    ingredients: [
      '200g iogurte grego natural',
      '100g frutas vermelhas',
      '1 colher de sopa de chia',
      'Adoçante a gosto'
    ],
    goal: 'emagrecimento'
  },
  {
    id: 'meal-3',
    name: 'Panqueca de Aveia',
    category: 'café da manhã',
    calories: 310,
    protein: 20,
    carbs: 35,
    fats: 10,
    description: 'Panqueca fit com aveia e banana',
    ingredients: [
      '2 ovos',
      '3 colheres de aveia',
      '1 banana amassada',
      'Canela a gosto',
      'Mel (opcional)'
    ],
    goal: 'emagrecimento'
  },

  // CAFÉ DA MANHÃ - GANHO DE MASSA
  {
    id: 'meal-4',
    name: 'Tapioca com Frango',
    category: 'café da manhã',
    calories: 420,
    protein: 35,
    carbs: 48,
    fats: 8,
    description: 'Tapioca recheada com frango desfiado',
    ingredients: [
      '4 colheres de goma de tapioca',
      '100g frango desfiado',
      '1 fatia de queijo',
      'Tomate e alface'
    ],
    goal: 'ganho de massa'
  },
  {
    id: 'meal-5',
    name: 'Vitamina Hipercalórica',
    category: 'café da manhã',
    calories: 550,
    protein: 32,
    carbs: 68,
    fats: 16,
    description: 'Shake nutritivo para ganho de massa',
    ingredients: [
      '300ml leite integral',
      '1 banana',
      '3 colheres de aveia',
      '2 colheres de pasta de amendoim',
      '1 scoop whey protein'
    ],
    goal: 'ganho de massa'
  },

  // ALMOÇO - EMAGRECIMENTO
  {
    id: 'meal-6',
    name: 'Frango Grelhado com Salada',
    category: 'almoço',
    calories: 380,
    protein: 42,
    carbs: 28,
    fats: 10,
    description: 'Peito de frango com salada colorida e batata doce',
    ingredients: [
      '150g peito de frango',
      'Salada verde à vontade',
      '100g batata doce',
      'Azeite (1 colher)',
      'Temperos naturais'
    ],
    goal: 'emagrecimento'
  },
  {
    id: 'meal-7',
    name: 'Peixe com Legumes',
    category: 'almoço',
    calories: 340,
    protein: 38,
    carbs: 24,
    fats: 12,
    description: 'Filé de peixe assado com legumes no vapor',
    ingredients: [
      '150g filé de peixe',
      'Brócolis e couve-flor',
      'Cenoura',
      '2 colheres de arroz integral',
      'Limão e ervas'
    ],
    goal: 'emagrecimento'
  },
  {
    id: 'meal-8',
    name: 'Carne Magra com Quinoa',
    category: 'almoço',
    calories: 420,
    protein: 40,
    carbs: 35,
    fats: 14,
    description: 'Carne magra grelhada com quinoa e vegetais',
    ingredients: [
      '120g patinho ou alcatra',
      '4 colheres de quinoa',
      'Abobrinha grelhada',
      'Tomate cereja',
      'Rúcula'
    ],
    goal: 'emagrecimento'
  },

  // ALMOÇO - GANHO DE MASSA
  {
    id: 'meal-9',
    name: 'Frango com Arroz e Feijão',
    category: 'almoço',
    calories: 620,
    protein: 52,
    carbs: 72,
    fats: 12,
    description: 'Refeição completa para ganho de massa',
    ingredients: [
      '180g peito de frango',
      '6 colheres de arroz branco',
      '1 concha de feijão',
      'Salada verde',
      'Azeite'
    ],
    goal: 'ganho de massa'
  },
  {
    id: 'meal-10',
    name: 'Carne com Batata e Macarrão',
    category: 'almoço',
    calories: 680,
    protein: 48,
    carbs: 78,
    fats: 18,
    description: 'Refeição hipercalórica para hipertrofia',
    ingredients: [
      '150g carne vermelha magra',
      '150g batata',
      '100g macarrão integral',
      'Legumes variados',
      'Molho de tomate caseiro'
    ],
    goal: 'ganho de massa'
  },

  // JANTAR - EMAGRECIMENTO
  {
    id: 'meal-11',
    name: 'Sopa de Legumes com Frango',
    category: 'jantar',
    calories: 280,
    protein: 28,
    carbs: 22,
    fats: 8,
    description: 'Sopa nutritiva e leve para o jantar',
    ingredients: [
      '100g frango desfiado',
      'Cenoura, abobrinha, chuchu',
      'Batata (1 pequena)',
      'Caldo de legumes',
      'Temperos naturais'
    ],
    goal: 'emagrecimento'
  },
  {
    id: 'meal-12',
    name: 'Omelete de Claras com Salada',
    category: 'jantar',
    calories: 240,
    protein: 26,
    carbs: 12,
    fats: 10,
    description: 'Jantar leve e proteico',
    ingredients: [
      '5 claras + 1 ovo inteiro',
      'Tomate e cebola',
      'Salada verde',
      'Queijo cottage (30g)',
      'Ervas frescas'
    ],
    goal: 'emagrecimento'
  },

  // JANTAR - GANHO DE MASSA
  {
    id: 'meal-13',
    name: 'Salmão com Arroz Integral',
    category: 'jantar',
    calories: 520,
    protein: 42,
    carbs: 48,
    fats: 18,
    description: 'Jantar rico em ômega-3 e proteínas',
    ingredients: [
      '150g salmão',
      '5 colheres de arroz integral',
      'Aspargos grelhados',
      'Azeite',
      'Limão siciliano'
    ],
    goal: 'ganho de massa'
  },

  // LANCHES - EMAGRECIMENTO
  {
    id: 'meal-14',
    name: 'Frutas com Castanhas',
    category: 'lanche',
    calories: 180,
    protein: 6,
    carbs: 22,
    fats: 8,
    description: 'Lanche prático e saudável',
    ingredients: [
      '1 maçã ou pera',
      '10 unidades de castanhas',
      'Canela (opcional)'
    ],
    goal: 'emagrecimento'
  },
  {
    id: 'meal-15',
    name: 'Wrap de Peito de Peru',
    category: 'lanche',
    calories: 220,
    protein: 18,
    carbs: 24,
    fats: 6,
    description: 'Lanche rápido e proteico',
    ingredients: [
      '1 tortilha integral',
      '50g peito de peru',
      'Alface e tomate',
      'Cream cheese light',
      'Mostarda'
    ],
    goal: 'emagrecimento'
  },

  // LANCHES - GANHO DE MASSA
  {
    id: 'meal-16',
    name: 'Sanduíche Natural',
    category: 'lanche',
    calories: 380,
    protein: 28,
    carbs: 42,
    fats: 12,
    description: 'Sanduíche completo para ganho de massa',
    ingredients: [
      '2 fatias de pão integral',
      '80g frango desfiado',
      'Queijo branco',
      'Alface, tomate, cenoura',
      'Pasta de abacate'
    ],
    goal: 'ganho de massa'
  },
  {
    id: 'meal-17',
    name: 'Shake de Banana com Aveia',
    category: 'lanche',
    calories: 420,
    protein: 24,
    carbs: 52,
    fats: 14,
    description: 'Shake energético pós-treino',
    ingredients: [
      '250ml leite',
      '2 bananas',
      '3 colheres de aveia',
      '1 colher de pasta de amendoim',
      '1 scoop whey'
    ],
    goal: 'ganho de massa'
  },

  // MANUTENÇÃO
  {
    id: 'meal-18',
    name: 'Bowl de Açaí Fit',
    category: 'lanche',
    calories: 320,
    protein: 12,
    carbs: 48,
    fats: 10,
    description: 'Bowl equilibrado para manutenção',
    ingredients: [
      '200g polpa de açaí',
      '1 banana',
      'Granola (2 colheres)',
      'Frutas variadas',
      'Mel'
    ],
    goal: 'manutenção'
  },
  {
    id: 'meal-19',
    name: 'Salada Completa',
    category: 'almoço',
    calories: 450,
    protein: 32,
    carbs: 38,
    fats: 18,
    description: 'Salada balanceada com todos os macros',
    ingredients: [
      '100g frango ou atum',
      'Mix de folhas',
      'Grão de bico',
      'Abacate',
      'Tomate cereja',
      'Azeite e limão'
    ],
    goal: 'manutenção'
  },
  {
    id: 'meal-20',
    name: 'Risoto de Frango Light',
    category: 'jantar',
    calories: 480,
    protein: 36,
    carbs: 54,
    fats: 12,
    description: 'Risoto saudável e saboroso',
    ingredients: [
      '120g frango em cubos',
      '5 colheres de arroz arbóreo',
      'Cogumelos',
      'Caldo de legumes',
      'Queijo parmesão light',
      'Ervas finas'
    ],
    goal: 'manutenção'
  }
];
