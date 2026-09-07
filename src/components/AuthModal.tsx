import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Key, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../lib/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, canClose = false }) => {
  const { 
    loginWithGoogle, 
    loginWithMicrosoft, 
    loginWithEmail, 
    registerWithEmail, 
    loginAsGuest, 
    isLoading 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'forgot') {
      if (!email || !email.includes('@')) {
        setError('Por favor, informe um endereço de e-mail válido.');
        sounds.playWarning();
        return;
      }
      sounds.playDataBeep();
      setSuccessMessage(`Link de redefinição de acesso enviado com sucesso para ${email}!`);
      sounds.playSuccess();
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Por favor, informe um e-mail válido.');
      sounds.playWarning();
      return;
    }

    if (!password || password.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres.');
      sounds.playWarning();
      return;
    }

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        if (onClose) onClose();
      } else {
        if (!name.trim()) {
          setError('Por favor, informe seu nome de Comandante.');
          return;
        }
        await registerWithEmail(name, email, password);
        if (onClose) onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar no servidor neural.');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      if (onClose) onClose();
    } catch (err: any) {
      setError('Falha na autenticação Google.');
    }
  };

  const handleMicrosoftLogin = async () => {
    setError(null);
    try {
      await loginWithMicrosoft();
      if (onClose) onClose();
    } catch (err: any) {
      setError('Falha na autenticação Microsoft.');
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Background Cyber Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-[#040817] border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden">
        
        {/* Top Tech Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full" />

        {canClose && onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 shadow-[0_0_20px_rgba(0,242,254,0.3)] mb-1">
              <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold font-rajdhani tracking-wider text-white flex items-center justify-center gap-2">
              <span>JARVES PROTOCOL</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">v3.0</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {mode === 'login' && 'Autentique suas credenciais para acessar o comando de voz e inteligência autônoma.'}
              {mode === 'register' && 'Cadastre seu perfil de Comandante para inicializar seu Jarvis pessoal.'}
              {mode === 'forgot' && 'Informe seu e-mail para recuperar os tokens de segurança da sua conta.'}
            </p>
          </div>

          {/* Social OAuth Providers */}
          {mode !== 'forgot' && (
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#0c1328] hover:bg-[#131d3d] border border-cyan-500/20 hover:border-cyan-400/50 text-white font-medium text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(0,0,0,0.4)] group"
              >
                <svg className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continuar com Google</span>
              </button>

              <button
                type="button"
                onClick={handleMicrosoftLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#0c1328] hover:bg-[#131d3d] border border-cyan-500/20 hover:border-cyan-400/50 text-white font-medium text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(0,0,0,0.4)] group"
              >
                <svg className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                <span>Continuar com Microsoft</span>
              </button>
            </div>
          )}

          {mode !== 'forgot' && (
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#040817] px-3 text-[10px] font-mono uppercase tracking-widest text-slate-500 shrink-0">
                OU VIA E-MAIL
              </span>
            </div>
          )}

          {/* Feedback Messages */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'register' && (
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 tracking-wider">
                  Nome do Comandante
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Tony Stark"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 tracking-wider">
                Endereço de E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="comandante@jarves.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Senha de Segurança
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-rajdhani font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(0,242,254,0.35)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Entrar no Sistema'}
                    {mode === 'register' && 'Inicializar Conta'}
                    {mode === 'forgot' && 'Enviar Link de Recuperação'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switchers */}
          <div className="text-center pt-2 space-y-2">
            {mode === 'login' ? (
              <p className="text-xs text-slate-400">
                Não tem uma conta no JARVES?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 hover:underline"
                >
                  Cadastre-se grátis
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Já possui credenciais?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 hover:underline"
                >
                  Fazer Login
                </button>
              </p>
            )}

            {/* Quick Guest Demo button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-cyan-300 transition-colors pt-2"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Entrar como Convidado / Demonstração Rápida</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
