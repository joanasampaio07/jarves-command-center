import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckSquare, 
  Zap, 
  DollarSign, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  MessageSquare, 
  Mic, 
  TrendingUp, 
  Plus, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { JarvisOrb } from '../components/JarvisOrb';
import { PageName } from '../components/Layout';
import { formatCurrency, formatDate } from '../lib/utils';
import { sounds } from '../lib/sound';
import { getTimeGreeting } from '../lib/greeting';

interface CommandCenterProps {
  onNavigate: (page: PageName) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigate }) => {
  const { 
    user, 
    tasks, 
    habits, 
    habitLogs, 
    transactions, 
    wallets, 
    toggleTaskComplete, 
    toggleHabitForToday, 
    setIsVoiceListening,
    setActiveQuickAction,
    sendChatMessage
  } = useApp();
  const { themeConfig } = useTheme();
  const [quickInput, setQuickInput] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const todayTasks = tasks.filter(t => t.due_date === todayStr);
  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

  // Month financial summary
  const monthIncome = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const monthExpenses = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    sendChatMessage(quickInput);
    setQuickInput('');
    onNavigate('TextChat');
  };

  const timeGreeting = getTimeGreeting();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* 1. HERO HEADER: Greeting & AI Reactor Core */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#070e24] to-[#040816] border border-cyan-500/25 p-6 sm:p-10 shadow-[0_0_40px_rgba(0,242,254,0.1)] hud-corner">
        
        {/* Background decorative grid aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Intelligence Briefing */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>CENTRAL DE INTELIGÊNCIA // STATUS 100%</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-rajdhani text-white tracking-wide leading-tight">
              {timeGreeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{user.name}</span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              O seu sistema operacional está online. Você possui <strong className="text-cyan-300">{pendingTasks.length} tarefas pendentes</strong> e <strong className="text-emerald-300">{habits.length} hábitos monitorados</strong> para hoje.
            </p>

            {/* Natural Language Command Bar */}
            <form onSubmit={handleQuickSubmit} className="pt-2 max-w-lg">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={quickInput}
                  onChange={e => setQuickInput(e.target.value)}
                  placeholder="Ex: Jarves, o que tenho pra hoje? ou agendar reunião..."
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-black/60 border border-cyan-500/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                  title="Enviar ao JARVES"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveQuickAction('task');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-xs text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Tarefa</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveQuickAction('transaction');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-xs text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Gasto</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigate('Integrations');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-xs text-emerald-300 border border-emerald-500/30 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>WhatsApp Conectado</span>
              </button>
            </div>
          </div>

          {/* Right: Interactive Jarvis Reactor Orb */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <JarvisOrb onActivateVoice={() => setIsVoiceListening(true)} />
          </div>

        </div>
      </div>

      {/* 2. FOUR CORE HUD METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Tarefas */}
        <div 
          onClick={() => onNavigate('Tasks')}
          className="p-5 rounded-2xl bg-[#060c1d] border border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,242,254,0.15)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Tarefas Pendentes</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-rajdhani text-white">{pendingTasks.length}</span>
            <span className="text-xs text-cyan-400 font-mono">({todayTasks.length} para hoje)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-300">
            <span>Acessar Quadro</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Hábitos */}
        <div 
          onClick={() => onNavigate('Habits')}
          className="p-5 rounded-2xl bg-[#060c1d] border border-purple-500/20 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Hábitos Diários</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-rajdhani text-white">
              {habitLogs.filter(l => l.date === todayStr && l.completed).length} / {habits.length}
            </span>
            <span className="text-xs text-purple-400 font-mono">cumpridos</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 group-hover:text-purple-300">
            <span>Verificar Hábitos</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Saldo Consolidado */}
        <div 
          onClick={() => onNavigate('Finances')}
          className="p-5 rounded-2xl bg-[#060c1d] border border-emerald-500/20 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Patrimônio Líquido</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-rajdhani text-white">{formatCurrency(totalBalance)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-300">
            <span>{wallets.length} Carteiras ativas</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Assistente de WhatsApp */}
        <div 
          onClick={() => onNavigate('Integrations')}
          className="p-5 rounded-2xl bg-[#060c1d] border border-amber-500/20 hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">WhatsApp IA</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-rajdhani text-white">Online</span>
            <span className="text-xs text-emerald-400 font-mono">● 24/7 Ativo</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-300">
            <span>Configurar Comandos</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* 3. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Today's Tasks & Habits Tracker */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section A: Today's Tasks */}
          <div className="p-6 rounded-3xl bg-[#050b1a] border border-cyan-500/20">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cyan-400" />
                <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider">Fila de Tarefas</h3>
              </div>
              <button
                onClick={() => onNavigate('Tasks')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <span>Ver todas ({tasks.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {tasks.slice(0, 4).map((task) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isDone 
                        ? 'bg-white/[0.02] border-white/5 opacity-60' 
                        : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                          isDone 
                            ? 'bg-cyan-500 border-cyan-400 text-black' 
                            : 'border-slate-600 hover:border-cyan-400'
                        }`}
                      >
                        {isDone && <CheckSquare className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-400 truncate">{task.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {task.priority === 'urgent' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold uppercase">Urgente</span>
                      )}
                      {task.priority === 'high' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase">Alta</span>
                      )}
                      {task.due_time && (
                        <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.due_time}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Daily Habits Checklist */}
          <div className="p-6 rounded-3xl bg-[#050b1a] border border-purple-500/20">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider">Hábitos de Hoje</h3>
              </div>
              <button
                onClick={() => onNavigate('Habits')}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
              >
                <span>Painel de Streaks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {habits.map((habit) => {
                const isLogged = habitLogs.some(l => l.habit_id === habit.id && l.date === todayStr && l.completed);
                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabitForToday(habit.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isLogged
                        ? 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300">
                        {habit.category}
                      </span>
                      <span className="text-xs font-bold text-purple-400 font-mono">🔥 {habit.current_streak}d</span>
                    </div>
                    <p className={`text-xs font-bold ${isLogged ? 'text-purple-200' : 'text-slate-300'}`}>
                      {habit.title}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold">
                      <span className={`w-2 h-2 rounded-full ${isLogged ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span className={isLogged ? 'text-purple-300' : 'text-slate-500'}>
                        {isLogged ? 'Cumprido hoje' : 'Clique para marcar'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Financial Overview & Quick Chat */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Financial Cockpit */}
          <div className="p-6 rounded-3xl bg-[#050b1a] border border-emerald-500/20">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider">Balanço do Mês</h3>
              </div>
              <button
                onClick={() => onNavigate('Finances')}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                <span>Detalhes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">Receitas</span>
                  <p className="text-base font-bold font-rajdhani text-emerald-300">{formatCurrency(monthIncome)}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  +
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-red-950/30 border border-red-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-red-400 uppercase">Despesas</span>
                  <p className="text-base font-bold font-rajdhani text-red-300">{formatCurrency(monthExpenses)}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                  -
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">Superávit do Mês</span>
                  <p className="text-base font-bold font-rajdhani text-cyan-300">{formatCurrency(monthIncome - monthExpenses)}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  =
                </div>
              </div>
            </div>
          </div>

          {/* Quick Chat Shortcut Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/60 to-blue-950/40 border border-cyan-500/30 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-rajdhani text-lg font-bold text-white">Chat IA Jarvis</h4>
            </div>
            <p className="text-xs text-cyan-200/80 mb-4 leading-relaxed">
              Tire dúvidas, peça resumos, crie tarefas por voz ou organize seu dia com um clique.
            </p>
            <button
              onClick={() => onNavigate('TextChat')}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-rajdhani font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
            >
              <span>Abrir Conversa Completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
