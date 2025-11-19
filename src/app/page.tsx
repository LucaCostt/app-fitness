'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import AuthPage from '@/components/AuthPage';
import { 
  Dumbbell, 
  UtensilsCrossed, 
  TrendingUp, 
  Settings, 
  Heart,
  Search,
  Star,
  Home,
  MapPin,
  Flame,
  Target,
  Calendar,
  ChevronRight,
  X,
  User as UserIcon,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  LogOut,
  Loader2
} from 'lucide-react';
import { exercises } from '@/lib/exercises';
import { meals } from '@/lib/meals';
import { 
  generatePersonalizedRoutine,
  calculateBMI,
  getBMICategory,
  calculateCalories
} from '@/lib/routineGenerator';
import {
  getProfile,
  createOrUpdateProfile,
  getWorkoutRoutineDB,
  saveWorkoutRoutineDB,
  getProgressHistoryDB,
  getFavoriteExercisesDB,
  getFavoriteMealsDB,
  saveFavoriteExerciseDB,
  removeFavoriteExerciseDB,
  saveFavoriteMealDB,
  removeFavoriteMealDB,
  profileToPersonalInfo,
  personalInfoToProfile,
} from '@/lib/supabaseOperations';
import type { 
  UserPreferences, 
  Exercise, 
  Meal, 
  MuscleGroup,
  ExerciseLocation,
  PersonalInfo,
  WorkoutRoutine
} from '@/types/fitness';

type Tab = 'home' | 'exercises' | 'meals' | 'progress' | 'settings' | 'routine';

