
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useConversations } from '@/hooks/useConversations';
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

interface ConversationsSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ConversationsSidebar = ({ isCollapsed, onToggleCollapse }: ConversationsSidebarProps) => {
  const { 
    conversations, 
    currentConversation, 
    createConversation, 
    selectConversation, 
    deleteConversation 
  } = useConversations();
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

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        <Button
          onClick={onToggleCollapse}
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleNewConversation}
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <div className="flex-1 flex flex-col items-center space-y-2 overflow-y-auto">
          {conversations.slice(0, 5).map((conversation) => (
            <Button
              key={conversation.id}
              onClick={() => selectConversation(conversation)}
              variant={currentConversation?.id === conversation.id ? "default" : "ghost"}
              size="sm"
              className="w-10 h-10 p-0"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Conversas</h2>
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={handleNewConversation}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Conversa
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma conversa ainda.</p>
              <p className="text-sm">Comece uma nova!</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                  currentConversation?.id === conversation.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => selectConversation(conversation)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-800 truncate">
                      {conversation.title || 'Nova conversa'}
                    </h3>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(conversation.updated_at)}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
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
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationsSidebar;
