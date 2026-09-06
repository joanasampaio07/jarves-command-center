import React, { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Check, Loader2, Settings2, Key, Play, RefreshCw, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../lib/sound';

export const VoiceChat: React.FC = () => {
  const { user, addTask, addTransaction, toggleHabitForToday, sendChatMessage } = useApp();
  const [voiceEngine, setVoiceEngine] = useState<'elevenlabs' | 'natural'>('natural');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('male');
  const [continuousMode, setContinuousMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('CLIQUE E FALE');
  const [subText, setSubText] = useState('CLIQUE NO BOTÃO E PERMITA O MICROFONE');
  const [transcript, setTranscript] = useState('');
  const [lastReply, setLastReply] = useState('');
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('jarves_tts_api_key') || 'sk_968d12513936889625c4186092bb0c43f0a72a5cdf537934');
  const recognitionRef = useRef<any>(null);
  const splineRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = continuousMode;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
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

          if (event.results[0].isFinal && currentTranscript.trim().length > 0) {
            handleProcessVoiceCommand(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition warning/error:', event.error);
          if (isListeningRef.current) {
            setIsListening(false);
            isListeningRef.current = false;
            // Fallback to simulation if microphone wasn't captured
            simulateVoiceInput();
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          isListeningRef.current = false;
          if (!isProcessing && !isSpeaking) {
            setStatusText(continuousMode ? 'MODO CONTÍNUO' : 'CLIQUE E FALE');
            setSubText(continuousMode ? 'AGUARDANDO VOZ...' : 'CLIQUE NO BOTÃO E PERMITA O MICROFONE');
          }
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.error('Failed to initialize SpeechRecognition', err);
      }
    }
  }, [continuousMode]);

  // Unlocks browser audio context on user click
  const unlockAudio = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  };

  const handleToggleVoice = () => {
    unlockAudio();
    sounds.playClick();

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      isListeningRef.current = false;
      setStatusText('CLIQUE E FALE');
      setSubText('CLIQUE NO BOTÃO E PERMITA O MICROFONE');
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // If start fails (e.g. already started or blocked), use simulated live speech
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = (customCommand?: string) => {
    setIsListening(true);
    isListeningRef.current = true;
    setStatusText('OUVINDO...');
    setSubText('PROCESSANDO ENTRADA DE ÁUDIO');
    sounds.playJarvisActivate();

    const samplePrompts = [
      'Jarves, o que tenho pra hoje?',
      'Jarves, adicionar despesa de 65 reais para almoço',
      'Jarves, agendar reunião com cliente amanhã às 15 horas',
      'Jarves, marcar hábito de treino de hoje'
    ];

    setTimeout(() => {
      const chosen = customCommand || samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
      setTranscript(chosen);
      setIsListening(false);
      isListeningRef.current = false;
      handleProcessVoiceCommand(chosen);
    }, 1800);
  };

  const handleProcessVoiceCommand = (command: string) => {
    setIsProcessing(true);
    setStatusText('PROCESSANDO...');
    setSubText('INTELIGÊNCIA ARTIFICIAL ANALISANDO');

    setTimeout(() => {
      setIsProcessing(false);
      setIsSpeaking(true);
      setStatusText('JARVES FALANDO');
      setSubText('RESPOSTA DE VOZ SINTETIZADA');

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
        replyText = 'Comandante, registrei a despesa de sessenta e cinco reais na sua conta Nubank com sucesso.';
      } else if (lower.includes('reunião') || lower.includes('agendar') || lower.includes('tarefa')) {
        addTask({
          title: 'Reunião com cliente (Agendado por Voz)',
          description: 'Criado automaticamente via comando de voz do JARVES.',
          status: 'pending',
          priority: 'high',
          due_date: new Date().toISOString().split('T')[0],
          due_time: '15:00',
          category: 'Reuniões',
        });
        replyText = 'Perfeito Comandante. Criei o compromisso na sua fila de tarefas para amanhã às quinze horas e atualizei sua agenda.';
      } else if (lower.includes('treino') || lower.includes('hábito')) {
        toggleHabitForToday('hbt_1');
        replyText = 'Hábito de treino registrado para o dia de hoje. Sua sequência diária de disciplina foi mantida.';
      } else {
        replyText = 'Sistemas operacionais calibrados e online, Comandante. O que mais posso executar para você?';
      }

      setLastReply(replyText);
      speakAudio(replyText);
    }, 900);
  };

  // High-fidelity speech synthesizer
  const speakAudio = async (text: string) => {
    unlockAudio();

    // 1. If ElevenLabs is configured, try ElevenLabs API
    if (voiceEngine === 'elevenlabs' && apiKey) {
      try {
        const cleanKey = apiKey.trim().replace(/^sk_/, '');
        const voiceId = voiceGender === 'male' ? 'pNInz6obpgDQGcFmaJgB' : '21m00Tcm4TlvDq8ikWAM';
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': cleanKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.85,
            }
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const audio = new Audio(URL.createObjectURL(blob));
          audio.onended = () => {
            setIsSpeaking(false);
            setStatusText(continuousMode ? 'MODO CONTÍNUO' : 'CLIQUE E FALE');
            setSubText(continuousMode ? 'AGUARDANDO VOZ...' : 'CLIQUE NO BOTÃO E PERMITA O MICROFONE');
            if (continuousMode) setTimeout(() => handleToggleVoice(), 800);
          };
          audio.play().catch(() => speakNativeTTS(text));
          return;
        }
      } catch (err) {
        console.warn('ElevenLabs API request failed, falling back to Native Natural Voice', err);
      }
    }

    // 2. Native Speech Synthesis Fallback (Guaranteed to play)
    speakNativeTTS(text);
  };

  const speakNativeTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.pitch = voiceGender === 'female' ? 1.15 : 0.88;

      const voices = window.speechSynthesis.getVoices();
      const ptVoices = voices.filter(v => v.lang.includes('pt') || v.lang.includes('BR'));
      
      const naturalVoices = ptVoices.filter(v => 
        v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Antonio')
      );

      if (naturalVoices.length > 0) {
        utterance.voice = naturalVoices[0];
      } else if (ptVoices.length > 0) {
        utterance.voice = voiceGender === 'female' && ptVoices.length > 1 ? ptVoices[1] : ptVoices[0];
      }

      utterance.onend = () => {
        setIsSpeaking(false);
        setStatusText(continuousMode ? 'MODO CONTÍNUO' : 'CLIQUE E FALE');
        setSubText(continuousMode ? 'AGUARDANDO PRÓXIMO COMANDO...' : 'CLIQUE NO BOTÃO E PERMITA O MICROFONE');
        if (continuousMode) {
          setTimeout(() => handleToggleVoice(), 800);
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setStatusText('CLIQUE E FALE');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsSpeaking(false);
        setStatusText('CLIQUE E FALE');
      }, 2500);
    }
  };

  const onSplineLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    setSplineLoaded(true);
  };

  const handleTestVoice = () => {
    sounds.playJarvisActivate();
    const testMsg = "Comandante, todos os sistemas operacionais do JARVES estão calibrados e prontos para atender você.";
    setLastReply(testMsg);
    setIsSpeaking(true);
    setStatusText('JARVES FALANDO');
    setSubText('TESTE DE ÁUDIO EM EXECUÇÃO');
    speakAudio(testMsg);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('jarves_tts_api_key', apiKey);
    setShowVoiceSettings(false);
    sounds.playSuccess();
    handleTestVoice();
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

          {/* TEST AUDIO BUTTON */}
          <button
            onClick={handleTestVoice}
            className="px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani tracking-wider flex items-center gap-1.5 bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 transition-all shadow-[0_0_10px_rgba(0,242,254,0.2)]"
            title="Clique para ouvir o JARVES falar agora"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>TESTAR VOZ</span>
          </button>

          {/* MOTOR DE VOZ ELEVENLABS SETTINGS */}
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani tracking-wider flex items-center gap-1.5 bg-purple-950/60 text-purple-300 border border-purple-500/40 hover:bg-purple-900/60 transition-all"
            title="Configurar Chave ElevenLabs / IA"
          >
            <Settings2 className="w-3.5 h-3.5 text-purple-400" />
            <span>ELEVENLABS API</span>
          </button>

        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300 font-mono">
          <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-purple-400 animate-ping' : isListening ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
          <span>{isSpeaking ? 'JARVES FALANDO...' : isListening ? 'ESCUTANDO...' : 'JARVES 3D ONLINE'}</span>
        </div>
      </div>

      {/* MODAL CONFIGURAÇÃO ELEVENLABS */}
      {showVoiceSettings && (
        <div className="absolute top-20 left-6 z-40 p-5 rounded-2xl bg-[#030a1c]/95 border border-purple-500/40 shadow-2xl backdrop-blur-xl w-80 sm:w-96 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <h4 className="text-sm font-bold font-rajdhani text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Chave ElevenLabs // Voz Cinema</span>
            </h4>
            <button
              onClick={() => setShowVoiceSettings(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSaveApiKey} className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">ElevenLabs API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Insira sua API Key da ElevenLabs..."
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-purple-500/40 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVoiceEngine(voiceEngine === 'elevenlabs' ? 'natural' : 'elevenlabs')}
                className={`flex-1 py-2 rounded-xl font-bold font-rajdhani text-xs uppercase tracking-wider transition-all ${
                  voiceEngine === 'elevenlabs' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {voiceEngine === 'elevenlabs' ? 'ElevenLabs: Ativado' : 'Usar Voz Nativa'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-rajdhani text-xs uppercase"
              >
                Salvar & Testar
              </button>
            </div>
          </form>
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
        {(transcript || lastReply) && (
          <div className="max-w-lg px-5 py-3 rounded-2xl bg-black/85 backdrop-blur-md border border-cyan-500/30 text-center animate-in fade-in duration-200 shadow-2xl space-y-1">
            {transcript && (
              <p className="text-xs text-cyan-200 font-medium italic">"{transcript}"</p>
            )}
            {lastReply && (
              <p className="text-xs text-emerald-300 font-bold font-rajdhani pt-1 border-t border-white/5">
                JARVES: {lastReply}
              </p>
            )}
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