export default function FitnessApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [preferences, setPreferences] = useState<UserPreferences>({
    goal: 'emagrecimento',
    location: 'ambos',
    level: 'iniciante'
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [workoutRoutine, setWorkoutRoutine] = useState<WorkoutRoutine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<ExerciseLocation | 'all'>('all');
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]);
  const [favoriteMeals, setFavoriteMeals] = useState<string[]>([]);
  const [progressHistory, setProgressHistory] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      const profile = await getProfile(userId);
      
      if (profile) {
        setPreferences({
          goal: profile.goal,
          location: profile.location,
          level: profile.level,
        });
        setPersonalInfo(profileToPersonalInfo(profile));
        setShowOnboarding(false);
      } else {
        setShowOnboarding(true);
      }

      const routine = await getWorkoutRoutineDB(userId);
      if (routine) setWorkoutRoutine(routine);

      const favorites = await getFavoriteExercisesDB(userId);
      setFavoriteExercises(favorites);

      const favMeals = await getFavoriteMealsDB(userId);
      setFavoriteMeals(favMeals);

      const progress = await getProgressHistoryDB(userId);
      setProgressHistory(progress);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleAuthSuccess = (authUser: User) => {
    setUser(authUser);
    loadUserData(authUser.id);
  };

  const handleSavePreferences = async (newPrefs: UserPreferences, newPersonalInfo?: PersonalInfo) => {
    if (!user) return;

    try {
      setPreferences(newPrefs);
      
      if (newPersonalInfo) {
        setPersonalInfo(newPersonalInfo);
        
        const profileData = personalInfoToProfile(
          newPersonalInfo,
          newPrefs.goal,
          newPrefs.location,
          newPrefs.level
        );
        
        await createOrUpdateProfile(user.id, profileData);
        
        const routine = generatePersonalizedRoutine(
          newPersonalInfo,
          newPrefs.goal,
          newPrefs.location,
          newPrefs.level
        );
        setWorkoutRoutine(routine);
        await saveWorkoutRoutineDB(user.id, routine);
      }
      
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Erro ao salvar preferências. Tente novamente.');
    }
  };

  const toggleFavoriteExercise = async (exerciseId: string) => {
    if (!user) return;

    try {
      if (favoriteExercises.includes(exerciseId)) {
        await removeFavoriteExerciseDB(user.id, exerciseId);
        setFavoriteExercises(prev => prev.filter(id => id !== exerciseId));
      } else {
        await saveFavoriteExerciseDB(user.id, exerciseId);
        setFavoriteExercises(prev => [...prev, exerciseId]);
      }
    } catch (error) {
      console.error('Error toggling favorite exercise:', error);
    }
  };

  const toggleFavoriteMeal = async (mealId: string) => {
    if (!user) return;

    try {
      if (favoriteMeals.includes(mealId)) {
        await removeFavoriteMealDB(user.id, mealId);
        setFavoriteMeals(prev => prev.filter(id => id !== mealId));
      } else {
        await saveFavoriteMealDB(user.id, mealId);
        setFavoriteMeals(prev => [...prev, mealId]);
      }
    } catch (error) {
      console.error('Error toggling favorite meal:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPersonalInfo(null);
    setWorkoutRoutine(null);
    setFavoriteExercises([]);
    setFavoriteMeals([]);
    setProgressHistory([]);
  };

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ex.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle === 'all' || ex.muscleGroup === selectedMuscle;
    const matchesLocation = selectedLocation === 'all' || 
                           ex.location === selectedLocation || 
                           ex.location === 'ambos';
    return matchesSearch && matchesMuscle && matchesLocation;
  });

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGoal = meal.goal === preferences.goal || meal.goal === 'manutenção';
    return matchesSearch && matchesGoal;
  });

  const muscleGroups: { value: MuscleGroup | 'all'; label: string; emoji: string }[] = [
    { value: 'all', label: 'Todos', emoji: '💪' },
    { value: 'peito', label: 'Peito', emoji: '🦾' },
    { value: 'costas', label: 'Costas', emoji: '🏋️' },
    { value: 'ombros', label: 'Ombros', emoji: '💪' },
    { value: 'biceps', label: 'Bíceps', emoji: '💪' },
    { value: 'triceps', label: 'Tríceps', emoji: '💪' },
    { value: 'pernas', label: 'Pernas', emoji: '🦵' },
    { value: 'abdomen', label: 'Abdômen', emoji: '🎯' },
    { value: 'gluteos', label: 'Glúteos', emoji: '🍑' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleSavePreferences} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">FitLife Pro</h1>
              <p className="text-xs text-purple-100">Seu personal trainer digital</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('settings')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 pb-24">
        {activeTab === 'home' && (
          <HomeTab 
            preferences={preferences}
            personalInfo={personalInfo}
            favoriteExercises={favoriteExercises}
            favoriteMeals={favoriteMeals}
            onNavigate={setActiveTab}
          />
        )}
        
        {activeTab === 'routine' && (
          <RoutineTab
            workoutRoutine={workoutRoutine}
            personalInfo={personalInfo}
            preferences={preferences}
          />
        )}
        
        {activeTab === 'exercises' && (
          <ExercisesTab
            exercises={filteredExercises}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedMuscle={selectedMuscle}
            setSelectedMuscle={setSelectedMuscle}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            muscleGroups={muscleGroups}
            favoriteExercises={favoriteExercises}
            toggleFavorite={toggleFavoriteExercise}
          />
        )}
        
        {activeTab === 'meals' && (
          <MealsTab
            meals={filteredMeals}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            preferences={preferences}
            personalInfo={personalInfo}
            favoriteMeals={favoriteMeals}
            toggleFavorite={toggleFavoriteMeal}
          />
        )}
        
        {activeTab === 'progress' && (
          <ProgressTab 
            progressHistory={progressHistory}
            preferences={preferences}
            personalInfo={personalInfo}
          />
        )}
        
        {activeTab === 'settings' && (
          <SettingsTab 
            preferences={preferences}
            personalInfo={personalInfo}
            onSave={handleSavePreferences}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-around items-center p-2">
          {[
            { id: 'home' as Tab, icon: Home, label: 'Início' },
            { id: 'routine' as Tab, icon: Calendar, label: 'Rotina' },
            { id: 'exercises' as Tab, icon: Dumbbell, label: 'Exercícios' },
            { id: 'meals' as Tab, icon: UtensilsCrossed, label: 'Refeições' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                activeTab === id
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// Componente OnboardingScreen (mantido igual ao original)
function OnboardingScreen({ onComplete }: { onComplete: (prefs: UserPreferences, info?: PersonalInfo) => void }) {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<UserPreferences>({
    goal: 'emagrecimento',
    location: 'ambos',
    level: 'iniciante'
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    age: 25,
    gender: 'masculino',
    height: 170,
    weight: 70,
    activityLevel: 'moderado',
    trainingDays: 3,
    experience: '6 meses a 1 ano',
    healthConditions: [],
    injuries: []
  });
  const [healthInput, setHealthInput] = useState('');
  const [injuryInput, setInjuryInput] = useState('');

  const handleComplete = () => {
    onComplete(prefs, personalInfo);
  };

  const addHealthCondition = () => {
    if (healthInput.trim()) {
      setPersonalInfo({
        ...personalInfo,
        healthConditions: [...(personalInfo.healthConditions || []), healthInput.trim()]
      });
      setHealthInput('');
    }
  };

  const addInjury = () => {
    if (injuryInput.trim()) {
      setPersonalInfo({
        ...personalInfo,
        injuries: [...(personalInfo.injuries || []), injuryInput.trim()]
      });
      setInjuryInput('');
    }
  };

  const removeHealthCondition = (index: number) => {
    setPersonalInfo({
      ...personalInfo,
      healthConditions: personalInfo.healthConditions?.filter((_, i) => i !== index)
    });
  };

  const removeInjury = (index: number) => {
    setPersonalInfo({
      ...personalInfo,
      injuries: personalInfo.injuries?.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo ao FitLife Pro!</h2>
          <p className="text-gray-600">Vamos personalizar sua experiência</p>
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-purple-600" />
              Informações Pessoais
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                placeholder="Seu nome"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                <input
                  type="number"
                  value={personalInfo.age}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, age: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                <select
                  value={personalInfo.gender}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                <input
                  type="number"
                  value={personalInfo.height}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, height: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  value={personalInfo.weight}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, weight: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso Alvo (opcional)</label>
              <input
                type="number"
                value={personalInfo.targetWeight || ''}
                onChange={(e) => setPersonalInfo({ ...personalInfo, targetWeight: Number(e.target.value) || undefined })}
                placeholder="Seu peso desejado"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Activity & Experience */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Atividade e Experiência
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Atividade</label>
              <div className="space-y-2">
                {[
                  { value: 'sedentário' as const, label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                  { value: 'leve' as const, label: 'Leve', desc: '1-3 dias por semana' },
                  { value: 'moderado' as const, label: 'Moderado', desc: '3-5 dias por semana' },
                  { value: 'intenso' as const, label: 'Intenso', desc: '6-7 dias por semana' },
                  { value: 'muito intenso' as const, label: 'Muito Intenso', desc: 'Atleta profissional' },
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setPersonalInfo({ ...personalInfo, activityLevel: value })}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                      personalInfo.activityLevel === value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{label}</div>
                    <div className="text-xs text-gray-600">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dias de Treino por Semana</label>
              <input
                type="number"
                min="1"
                max="7"
                value={personalInfo.trainingDays}
                onChange={(e) => setPersonalInfo({ ...personalInfo, trainingDays: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experiência com Treinos</label>
              <div className="space-y-2">
                {[
                  { value: 'nunca treinei' as const, label: 'Nunca treinei' },
                  { value: 'menos de 6 meses' as const, label: 'Menos de 6 meses' },
                  { value: '6 meses a 1 ano' as const, label: '6 meses a 1 ano' },
                  { value: '1 a 2 anos' as const, label: '1 a 2 anos' },
                  { value: 'mais de 2 anos' as const, label: 'Mais de 2 anos' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setPersonalInfo({ ...personalInfo, experience: value })}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                      personalInfo.experience === value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Health & Injuries */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Saúde e Limitações
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condições de Saúde (opcional)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={healthInput}
                  onChange={(e) => setHealthInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHealthCondition()}
                  placeholder="Ex: Diabetes, Hipertensão..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={addHealthCondition}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {personalInfo.healthConditions?.map((condition, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm flex items-center gap-1"
                  >
                    {condition}
                    <button onClick={() => removeHealthCondition(idx)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lesões ou Limitações (opcional)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={injuryInput}
                  onChange={(e) => setInjuryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInjury()}
                  placeholder="Ex: Joelho, Ombro..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={addInjury}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {personalInfo.injuries?.map((injury, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1"
                  >
                    {injury}
                    <button onClick={() => removeInjury(idx)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                💡 Essas informações nos ajudam a criar uma rotina mais segura e adequada para você.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Goal */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Qual é o seu objetivo?</h3>
            {[
              { value: 'emagrecimento' as const, label: 'Emagrecimento', icon: Flame, color: 'orange' },
              { value: 'ganho de massa' as const, label: 'Ganho de Massa', icon: Dumbbell, color: 'blue' },
              { value: 'manutenção' as const, label: 'Manutenção', icon: Target, color: 'green' },
            ].map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                onClick={() => setPrefs({ ...prefs, goal: value })}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  prefs.goal === value
                    ? `border-${color}-500 bg-${color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 text-${color}-600`} />
                <span className="font-medium text-gray-900">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 5: Location */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Onde você treina?</h3>
            {[
              { value: 'casa' as const, label: 'Em Casa', icon: Home },
              { value: 'academia' as const, label: 'Academia', icon: Dumbbell },
              { value: 'ambos' as const, label: 'Ambos', icon: MapPin },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setPrefs({ ...prefs, location: value })}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  prefs.location === value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-6 h-6 text-purple-600" />
                <span className="font-medium text-gray-900">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 6: Level */}
        {step === 6 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Qual seu nível?</h3>
            {[
              { value: 'iniciante' as const, label: 'Iniciante', desc: 'Começando agora' },
              { value: 'intermediário' as const, label: 'Intermediário', desc: 'Treino há alguns meses' },
              { value: 'avançado' as const, label: 'Avançado', desc: 'Treino há mais de 1 ano' },
            ].map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setPrefs({ ...prefs, level: value })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  prefs.level === value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-600">{desc}</div>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          )}
          <button
            onClick={() => step === 6 ? handleComplete() : setStep(step + 1)}
            disabled={step === 1 && !personalInfo.name}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 6 ? 'Criar Rotina Personalizada' : 'Próximo'}
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Componentes HomeTab, RoutineTab, ExercisesTab, MealsTab, ProgressTab e SettingsTab
// (mantidos iguais ao original - código muito longo, mantendo apenas as funções principais)

function HomeTab({ 
  preferences, 
  personalInfo,
  favoriteExercises, 
  favoriteMeals,
  onNavigate 
}: { 
  preferences: UserPreferences;
  personalInfo: PersonalInfo | null;
  favoriteExercises: string[];
  favoriteMeals: string[];
  onNavigate: (tab: Tab) => void;
}) {
  const goalInfo = {
    emagrecimento: { color: 'orange', icon: Flame, text: 'Emagrecimento' },
    'ganho de massa': { color: 'blue', icon: Dumbbell, text: 'Ganho de Massa' },
    manutenção: { color: 'green', icon: Target, text: 'Manutenção' }
  };

  const currentGoal = goalInfo[preferences.goal];
  const bmi = personalInfo ? calculateBMI(personalInfo.weight, personalInfo.height) : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;
  const dailyCalories = personalInfo ? calculateCalories(personalInfo, preferences.goal) : null;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-2">
          Olá{personalInfo?.name ? `, ${personalInfo.name}` : ', Atleta'}! 💪
        </h2>
        <p className="text-purple-100 mb-4">Pronto para treinar hoje?</p>
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-3 w-fit">
          <currentGoal.icon className="w-5 h-5" />
          <span className="font-medium">Meta: {currentGoal.text}</span>
        </div>
      </div>

      {/* Personal Stats */}
      {personalInfo && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">IMC</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{bmi}</p>
            <p className="text-xs text-gray-500">{bmiCategory}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-600">Calorias</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dailyCalories}</p>
            <p className="text-xs text-gray-500">por dia</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-600">Treinos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{personalInfo.trainingDays}x</p>
            <p className="text-xs text-gray-500">por semana</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-600">Favoritos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{favoriteExercises.length}</p>
          <p className="text-xs text-gray-500">Exercícios</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <UtensilsCrossed className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Refeições</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{favoriteMeals.length}</p>
          <p className="text-xs text-gray-500">Salvas</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Ações Rápidas</h3>
        
        <button
          onClick={() => onNavigate('routine')}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all flex items-center justify-between group text-white"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Minha Rotina Personalizada</p>
              <p className="text-sm text-purple-100">Treino criado para você</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => onNavigate('exercises')}
          className="w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
              <Dumbbell className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Explorar Exercícios</p>
              <p className="text-sm text-gray-600">Encontre o treino perfeito</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('meals')}
          className="w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
              <UtensilsCrossed className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Plano de Refeições</p>
              <p className="text-sm text-gray-600">Nutrição personalizada</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
        </button>
      </div>

      {/* Tip of the Day */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="font-bold text-lg mb-2">💡 Dica do Dia</h3>
        <p className="text-amber-50">
          Beba pelo menos 2 litros de água por dia para manter seu corpo hidratado e otimizar seus resultados!
        </p>
      </div>
    </div>
  );
}

function RoutineTab({
  workoutRoutine,
  personalInfo,
  preferences
}: {
  workoutRoutine: WorkoutRoutine | null;
  personalInfo: PersonalInfo | null;
  preferences: UserPreferences;
}) {
  if (!workoutRoutine || !personalInfo) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Rotina não encontrada</h3>
        <p className="text-gray-600">Complete seu perfil para gerar uma rotina personalizada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-2">{workoutRoutine.name}</h2>
        <p className="text-purple-100 mb-4">{workoutRoutine.description}</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm">
            {personalInfo.trainingDays}x por semana
          </span>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm capitalize">
            {preferences.level}
          </span>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm capitalize">
            {preferences.location}
          </span>
        </div>
      </div>

      {/* Workout Days */}
      <div className="space-y-4">
        {workoutRoutine.days.map((day, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{day.day}</h3>
                <p className="text-sm text-gray-600">{day.focus}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Dumbbell className="w-5 h-5 text-purple-600" />
              </div>
            </div>

            <div className="space-y-3">
              {day.exercises.map((ex, exIdx) => {
                const exercise = exercises.find(e => e.id === ex.exerciseId);
                if (!exercise) return null;

                return (
                  <div key={exIdx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {exIdx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                        <span>{ex.sets} séries</span>
                        <span>•</span>
                        <span>{ex.reps} reps</span>
                        <span>•</span>
                        <span>Descanso: {ex.rest}</span>
                      </div>
                      {ex.notes && (
                        <p className="text-xs text-blue-600 mt-1">💡 {ex.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Rotina Personalizada</h4>
            <p className="text-sm text-blue-800">
              Esta rotina foi criada especialmente para você com base nas suas informações pessoais, 
              objetivo e nível de experiência. Siga-a consistentemente para melhores resultados!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExercisesTab({
  exercises,
  searchTerm,
  setSearchTerm,
  selectedMuscle,
  setSelectedMuscle,
  selectedLocation,
  setSelectedLocation,
  muscleGroups,
  favoriteExercises,
  toggleFavorite
}: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Biblioteca de Exercícios</h2>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar exercícios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Muscle Group Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {muscleGroups.map((group: any) => (
          <button
            key={group.value}
            onClick={() => setSelectedMuscle(group.value)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              selectedMuscle === group.value
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
            }`}
          >
            <span className="mr-1">{group.emoji}</span>
            {group.label}
          </button>
        ))}
      </div>

      {/* Location Filter */}
      <div className="flex gap-2">
        {[
          { value: 'all' as const, label: 'Todos', icon: MapPin },
          { value: 'casa' as const, label: 'Casa', icon: Home },
          { value: 'academia' as const, label: 'Academia', icon: Dumbbell },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSelectedLocation(value)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${
              selectedLocation === value
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Exercise Cards */}
      <div className="space-y-3">
        {exercises.map((exercise: Exercise) => (
          <div
            key={exercise.id}
            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{exercise.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg font-medium">
                    {exercise.muscleGroup}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium">
                    {exercise.location}
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-lg font-medium">
                    {exercise.difficulty}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(exercise.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favoriteExercises.includes(exercise.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Séries:</span> {exercise.sets}
              </div>
              <div>
                <span className="font-medium">Reps:</span> {exercise.reps}
              </div>
              {exercise.equipment && (
                <div>
                  <span className="font-medium">Equip:</span> {exercise.equipment}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {exercises.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum exercício encontrado</p>
        </div>
      )}
    </div>
  );
}

function MealsTab({
  meals,
  searchTerm,
  setSearchTerm,
  preferences,
  personalInfo,
  favoriteMeals,
  toggleFavorite
}: any) {
  const categories = ['café da manhã', 'almoço', 'jantar', 'lanche'];
  const dailyCalories = personalInfo ? calculateCalories(personalInfo, preferences.goal) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Plano de Refeições</h2>
        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
          {preferences.goal}
        </div>
      </div>

      {dailyCalories && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Meta Calórica Diária</h3>
              <p className="text-2xl font-bold">{dailyCalories} kcal</p>
            </div>
          </div>
          <p className="text-green-100 text-sm">
            Baseado no seu perfil e objetivo de {preferences.goal}
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar refeições..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Meals by Category */}
      {categories.map(category => {
        const categoryMeals = meals.filter((m: Meal) => m.category === category);
        if (categoryMeals.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <h3 className="font-semibold text-gray-900 capitalize flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-green-600" />
              {category}
            </h3>
            {categoryMeals.map((meal: Meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{meal.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                    
                    {/* Macros */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="text-center p-2 bg-orange-50 rounded-lg">
                        <div className="text-xs text-gray-600">Calorias</div>
                        <div className="font-bold text-orange-600">{meal.calories}</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-xs text-gray-600">Proteína</div>
                        <div className="font-bold text-blue-600">{meal.protein}g</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded-lg">
                        <div className="text-xs text-gray-600">Carbs</div>
                        <div className="font-bold text-yellow-600">{meal.carbs}g</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <div className="text-xs text-gray-600">Gordura</div>
                        <div className="font-bold text-purple-600">{meal.fats}g</div>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <details className="text-sm">
                      <summary className="cursor-pointer text-green-600 font-medium hover:text-green-700">
                        Ver ingredientes
                      </summary>
                      <ul className="mt-2 space-y-1 text-gray-600 ml-4">
                        {meal.ingredients.map((ing, idx) => (
                          <li key={idx} className="list-disc">{ing}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                  <button
                    onClick={() => toggleFavorite(meal.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        favoriteMeals.includes(meal.id)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {meals.length === 0 && (
        <div className="text-center py-12">
          <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Nenhuma refeição encontrada</p>
        </div>
      )}
    </div>
  );
}

function ProgressTab({ progressHistory, preferences, personalInfo }: any) {
  const bmi = personalInfo ? calculateBMI(personalInfo.weight, personalInfo.height) : null;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Seu Progresso</h2>

      {/* Current Goal */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Meta Atual</h3>
            <p className="text-green-100 capitalize">{preferences.goal}</p>
          </div>
        </div>
        {personalInfo?.targetWeight && (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-green-100 mb-2">
              Peso atual: {personalInfo.weight}kg → Meta: {personalInfo.targetWeight}kg
            </p>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all"
                style={{
                  width: `${Math.min(100, ((personalInfo.weight - personalInfo.targetWeight) / personalInfo.weight) * 100)}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {personalInfo && (
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <Activity className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bmi}</p>
            <p className="text-sm text-gray-600">IMC Atual</p>
          </div>
        )}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <Calendar className="w-6 h-6 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{progressHistory.length}</p>
          <p className="text-sm text-gray-600">Dias registrados</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <Flame className="w-6 h-6 text-orange-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {progressHistory.reduce((acc: number, p: any) => acc + (p.exercises?.length || 0), 0)}
          </p>
          <p className="text-sm text-gray-600">Exercícios feitos</p>
        </div>
        {personalInfo && (
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <Clock className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{personalInfo.trainingDays}x</p>
            <p className="text-sm text-gray-600">Treinos/semana</p>
          </div>
        )}
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-2xl p-8 shadow-md text-center">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="font-bold text-gray-900 mb-2">Gráficos em Breve!</h3>
        <p className="text-gray-600 text-sm">
          Visualize sua evolução com gráficos detalhados de peso, medidas e performance.
        </p>
      </div>

      {/* History */}
      {progressHistory.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Histórico Recente</h3>
          {progressHistory.slice(-5).reverse().map((entry: any, idx: number) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{entry.date}</span>
                {entry.weight && (
                  <span className="text-sm text-gray-600">{entry.weight}kg</span>
                )}
              </div>
              {entry.notes && (
                <p className="text-sm text-gray-600">{entry.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab({ 
  preferences,
  personalInfo,
  onSave 
}: { 
  preferences: UserPreferences;
  personalInfo: PersonalInfo | null;
  onSave: (prefs: UserPreferences, info?: PersonalInfo) => void;
}) {
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [localInfo, setLocalInfo] = useState(personalInfo);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  const handleSave = () => {
    onSave(localPrefs, localInfo || undefined);
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>

      {/* Personal Info Section */}
      {localInfo && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <button
            onClick={() => setShowPersonalInfo(!showPersonalInfo)}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-purple-600" />
              Informações Pessoais
            </h3>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showPersonalInfo ? 'rotate-90' : ''}`} />
          </button>
          
          {showPersonalInfo && localInfo && (
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Nome:</span>
                  <p className="font-medium text-gray-900">{localInfo.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Idade:</span>
                  <p className="font-medium text-gray-900">{localInfo.age} anos</p>
                </div>
                <div>
                  <span className="text-gray-600">Altura:</span>
                  <p className="font-medium text-gray-900">{localInfo.height} cm</p>
                </div>
                <div>
                  <span className="text-gray-600">Peso:</span>
                  <p className="font-medium text-gray-900">{localInfo.weight} kg</p>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-gray-600 text-sm">IMC:</span>
                <p className="font-bold text-lg text-purple-600">
                  {calculateBMI(localInfo.weight, localInfo.height)} - {getBMICategory(calculateBMI(localInfo.weight, localInfo.height))}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Goal */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-semibold text-gray-900 mb-4">Objetivo</h3>
        <div className="space-y-2">
          {[
            { value: 'emagrecimento' as const, label: 'Emagrecimento' },
            { value: 'ganho de massa' as const, label: 'Ganho de Massa' },
            { value: 'manutenção' as const, label: 'Manutenção' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setLocalPrefs({ ...localPrefs, goal: value })}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                localPrefs.goal === value
                  ? 'bg-purple-100 border-2 border-purple-500'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-semibold text-gray-900 mb-4">Local de Treino</h3>
        <div className="space-y-2">
          {[
            { value: 'casa' as const, label: 'Em Casa' },
            { value: 'academia' as const, label: 'Academia' },
            { value: 'ambos' as const, label: 'Ambos' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setLocalPrefs({ ...localPrefs, location: value })}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                localPrefs.location === value
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Level */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-semibold text-gray-900 mb-4">Nível</h3>
        <div className="space-y-2">
          {[
            { value: 'iniciante' as const, label: 'Iniciante' },
            { value: 'intermediário' as const, label: 'Intermediário' },
            { value: 'avançado' as const, label: 'Avançado' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setLocalPrefs({ ...localPrefs, level: value })}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                localPrefs.level === value
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
      >
        Salvar Alterações
      </button>

      {/* App Info */}
      <div className="text-center text-sm text-gray-500">
        <p>FitLife Pro v1.0</p>
        <p className="mt-1">Seu personal trainer digital</p>
      </div>
    </div>
  );
}
