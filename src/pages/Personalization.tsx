import React from 'react';
import { Palette, Bot, Sparkles, Volume2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme, THEMES } from '../context/ThemeContext';
import { AssistantPersonality, AppTheme } from '../types/entities';
import { sounds } from '../lib/sound';

export const Personalization: React.FC = () => {
  const { user, updateUserPreferences } = useApp();
  const { theme, setTheme } = useTheme();

  const personalities: { id: AssistantPersonality; name: string; desc: string; icon: string }[] = [
    { id: 'jarvis', name: 'JARVES (Tony Stark AI)', desc: 'Sofisticado, perspicaz, altamente eficiente e proativo.', icon: '⚡' },
    { id: 'formal', name: 'Executivo Formal', desc: 'Comunicação executiva rigorosa, foco em números e brevidade.', icon: '👔' },
    { id: 'direct', name: 'Ultra Direto & Objetivo', desc: 'Respostas sem rodeios, respostas em tópicos e ações imediatas.', icon: '🎯' },
    { id: 'friendly', name: 'Amigável & Empático', desc: 'Tom encorajador, atencioso aos hábitos e bem-estar.', icon: '🤝' },
    { id: 'coach', name: 'Coach de Alta Performance', desc: 'Exigente, focado em quebrar recordes e manter a disciplina.', icon: '🔥' },
  ];

  const handleSelectPersonality = (p: AssistantPersonality) => {
    updateUserPreferences({ personality: p });
    sounds.playJarvisActivate();
  };

  const handleSelectTheme = (t: AppTheme) => {
    setTheme(t);
    updateUserPreferences({ marvis_theme: t });
    sounds.playSuccess();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
          <Palette className="w-8 h-8 text-cyan-400" />
          <span>PERSONALIZAÇÃO VISUAL & PERSONALIDADE DA IA</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ajuste o comportamento do assistente, velocidade da voz e o tema sci-fi da interface
        </p>
      </div>

      {/* 1. Theme Picker */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/20">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Temas Sci-Fi & Cyberpunk</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(THEMES) as AppTheme[]).map((themeKey) => {
            const config = THEMES[themeKey];
            const isSelected = theme === themeKey;

            return (
              <div
                key={themeKey}
                onClick={() => handleSelectTheme(themeKey)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.3)]'
                    : 'bg-[#060e22] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full shadow-lg"
                    style={{ backgroundColor: config.primaryColor, boxShadow: `0 0 12px ${config.glowColor}` }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{config.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400">ID: {config.id}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Personality Selector */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/20">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <span>Personalidade & Tom de Voz da IA</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {personalities.map((item) => {
            const isSelected = user.preferences.personality === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectPersonality(item.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.25)]'
                    : 'bg-[#060e22] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
