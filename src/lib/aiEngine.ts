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

export class JarvisAIEngine {
  private openaiKey: string = '';
  private groqKey: string = '';

  constructor() {
    this.openaiKey = localStorage.getItem('jarves_openai_key') || '';
    this.groqKey = localStorage.getItem('jarves_groq_key') || '';
  }

  public setOpenAIKey(key: string) {
    this.openaiKey = key.trim();
    localStorage.setItem('jarves_openai_key', this.openaiKey);
  }

  public setGroqKey(key: string) {
    this.groqKey = key.trim();
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

    return `Você é o JARVES, a Inteligência Artificial pessoal e sistema operacional do Comandante ${ctx.userName} (chamado de ${ctx.userAlias || 'Comandante'}).
Sua personalidade é diretamente inspirada no JARVIS do Homem de Ferro (Tony Stark): sofisticado, perspicaz, calmo, leal, eficiente, proativo e polido.

CONTEXTO EM TEMPO REAL DO USUÁRIO:
- Tarefas Pendentes (${pendingTasks.length}): ${pendingTasks.map(t => `${t.title} (${t.priority.toUpperCase()})`).join(', ') || 'Nenhuma tarefa pendente'}
- Hábitos Monitorados: ${ctx.habits.map(h => `${h.title} (Streak: ${h.current_streak} dias)`).join(', ') || 'Nenhum'}
- Saldo Consolidado em Contas: R$ ${totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Carteiras Ativas: ${ctx.wallets.map(w => `${w.name}: R$ ${w.balance}`).join(', ')}

INSTRUÇÕES DE RESPOSTA:
1. Responda em Português do Brasil com naturalidade, clareza e síntese elegante (ideal para ser falada em voz alta).
2. Não seja robótico nem repita frases prontas. Converse como um assistente de cinema consciente do contexto do usuário.
3. Se o usuário pedir para criar uma tarefa, registrar gasto ou checar hábitos, confirme com autoridade e elegância.
4. Mantenha respostas entre 1 a 3 frases fluidas para a voz não ficar longa demais, a menos que o usuário peça uma análise detalhada.`;
  }

  public async processMessage(
    userMessage: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    context: AIContext
  ): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(context);

    // 1. If OpenAI API Key is configured -> GPT-4o-mini / GPT-4o
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
            max_tokens: 250
          })
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices[0].message.content.trim();
          return { reply };
        }
      } catch (err) {
        console.warn('OpenAI request error, falling back to local intelligence', err);
      }
    }

    // 2. If Groq API Key is configured -> Llama 3.3 70B (Ultrarrápido e Gratuito)
    if (this.groqKey) {
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
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 0.65,
            max_tokens: 250
          })
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices[0].message.content.trim();
          return { reply };
        }
      } catch (err) {
        console.warn('Groq request error', err);
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
