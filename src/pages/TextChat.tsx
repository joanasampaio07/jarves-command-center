import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Trash2, Bot, User as UserIcon, Mic, Brain, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../lib/sound';
import { jarvisAI } from '../lib/aiEngine';

export const TextChat: React.FC = () => {
  const { user, tasks, habits, wallets, transactions, chatMessages, clearChat, setIsVoiceListening, addTask, addTransaction, toggleHabitForToday } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(chatMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    sounds.playClick();

    const newHistory = [
      ...messages,
      { id: Date.now().toString(), role: 'user' as const, content: userMsg, timestamp: new Date().toISOString() }
    ];
    setMessages(newHistory);
    setIsTyping(true);

    const context = {
      userName: user.name,
      userAlias: user.alias || 'Comandante',
      tasks,
      habits,
      wallets,
      recentTransactions: transactions.slice(0, 5),
      personality: user.preferences.personality || 'jarvis'
    };

    const aiResult = await jarvisAI.processMessage(
      userMsg,
      newHistory.map(m => ({ role: m.role, content: m.content })),
      context
    );

    // Apply auto-detected actions
    if (aiResult.actionDetected?.type === 'add_transaction' && aiResult.actionDetected.data) {
      addTransaction({
        description: aiResult.actionDetected.data.description || userMsg,
        amount: aiResult.actionDetected.data.amount || 50,
        type: 'expense',
        category: 'Geral',
        date: new Date().toISOString().split('T')[0],
        wallet_id: wallets[0]?.id || 'wal_1'
      });
    } else if (aiResult.actionDetected?.type === 'create_task' && aiResult.actionDetected.data) {
      addTask({
        title: aiResult.actionDetected.data.title || userMsg,
        status: 'pending',
        priority: 'high',
        due_date: new Date().toISOString().split('T')[0],
        category: 'Geral'
      });
    } else if (aiResult.actionDetected?.type === 'check_habit') {
      if (habits.length > 0) toggleHabitForToday(habits[0].id);
    }

    setIsTyping(false);
    sounds.playJarvisActivate();

    setMessages(prev => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: aiResult.reply,
        timestamp: new Date().toISOString(),
        actions_suggested: [
          { label: '📊 Resumo do Dia', action: 'summary' },
          { label: '✅ Tarefas Pendentes', action: 'tasks' },
          { label: '💰 Balanço Financeiro', action: 'finances' }
        ]
      }
    ]);
  };

  const quickPrompts = [
    'Jarves, o que tenho pra hoje?',
    'Jarves, marque o treino de hoje como concluído',
    'Jarves, como podemos fechar uma proposta comercial para uma grande empresa?',
    'Jarves, quanto já gastamos este mês nas contas?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-3xl bg-[#040817] border border-cyan-500/20 overflow-hidden shadow-2xl animate-in fade-in duration-300">
      
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#030612]/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.4)]">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#030612]" />
          </div>
          <div>
            <h2 className="font-rajdhani text-xl font-bold text-white tracking-wider flex items-center gap-2">
              <span>JARVES AI CORE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">LLM NEURAL</span>
            </h2>
            <p className="text-xs text-slate-400">Inteligência contextual com conhecimento em tempo real</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playJarvisActivate();
              setIsVoiceListening(true);
            }}
            className="p-2 rounded-xl bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 transition-colors"
            title="Falar por voz"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              clearChat();
              setMessages([]);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
            title="Limpar histórico"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isUser ? 'bg-cyan-600 text-white' : 'bg-[#0b152d] border border-cyan-500/40 text-cyan-400'
              }`}>
                {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                isUser 
                  ? 'bg-cyan-600/90 text-white rounded-tr-none shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                  : 'bg-[#060e22] text-slate-200 border border-cyan-500/20 rounded-tl-none shadow-md'
              }`}>
                <div className="whitespace-pre-wrap font-sans text-sm">{msg.content}</div>

                {msg.actions_suggested && msg.actions_suggested.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                    {msg.actions_suggested.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInput(act.label);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] mt-1.5 font-mono ${isUser ? 'text-cyan-200/70 text-right' : 'text-slate-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0b152d] border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#060e22] border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>JARVES processando resposta...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-6 py-2 border-t border-white/5 bg-[#030612]/50 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0">Sugestões:</span>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => setInput(p)}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 text-xs shrink-0 transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-[#030612]/90 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Converse sobre qualquer assunto ou dê ordens ao JARVES..."
          className="flex-1 px-4 py-3 rounded-2xl bg-black/60 border border-cyan-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
        />
        <button
          type="submit"
          className="p-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all"
          title="Enviar"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

    </div>
  );
};
