import React from 'react';
import { Bell, Sparkles, Mic, MessageSquare, Zap, ShieldCheck } from 'lucide-react';

export const News: React.FC = () => {
  const updates = [
    {
      version: 'v4.2.0',
      date: 'Junho de 2026',
      title: 'WhatsApp Audio Intelligence & Transcrição Neural',
      desc: 'Agora você pode enviar notas de áudio no WhatsApp e o JARVES processa transcrição com diarização de falantes e sintetização de resposta ultrarrápida.',
      tags: ['WhatsApp', 'Áudio', 'Voz']
    },
    {
      version: 'v4.0.0',
      date: 'Maio de 2026',
      title: 'Novo Command Center Sci-Fi com Reator Reativo',
      desc: 'Interface totalmente redesenhada com 5 temas cyberpunk, painel de controle financeiro multi-carteiras e rastreador de hábitos com streaks visuais.',
      tags: ['Design', 'Command Center', 'Temas']
    },
    {
      version: 'v3.8.0',
      date: 'Abril de 2026',
      title: 'Sincronização Bidirecional Google Calendar',
      desc: 'Tarefas e compromissos marcados no JARVES agora aparecem instantaneamente na sua conta do Google Agenda.',
      tags: ['Integrações', 'Google']
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
          <Bell className="w-8 h-8 text-cyan-400" />
          <span>NOVIDADES & ATUALIZAÇÕES DO SISTEMA</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Acompanhe os novos recursos, melhorias de inteligência artificial e atualizações do JARVES
        </p>
      </div>

      {/* Changelog timeline */}
      <div className="space-y-6">
        {updates.map((up, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/20 hover:border-cyan-500/40 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                {up.version}
              </span>
              <span className="text-xs font-mono text-slate-500">{up.date}</span>
            </div>

            <h3 className="text-xl font-bold font-rajdhani text-white">{up.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{up.desc}</p>

            <div className="flex items-center gap-2 pt-2">
              {up.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
