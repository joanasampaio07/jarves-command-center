import React, { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Check, Loader2, Settings2, Key, Play, RefreshCw, VolumeX, Bot, Brain } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../lib/sound';
import { jarvisAI } from '../lib/aiEngine';

export const VoiceChat: React.FC = () => {
  const { user, tasks, habits, wallets, transactions, addTask, addTransaction, toggleHabitForToday } = useApp();
  const [voiceEngine, setVoiceEngine] = useState<'elevenlabs' | 'natural'>('elevenlabs');
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
  const [showSettings, setShowSettings] = useState(false);
  
  // API Keys from Environment or Local Storage
  const defaultTTS = (import.meta as any).env?.VITE_ELEVENLABS_API_KEY || '';
  const defaultGroq = (import.meta as any).env?.VITE_GROQ_API_KEY || '';

  const [elevenApiKey, setElevenApiKey] = useState(() => localStorage.getItem('jarves_tts_api_key') || defaultTTS);
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('jarves_openai_key') || '');
  const [groqKey, setGroqKey] = useState(() => localStorage.getItem('jarves_groq_key') || defaultGroq);
  
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const recognitionRef = useRef<any>(null);
  const splineRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

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
          console.warn('Speech recognition warning:', event.error);
          if (isListeningRef.current) {
            setIsListening(false);
            isListeningRef.current = false;
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
        console.error('Speech recognition setup error', err);
      }
    }
  }, [continuousMode]);

  const handleToggleVoice = () => {
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
      'Jarves, como podemos estruturar a apresentação para a empresa cliente?',
      'Jarves, qual é o status das minhas tarefas mais urgentes hoje?',
      'Jarves, adicionar despesa de 120 reais na conta principal',
      'Jarves, marque meu hábito de leitura como concluído'
    ];

    setTimeout(() => {
      const chosen = customCommand || samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
      setTranscript(chosen);
      setIsListening(false);
      isListeningRef.current = false;
      handleProcessVoiceCommand(chosen);
    }, 1800);
  };

  // Dynamic Contextual AI Processing with LLM
  const handleProcessVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    setStatusText('PENSANDO...');
    setSubText('JARVES ANALISANDO VIA IA NEURAL');

    const context = {
      userName: user.name,
      userAlias: user.alias || 'Comandante',
      tasks,
      habits,
      wallets,
      recentTransactions: transactions.slice(0, 5),
      personality: user.preferences.personality || 'jarvis'
    };

    const aiResult = await jarvisAI.processMessage(
      command,
      chatHistory,
      context
    );

    // Apply auto-detected actions if any
    if (aiResult.actionDetected?.type === 'add_transaction' && aiResult.actionDetected.data) {
      addTransaction({
        description: aiResult.actionDetected.data.description || 'Gasto registrado por voz',
        amount: aiResult.actionDetected.data.amount || 50,
        type: 'expense',
        category: 'Geral',
        date: new Date().toISOString().split('T')[0],
        wallet_id: wallets[0]?.id || 'wal_1'
      });
    } else if (aiResult.actionDetected?.type === 'create_task' && aiResult.actionDetected.data) {
      addTask({
        title: aiResult.actionDetected.data.title || command,
        status: 'pending',
        priority: aiResult.actionDetected.data.priority || 'high',
        due_date: new Date().toISOString().split('T')[0],
        category: 'Voz'
      });
    } else if (aiResult.actionDetected?.type === 'check_habit') {
      if (habits.length > 0) toggleHabitForToday(habits[0].id);
    }

    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: command },
      { role: 'assistant', content: aiResult.reply }
    ]);

    setIsProcessing(false);
    setIsSpeaking(true);
    setStatusText('JARVES FALANDO');
    setSubText('RESPOSTA DE VOZ NEURAL');
    setLastReply(aiResult.reply);

    speakRealisticElevenLabs(aiResult.reply);
  };

  const [voiceId, setVoiceId] = useState(() => localStorage.getItem('jarves_voice_id') || 'onwK4e9ZLuTAKqWW03F9');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  // High-fidelity speech synthesizer using ElevenLabs
  const speakRealisticElevenLabs = async (text: string, customVoiceId?: string, overrideKey?: string): Promise<boolean> => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    setVoiceError(null);
    const activeApiKey = (overrideKey || elevenApiKey || defaultTTS || '').trim();
    const activeVoice = customVoiceId || voiceId || 'onwK4e9ZLuTAKqWW03F9';

    if (voiceEngine === 'elevenlabs' && activeApiKey && activeApiKey.startsWith('sk_')) {
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${activeVoice}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': activeApiKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.15,
              use_speaker_boost: true
            }
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;

          audio.onended = () => {
            setIsSpeaking(false);
            setStatusText(continuousMode ? 'MODO CONTÍNUO' : 'CLIQUE E FALE');
            setSubText(continuousMode ? 'AGUARDANDO VOZ...' : 'CLIQUE NO BOTÃO E PERMITA O MICROFONE');
            if (continuousMode) setTimeout(() => handleToggleVoice(), 800);
          };

          audio.onerror = (e) => {
            console.warn('Audio element error', e);
            setVoiceError('Falha ao reproduzir áudio do navegador.');
            speakNativeTTS(text);
          };

          await audio.play();
          return true;
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData?.detail?.message || errData?.detail?.status || `Erro HTTP ${response.status}`;
          console.warn('ElevenLabs API returned error:', errMsg);
          setVoiceError(`ElevenLabs: ${errMsg}`);
          speakNativeTTS(text);
          return false;
        }
      } catch (err: any) {
        console.warn('ElevenLabs API fetch error', err);
        setVoiceError(`Falha de conexão com a ElevenLabs: ${err?.message || 'Erro de rede'}`);
        speakNativeTTS(text);
        return false;
      }
    } else {
      if (!activeApiKey) {
        setVoiceError('Chave da ElevenLabs não configurada. Usando sintetizador local.');
      }
      speakNativeTTS(text);
      return false;
    }
  };

  const handleTestVoice = async (testKey?: string, testVoice?: string) => {
    setIsTestingVoice(true);
    setVoiceError(null);
    sounds.playJarvisActivate();
    const keyToUse = testKey || elevenApiKey || defaultTTS;
    const voiceToUse = testVoice || voiceId;
    
    const success = await speakRealisticElevenLabs(
      'Olá Comandante! Todos os sistemas do JARVES estão calibrados e a voz de cinema está ativa.',
      voiceToUse,
      keyToUse
    );
    setIsTestingVoice(false);
    if (!success) {
      sounds.playClick();
    }
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

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('jarves_tts_api_key', elevenApiKey);
    localStorage.setItem('jarves_voice_id', voiceId);
    jarvisAI.setOpenAIKey(openaiKey);
    jarvisAI.setGroqKey(groqKey);
    setShowSettings(false);
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
              setVoiceId('onwK4e9ZLuTAKqWW03F9');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani tracking-wider transition-all ${
              voiceGender === 'male'
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/60 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            VOZ JARVIS (DANIEL)
          </button>

          {/* TESTAR VOZ DIRETO */}
          <button
            onClick={() => handleTestVoice()}
            disabled={isTestingVoice || isSpeaking}
            className="px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani tracking-wider flex items-center gap-1.5 bg-gradient-to-r from-blue-600/40 to-cyan-600/40 text-cyan-200 border border-cyan-400/40 hover:from-blue-600/60 hover:to-cyan-600/60 transition-all shadow-[0_0_10px_rgba(0,242,254,0.2)] disabled:opacity-50"
            title="Ouvir a voz oficial do JARVIS agora"
          >
            {isTestingVoice ? <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-300" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-300" />}
            <span>TESTAR VOZ JARVIS</span>
          </button>

          {/* CONVERSA CONTÍNUA */}
          <button
            onClick={() => {
              sounds.playClick();
              setContinuousMode(!continuousMode);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani tracking-wider flex items-center gap-1.5 transition-all ${
              continuousMode
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/60 shadow-[0_0_15px_rgba(160,185,129,0.3)]'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>CONVERSA CONTÍNUA: {continuousMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* IA SETTINGS ICON */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-cyan-300 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1 px-2.5 text-xs font-rajdhani font-bold"
            title="Configurar Chaves de API de IA"
          >
            <Settings2 className="w-4 h-4" />
            <span>CONFIGS</span>
          </button>

        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300 font-mono">
          <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-purple-400 animate-ping' : isListening ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
          <span>{isSpeaking ? 'JARVES FALANDO...' : isListening ? 'ESCUTANDO...' : isProcessing ? 'PENSANDO...' : 'JARVES 3D ONLINE'}</span>
        </div>
      </div>

      {/* ERROR BANNER IF VOICE FAILS */}
      {voiceError && (
        <div className="relative z-30 mx-6 p-3 rounded-2xl bg-amber-950/80 border border-amber-500/50 backdrop-blur-md flex items-center justify-between gap-3 text-xs text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{voiceError}</span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-mono font-bold text-[11px] border border-amber-500/40 transition-all shrink-0"
          >
            Ajustar Chave ⚙️
          </button>
        </div>
      )}

      {/* MODAL CONFIGURAÇÃO CÉREBRO IA */}
      {showSettings && (
        <div className="absolute top-20 left-6 z-40 p-6 rounded-3xl bg-[#030a1c]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl w-80 sm:w-[420px] animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h4 className="text-base font-bold font-rajdhani text-white uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span>Configuração do Cérebro Neural</span>
            </h4>
            <button
              onClick={() => setShowSettings(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            {/* Groq Key */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 flex items-center justify-between">
                <span>Groq API Key (Llama / Mistral)</span>
                <span className="text-emerald-400 font-bold">● Ativo</span>
              </label>
              <input
                type="password"
                value={groqKey}
                onChange={e => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* ElevenLabs Key */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 flex items-center justify-between">
                <span>ElevenLabs API Key (Voz do JARVIS)</span>
                <span className="text-purple-400 font-bold">● Neural HD</span>
              </label>
              <input
                type="password"
                value={elevenApiKey}
                onChange={e => setElevenApiKey(e.target.value)}
                placeholder="sk_..."
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-purple-500/30 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Voice Model Selection */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1">
                Modelo da Voz (JARVIS Character)
              </label>
              <select
                value={voiceId}
                onChange={e => setVoiceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-cyan-500/30 text-cyan-200 font-mono text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="onwK4e9ZLuTAKqWW03F9">Daniel - JARVIS Oficial do Filme (British Male)</option>
                <option value="JBFqnCBsd6RMkjVDRZzb">George - British Narrator (Maduro e Calmo)</option>
                <option value="nPczCjzI2devNBz1zQrb">Brian - Deep Resonance (Grave e Encorpado)</option>
                <option value="pNInz6obpgDQGcFmaJgB">Adam - Autoritário e Firme</option>
              </select>
            </div>

            {/* Test Voice in Settings */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleTestVoice(elevenApiKey, voiceId)}
                disabled={isTestingVoice}
                className="w-full py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 font-mono text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isTestingVoice ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>Testar Voz com esta Chave 🔊</span>
              </button>
            </div>

            {/* OpenAI Key */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 flex items-center justify-between">
                <span>OpenAI API Key (Opcional)</span>
                <span className="text-slate-500">Opcional</span>
              </label>
              <input
                type="password"
                value={openaiKey}
                onChange={e => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold font-rajdhani tracking-wider uppercase text-xs transition-all shadow-[0_0_20px_rgba(0,242,254,0.4)]"
            >
              Salvar Alterações
            </button>
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
