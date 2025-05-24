
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import LearningPreferences from '@/components/LearningPreferences';
import Sidebar from '@/components/Sidebar';
import { toast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

const Index = () => {
  const [userXP, setUserXP] = useState(150);
  const [userLevel, setUserLevel] = useState(2);
  const [learningStyle, setLearningStyle] = useState('Textos explicativos');
  const [showPreferences, setShowPreferences] = useState(false);
  const [studyStreak, setStudyStreak] = useState(5);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Primeira Pergunta',
      description: 'Fez sua primeira pergunta ao TIAcher',
      icon: 'question',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 86400000) // 1 dia atrás
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
  ]);

  const handleXPGain = (points: number) => {
    const newXP = userXP + points;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    setUserXP(newXP);
    
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
      toast({
        title: "🎉 Nível aumentou!",
        description: `Parabéns! Você chegou ao nível ${newLevel}!`,
      });
    } else {
      toast({
        title: "✨ XP ganho!",
        description: `+${points} XP pela interação!`,
      });
    }
  };

  const handleStyleChange = (newStyle: string) => {
    setLearningStyle(newStyle);
    toast({
      title: "Preferências atualizadas!",
      description: `Agora vou adaptar as respostas para: ${newStyle}`,
    });
  };

  const handleOpenHistory = () => {
    toast({
      title: "Em desenvolvimento",
      description: "A funcionalidade de histórico será implementada em breve!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userXP={userXP}
        userLevel={userLevel}
        onOpenPreferences={() => setShowPreferences(true)}
      />
      
      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 flex flex-col">
          <ChatInterface 
            learningStyle={learningStyle}
            onXPGain={handleXPGain}
          />
        </div>
        
        <Sidebar 
          userXP={userXP}
          userLevel={userLevel}
          achievements={achievements}
          studyStreak={studyStreak}
          onOpenHistory={handleOpenHistory}
        />
      </div>

      {showPreferences && (
        <LearningPreferences
          currentStyle={learningStyle}
          onStyleChange={handleStyleChange}
          onClose={() => setShowPreferences(false)}
        />
      )}
    </div>
  );
};

export default Index;
