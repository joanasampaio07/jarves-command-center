import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Clock, 
  Tag, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriorityLevel, TaskStatus } from '../types/entities';
import { sounds } from '../lib/sound';

export const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete, setActiveQuickAction } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityLevel>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'completed' && task.status === 'completed') ||
      (statusFilter === 'pending' && task.status !== 'completed');

    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCount = tasks.filter(t => t.status !== 'completed').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
            <ListTodo className="w-8 h-8 text-cyan-400" />
            <span>GERENCIADOR DE TAREFAS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {pendingCount} pendentes • {completedCount} concluídas • {tasks.length} total
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveQuickAction('task');
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-rajdhani font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Tarefa</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-2xl bg-[#040918] border border-cyan-500/20">
        
        {/* Search */}
        <div className="sm:col-span-6 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar tarefas por título ou detalhes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Apenas Pendentes</option>
            <option value="completed">Concluídas</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="sm:col-span-3">
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="urgent">Urgente 🔥</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>

      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#040918] border border-dashed border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">Nenhuma tarefa encontrada.</p>
            <p className="text-xs text-slate-600 mt-1">Crie uma nova tarefa pelo botão acima ou falando com o JARVES.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-slate-950/40 border-slate-900 opacity-60'
                    : 'bg-[#050c20] border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(0,242,254,0.1)]'
                }`}
              >
                {/* Left checkbox and Title */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`mt-0.5 sm:mt-0 w-6 h-6 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
                      isDone
                        ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(0,242,254,0.4)]'
                        : 'border-slate-600 hover:border-cyan-400 bg-slate-900/80'
                    }`}
                  >
                    {isDone && <CheckSquare className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-sm font-bold truncate ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      {task.category && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                          {task.category}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{task.description}</p>
                    )}
                  </div>
                </div>

                {/* Right Badges & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-9 sm:pl-0">
                  
                  {/* Priority */}
                  {task.priority === 'urgent' && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 font-bold uppercase border border-red-500/30">
                      Urgente 🔥
                    </span>
                  )}
                  {task.priority === 'high' && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase border border-amber-500/30">
                      Alta
                    </span>
                  )}
                  {task.priority === 'medium' && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">
                      Média
                    </span>
                  )}
                  {task.priority === 'low' && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-medium">
                      Baixa
                    </span>
                  )}

                  {/* Due Date / Time */}
                  {task.due_date && (
                    <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {task.due_date} {task.due_time ? `@ ${task.due_time}` : ''}
                    </span>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
