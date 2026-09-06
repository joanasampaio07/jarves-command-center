import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Zap, DollarSign, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../lib/utils';

export const Analytics: React.FC = () => {
  const { tasks, habits, habitLogs, transactions, wallets } = useApp();

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const netSavings = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-cyan-400" />
          <span>MÉTRICAS & ANÁLISES DE DESEMPENHO</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Índices de produtividade pessoal, consistência de hábitos e saúde financeira
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-slate-400">Score de Produtividade</span>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-4xl font-bold font-rajdhani text-cyan-300">{taskCompletionRate}%</p>
          <p className="text-xs text-slate-400 mt-2 font-mono">{completedTasks} de {tasks.length} tarefas concluídas</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#040918] border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-slate-400">Maior Sequência de Hábitos</span>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-4xl font-bold font-rajdhani text-purple-300">
            {Math.max(...habits.map(h => h.current_streak), 0)} <span className="text-sm font-normal">dias</span>
          </p>
          <p className="text-xs text-slate-400 mt-2 font-mono">Consistência diária</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#040918] border border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-slate-400">Taxa de Poupança</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-4xl font-bold font-rajdhani text-emerald-300">
            {totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0}%
          </p>
          <p className="text-xs text-slate-400 mt-2 font-mono">Superávit: {formatCurrency(netSavings)}</p>
        </div>

      </div>

      {/* Breakdown Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-3xl bg-[#040918] border border-slate-800">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase mb-4">Distribuição de Tarefas por Categoria</h3>
          <div className="space-y-3">
            {['Estratégia', 'Reuniões', 'Finanças', 'Geral'].map((cat, i) => {
              const count = tasks.filter(t => t.category === cat).length;
              const pct = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{cat}</span>
                    <span className="text-cyan-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#040918] border border-slate-800">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase mb-4">Atividades Recentes do Sistema</h3>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-2">
            {tasks.slice(0, 5).map(t => (
              <div key={t.id} className="p-2.5 rounded-xl bg-slate-900/60 text-xs flex items-center justify-between">
                <span className="text-slate-200 truncate">{t.title}</span>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">{t.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
