
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  author: "user" | "ai";
  timestamp: string | Date;
}

export const useConversations = (learningStyle: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch user's conversations
  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error: any) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Erro ao carregar conversas",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id)
        .order("timestamp", { ascending: true });

      if (error) throw error;
      
      // Type assertion to ensure compatibility
      const typedMessages = (data || []).map(msg => ({
        ...msg,
        author: msg.author as "user" | "ai"
      }));
      
      setMessages(typedMessages);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Erro ao carregar mensagens",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new conversation
  const createConversation = async (title?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          title: title || null,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchConversations();
      setCurrentConversation(data);
      
      // Add greeting message
      const greetingMessage: Message = {
        id: `greeting-${data.id}`,
        conversation_id: data.id,
        user_id: user.id,
        author: "ai",
        content: `Olá! Sou o TIAcher, seu professor de IA personalizado! 🎓\n\nVi que você prefere aprender através de **${learningStyle}**. Vou adaptar todas as minhas respostas para esse estilo!\n\nO que você gostaria de aprender hoje?`,
        timestamp: new Date(),
      };
      
      setMessages([greetingMessage]);

      return data;
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erro ao criar conversa",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Send a message
  const sendMessage = async (
    content: string,
    author: "user" | "ai",
    conversationId?: string
  ) => {
    if (!user) return null;

    let targetConversationId = conversationId || currentConversation?.id;

    // Create conversation if none exists
    if (!targetConversationId) {
      const newConversation = await createConversation();
      if (!newConversation) return null;
      targetConversationId = newConversation.id;
    }

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: targetConversationId,
          user_id: user.id,
          content,
          author,
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation title if it's the first message and no title exists
      if (
        author === "user" &&
        currentConversation &&
        !currentConversation.title
      ) {
        const shortTitle =
          content.length > 50 ? content.substring(0, 50) + "..." : content;
        await supabase
          .from("conversations")
          .update({ title: shortTitle })
          .eq("id", targetConversationId);

        setCurrentConversation((prev) =>
          prev ? { ...prev, title: shortTitle } : null
        );
      }

      // Type assertion to ensure compatibility
      const typedMessage = {
        ...data,
        author: data.author as "user" | "ai"
      };

      setMessages((prev) => [...prev, typedMessage]);
      await fetchConversations();

      return typedMessage;
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Select a conversation
  const selectConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    await fetchMessages(conversation.id);
  };

  // Delete a conversation
  const deleteConversation = async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId)
        .eq("user_id", user.id);

      if (error) throw error;

      await fetchConversations();

      // If we're deleting the current conversation, clear it
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      toast({
        title: "Conversa excluída",
        description: "A conversa foi removida com sucesso.",
      });
    } catch (error: any) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Erro ao excluir conversa",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  return {
    conversations,
    currentConversation,
    messages,
    setMessages,
    loading,
    fetchConversations,
    createConversation,
    sendMessage,
    selectConversation,
    deleteConversation,
  };
};
