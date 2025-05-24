import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, BookOpen, Clock, Award } from "lucide-react";

interface SidebarProps {
  userXP: number;
  userLevel: number;
  achievements: Achievement[];
  studyStreak: number;
  onOpenHistory: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

const Sidebar = ({
  userXP,
  userLevel,
  achievements,
  studyStreak,
  onOpenHistory,
}: SidebarProps) => {
  const xpForNextLevel = (userLevel + 1) * 100;
  const currentLevelXP = userXP % 100;
  const progressPercent = (currentLevelXP / 100) * 100;

  const recentAchievements = achievements
    .filter((a) => a.unlocked)
    .sort(
      (a, b) =>
        new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime()
    )
    .slice(0, 3);

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 space-y-4 overflow-y-auto">
      {/* Progresso do Usuário */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Nível {userLevel}</h3>
              <p className="text-sm text-gray-600">
                {currentLevelXP}/{100} XP
              </p>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-gray-500">
              {100 - currentLevelXP} XP para o próximo nível
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sequência de Estudos */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium">Sequência de estudos</h4>
              <p className="text-sm text-gray-600">
                {studyStreak} dias seguidos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conquistas Recentes */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Trophy className="w-5 h-5 text-indigo-600" />
            <h4 className="font-medium">Conquistas Recentes</h4>
          </div>
          <div className="space-y-2">
            {recentAchievements.length > 0 ? (
              recentAchievements.map((achievement) => (
<<<<<<< HEAD
                <div key={achievement.id} className="flex items-center space-x-2 p-2 bg-indigo-50 rounded-lg">
                  <Award className="w-4 h-4 text-indigo-600" />
=======
                <div
                  key={achievement.id}
                  className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg"
                >
                  <Award className="w-4 h-4 text-yellow-600" />
>>>>>>> c2b31fc (fix: fix color of some components)
                  <div className="flex-1">
                    <p className="text-sm font-medium">{achievement.title}</p>
                    <p className="text-xs text-gray-600">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Continue estudando para desbloquear conquistas!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h4 className="font-medium mb-3">Ações Rápidas</h4>
          <Button
            variant="outline"
            className="w-full justify-start bg-yellow-50 hover:bg-yellow-100"
            onClick={onOpenHistory}
          >
            <Clock className="w-4 h-4 mr-2" />
            Histórico de Estudos
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-yellow-50 hover:bg-yellow-100"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Tópicos Favoritos
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-yellow-50 hover:bg-yellow-100"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Todas as Conquistas
          </Button>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Estatísticas</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Perguntas feitas:</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Exercícios resolvidos:</span>
              <span className="font-medium">18</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tempo de estudo:</span>
              <span className="font-medium">2h 30m</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
