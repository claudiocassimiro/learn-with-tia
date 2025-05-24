
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Play, HelpCircle, Shuffle } from 'lucide-react';

interface LearningPreferencesProps {
  currentStyle: string;
  onStyleChange: (style: string) => void;
  onClose: () => void;
}

const LearningPreferences = ({ currentStyle, onStyleChange, onClose }: LearningPreferencesProps) => {
  const [selectedStyle, setSelectedStyle] = useState(currentStyle);

  const learningStyles = [
    {
      id: 'Textos explicativos',
      name: 'Textos Explicativos',
      description: 'Aprender através de explicações detalhadas e teorias',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'Exercícios',
      name: 'Exercícios',
      description: 'Praticar com exercícios e problemas resolvidos',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      id: 'Quizzes',
      name: 'Quizzes',
      description: 'Testar conhecimento com perguntas e respostas',
      icon: <HelpCircle className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'Vídeos',
      name: 'Vídeos',
      description: 'Aprender com conteúdo visual e videoaulas',
      icon: <Play className="w-6 h-6" />,
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      id: 'Mistos',
      name: 'Conteúdo Misto',
      description: 'Combinar diferentes tipos de conteúdo',
      icon: <Shuffle className="w-6 h-6" />,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  ];

  const handleSave = () => {
    onStyleChange(selectedStyle);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span>Preferências de Aprendizagem</span>
          </CardTitle>
          <CardDescription>
            Escolha como você prefere aprender. O TIAcher vai adaptar todas as respostas ao seu estilo!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {learningStyles.map((style) => (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedStyle === style.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedStyle === style.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {style.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{style.name}</h3>
                        {selectedStyle === style.id && (
                          <Badge className="bg-blue-500 text-white">Selecionado</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {style.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Salvar Preferências
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPreferences;
