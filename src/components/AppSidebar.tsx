
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  User, 
  LogOut,
  Trophy,
  Star,
  Calendar,
  Trash2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AppSidebarProps {
  learningStyle: string;
  onOpenPreferences: () => void;
}

export function AppSidebar({ learningStyle, onOpenPreferences }: AppSidebarProps) {
  const { profile, userProgress, signOut } = useAuth();
  const { 
    conversations, 
    currentConversation, 
    createConversation, 
    selectConversation, 
    deleteConversation 
  } = useConversations(learningStyle);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleNewConversation = async () => {
    await createConversation();
  };

  const handleDeleteConversation = async (conversationId: string) => {
    setDeletingId(conversationId);
    await deleteConversation(conversationId);
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center space-x-3 p-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {profile?.full_name || profile?.email}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                Nível {userProgress?.level || 1}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-medium text-gray-600">{userProgress?.xp || 0} XP</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-gray-200" />

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-medium px-4 py-2">Conversas</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  onClick={handleNewConversation}
                  className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-sm h-10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Conversa
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-medium px-4 py-2">Histórico</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[300px] px-2">
              <SidebarMenu className="space-y-1">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">Nenhuma conversa ainda</p>
                    <p className="text-xs text-gray-400 mt-1">Comece uma nova conversa!</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <div className="group flex items-center w-full">
                        <SidebarMenuButton
                          onClick={() => selectConversation(conversation)}
                          isActive={currentConversation?.id === conversation.id}
                          className={`flex-1 p-3 rounded-lg transition-all duration-200 ${
                            currentConversation?.id === conversation.id
                              ? 'bg-blue-50 border-blue-200 border text-blue-900 shadow-sm'
                              : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                          }`}
                        >
                          <MessageSquare className="w-4 h-4 shrink-0" />
                          <div className="flex-1 min-w-0 text-left">
                            <span className="truncate block text-sm font-medium">
                              {conversation.title || 'Nova conversa'}
                            </span>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(conversation.updated_at)}
                            </div>
                          </div>
                        </SidebarMenuButton>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir conversa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza de que deseja excluir esta conversa? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteConversation(conversation.id)}
                                disabled={deletingId === conversation.id}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {deletingId === conversation.id ? 'Excluindo...' : 'Excluir'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-gray-200" />

      <SidebarFooter className="bg-gray-50 border-t border-gray-100">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={onOpenPreferences}
              className="hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-700"
            >
              <Settings className="w-4 h-4" />
              <span>Preferências</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-700">
              <Trophy className="w-4 h-4" />
              <span>Conquistas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut}
              className="hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-gray-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
