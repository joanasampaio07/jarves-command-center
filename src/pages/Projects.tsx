import React, { useState } from 'react';
import { FolderKanban, Plus, Calendar, DollarSign, CheckCircle, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../lib/utils';
import { sounds } from '../lib/sound';

export const Projects: React.FC = () => {
  const { projects, tasks, deleteProject, setActiveQuickAction } = useApp();

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-cyan-400" />
            <span>GESTÃO DE PROJETOS E METAS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Planejamento estratégico, acompanhamento de orçamento e progresso em tempo real
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveQuickAction('project');
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-rajdhani font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const linkedTasks = tasks.filter(t => t.project_id === proj.id);
          const doneTasks = linkedTasks.filter(t => t.status === 'completed');

          return (
            <div
              key={proj.id}
              className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    {proj.category || 'Geral'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      Status: <span className="text-emerald-400 uppercase">{proj.status}</span>
                    </span>
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      title="Excluir Projeto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold font-rajdhani text-white mb-2">{proj.title}</h3>
                {proj.description && (
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{proj.description}</p>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Progresso Geral</span>
                    <span className="text-cyan-400 font-bold">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Metrics */}
              <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-xs font-mono">
                {proj.budget ? (
                  <div>
                    <span className="text-slate-500 block">Orçamento / Gasto:</span>
                    <span className="text-slate-200 font-bold">
                      {formatCurrency(proj.spent || 0)} / {formatCurrency(proj.budget)}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-slate-500 block">Orçamento:</span>
                    <span className="text-slate-400">Não estipulado</span>
                  </div>
                )}

                {proj.deadline && (
                  <div className="text-right">
                    <span className="text-slate-500 block">Prazo Final:</span>
                    <span className="text-cyan-400 font-bold flex items-center justify-end gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {proj.deadline}
                    </span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
