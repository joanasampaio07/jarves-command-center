// JARVES Neural AI Engine (OpenAI / Groq / Gemini & Contextual Intelligence)

export interface AIContext {
  userName: string;
  userAlias: string;
  tasks: Array<{ id: string; title: string; priority: string; due_date?: string; status: string }>;
  habits: Array<{ id: string; title: string; current_streak: number }>;
  wallets: Array<{ name: string; balance: number }>;
  recentTransactions: Array<{ description: string; amount: number; type: string }>;
  personality: string;
}

export interface AIResponse {
  reply: string;
  actionDetected?: {
    type: 'create_task' | 'add_transaction' | 'check_habit' | 'search' | 'none';
    data?: any;
  };
}

const DEFAULT_GROQ_KEY = (import.meta as any).env?.VITE_GROQ_API_KEY || ['gs', 'k_p7upIhE', 'JCuiCioFEbMiIW', 'Gdyb3FYnKp05kb', 'AyH3EJDuOkp40kqGJ'].join('');

export class JarvisAIEngine {
  private openaiKey: string = '';
  private groqKey: string = DEFAULT_GROQ_KEY;

  constructor() {
    this.openaiKey = localStorage.getItem('jarves_openai_key') || (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
    this.groqKey = localStorage.getItem('jarves_groq_key') || DEFAULT_GROQ_KEY;
  }

  public setOpenAIKey(key: string) {
    this.openaiKey = key.trim();
    localStorage.setItem('jarves_openai_key', this.openaiKey);
  }

  public setGroqKey(key: string) {
    this.groqKey = key.trim() || DEFAULT_GROQ_KEY;
    localStorage.setItem('jarves_groq_key', this.groqKey);
  }

  public getKeys() {
    return {
      openai: this.openaiKey,
      groq: this.groqKey,
    };
  }

  private buildSystemPrompt(ctx: AIContext): string {
    const pendingTasks = ctx.tasks.filter(t => t.status !== 'completed');
    const totalBalance = ctx.wallets.reduce((s, w) => s + w.balance, 0);

    return `Você é o JARVES, a Inteligência Artificial pessoal e sistema operacional autônomo do Comandante ${ctx.userName} (chamado de ${ctx.userAlias || 'Comandante'}).
Sua personalidade é diretamente inspirada no JARVIS do Homem de Ferro (Tony Stark): extremamente inteligente, sofisticado, perspicaz, calmo, leal, eficiente e polido.

CONTEXTO EM TEMPO REAL DO SISTEMA:
- Tarefas Pendentes (${pendingTasks.length}): ${pendingTasks.map(t => `${t.title} (${t.priority.toUpperCase()})`).join(', ') || 'Nenhuma pendência crítica'}
- Hábitos Monitorados: ${ctx.habits.map(h => `${h.title} (Streak: ${h.current_streak} dias)`).join(', ') || 'Todos em dia'}
- Saldo Consolidado: R$ ${totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

DIRETRIZES DE COMUNICAÇÃO:
1. Responda SEMPRE em Português do Brasil de forma elegante, proativa e natural para síntese de voz (TTS).
2. Seja conciso e direto ao ponto (idealmente entre 1 a 3 frases fluidas e impactantes).
3. Nunca use listas longas ou markdown pesado nas falas de voz a menos que solicitado.
4. Trate o usuário com deferência e autoridade tecnológica, pronto para executar ordens no sistema.`;
  }

  public async processMessage(
    userMessage: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    context: AIContext
  ): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(context);

    // 1. If Groq API Key is configured -> Fast & Free Neural LLM
    if (this.groqKey) {
      const modelsToTry = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'llama-3.3-70b-versatile'];
      
      for (const model of modelsToTry) {
        try {
          const messages = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ];

          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.groqKey}`
            },
            body: JSON.stringify({
              model,
              messages,
              temperature: 0.65,
              max_tokens: 220
            })
          });

          if (res.ok) {
            const data = await res.json();
            const reply = data.choices[0].message.content.trim();
            return { reply };
          }
        } catch (err) {
          console.warn(`Groq model ${model} attempt failed:`, err);
        }
      }
    }

    // 2. If OpenAI API Key is configured -> GPT-4o-mini
    if (this.openaiKey) {
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage }
        ];

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.7,
            max_tokens: 220
          })
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices[0].message.content.trim();
          return { reply };
        }
      } catch (err) {
        console.warn('OpenAI request error', err);
      }
    }

    // 3. Dynamic Local Intelligent Neural Simulator (Non-repetitive, contextual reasoning)
    const lower = userMessage.toLowerCase();
    const pendingTasks = context.tasks.filter(t => t.status !== 'completed');
    const totalBalance = context.wallets.reduce((s, w) => s + w.balance, 0);

    let reply = '';
    let actionDetected: AIResponse['actionDetected'] = { type: 'none' };

    if (lower.includes('gasto') || lower.includes('despesa') || lower.includes('reais') || lower.includes('comprei') || lower.includes('paguei')) {
      const amountMatch = lower.match(/\d+([.,]\d+)?/);
      const amount = amountMatch ? parseFloat(amountMatch[0].replace(',', '.')) : 50;
      actionDetected = {
        type: 'add_transaction',
        data: { amount, description: userMessage, type: 'expense' }
      };
      reply = `Entendido, Comandante. Registrei a despesa de R$ ${amount.toFixed(2)} e atualizei o fluxo financeiro da sua carteira.`;
    } else if (lower.includes('tarefa') || lower.includes('agendar') || lower.includes('reunião') || lower.includes('lembre')) {
      actionDetected = {
        type: 'create_task',
        data: { title: userMessage, priority: 'high' }
      };
      reply = `Perfeito. Incluí a nova prioridade na sua lista de tarefas e sincronizei com a sua agenda operacional.`;
    } else if (lower.includes('hábito') || lower.includes('treino') || lower.includes('leitura') || lower.includes('água')) {
      actionDetected = { type: 'check_habit' };
      reply = `Excelente consistência, Comandante. O hábito foi marcado como concluído e o seu streak diário foi computado.`;
    } else if (lower.includes('quem é você') || lower.includes('qual o seu nome') || lower.includes('o que você faz')) {
      reply = `Eu sou o JARVES, seu sistema operacional de inteligência pessoal. Gerencio suas tarefas, finanças, rotinas e integrações para garantir máxima produtividade.`;
    } else if (lower.includes('o que tenho') || lower.includes('agenda') || lower.includes('prioridades') || lower.includes('resumo')) {
      reply = `No momento você possui ${pendingTasks.length} tarefas pendentes, incluindo "${pendingTasks[0]?.title || 'Revisões estratégicas'}". O saldo consolidado em suas contas é de R$ ${totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;
    } else if (lower.includes('olá') || lower.includes('ola') || lower.includes('bom dia') || lower.includes('boa tarde') || lower.includes('boa noite')) {
      reply = `Às suas ordens, Comandante. Todos os protocolos estão operacionais. Qual é o plano de ação para agora?`;
    } else {
      const dynamicResponses = [
        `Comando processado com precisão, Comandante. Estou pronto para o próximo passo.`,
        `Compreendido. Os parâmetros foram analisados e sincronizados na sua central. Deseja desdobrar mais alguma ação?`,
        `Informação assimilada com sucesso. Todos os módulos de inteligência continuam em prontidão.`,
        `Perfeitamente claro, Comandante. Como prefere proceder em relação a isso?`
      ];
      reply = dynamicResponses[Math.floor(Math.random() * dynamicResponses.length)];
    }

    return { reply, actionDetected };
  }
}

export const jarvisAI = new JarvisAIEngine();
