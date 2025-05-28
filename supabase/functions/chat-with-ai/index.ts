
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, learningStyle } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não está configurada');
    }

    // Adaptar o prompt baseado no estilo de aprendizagem
    let systemPrompt = `Você é o TIAcher, um professor de IA personalizado e amigável que adapta suas respostas ao estilo de aprendizagem preferido do aluno.

Estilo de aprendizagem atual: ${learningStyle}

Diretrizes específicas por estilo:
- "Textos explicativos": Forneça explicações detalhadas, claras e bem estruturadas com exemplos práticos
- "Exercícios": Crie exercícios práticos, problemas para resolver e atividades hands-on
- "Quizzes": Faça perguntas, crie testes de múltipla escolha e avaliações interativas
- "Vídeos": Descreva conceitos de forma visual, sugira recursos visuais e explique como se fosse um roteiro de vídeo

Sempre mantenha um tom amigável, encorajador e educativo. Use emojis quando apropriado e formate suas respostas em markdown.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
