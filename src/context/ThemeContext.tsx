import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme } from '../types/entities';

interface ThemeConfig {
  id: AppTheme;
  name: string;
  primaryColor: string;
  glowColor: string;
  accentBg: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan (JARVIS)',
    primaryColor: '#00f2fe',
    glowColor: 'rgba(0, 242, 254, 0.4)',
    accentBg: 'from-cyan-500/20 to-blue-600/10',
    borderColor: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
  },
  purple: {
    id: 'purple',
    name: 'Neon Purple (Cyberpunk)',
    primaryColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    accentBg: 'from-purple-500/20 to-pink-600/10',
    borderColor: 'border-purple-500/30',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
  },
  emerald: {
    id: 'emerald',
    name: 'Matrix Emerald (Bio-Tech)',
    primaryColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    accentBg: 'from-emerald-500/20 to-teal-600/10',
    borderColor: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
  },
  titan_gold: {
    id: 'titan_gold',
    name: 'Titan Gold (Mark L)',
    primaryColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    accentBg: 'from-amber-500/20 to-orange-600/10',
    borderColor: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Stealth',
    primaryColor: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.3)',
    accentBg: 'from-slate-700/20 to-slate-900/10',
    borderColor: 'border-slate-600/30',
    badgeBg: 'bg-slate-700/30',
    badgeText: 'text-slate-300',
  },
};

interface ThemeContextType {
  theme: AppTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('marvis_theme') as AppTheme;
    return saved && THEMES[saved] ? saved : 'cyan';
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('marvis_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeConfig: THEMES[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
