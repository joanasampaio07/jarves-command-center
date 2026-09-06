import React, { useState } from 'react';
import { Zap, Plus, Flame, Award, Calendar, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../lib/sound';

export const Habits: React.FC = () => {
  const { habits, habitLogs, toggleHabitForToday, deleteHabit, setActiveQuickAction } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];

  // Get last 7 days for the streak matrix
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3).toUpperCase(),
      dayNum: d.getDate(),
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-purple-400" />
            <span>RASTREADOR DE HÁBITOS & ROTINAS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Construa disciplina com streaks diários, metas de consistência e inteligência de rotina
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveQuickAction('habit');
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-rajdhani font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Hábito</span>
        </button>
      </div>

      {/* Habits Matrix List */}
      <div className="space-y-4">
        {habits.map((habit) => {
          const isTodayCompleted = habitLogs.some(l => l.habit_id === habit.id && l.date === todayStr && l.completed);
          
          return (
            <div
              key={habit.id}
              className="p-6 rounded-3xl bg-[#040918] border border-purple-500/20 hover:border-purple-500/40 transition-all shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left: Info & Streak */}
                <div className="flex items-start gap-4 min-w-0">
                  <button
                    onClick={() => toggleHabitForToday(habit.id)}
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shrink-0 ${
                      isTodayCompleted
                        ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]'
                        : 'bg-slate-900/80 border-slate-700 hover:border-purple-400 text-slate-500'
                    }`}
                    title={isTodayCompleted ? 'Concluído hoje' : 'Marcar como feito hoje'}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-rajdhani text-xl font-bold text-white">{habit.title}</h3>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                        {habit.category}
                      </span>
                    </div>
                    {habit.description && (
                      <p className="text-xs text-slate-400 mt-1">{habit.description}</p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <span className="flex items-center gap-1 font-bold text-amber-400 font-mono">
                        <Flame className="w-4 h-4 fill-amber-400" />
                        Streak: {habit.current_streak} dias
                      </span>
                      <span className="text-slate-500 font-mono">
                        Recorde: {habit.longest_streak} dias
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Last 7 Days Mini-Heatmap */}
                <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
                  <div className="flex items-center gap-2 bg-[#02050f] p-2.5 rounded-2xl border border-slate-800">
                    {last7Days.map((day) => {
                      const done = habitLogs.some(l => l.habit_id === habit.id && l.date === day.dateStr && l.completed);
                      const isToday = day.dateStr === todayStr;

                      return (
                        <div key={day.dateStr} className="flex flex-col items-center gap-1">
                          <span className={`text-[9px] font-mono ${isToday ? 'text-purple-400 font-bold' : 'text-slate-500'}`}>
                            {day.dayName}
                          </span>
                          <div
                            onClick={() => {
                              if (isToday) toggleHabitForToday(habit.id);
                            }}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                              isToday ? 'cursor-pointer' : 'cursor-default'
                            } ${
                              done
                                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                                : 'bg-slate-900 text-slate-600 border border-slate-800'
                            }`}
                          >
                            {day.dayNum}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Excluir Hábito"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
