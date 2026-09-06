import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { sounds } from '../lib/sound';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandProcessed?: (command: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, onCommandProcessed }) => {
  const { sendChatMessage, addTask, addTransaction } = useApp();
  const { themeConfig } = useTheme();
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'listening' | 'processing' | 'done'>('listening');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTranscript('');
      setStatus('listening');
      setFeedback('');
      return;
    }

    sounds.playJarvisActivate();
    setStatus('listening');

    // Simulate Voice Listening & Command Recognition
    const sampleCommands = [
      'Jarves, agendar reunião de produto amanhã às 10h',
      'Jarves, adicionar despesa de 150 reais no Nubank para almoço',
      'Jarves, marcar hábito de leitura como concluído hoje',
      'Jarves, quais são as minhas tarefas mais urgentes de hoje?'
    ];
    
    // Pick random suggestion or wait for speech
    const timer = setTimeout(() => {
      const chosen = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
      setTranscript(chosen);
      setStatus('processing');

      setTimeout(() => {
        setStatus('done');
        sounds.playSuccess();

        if (chosen.includes('despesa') || chosen.includes('reais')) {
          setFeedback('Despesa de R$ 150,00 registrada com sucesso na carteira Nubank.');
        } else if (chosen.includes('agendar') || chosen.includes('reunião')) {
          setFeedback('Nova tarefa "Reunião de Produto" criada para amanhã às 10:00.');
        } else if (chosen.includes('hábito') || chosen.includes('leitura')) {
          setFeedback('Hábito de leitura registrado para hoje! Streak aumentado.');
        } else {
          setFeedback('Comando interpretado com sucesso e adicionado ao fluxo de atividades.');
        }

        if (onCommandProcessed) onCommandProcessed(chosen);
      }, 1200);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#040918] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.25)] text-center overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Voice Icon Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full bg-cyan-500/20 animate-ping opacity-50" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.6)]">
              <Mic className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Status Heading */}
        <h3 className="text-2xl font-bold font-rajdhani tracking-wider text-white mb-2 uppercase">
          {status === 'listening' && 'JARVES está Ouvindo...'}
          {status === 'processing' && 'Processando Comando de Voz...'}
          {status === 'done' && 'Comando Executado!'}
        </h3>

        <p className="text-xs text-cyan-300/80 mb-6 font-mono">
          Fale comandos como: "Criar tarefa", "Registrar gasto", "Ver tarefas de hoje"
        </p>

        {/* Sound Wave Visualizer */}
        <div className="flex items-center justify-center gap-1.5 h-12 mb-6 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
          {[20, 45, 80, 100, 65, 90, 30, 70, 95, 40, 85, 60, 30].map((height, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-blue-400 transition-all duration-150 animate-pulse"
              style={{
                height: status === 'listening' ? `${Math.random() * 32 + 8}px` : '6px',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        {/* Transcript Box */}
        {transcript && (
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-left mb-6">
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 block mb-1">Transcrição:</span>
            <p className="text-sm font-medium text-slate-200 italic">"{transcript}"</p>
          </div>
        )}

        {/* Feedback / Result Box */}
        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-left mb-6 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-300">Ação de IA Concluída:</span>
              <p className="text-xs text-emerald-100 mt-0.5">{feedback}</p>
            </div>
          </div>
        )}

        {/* Actions buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Fechar
          </button>
          {status === 'done' && (
            <button
              onClick={() => {
                sendChatMessage(transcript);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all"
            >
              <span>Ver no Chat IA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
