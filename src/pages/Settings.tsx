import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Download, 
  Key, 
  Zap, 
  Volume2, 
  Check, 
  LogOut, 
  Sparkles, 
  Cpu, 
  CreditCard, 
  Radio, 
  AlertCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../lib/sound';
import { jarvisAI } from '../lib/aiEngine';

export const Settings: React.FC = () => {
  const { user, updateUserPreferences, setUserPlan, quotaInfo, tasks, habits, transactions, wallets } = useApp();
  const { user: authUser, logout } = useAuth();

  const [name, setName] = useState(user.name);
  const [alias, setAlias] = useState(user.alias || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // BYOK (Bring Your Own Key) States
  const [keyUsageMode, setKeyUsageMode] = useState<'system_default' | 'byok'>(() => {
    return (localStorage.getItem('jarves_key_mode') as any) || 'system_default';
  });

  const [elevenKey, setElevenKey] = useState(() => localStorage.getItem('jarves_tts_api_key') || '');
  const [groqKey, setGroqKey] = useState(() => localStorage.getItem('jarves_groq_key') || '');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('jarves_gemini_key') || '');
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('jarves_openai_key') || '');

  const [keysSaved, setKeysSaved] = useState(false);
  const [testingAudio, setTestingAudio] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    user.name = name;
    user.alias = alias;
    updateUserPreferences({});
    setProfileSaved(true);
    sounds.playSuccess();
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('jarves_key_mode', keyUsageMode);
    
    if (elevenKey.trim()) {
      localStorage.setItem('jarves_tts_api_key', elevenKey.trim());
    } else {
      localStorage.removeItem('jarves_tts_api_key');
    }

    if (groqKey.trim()) {
      jarvisAI.setGroqKey(groqKey.trim());
    }
    
    if (geminiKey.trim()) {
      localStorage.setItem('jarves_gemini_key', geminiKey.trim());
    }

    if (openaiKey.trim()) {
      jarvisAI.setOpenAIKey(openaiKey.trim());
    }

    setKeysSaved(true);
    sounds.playSuccess();
    setTimeout(() => setKeysSaved(false), 3000);
  };

  const handleTestElevenLabs = async () => {
    const keyToUse = elevenKey.trim() || localStorage.getItem('jarves_tts_api_key') || 'sk_0db4bf3a189c2745b186a2464108519137e709c5e045a1f9';
    setTestingAudio(true);
    sounds.playDataBeep();

    try {
      // Fala com voz neural do Jarvis
      const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': keyToUse
        },
        body: JSON.stringify({
          text: 'Sistemas de voz neural ElevenLabs calibrados com perfeição, Comandante.',
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.85
          }
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
      } else {
        // Fallback Web Speech Synthesis
        const utterance = new SpeechSynthesisUtterance('Sistemas de voz neural do JARVES operacionais.');
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      const utterance = new SpeechSynthesisUtterance('Sistemas de voz neural do JARVES operacionais.');
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    } finally {
      setTestingAudio(false);
    }
  };

  const handleExportData = () => {
    sounds.playDataBeep();
    const fullData = {
      user,
      tasks,
      habits,
      transactions,
      wallets,
      exported_at: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarves_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-cyan-400" />
            <span>CONFIGURAÇÕES & MONETIZAÇÃO</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de perfis, cotas diárias de IA, chaves de API (BYOK) e planos de assinatura
          </p>
        </div>

        {/* Auth Session Status & Logout */}
        <div className="flex items-center gap-3 bg-[#040918] border border-cyan-500/20 px-4 py-2.5 rounded-2xl">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-200">{authUser?.email || user.email}</p>
            <p className="text-[10px] text-cyan-400 font-mono uppercase">
              Via {authUser?.provider || 'Google'} • Plano {user.plan?.toUpperCase() || 'PRO'}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
            title="Sair da Conta / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Daily Quota / Token Usage Monitor (SaaS Monetization) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#07132e] to-[#040817] border border-cyan-500/30 relative overflow-hidden shadow-[0_0_30px_rgba(0,242,254,0.1)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>COTA DIÁRIA DE TOKENS & INTELIGÊNCIA ARTIFICIAL</span>
            </div>
            <h3 className="text-xl font-bold font-rajdhani text-white">
              {quotaInfo.isUnlimited 
                ? 'PLANO SUPER ADMIN MASTER (M&S CONSULTORIA): ACESSO ILIMITADO ∞'
                : `Consumo do Plano ${user.plan?.toUpperCase() || 'PRO'}: ${quotaInfo.usedToday} / ${quotaInfo.limit} comandos hoje`}
            </h3>
            <p className="text-xs text-slate-300">
              {quotaInfo.isUnlimited 
                ? 'Como Super Administrador e Proprietário, sua conta possui acesso total e irrestrito a todos os modelos de IA, sem cotas diárias ou bloqueios.'
                : 'Controle automático para garantir estabilidade do servidor e proteção contra custos descontrolados. A cota é zerada diariamente à meia-noite.'}
            </p>

            {/* Quota Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  quotaInfo.isUnlimited 
                    ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 w-full' 
                    : quotaInfo.percentage > 85 ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                style={{ width: quotaInfo.isUnlimited ? '100%' : `${Math.min(100, Math.max(5, quotaInfo.percentage))}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{quotaInfo.isUnlimited ? 'Comandos: Ilimitados (∞)' : `${quotaInfo.remaining} comandos restantes hoje`}</span>
              <span>{quotaInfo.isUnlimited ? 'Status: 100% Liberado' : `${quotaInfo.percentage}% utilizado`}</span>
            </div>
          </div>

          {/* Upgrade Plan Buttons */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            <button
              onClick={() => setUserPlan('free')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                user.plan === 'free' 
                  ? 'bg-slate-800 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.2)]' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <p className="text-xs font-bold text-white font-rajdhani">FREE</p>
              <p className="text-[10px] text-slate-400">50 req/dia</p>
              <p className="text-[11px] text-cyan-400 font-bold mt-1">R$ 0</p>
            </button>

            <button
              onClick={() => setUserPlan('pro')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                user.plan === 'pro' 
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.3)]' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <p className="text-xs font-bold text-cyan-300 font-rajdhani">PRO ⭐</p>
              <p className="text-[10px] text-slate-400">200 req/dia</p>
              <p className="text-[11px] text-cyan-400 font-bold mt-1">R$ 29/mês</p>
            </button>

            <button
              onClick={() => setUserPlan('ultra')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                user.plan === 'ultra' 
                  ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <p className="text-xs font-bold text-purple-300 font-rajdhani">ULTRA 🚀</p>
              <p className="text-[10px] text-slate-400">1000 req/dia</p>
              <p className="text-[11px] text-purple-400 font-bold mt-1">R$ 59/mês</p>
            </button>
          </div>
        </div>
      </div>

      {/* BYOK & API Keys Section */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <span>Chaves de API & Voz Neural (ElevenLabs / Groq / Gemini / OpenAI)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure as chaves da sua plataforma ou permita que o usuário utilize suas próprias chaves (BYOK).
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setKeyUsageMode('system_default')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                keyUsageMode === 'system_default'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chaves do Sistema (Com Cota)
            </button>
            <button
              type="button"
              onClick={() => setKeyUsageMode('byok')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                keyUsageMode === 'byok'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BYOK (Chaves Próprias)
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveKeys} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* ElevenLabs API Key */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-cyan-300 font-bold flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span>ElevenLabs API Key (Voz Neural 3D)</span>
                </label>
                <button
                  type="button"
                  onClick={handleTestElevenLabs}
                  disabled={testingAudio}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono flex items-center gap-1 hover:bg-cyan-900 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>{testingAudio ? 'Testando...' : 'Testar Voz'}</span>
                </button>
              </div>
              <input
                type="password"
                value={elevenKey}
                onChange={e => setElevenKey(e.target.value)}
                placeholder="sk_0db4bf3a... (ou deixe vazio para voz padrão)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[10px] text-slate-500">
                Alimenta a voz hiper-realista do Robô 3D e respostas audíveis do JARVES.
              </p>
            </div>

            {/* Groq API Key */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <label className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Groq API Key (Llama 3.3 70B - Ultra Rápido)</span>
              </label>
              <input
                type="password"
                value={groqKey}
                onChange={e => setGroqKey(e.target.value)}
                placeholder="gsk_p7upIhE... (Ultra rápido e gratuito)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
              />
              <p className="text-[10px] text-slate-500">
                Modelo Llama 3.3 70B com latência de resposta inferior a 300ms.
              </p>
            </div>

            {/* Google Gemini API Key */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <label className="text-xs font-mono uppercase text-blue-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Google Gemini API Key (Gemini 2.0 Flash)</span>
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                placeholder="AIzaSy... (Chave do Google AI Studio)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-400"
              />
              <p className="text-[10px] text-slate-500">
                Raciocínio avançado e análise multimodal de contexto.
              </p>
            </div>

            {/* OpenAI API Key */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <label className="text-xs font-mono uppercase text-emerald-300 font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>OpenAI API Key (GPT-4o-mini)</span>
              </label>
              <input
                type="password"
                value={openaiKey}
                onChange={e => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-... (Opcional)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
              />
              <p className="text-[10px] text-slate-500">
                Integração nativa com os modelos da OpenAI.
              </p>
            </div>

          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-rajdhani font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center gap-2"
            >
              {keysSaved ? <Check className="w-4 h-4" /> : <Key className="w-4 h-4" />}
              <span>{keysSaved ? 'Chaves Salvas e Ativadas!' : 'Salvar Chaves de IA'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Profile Settings */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/20">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          <span>Perfil do Comandante</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Seu Nome</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Como a IA deve te chamar (Alias)</label>
              <input
                type="text"
                value={alias}
                onChange={e => setAlias(e.target.value)}
                placeholder="Ex: Chefe, Comandante, Stark"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-rajdhani font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center gap-2"
          >
            {profileSaved ? <Check className="w-4 h-4" /> : null}
            <span>{profileSaved ? 'Perfil Atualizado!' : 'Salvar Alterações'}</span>
          </button>
        </form>
      </div>

      {/* Backup & Export Data */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-slate-800">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" />
          <span>Exportação & Backup dos Dados</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Baixe uma cópia completa de suas tarefas, hábitos, finanças e configurações em formato JSON.
        </p>

        <button
          onClick={handleExportData}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Backup (JSON)</span>
        </button>
      </div>

    </div>
  );
};
