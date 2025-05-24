
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, ExternalLink, Search, Youtube } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  sources?: string[];
  videoRecommendations?: string[];
  learningType?: string;
}

interface ChatInterfaceProps {
  learningStyle: string;
  onXPGain: (points: number) => void;
}

const ChatInterface = ({ learningStyle, onXPGain }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Olá! Sou o TIAcher, seu professor de IA personalizado! 🎓\n\nVi que você prefere aprender através de **${learningStyle}**. Vou adaptar todas as minhas respostas para esse estilo!\n\nO que você gostaria de aprender hoje?`,
      timestamp: new Date(),
      learningType: 'greeting'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): Message => {
    // Simulação de resposta da IA baseada no estilo de aprendizagem
    let content = '';
    let sources: string[] = [];
    let videoRecommendations: string[] = [];

    if (learningStyle === 'Exercícios') {
      content = `Ótima pergunta sobre "${userMessage}"! Vou criar alguns exercícios para você praticar:\n\n**Exercício 1:** Complete a seguinte afirmação...\n**Exercício 2:** Resolva o problema...\n**Exercício 3:** Analise o caso...`;
      sources = ['Fonte acadêmica 1', 'Livro didático referência'];
    } else if (learningStyle === 'Quizzes') {
      content = `Vamos testar seu conhecimento sobre "${userMessage}" com um quiz!\n\n**Pergunta 1:** Qual é a definição correta de...?\na) Opção A\nb) Opção B\nc) Opção C\n\n**Pergunta 2:** Como você aplicaria...?`;
      videoRecommendations = ['Vídeo explicativo no YouTube', 'Tutorial prático'];
    } else if (learningStyle === 'Vídeos') {
      content = `Encontrei ótimos vídeos sobre "${userMessage}"! Aqui está um resumo dos conceitos principais que você verá nos vídeos recomendados...`;
      videoRecommendations = ['Tutorial completo - YouTube', 'Explicação visual - Khan Academy'];
    } else {
      content = `Vou explicar "${userMessage}" de forma detalhada:\n\n**Conceito Principal:**\nEste tópico envolve...\n\n**Pontos Importantes:**\n• Ponto 1\n• Ponto 2\n• Ponto 3\n\n**Aplicação Prática:**\nNa prática, isso significa...`;
      sources = ['Pesquisa web realizada', 'Artigos científicos'];
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: new Date(),
      sources: sources.length > 0 ? sources : undefined,
      videoRecommendations: videoRecommendations.length > 0 ? videoRecommendations : undefined,
      learningType: learningStyle
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simular delay da IA
    setTimeout(() => {
      const aiResponse = simulateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      onXPGain(10); // Ganhar XP por interação
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] p-4 ${
              message.type === 'user' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-sm">
                      {message.type === 'user' ? 'Você' : 'TIAcher'}
                    </span>
                    {message.learningType && (
                      <Badge variant="outline" className="text-xs">
                        {message.learningType}
                      </Badge>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none">
                    {message.content.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                  
                  {message.sources && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
                        <Search className="w-3 h-3" />
                        <span>Fontes consultadas:</span>
                      </div>
                      {message.sources.map((source, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs text-blue-600">
                          <ExternalLink className="w-3 h-3" />
                          <span>{source}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {message.videoRecommendations && (
                    <div className="mt-3 p-2 bg-red-50 rounded-md">
                      <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
                        <Youtube className="w-3 h-3" />
                        <span>Vídeos recomendados:</span>
                      </div>
                      {message.videoRecommendations.map((video, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs text-red-600">
                          <ExternalLink className="w-3 h-3" />
                          <span>{video}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-4 bg-white border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </Card>
          </div>
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
            className="flex-1 min-h-[60px] resize-none"
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
