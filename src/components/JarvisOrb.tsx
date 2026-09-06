import React, { useState, useEffect } from 'react';
import { Mic, Sparkles, Activity } from 'lucide-react';
import { sounds } from '../lib/sound';
import { useTheme } from '../context/ThemeContext';

interface JarvisOrbProps {
  onActivateVoice?: () => void;
  isListening?: boolean;
}

export const JarvisOrb: React.FC<JarvisOrbProps> = ({ onActivateVoice, isListening = false }) => {
  const { themeConfig } = useTheme();
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    sounds.playJarvisActivate();
    if (onActivateVoice) onActivateVoice();
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-6">
      {/* Outer ambient glow */}
      <div 
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-30 transition-all duration-700 pointer-events-none"
        style={{
          background: isListening 
            ? 'radial-gradient(circle, #ef4444 0%, #ec4899 50%, transparent 70%)'
            : `radial-gradient(circle, ${themeConfig.primaryColor} 0%, #3b82f6 50%, transparent 70%)`
        }}
      />

      {/* Main Interactive Reactor Sphere Container */}
      <div 
        onClick={handleClick}
        className="group relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center cursor-pointer transition-transform duration-300 active:scale-95"
        title="Clique para falar com o JARVES"
      >
        {/* Ring 1: Outer dashed orbital */}
        <div 
          className="absolute inset-0 rounded-full border border-dashed animate-spin-slow"
          style={{ borderColor: isListening ? '#ef4444' : themeConfig.primaryColor, opacity: 0.4 }}
        />

        {/* Ring 2: Counter-rotating segmented ring */}
        <div 
          className="absolute inset-3 rounded-full border-2 border-t-transparent border-b-transparent animate-spin-reverse-slow"
          style={{ borderColor: isListening ? 'rgba(239, 68, 68, 0.7)' : themeConfig.glowColor }}
        />

        {/* Ring 3: Tech HUD brackets ring */}
        <div 
          className="absolute inset-6 rounded-full border border-dotted"
          style={{ borderColor: isListening ? '#ef4444' : themeConfig.primaryColor, opacity: 0.6 }}
        />

        {/* Core Glowing Sphere */}
        <div 
          className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl backdrop-blur-md ${
            isListening ? 'bg-red-950/80 border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.8)]' : 'bg-[#040e22]/90 border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(0,242,254,0.5)] group-hover:shadow-[0_0_60px_rgba(0,242,254,0.8)] group-hover:border-cyan-300'
          }`}
        >
          {/* Internal Energy Waves */}
          <div className="absolute inset-1 rounded-full overflow-hidden flex items-center justify-center opacity-80">
            <div 
              className="w-full h-full rounded-full animate-pulse-glow"
              style={{
                background: isListening 
                  ? 'radial-gradient(circle, rgba(239,68,68,0.6) 0%, rgba(153,27,27,0.2) 70%, transparent 100%)'
                  : `radial-gradient(circle, ${themeConfig.glowColor} 0%, rgba(14,165,233,0.15) 70%, transparent 100%)`
              }}
            />
          </div>

          {/* Central Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {isListening ? (
              <Mic className="w-8 h-8 text-red-400 animate-bounce" />
            ) : (
              <Sparkles className="w-8 h-8 text-cyan-300 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
            )}
            <span className="text-[10px] font-rajdhani font-bold tracking-widest uppercase mt-1 text-cyan-200">
              {isListening ? 'ESCUTANDO...' : 'JARVES IA'}
            </span>
          </div>

          {/* Sci-Fi Frequency Wave Lines inside Core */}
          <div className="absolute bottom-3 flex items-center gap-1">
            {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
              <div
                key={i}
                className="w-0.5 rounded-full transition-all duration-150"
                style={{
                  height: isListening ? `${(Math.sin(pulse * 0.2 + i) + 1) * 8 + 3}px` : '4px',
                  backgroundColor: isListening ? '#ef4444' : themeConfig.primaryColor,
                  opacity: 0.8
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar Indicator under Orb */}
      <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300 font-rajdhani font-semibold tracking-wider">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>SISTEMA ATIVO & OPERACIONAL</span>
        <Activity className="w-3.5 h-3.5 text-cyan-400 ml-1" />
      </div>
    </div>
  );
};
