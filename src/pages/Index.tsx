
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import LearningPreferences from "@/components/LearningPreferences";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const { profile, userProgress, addXP } = useAuth();
  const [showPreferences, setShowPreferences] = useState(false);

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
      <SidebarProvider>
        <div className="min-h-screen bg-gray-50 flex w-full">
          <AppSidebar 
            learningStyle={learningStyle} 
            onOpenPreferences={() => setShowPreferences(true)} 
          />
          
          <SidebarInset>
            <div className="flex flex-col h-screen">
              <Header
                userXP={userProgress.xp}
                userLevel={userProgress.level}
                onOpenPreferences={() => setShowPreferences(true)}
              >
                <SidebarTrigger className="mr-2" />
              </Header>

              <div className="flex-1 overflow-hidden">
                <ChatInterface learningStyle={learningStyle} onXPGain={addXP} />
              </div>
            </div>
          </SidebarInset>

          {showPreferences && (
            <LearningPreferences
              onClose={() => setShowPreferences(false)}
              currentStyle={learningStyle}
            />
          )}
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Index;
