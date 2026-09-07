import React, { createContext, useContext, useState, useEffect } from 'react';
import { sounds } from '../lib/sound';
import { getPersonalizedWelcome, speakGreeting } from '../lib/greeting';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  alias?: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  provider: 'google' | 'microsoft' | 'email' | 'guest';
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  lastLogin: string;
  aiSettings?: {
    preferredProvider: 'groq' | 'gemini' | 'openai' | 'anthropic';
    keyUsageMode: 'system_default' | 'byok'; // Bring Your Own Key
    customKeys: {
      groq?: string;
      gemini?: string;
      openai?: string;
      anthropic?: string;
      elevenlabs?: string;
    };
  };
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  toggleUserRole: () => void;
  setUserRole: (role: 'admin' | 'user') => void;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<boolean>;
  loginAsGuest: () => void;
  logout: () => void;
  updateUserAIKeys: (keys: AuthUser['aiSettings']) => void;
  updateUserProfile: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'jarves_auth_session_v1';

const defaultDemoUser: AuthUser = {
  id: 'usr_jarves_stark',
  name: 'Comandante M&S',
  email: 'diretoria@msconsultoria.com.br',
  alias: 'Diretor',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  provider: 'google',
  plan: 'pro',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  aiSettings: {
    preferredProvider: 'groq',
    keyUsageMode: 'system_default',
    customKeys: {
      groq: '',
      gemini: '',
      openai: '',
      anthropic: '',
      elevenlabs: ''
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Inicializa com usuário logado para demonstração imediata mas permite logout/troca de conta
        setUser(defaultDemoUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDemoUser));
      }
    } catch (e) {
      console.error('Error restoring auth session', e);
      setUser(defaultDemoUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (newUser: AuthUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const isAdminEmail = (email: string) => {
    const lower = email.toLowerCase().trim();
    const adminEmails = [
      'mesconsultoria@gmail.com',
      'sampalira@gmail.com',
      'diretoria@msconsultoria.com.br',
      'admin@msconsultoria.com.br',
      'joanasampaio07@gmail.com'
    ];
    if (adminEmails.includes(lower)) return true;
    return lower.includes('mesconsultoria') || lower.includes('sampalira') || lower.includes('admin') || lower.includes('msconsultoria') || lower.includes('diretoria');
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    sounds.playDataBeep();
    // Simula autenticação OAuth 2.0 do Google para o Administrador Master
    await new Promise((r) => setTimeout(r, 1200));

    const googleUser: AuthUser = {
      id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
      name: 'Comandante M&S',
      email: 'mesconsultoria@gmail.com',
      alias: 'Diretor M&S',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      provider: 'google',
      plan: 'pro',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      aiSettings: {
        preferredProvider: 'gemini',
        keyUsageMode: 'system_default',
        customKeys: {}
      }
    };

    saveUserSession(googleUser);
    sounds.playSuccess();
    setIsLoading(false);
    speakGreeting(getPersonalizedWelcome(googleUser.name, googleUser.alias));
  };

  const loginWithMicrosoft = async () => {
    setIsLoading(true);
    sounds.playDataBeep();
    await new Promise((r) => setTimeout(r, 1200));

    const msUser: AuthUser = {
      id: 'usr_ms_' + Math.random().toString(36).substring(2, 9),
      name: 'Executivo Microsoft',
      email: 'corporativo@outlook.com',
      alias: 'Diretor',
      avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      provider: 'microsoft',
      plan: 'pro',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      aiSettings: {
        preferredProvider: 'openai',
        keyUsageMode: 'system_default',
        customKeys: {}
      }
    };

    saveUserSession(msUser);
    sounds.playSuccess();
    setIsLoading(false);
    speakGreeting(getPersonalizedWelcome(msUser.name, msUser.alias));
  };

  const loginWithEmail = async (email: string, _pass: string): Promise<boolean> => {
    setIsLoading(true);
    sounds.playDataBeep();
    await new Promise((r) => setTimeout(r, 800));

    const isAdm = isAdminEmail(email);
    const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = isAdm ? 'Diretor M&S' : (nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));

    const emailUser: AuthUser = {
      id: 'usr_em_' + Math.random().toString(36).substring(2, 9),
      name: formattedName || 'Comandante',
      email: email,
      alias: isAdm ? 'Diretor' : (formattedName.split(' ')[0] || 'Chefe'),
      avatar_url: isAdm ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      role: isAdm ? 'admin' : 'user',
      provider: 'email',
      plan: 'pro',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      aiSettings: {
        preferredProvider: 'groq',
        keyUsageMode: 'system_default',
        customKeys: {}
      }
    };

    saveUserSession(emailUser);
    sounds.playSuccess();
    setIsLoading(false);
    speakGreeting(getPersonalizedWelcome(emailUser.name, emailUser.alias));
    return true;
  };

  const registerWithEmail = async (name: string, email: string, _pass: string): Promise<boolean> => {
    setIsLoading(true);
    sounds.playDataBeep();
    await new Promise((r) => setTimeout(r, 900));

    const isAdm = isAdminEmail(email);
    const newUser: AuthUser = {
      id: 'usr_reg_' + Math.random().toString(36).substring(2, 9),
      name: name.trim() || 'Novo Comandante',
      email: email.trim(),
      alias: isAdm ? 'Diretor' : (name.trim().split(' ')[0] || 'Comandante'),
      avatar_url: isAdm ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: isAdm ? 'admin' : 'user',
      provider: 'email',
      plan: 'pro',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      aiSettings: {
        preferredProvider: 'groq',
        keyUsageMode: 'system_default',
        customKeys: {}
      }
    };

    saveUserSession(newUser);
    sounds.playSuccess();
    setIsLoading(false);
    speakGreeting(getPersonalizedWelcome(newUser.name, newUser.alias));
    return true;
  };

  const loginAsGuest = () => {
    sounds.playDataBeep();
    const guestUser: AuthUser = {
      id: 'usr_guest_' + Math.random().toString(36).substring(2, 6),
      name: 'Operador Convidado',
      email: 'convidado@jarves.ai',
      alias: 'Operador',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      provider: 'guest',
      plan: 'free',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      aiSettings: {
        preferredProvider: 'groq',
        keyUsageMode: 'system_default',
        customKeys: {}
      }
    };
    saveUserSession(guestUser);
    sounds.playSuccess();
    speakGreeting(getPersonalizedWelcome(guestUser.name, guestUser.alias));
  };

  const toggleUserRole = () => {
    if (!user) return;
    sounds.playClick();
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    updateUserProfile({ role: nextRole });
    sounds.playSuccess();
  };

  const setUserRole = (newRole: 'admin' | 'user') => {
    if (!user) return;
    updateUserProfile({ role: newRole });
  };

  const logout = () => {
    sounds.playClick();
    saveUserSession(null);
  };

  const updateUserAIKeys = (aiSettings: AuthUser['aiSettings']) => {
    if (!user) return;
    const updated = {
      ...user,
      aiSettings: {
        ...user.aiSettings,
        ...aiSettings
      }
    };
    saveUserSession(updated);
  };

  const updateUserProfile = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = {
      ...user,
      ...updates
    };
    saveUserSession(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === 'admin',
        toggleUserRole,
        setUserRole,
        loginWithGoogle,
        loginWithMicrosoft,
        loginWithEmail,
        registerWithEmail,
        loginAsGuest,
        logout,
        updateUserAIKeys,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
