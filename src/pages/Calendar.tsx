import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, CheckSquare, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../lib/sound';

export const Calendar: React.FC = () => {
  const { tasks, user, setActiveQuickAction } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    sounds.playClick();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    sounds.playClick();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-cyan-400" />
            <span>CALENDÁRIO INTELIGENTE</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualização consolidada de compromissos, tarefas com prazo e eventos sincronizados
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user.preferences.google_calendar_connected && (
            <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Calendar Sincronizado</span>
            </span>
          )}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveQuickAction('task');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-rajdhani font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Evento</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/20">
        
        {/* Navigation Month Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <h2 className="text-2xl font-bold font-rajdhani text-white uppercase tracking-wider">
            {monthNames[month]} <span className="text-cyan-400">{year}</span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white"
            >
              Hoje
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 mt-4 text-center">
          {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((d, i) => (
            <div key={i} className="text-[11px] font-mono font-bold text-slate-500 uppercase py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Month Days Grid */}
        <div className="grid grid-cols-7 gap-2 mt-1">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[90px] rounded-2xl bg-white/[0.01] border border-transparent" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const dayTasks = tasks.filter(t => t.due_date === dateStr);

            return (
              <div
                key={dayNum}
                className={`min-h-[90px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                  isToday
                    ? 'bg-cyan-950/30 border-cyan-500/60 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isToday ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {dayNum}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  )}
                </div>

                {/* Day Tasks preview */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] truncate font-medium border border-cyan-500/30"
                      title={t.title}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <span className="text-[9px] text-slate-500 font-mono">+{dayTasks.length - 2} mais</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
