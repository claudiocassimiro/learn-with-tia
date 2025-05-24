
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import LearningPreferences from '@/components/LearningPreferences';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Mock achievements for now - we'll load real ones later
const mockAchievements = [
  {
    id: '1',
    title: 'Primeira Pergunta',
    description: 'Fez sua primeira pergunta ao TIAcher',
    icon: 'question',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000)
  },
  {
    id: '2',
    title: 'Estudante Dedicado', 
    description: 'Estudou por 5 dias seguidos',
    icon: 'star',
    unlocked: true,
    unlockedAt: new Date()
  },
  {
    id: '3',
    title: 'Explorador',
    description: 'Testou 3 estilos de aprendizagem diferentes',
    icon: 'compass',
    unlocked: false
  }
];

const IndexContent = () => {
  const { user, profile, userProgress, addXP, updateProfile } = useAuth();
  const [showPreferences, setShowPreferences] = useState(false);

  const handleXPGain = async (points: number) => {
    await addXP(points);
  };

  const handleStyleChange = async (newStyle: string) => {
    if (profile) {
      await updateProfile({ learning_style: newStyle });
    }
  };

  const handleOpenHistory = () => {
    toast({
      title: "Em desenvolvimento",
      description: "A funcionalidade de histórico será implementada em breve!",
    });
  };

  const handleOpenPreferences = () => {
    setShowPreferences(true);
  };

  if (!user || !profile || !userProgress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userXP={userProgress.xp}
        userLevel={userProgress.level}
        onOpenPreferences={handleOpenPreferences}
      />
      
      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 flex flex-col">
          <ChatInterface 
            learningStyle={profile.learning_style}
            onXPGain={handleXPGain}
          />
        </div>
        
        <Sidebar 
          userXP={userProgress.xp}
          userLevel={userProgress.level}
          achievements={mockAchievements}
          studyStreak={userProgress.study_streak}
          onOpenHistory={handleOpenHistory}
        />
      </div>

      {showPreferences && (
        <LearningPreferences
          currentStyle={profile.learning_style}
          onStyleChange={handleStyleChange}
          onClose={() => setShowPreferences(false)}
        />
      )}
    </div>
  );
};

const Index = () => {
  const { user } = useAuth();

  // Show welcome page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                TI
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            TIAcher
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Seu professor de IA personalizado para aprender tecnologia de forma adaptada ao seu estilo de aprendizagem
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Link to="/auth">Começar Agora</Link>
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">🎯 Personalizado</h3>
              <p className="text-gray-600 text-sm">Aprenda no seu ritmo com conteúdo adaptado ao seu estilo</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">🏆 Gamificado</h3>
              <p className="text-gray-600 text-sm">Ganhe XP, suba de nível e desbloqueie conquistas</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">🤖 IA Avançada</h3>
              <p className="text-gray-600 text-sm">Powered by inteligência artificial de última geração</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <IndexContent />
    </ProtectedRoute>
  );
};

export default Index;
