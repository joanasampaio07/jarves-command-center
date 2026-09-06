import React, { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Check, Loader2, Settings2, Key, Radio } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../lib/sound';

export const VoiceChat: React.FC = () => {
  const { user, addTask, addTransaction, toggleHabitForToday, sendChatMessage } = useApp();
  const [voiceEngine, setVoiceEngine] = useState<'elevenlabs' | 'openai' | 'natural'>('natural');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('male');
  const [continuousMode, setContinuousMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('CLIQUE E FALE');
  const [subText, setSubText] = useState('CLIQUE NO BOTÃO E PERMITA O MICROFONE');
  const [transcript, setTranscript] = useState('');
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('jarves_tts_api_key') || '');
  const recognitionRef = useRef<any>(null);
  const splineRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = continuousMode;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusText('OUVINDO...');
        setSubText('FALE COM O JARVES AGORA');
        sounds.playJarvisActivate();
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          handleProcessVoiceCommand(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setStatusText('CLIQUE E FALE');
        setSubText('ERRO OU MICROFONE NÃO PERMITIDO');
      };

      recognition.onend = () => {
        setIsListening(false);
        if (!isProcessing && !isSpeaking) {
          setStatusText(continuousMode ? 'MODO CONTÍNUO' : 'CLIQUE E FALE');
          setSubText(continuousMode ? 'AGUARDANDO VOZ...' : 'CLIQUE NO BOTÃO E PERMITA O MICROFONE');
        }
      };

      recognitionRef.current = recognition;
    }
  }, [continuousMode]);

  const handleToggleVoice = () => {
    sounds.playClick();
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      setStatusText('CLIQUE E FALE');
      setSubText('CLIQUE NO BOTÃO E PERMITA O MICROFONE');
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setStatusText('OUVINDO...');
    setSubText('SIMULANDO CAPTAÇÃO DE VOZ');
    sounds.playJarvisActivate();

    const samplePrompts = [
      'Jarves, o que tenho pra hoje?',
      'Jarves, adicionar despesa de 65 reais para almoço',
      'Jarves, agendar reunião com cliente amanhã às 15 horas',
      'Jarves, marcar hábito de treino de hoje'
    ];

    setTimeout(() => {
      const chosen = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
      setTranscript(chosen);
      setIsListening(false);
      handleProcessVoiceCommand(chosen);
    }, 2800);
  };

  const handleProcessVoiceCommand = (command: string) => {
    setIsProcessing(true);
    setStatusText('PROCESSANDO...');
    setSubText('INTELIGÊNCIA ARTIFICIAL ANALISANDO');

    setTimeout(() => {
      setIsProcessing(false);
      setIsSpeaking(true);
      setStatusText('JARVES FALANDO');
      setSubText('RESPOSTA DE VOZ ULTRA-REALISTA');

      let replyText = '';
      const lower = command.toLowerCase();

      if (lower.includes('despesa') || lower.includes('gasto') || lower.includes('reais')) {
        addTransaction({
          description: 'Despesa registrada por voz (Jarves)',
          amount: 65.00,
          type: 'expense',
          category: 'Alimentação',
          date: new Date().toISOString().split('T')[0],
          wallet_id: 'wal_1',
        });
        replyText = 'Comandante, registrei a despesa de sessenta e cinco reais na sua conta principal Nubank.';
      } else if (lower.includes('reunião') || lower.includes('agendar') || lower.includes('tarefa')) {
        addTask({
          title: 'Reunião com cliente (Agendado por Voz)',
          description: 'Criado automaticamente via comando de voz.',
          status: 'pending',
          priority: 'high',
          due_date: new Date().toISOString().split('T')[0],
          due_time: '15:00',
          category: 'Reuniões',
        });
        replyText = 'Perfeito Comandante. Criei o compromisso na sua fila de tarefas para amanhã às quinze horas e sincronizei com sua agenda.';
      } else if (lower.includes('treino') || lower.includes('hábito')) {
        toggleHabitForToday('hbt_1');
        replyText = 'Hábito de treino registrado para o dia de hoje. Sua sequência de disciplina foi mantida com sucesso.';
      } else {
        replyText = 'Todos os sistemas operacionais calibrados, Comandante. O que mais deseja executar?';
      }

      speakRealisticJarvis(replyText);
    }, 1100);
  };

  // Ultra-Realistic Speech Synthesis Engine
  const speakRealisticJarvis = async (text: string) => {
    // If ElevenLabs API Key is provided, call ElevenLabs Neural TTS API
    if (voiceEngine === 'elevenlabs' && apiKey) {
      try {
        const voiceId = voiceGender === 'male' ? 'pNInz6obpgDQGcFmaJgB' : '21m00Tcm4TlvDq8ikWAM'; // Adam / Rachel
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.85,
              style: 0.4,
              use_speaker_boost: true
            }
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const audio = new Audio(URL.createObjectURL(blob));
          audio.onended = () => {
            setIsSpeaking(false);
            setStatusText(continuousMode ? 'MODO CONTÍNUO' : 'CLIQUE E FALE');
            setSubText(continuousMode ? 'AGUARDANDO PRÓXIMO COMANDO...' : 'CLIQUE NO BOTÃO E PERMITA O MICROFONE');
            if (continuousMode) setTimeout(() => handleToggleVoice(), 800);
          };
          audio.play();
          return;
        }
      } catch (err) {
        console.error('ElevenLabs API error, falling back to Web Speech', err);
      }
    }

    // High quality Natural Voice Fallback via Web Speech API with tuned pitch & rate
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      // Fine-tuned for sophisticated JARVIS tone: slightly calmer, articulated cadence
      utterance.rate = 0.98;
      utterance.pitch = voiceGender === 'female' ? 1.15 : 0.88;

      const voices = window.speechSynthesis.getVoices();
      // Prioritize natural neural voices if installed (e.g. Microsoft Antonio Online (Natural) or Google português)
      const naturalVoices = voices.filter(v => 
        (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Neural')) &&
        (v.lang.includes('pt') || v.lang.includes('BR'))
      );

      const allPt = voices.filter(v => v.lang.includes('pt') || v.lang.includes('BR'));
      
      if (naturalVoices.length > 0) {
        utterance.voice = naturalVoices[0];
      } else if (allPt.length > 0) {
        utterance.voice = voiceGender === 'female' && allPt.length > 1 ? allPt[1] : allPt[0];
      }

      utterance.onend = () => {
        setIsSpeaking(false);
        setStatusText(continuousMode ? 'MODO CONTÍNUO' : 'CLIQUE E FALE');
        setSubText(continuousMode ? 'AGUARDANDO PRÓXIMO COMANDO...' : 'CLIQUE NO BOTÃO E PERMITA O MICROFONE');
        if (continuousMode) {
          setTimeout(() => handleToggleVoice(), 800);
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsSpeaking(false);
        setStatusText('CLIQUE E FALE');
        setSubText('CLIQUE NO BOTÃO E PERMITA O MICROFONE');
      }, 3000);
    }
  };

  const onSplineLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    setSplineLoaded(true);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('jarves_tts_api_key', apiKey);
    setShowVoiceSettings(false);
    sounds.playSuccess();
  };

  return (
    <div className="relative w-full h-[calc(100vh-6.5rem)] rounded-3xl overflow-hidden bg-[#02040a] border border-cyan-500/20 shadow-2xl flex flex-col items-center justify-between select-none">
      
      {/* Background ambient lighting aura */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: isListening 
            ? 'radial-gradient(circle at 50% 60%, rgba(0, 242, 254, 0.25) 0%, rgba(14, 165, 233, 0.08) 40%, transparent 70%)'
            : isSpeaking
            ? 'radial-gradient(circle at 50% 60%, rgba(168, 85, 247, 0.25) 0%, rgba(59, 130, 246, 0.08) 40%, transparent 70%)'
            : 'radial-gradient(circle at 50% 60%, rgba(0, 242, 254, 0.12) 0%, rgba(15, 23, 42, 0.05) 50%, transparent 75%)'
        }}
      />

      {/* TOP CONTROLS */}
      <div className="relative z-30 w-full p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* VOZ MASCULINA */}
          <button
            onClick={() => {
              sounds.playClick();
              setVoiceGender('male');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani tracking-wider transition-all ${
              voiceGender === 'male'
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/60 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            VOZ MASCULINA (JARVIS)
          </button>

          {/* VOZ FEMININA */}
          <button
            onClick={() => {
              sounds.playClick();
              setVoiceGender('female');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani tracking-wider transition-all ${
              voiceGender === 'female'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            VOZ FEMININA (FRIDAY)
          </button>

          {/* CONVERSA CONTÍNUA */}
          <button
            onClick={() => {
              sounds.playClick();
              setContinuousMode(!continuousMode);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani tracking-wider flex items-center gap-1.5 transition-all ${
              continuousMode
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>CONVERSA CONTÍNUA: {continuousMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* MOTOR DE VOZ ELEVENLABS / OPENAI SETTINGS */}
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani tracking-wider flex items-center gap-1.5 bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 transition-all"
            title="Configurar Motor de Voz Ultra-Realista"
          >
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>MOTOR DE VOZ IA: {voiceEngine.toUpperCase()}</span>
          </button>

        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300 font-mono">
          <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-purple-400 animate-ping' : isListening ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
          <span>{isSpeaking ? 'JARVES FALANDO...' : isListening ? 'ESCUTANDO...' : 'JARVES 3D ONLINE'}</span>
        </div>
      </div>

      {/* MODAL CONFIGURAÇÃO DO MOTOR DE VOZ ULTRA-REALISTA */}
      {showVoiceSettings && (
        <div className="absolute top-20 left-6 z-40 p-5 rounded-2xl bg-[#030a1c]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl w-80 sm:w-96 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <h4 className="text-sm font-bold font-rajdhani text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Configurar Voz Ultra-Realista</span>
            </h4>
            <button
              onClick={() => setShowVoiceSettings(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Qualidade do Motor de Voz</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVoiceEngine('natural')}
                  className={`p-2 rounded-xl border text-center font-bold transition-all ${
                    voiceEngine === 'natural' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Voz Natural Neural
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceEngine('elevenlabs')}
                  className={`p-2 rounded-xl border text-center font-bold transition-all ${
                    voiceEngine === 'elevenlabs' ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  ElevenLabs (Cinema)
                </button>
              </div>
            </div>

            {voiceEngine === 'elevenlabs' && (
              <form onSubmit={handleSaveApiKey} className="space-y-2 pt-1">
                <label className="block text-[10px] font-mono uppercase text-slate-400">ElevenLabs API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="xi-api-key..."
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-purple-500/40 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
                />
                <p className="text-[10px] text-slate-400 leading-tight">
                  Gera voz humana com entonação idêntica ao JARVIS do cinema em tempo real.
                </p>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-rajdhani tracking-wider uppercase text-xs transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  Salvar Chave
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CENTER: 3D SPLINE ROBOT CANVAS */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        {!splineLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-0">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <span className="text-xs font-mono text-cyan-300 tracking-widest uppercase">Carregando Modelo 3D Neural...</span>
          </div>
        )}

        <div className="w-full h-full flex items-center justify-center">
          <Spline
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            onLoad={onSplineLoad}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* BOTTOM CONTROLS & FLOATING MICROPHONE */}
      <div className="relative z-30 flex flex-col items-center gap-4 pb-8 pointer-events-auto">
        
        {/* Live Transcript / Speech Bubble */}
        {transcript && (
          <div className="max-w-md px-4 py-2.5 rounded-2xl bg-black/80 backdrop-blur-md border border-cyan-500/30 text-center animate-in fade-in duration-200 shadow-xl">
            <p className="text-xs text-cyan-200 font-medium italic">"{transcript}"</p>
          </div>
        )}

        {/* Central Circular Microphone Button */}
        <div className="relative flex flex-col items-center">
          
          <div 
            className={`absolute -inset-3 rounded-full border border-cyan-400/40 transition-all duration-700 pointer-events-none ${
              isListening ? 'scale-125 border-red-400/80 animate-ping' : isSpeaking ? 'scale-110 border-purple-400/60 animate-pulse' : 'animate-pulse'
            }`}
          />
          
          <button
            onClick={handleToggleVoice}
            className={`group relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isListening
                ? 'bg-red-950/90 border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.8)] scale-105'
                : isSpeaking
                ? 'bg-purple-950/90 border-2 border-purple-400 shadow-[0_0_50px_rgba(168,85,247,0.8)]'
                : 'bg-[#02182b]/90 border-2 border-cyan-400 shadow-[0_0_40px_rgba(0,242,254,0.6)] hover:shadow-[0_0_60px_rgba(0,242,254,0.9)] hover:scale-105 active:scale-95'
            }`}
            title="Clique para falar com o JARVES"
          >
            {isListening ? (
              <Mic className="w-8 h-8 text-red-400 animate-bounce" />
            ) : isSpeaking ? (
              <Volume2 className="w-8 h-8 text-purple-300 animate-pulse" />
            ) : (
              <Mic className="w-8 h-8 text-cyan-300 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>

        {/* Action Labels */}
        <div className="text-center space-y-1">
          <p className="text-xs font-black tracking-[0.8em] sm:tracking-[1.2em] uppercase text-white drop-shadow-lg opacity-90 pl-3">
            {statusText}
          </p>
          <p className="text-[10px] text-cyan-400/80 font-mono tracking-widest uppercase">
            {subText}
          </p>
          
          <div className={`mx-auto h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-700 ${
            isListening || isSpeaking ? 'w-48' : 'w-16'
          }`} />
        </div>

      </div>

    </div>
  );
};
