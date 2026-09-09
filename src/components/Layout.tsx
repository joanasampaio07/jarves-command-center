import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  MessageSquare, 
  CheckSquare, 
  DollarSign, 
  Zap, 
  FolderKanban, 
  Calendar as CalendarIcon, 
  Puzzle, 
  Palette, 
  BarChart3, 
  HelpCircle, 
  Bell, 
  Settings, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Mic, 
  Menu, 
  X, 
  Plus,
  Activity,
  LogOut,
  ChevronRight,
  Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { sounds } from '../lib/sound';

export type PageName = 
  | 'Dashboard' 
  | 'CommandCenter' 
  | 'VoiceChat'
  | 'TextChat' 
  | 'Tasks' 
  | 'Finances' 
  | 'Habits' 
  | 'Projects' 
  | 'Calendar' 
  | 'Integrations' 
  | 'Personalization' 
  | 'Analytics' 
  | 'HowToUse' 
  | 'News' 
  | 'Support' 
  | 'Settings' 
  | 'Admin';

interface LayoutProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentPage, onNavigate, children }) => {
  const { user, quotaInfo, setIsVoiceListening, setActiveQuickAction, updateUserPreferences } = useApp();
  const { user: authUser, isAdmin, toggleUserRole, logout } = useAuth();
  const { theme, themeConfig, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Itens de navegação: O "Painel Admin" só é visível se for Admin
  const allNavItems = [
    { name: 'Command Center', page: 'CommandCenter' as PageName, icon: LayoutDashboard, badge: 'IA' },
    { name: 'Chat IA Voz (Robô 3D)', page: 'VoiceChat' as PageName, icon: Bot, badge: '3D' },
    { name: 'Chat IA Texto', page: 'TextChat' as PageName, icon: MessageSquare },
    { name: 'Tarefas', page: 'Tasks' as PageName, icon: CheckSquare },
    { name: 'Finanças & Contas', page: 'Finances' as PageName, icon: DollarSign },
    { name: 'Hábitos Diários', page: 'Habits' as PageName, icon: Zap },
    { name: 'Projetos', page: 'Projects' as PageName, icon: FolderKanban },
    { name: 'Calendário', page: 'Calendar' as PageName, icon: CalendarIcon },
    { name: 'Integrações (WhatsApp)', page: 'Integrations' as PageName, icon: Puzzle, badge: 'Zap' },
    { name: 'Personalização & IA', page: 'Personalization' as PageName, icon: Palette },
    { name: 'Métricas & Análises', page: 'Analytics' as PageName, icon: BarChart3 },
    { name: 'Novidades & Updates', page: 'News' as PageName, icon: Bell },
    { name: 'Como Usar', page: 'HowToUse' as PageName, icon: HelpCircle },
    { name: 'Configurações', page: 'Settings' as PageName, icon: Settings },
    { name: 'Painel Master (Admin)', page: 'Admin' as PageName, icon: ShieldAlert, badge: 'ROOT' },
  ];

  const navItems = allNavItems;

  const handleNavClick = (page: PageName) => {
    sounds.playClick();
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
    updateUserPreferences({ sound_effects: next });
    if (next) sounds.playDataBeep();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#02050e] text-slate-100 font-inter">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 border-r border-cyan-500/20 bg-[#040817]/95 backdrop-blur-xl h-screen sticky top-0 z-40 overflow-y-auto">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div 
            onClick={() => handleNavClick('CommandCenter')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center p-0.5 shadow-[0_0_20px_rgba(0,242,254,0.4)] group-hover:shadow-[0_0_30px_rgba(0,242,254,0.7)] transition-all">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-rajdhani text-2xl font-bold tracking-wider text-white">JARVES</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  {isAdmin ? 'ROOT' : 'PRO'}
                </span>
              </div>
              <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest font-semibold">
                M&S Consultoria
              </p>
            </div>
          </div>
        </div>

        {/* Quick Voice / Action Button */}
        <div className="p-4">
          <button
            onClick={() => handleNavClick('VoiceChat')}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-rajdhani font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(0,242,254,0.35)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] transition-all"
          >
            <Bot className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span>Falar com o Robô 3D</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page || (item.page === 'CommandCenter' && currentPage === 'Dashboard');
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-300'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    item.badge === 'ROOT' 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                      : item.badge === '3D'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & System Status Footer */}
        <div className="p-4 border-t border-white/5 bg-[#030612]/80 space-y-3">
          {/* Daily Quota Mini-Bar */}
          <div 
            onClick={() => handleNavClick('Settings')}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all group"
            title="Clique para gerenciar cota e planos"
          >
            <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400 group-hover:animate-pulse" />
                <span>Cota IA ({isAdmin ? 'ADMIN' : user.plan?.toUpperCase() || 'PRO'})</span>
              </span>
              <span className="text-cyan-300 font-bold">
                {isAdmin ? 'ILIMITADA ∞' : `${quotaInfo.usedToday}/${quotaInfo.limit}`}
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isAdmin ? 'bg-gradient-to-r from-cyan-400 to-purple-400 w-full' : quotaInfo.percentage > 85 ? 'bg-amber-400' : 'bg-cyan-400'
                }`}
                style={{ width: isAdmin ? '100%' : `${Math.min(100, Math.max(5, quotaInfo.percentage))}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={authUser?.avatar_url || user.avatar_url}
                alt={authUser?.name || user.name}
                className="w-9 h-9 rounded-xl object-cover border border-cyan-500/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#030612]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{authUser?.name || user.name}</p>
              <p className="text-[10px] text-cyan-400/80 font-mono truncate">{authUser?.email || user.email}</p>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                logout();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sair da Conta (Logout)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-[#040817]/95 sticky top-0 z-50 backdrop-blur-lg">
        <div 
          onClick={() => handleNavClick('CommandCenter')}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="font-rajdhani text-xl font-bold tracking-wider text-white">M&S CONSULTORIA</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile Quota Badge */}
          <button
            onClick={() => handleNavClick('Settings')}
            className="px-2 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{isAdmin ? 'ILIMITADO ∞' : `${quotaInfo.usedToday}/${quotaInfo.limit}`}</span>
          </button>
          <button
            onClick={() => handleNavClick('VoiceChat')}
            className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
            title="Chat IA Voz 3D"
          >
            <Bot className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-[#02050e]/95 backdrop-blur-xl p-4 overflow-y-auto animate-in fade-in duration-200">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-cyan-400" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* TOPBAR DESKTOP */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-white/5 bg-[#030612]/60 backdrop-blur-md sticky top-0 z-30">
          {/* Breadcrumb / Section Name com a Marca M&S CONSULTORIA */}
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(0,242,254,0.8)]" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-rajdhani font-bold tracking-wider text-white">
                M&S CONSULTORIA
              </span>
              <span className="text-xs font-mono text-cyan-500/60">//</span>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                {currentPage.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Controls / Tools */}
          <div className="flex items-center gap-3">
            {/* Live Quota Pill */}
            <button
              onClick={() => handleNavClick('Settings')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-all group"
              title="Consumo de Tokens IA Diário"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>
                Cota Diária: <strong>{isAdmin ? 'ILIMITADA ∞' : `${quotaInfo.usedToday}/${quotaInfo.limit}`}</strong>
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ml-1 ${
                isAdmin ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                {isAdmin ? 'MASTER' : user.plan?.toUpperCase() || 'PRO'}
              </span>
            </button>

            {/* Quick Action Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setActiveQuickAction('task');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Registro</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl text-xs transition-colors ${
                soundEnabled ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/20' : 'text-slate-500 bg-slate-900 border border-slate-800'
              }`}
              title={soundEnabled ? 'Efeitos sonoros ativados' : 'Silencioso'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Theme Selector */}
            <button
              onClick={() => handleNavClick('Personalization')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:border-cyan-500/40 transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeConfig.primaryColor }} />
              <span className="font-mono text-[11px]">{themeConfig.name.split(' ')[0]}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

    </div>
  );
};
