import React, { useState } from 'react';
import { X, CheckSquare, DollarSign, Zap, FolderPlus, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriorityLevel, TransactionType, RecurrenceType } from '../types/entities';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'task' | 'transaction' | 'habit' | 'project' | null;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose, defaultTab = 'task' }) => {
  const { addTask, addTransaction, addHabit, addProject, wallets } = useApp();
  const [activeTab, setActiveTab] = useState<'task' | 'transaction' | 'habit' | 'project'>(defaultTab || 'task');

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('medium');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskDueTime, setTaskDueTime] = useState('');
  const [taskCategory, setTaskCategory] = useState('Geral');

  // Transaction form
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [txCategory, setTxCategory] = useState('Alimentação');
  const [txWalletId, setTxWalletId] = useState(wallets[0]?.id || '');

  // Habit form
  const [habitTitle, setHabitTitle] = useState('');
  const [habitDesc, setHabitDesc] = useState('');
  const [habitTimeOfDay, setHabitTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('anytime');
  const [habitCategory, setHabitCategory] = useState('Saúde');
  const [habitColor, setHabitColor] = useState('#00f2fe');

  // Project form
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projBudget, setProjBudget] = useState('');
  const [projDeadline, setProjDeadline] = useState('');
  const [projCategory, setProjCategory] = useState('Inovação');

  if (!isOpen) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle,
      description: taskDesc,
      status: 'pending',
      priority: taskPriority,
      due_date: taskDueDate,
      due_time: taskDueTime || undefined,
      category: taskCategory,
      tags: [taskCategory],
    });
    setTaskTitle('');
    setTaskDesc('');
    onClose();
  };

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDesc.trim() || !txAmount) return;
    addTransaction({
      description: txDesc,
      amount: parseFloat(txAmount),
      type: txType,
      category: txCategory,
      date: new Date().toISOString().split('T')[0],
      wallet_id: txWalletId || wallets[0]?.id,
    });
    setTxDesc('');
    setTxAmount('');
    onClose();
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;
    addHabit({
      title: habitTitle,
      description: habitDesc,
      frequency: 'daily',
      time_of_day: habitTimeOfDay,
      category: habitCategory,
      color: habitColor,
    });
    setHabitTitle('');
    setHabitDesc('');
    onClose();
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;
    addProject({
      title: projTitle,
      description: projDesc,
      status: 'in_progress',
      color: '#00f2fe',
      budget: projBudget ? parseFloat(projBudget) : undefined,
      spent: 0,
      progress: 0,
      deadline: projDeadline || undefined,
      category: projCategory,
    });
    setProjTitle('');
    setProjDesc('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl p-6 rounded-3xl bg-[#060c1d] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.2)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold font-rajdhani tracking-wider text-white uppercase flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" />
            <span>Central de Criação Rápida</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-4 gap-2 my-4">
          <button
            onClick={() => setActiveTab('task')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'task'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tarefa</span>
          </button>
          <button
            onClick={() => setActiveTab('transaction')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'transaction'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Finanças</span>
          </button>
          <button
            onClick={() => setActiveTab('habit')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'habit'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Hábito</span>
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'project'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Projeto</span>
          </button>
        </div>

        {/* Tab 1: Tarefa Form */}
        {activeTab === 'task' && (
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Título da Tarefa</label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                placeholder="Ex: Alinhar escopo de automação com o time..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Descrição (opcional)</label>
              <textarea
                rows={2}
                value={taskDesc}
                onChange={e => setTaskDesc(e.target.value)}
                placeholder="Detalhes ou checklist da tarefa..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Prioridade</label>
                <select
                  value={taskPriority}
                  onChange={e => setTaskPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente 🔥</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Data de Entrega</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={e => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Horário (opcional)</label>
                <input
                  type="time"
                  value={taskDueTime}
                  onChange={e => setTaskDueTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-rajdhani tracking-wider uppercase shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
            >
              Criar Tarefa
            </button>
          </form>
        )}

        {/* Tab 2: Finanças Form */}
        {activeTab === 'transaction' && (
          <form onSubmit={handleCreateTx} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTxType('expense')}
                className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  txType === 'expense' ? 'bg-red-500/20 text-red-300 border border-red-500/50' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Despesa (-)
              </button>
              <button
                type="button"
                onClick={() => setTxType('income')}
                className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  txType === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Receita (+)
              </button>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Descrição</label>
              <input
                type="text"
                required
                value={txDesc}
                onChange={e => setTxDesc(e.target.value)}
                placeholder="Ex: Assinatura Servidor, Almoço executivo..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={txAmount}
                  onChange={e => setTxAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Conta / Carteira</label>
                <select
                  value={txWalletId}
                  onChange={e => setTxWalletId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                >
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-rajdhani tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
            >
              Registrar Transação
            </button>
          </form>
        )}

        {/* Tab 3: Hábito Form */}
        {activeTab === 'habit' && (
          <form onSubmit={handleCreateHabit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Nome do Hábito</label>
              <input
                type="text"
                required
                value={habitTitle}
                onChange={e => setHabitTitle(e.target.value)}
                placeholder="Ex: Meditação 15min, Leitura, Tomar Vitaminas..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Horário Preferido</label>
                <select
                  value={habitTimeOfDay}
                  onChange={e => setHabitTimeOfDay(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="morning">Manhã ☀️</option>
                  <option value="afternoon">Tarde 🌤️</option>
                  <option value="evening">Noite 🌙</option>
                  <option value="anytime">Qualquer Momento ⚡</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Categoria</label>
                <input
                  type="text"
                  value={habitCategory}
                  onChange={e => setHabitCategory(e.target.value)}
                  placeholder="Ex: Saúde, Mente, Foco"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-rajdhani tracking-wider uppercase shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
            >
              Criar Hábito
            </button>
          </form>
        )}

        {/* Tab 4: Projeto Form */}
        {activeTab === 'project' && (
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Título do Projeto</label>
              <input
                type="text"
                required
                value={projTitle}
                onChange={e => setProjTitle(e.target.value)}
                placeholder="Ex: Reestruturação Comercial, App IA..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Orçamento Previsto (R$)</label>
                <input
                  type="number"
                  value={projBudget}
                  onChange={e => setProjBudget(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Prazo Final</label>
                <input
                  type="date"
                  value={projDeadline}
                  onChange={e => setProjDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold font-rajdhani tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
            >
              Iniciar Projeto
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
