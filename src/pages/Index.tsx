import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import ConversationsSidebar from "@/components/ConversationsSidebar";
import LearningPreferences from "@/components/LearningPreferences";

const Index = () => {
  const { profile, userProgress, addXP } = useAuth();
  const [showPreferences, setShowPreferences] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!profile || !userProgress) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <p className="text-gray-600">Carregando dados do usuário...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const learningStyle = profile.learning_style || "Textos explicativos";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          userXP={userProgress.xp}
          userLevel={userProgress.level}
          onOpenPreferences={() => setShowPreferences(true)}
        />

        <div className="flex-1 flex overflow-hidden">
          <ConversationsSidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <div className="flex-1 flex flex-col">
            <ChatInterface learningStyle={learningStyle} onXPGain={addXP} />
          </div>
        </div>

        {showPreferences && (
          <LearningPreferences
            isOpen={showPreferences}
            onClose={() => setShowPreferences(false)}
            currentStyle={learningStyle}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Index;
