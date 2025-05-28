import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, ExternalLink, Search, Youtube } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";

interface ChatInterfaceProps {
  learningStyle: string;
  onXPGain: (points: number) => void;
}

const ChatInterface = ({ learningStyle, onXPGain }: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, currentConversation, sendMessage } = useConversations();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === "1"
          ? {
              ...msg,
              content: `Olá! Sou o TIAcher, seu professor de IA personalizado! 🎓\n\nVi que você prefere aprender através de **${learningStyle}**. Vou adaptar todas as minhas respostas para esse estilo!\n\nO que você gostaria de aprender hoje?`,
            }
          : msg
      )
    );
  }, [learningStyle]);

  const simulateAIResponse = (userMessage: string): Message => {
    // Simulação de resposta da IA baseada no estilo de aprendizagem
    let content = "";

    if (learningStyle === "Exercícios") {
      content = `Ótima pergunta sobre "${userMessage}"! Vou criar alguns exercícios para você praticar:\n\n**Exercício 1:** Complete a seguinte afirmação...\n**Exercício 2:** Resolva o problema...\n**Exercício 3:** Analise o caso...`;
    } else if (learningStyle === "Quizzes") {
      content = `Vamos testar seu conhecimento sobre "${userMessage}" com um quiz!\n\n**Pergunta 1:** Qual é a definição correta de...?\na) Opção A\nb) Opção B\nc) Opção C\n\n**Pergunta 2:** Como você aplicaria...?`;
    } else if (learningStyle === "Vídeos") {
      content = `Encontrei ótimos vídeos sobre "${userMessage}"! Aqui está um resumo dos conceitos principais que você verá nos vídeos recomendados...`;
    } else {
      content = `Vou explicar "${userMessage}" de forma detalhada:\n\n**Conceito Principal:**\nEste tópico envolve...\n\n**Pontos Importantes:**\n• Ponto 1\n• Ponto 2\n• Ponto 3\n\n**Aplicação Prática:**\nNa prática, isso significa...`;
    }

    return content;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessageContent = input;
    setInput("");
    setIsLoading(true);

    // Send user message
    await sendMessage(userMessageContent, "user");

    // Simulate AI response
    setTimeout(async () => {
      const aiResponse = simulateAIResponse(userMessageContent);
      await sendMessage(aiResponse, "ai");
      setIsLoading(false);
      onXPGain(10); // Ganhar XP por interação
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: any) => {
    return (
      <div
        key={message.id}
        className={`flex ${
          message.author === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <Card
          className={`max-w-[80%] p-4 ${
            message.author === "user"
              ? "bg-blue-50 border-blue-200"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-start space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.author === "user"
                  ? "bg-blue-500"
                  : "bg-gradient-to-r from-purple-500 to-blue-500"
              }`}
            >
              {message.author === "user" ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-sm">
                  {message.author === "user" ? "Você" : "TIAcher"}
                </span>
                <Badge variant="outline" className="text-xs">
                  {learningStyle}
                </Badge>
              </div>
              <div className="prose prose-sm max-w-none">
                {message.content
                  .split("\n")
                  .map((line: string, index: number) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {line}
                    </p>
                  ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {!currentConversation ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Bem-vindo ao TIAcher!
              </h3>
              <p className="text-gray-500 mb-4">
                Seu professor de IA personalizado para{" "}
                {learningStyle.toLowerCase()}
              </p>
              <p className="text-sm text-gray-400">
                Crie uma nova conversa ou selecione uma existente para começar
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="flex justify-start">
                <Card className="max-w-[80%] p-4 bg-white border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-sm">TIAcher</span>
                        <Badge variant="outline" className="text-xs">
                          {learningStyle}
                        </Badge>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p>
                          Olá! Sou o TIAcher, seu professor de IA personalizado!
                          🎓
                        </p>
                        <p>
                          Vi que você prefere aprender através de **
                          {learningStyle}**. Vou adaptar todas as minhas
                          respostas para esse estilo!
                        </p>
                        <p>O que você gostaria de aprender hoje?</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {messages.map(renderMessage)}

            {isLoading && (
              <div className="flex justify-start">
                <Card className="max-w-[80%] p-4 bg-white border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta aqui..."
            className="flex-1 min-h-[60px] resize-none border border-blue-600 bg-blue-400"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="self-end bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Pressione Enter para enviar, Shift+Enter para quebrar linha
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
