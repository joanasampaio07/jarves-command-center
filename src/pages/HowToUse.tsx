import React from 'react';
import { HelpCircle, Mic, MessageSquare, CheckSquare, DollarSign, Sparkles, Terminal } from 'lucide-react';

export const HowToUse: React.FC = () => {
  const voiceCommands = [
    { cmd: '"Jarves, o que tenho pra hoje?"', desc: 'Retorna um briefing instantâneo com suas tarefas e eventos da agenda.' },
    { cmd: '"Jarves, agendar reunião amanhã às 15h"', desc: 'Cria uma nova tarefa com data e horário programados.' },
    { cmd: '"Jarves, adicionar gasto de R$ 45 no Nubank"', desc: 'Registra automaticamente a despesa na carteira informada.' },
    { cmd: '"Jarves, marcar treino de hoje como concluído"', desc: 'Atualiza o streak do seu hábito diário com sucesso.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-cyan-400" />
          <span>COMO USAR O JARVES COMMAND CENTER</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Guia completo de comandos de voz, inteligência no WhatsApp e atalhos de produtividade
        </p>
      </div>

      {/* Voice Commands Cheatsheet */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/20">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Mic className="w-5 h-5 text-cyan-400" />
          <span>Comandos de Voz Recomendados</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {voiceCommands.map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#060e22] border border-cyan-500/30">
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold mb-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>{item.cmd}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Workflow Guide */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-emerald-500/20">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          <span>Como Funciona a IA no WhatsApp</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#060e22] border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-2">1</span>
            <h4 className="font-bold text-white mb-1">Envie Áudios ou Mensagens</h4>
            <p className="text-slate-400">Você pode falar naturalmente no WhatsApp como se estivesse conversando com um assistente humano.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#060e22] border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-2">2</span>
            <h4 className="font-bold text-white mb-1">Processamento em Tempo Real</h4>
            <p className="text-slate-400">O JARVES transcreve, categoriza os dados e atualiza o seu banco de dados em milissegundos.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#060e22] border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-2">3</span>
            <h4 className="font-bold text-white mb-1">Resumo & Notificações</h4>
            <p className="text-slate-400">Receba lembretes proativos e relatórios inteligentes no horário que você preferir.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
