import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Task, 
  Habit, 
  HabitLog, 
  FinancialTransaction, 
  Wallet, 
  Project, 
  Reminder, 
  ChatMessage, 
  ActivityLog, 
  User,
  AssistantPersonality
} from '../types/entities';
import { generateId } from '../lib/utils';
import { sounds } from '../lib/sound';
import { jarvisAI } from '../lib/aiEngine';

interface AppContextType {
  user: User;
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLog[];
  transactions: FinancialTransaction[];
  wallets: Wallet[];
  projects: Project[];
  reminders: Reminder[];
  chatMessages: ChatMessage[];
  activityLogs: ActivityLog[];
  isVoiceListening: boolean;
  activeQuickAction: 'task' | 'transaction' | 'habit' | 'project' | null;
  quotaInfo: {
    limit: number;
    usedToday: number;
    remaining: number;
    percentage: number;
    isLimitReached: boolean;
  };
  // Actions
  updateUserPreferences: (prefs: Partial<User['preferences']>) => void;
  setUserPlan: (plan: 'free' | 'pro' | 'ultra') => void;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'created_at' | 'current_streak' | 'longest_streak'>) => void;
  toggleHabitForToday: (habitId: string) => void;
  deleteHabit: (id: string) => void;
  addTransaction: (tx: Omit<FinancialTransaction, 'id' | 'created_at'>) => void;
  deleteTransaction: (id: string) => void;
  addWallet: (wallet: Omit<Wallet, 'id' | 'created_at'>) => void;
  updateWalletBalance: (id: string, newBalance: number) => void;
  addProject: (project: Omit<Project, 'id' | 'created_at'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  sendChatMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setIsVoiceListening: (listening: boolean) => void;
  setActiveQuickAction: (action: 'task' | 'transaction' | 'habit' | 'project' | null) => void;
  logActivity: (action: string, entity_type: ActivityLog['entity_type'], description: string) => void;
}

const defaultUser: User = {
  id: 'usr_jarves_01',
  email: 'comandante@jarves.ai',
  name: 'Comandante Stark',
  alias: 'Chefe',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'pro',
  daily_quota: {
    limit: 100,
    used_today: 14,
    reset_date: new Date().toISOString().split('T')[0],
  },
  preferences: {
    marvis_theme: 'cyan',
    personality: 'jarvis',
    voice_enabled: true,
    voice_speed: 1.0,
    sound_effects: true,
    daily_briefing_time: '08:00',
    whatsapp_notifications: true,
    whatsapp_phone: '+55 11 99999-8888',
    google_calendar_connected: true,
    notion_connected: false,
  },
  created_at: new Date().toISOString(),
};

const initialTasks: Task[] = [
  {
    id: 'tsk_1',
    title: 'Apresentar proposta do JARVES para grande empresa',
    description: 'Demonstrar comando de voz neural, integrações corporativas e automação.',
    status: 'pending',
    priority: 'urgent',
    due_date: new Date().toISOString().split('T')[0],
    due_time: '16:00',
    category: 'Estratégia',
    tags: ['Vendas', 'B2B'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'tsk_2',
    title: 'Reunião de Alinhamento Comercial',
    description: 'Validar precificação e pacote de inteligência artificial.',
    status: 'in_progress',
    priority: 'high',
    due_date: new Date().toISOString().split('T')[0],
    due_time: '14:30',
    category: 'Reuniões',
    tags: ['Jarves', 'Tech'],
    created_at: new Date().toISOString(),
  },
];

const initialHabits: Habit[] = [
  {
    id: 'hbt_1',
    title: 'Treino & Alta Performance',
    description: '45 minutos de exercícios.',
    frequency: 'daily',
    time_of_day: 'morning',
    category: 'Saúde',
    color: '#00f2fe',
    current_streak: 14,
    longest_streak: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: 'hbt_2',
    title: 'Leitura Estratégica (20 páginas)',
    description: 'Livros de negócios, liderança ou tecnologia.',
    frequency: 'daily',
    time_of_day: 'evening',
    category: 'Mente',
    color: '#a855f7',
    current_streak: 8,
    longest_streak: 15,
    created_at: new Date().toISOString(),
  },
];

const initialWallets: Wallet[] = [
  { id: 'wal_1', name: 'Conta Principal (Nubank)', type: 'bank', balance: 28450.00, color: '#820ad1', is_default: true, created_at: new Date().toISOString() },
  { id: 'wal_2', name: 'Investimentos & Reserva', type: 'investment', balance: 145200.00, color: '#10b981', created_at: new Date().toISOString() },
  { id: 'wal_3', name: 'Carteira Operacional PJ', type: 'wallet', balance: 64180.50, color: '#00f2fe', created_at: new Date().toISOString() },
];

const initialTransactions: FinancialTransaction[] = [
  {
    id: 'tx_1',
    description: 'Recebimento Contrato Enterprise',
    amount: 25000.00,
    type: 'income',
    category: 'Serviços',
    date: new Date().toISOString().split('T')[0],
    wallet_id: 'wal_1',
    created_at: new Date().toISOString(),
  },
];

const initialProjects: Project[] = [
  {
    id: 'prj_1',
    title: 'Vendas Enterprise B2B 2026',
    description: 'Comercialização do Sistema JARVES para médias e grandes empresas.',
    status: 'in_progress',
    color: '#00f2fe',
    deadline: '2026-12-15',
    budget: 80000,
    spent: 12000,
    progress: 75,
    category: 'Comercial',
    created_at: new Date().toISOString(),
  },
];

const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    role: 'assistant',
    content: 'Olá Comandante! JARVES online e com todos os sistemas operacionais calibrados. O que gostaria de executar ou planejar agora?',
    timestamp: new Date().toISOString(),
    actions_suggested: [
      { label: '📊 Resumo do Dia', action: 'summary' },
      { label: '✅ Tarefas Pendentes', action: 'tasks' },
      { label: '💰 Balanço Financeiro', action: 'finances' }
    ]
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('jarves_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('jarves_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('jarves_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('jarves_habit_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'hl_1', habit_id: 'hbt_1', date: today, completed: true, completed_at: new Date().toISOString() },
    ];
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('jarves_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem('jarves_wallets');
    return saved ? JSON.parse(saved) : initialWallets;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('jarves_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('jarves_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('jarves_chat_messages');
    return saved ? JSON.parse(saved) : initialChatMessages;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('jarves_activity_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'act_1', action: 'SISTEMA_INICIADO', entity_type: 'system', description: 'JARVES Command Center inicializado.', timestamp: new Date().toISOString() },
    ];
  });

  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState<'task' | 'transaction' | 'habit' | 'project' | null>(null);

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('jarves_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('jarves_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('jarves_habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('jarves_habit_logs', JSON.stringify(habitLogs)); }, [habitLogs]);
  useEffect(() => { localStorage.setItem('jarves_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('jarves_wallets', JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem('jarves_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('jarves_chat_messages', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('jarves_activity_logs', JSON.stringify(activityLogs)); }, [activityLogs]);

  const logActivity = (action: string, entity_type: ActivityLog['entity_type'], description: string) => {
    const newLog: ActivityLog = {
      id: generateId(),
      action,
      entity_type,
      description,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 50)]);
  };

  const updateUserPreferences = (prefs: Partial<User['preferences']>) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefs }
    }));
    sounds.playDataBeep();
  };

  const addTask = (taskData: Omit<Task, 'id' | 'created_at'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'tsk_' + generateId(),
      created_at: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    logActivity('TAREFA_CRIADA', 'task', `Tarefa criada: "${newTask.title}"`);
    sounds.playSuccess();
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    sounds.playClick();
  };

  const deleteTask = (id: string) => {
    const t = tasks.find(item => item.id === id);
    setTasks(prev => prev.filter(item => item.id !== id));
    if (t) logActivity('TAREFA_EXCLUIDA', 'task', `Tarefa removida: "${t.title}"`);
    sounds.playClick();
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isCompleted = t.status === 'completed';
        const newStatus = isCompleted ? 'pending' : 'completed';
        if (!isCompleted) {
          sounds.playSuccess();
          logActivity('TAREFA_CONCLUIDA', 'task', `Tarefa concluída: "${t.title}"`);
        } else {
          sounds.playClick();
        }
        return {
          ...t,
          status: newStatus,
          completed_at: !isCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    }));
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'created_at' | 'current_streak' | 'longest_streak'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: 'hbt_' + generateId(),
      current_streak: 0,
      longest_streak: 0,
      created_at: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
    logActivity('HABITO_CRIADO', 'habit', `Hábito criado: "${newHabit.title}"`);
    sounds.playSuccess();
  };

  const toggleHabitForToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = habitLogs.find(l => l.habit_id === habitId && l.date === today);

    if (existingLog) {
      setHabitLogs(prev => prev.filter(l => !(l.habit_id === habitId && l.date === today)));
      setHabits(prev => prev.map(h => h.id === habitId ? { ...h, current_streak: Math.max(0, h.current_streak - 1) } : h));
      sounds.playClick();
    } else {
      const newLog: HabitLog = {
        id: generateId(),
        habit_id: habitId,
        date: today,
        completed: true,
        completed_at: new Date().toISOString(),
      };
      setHabitLogs(prev => [...prev, newLog]);
      setHabits(prev => prev.map(h => {
        if (h.id === habitId) {
          const newStreak = h.current_streak + 1;
          return {
            ...h,
            current_streak: newStreak,
            longest_streak: Math.max(h.longest_streak, newStreak),
          };
        }
        return h;
      }));
      sounds.playSuccess();
      const h = habits.find(item => item.id === habitId);
      if (h) logActivity('HABITO_CONCLUIDO', 'habit', `Hábito cumprido hoje: "${h.title}"`);
    }
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setHabitLogs(prev => prev.filter(l => l.habit_id !== id));
    sounds.playClick();
  };

  const addTransaction = (txData: Omit<FinancialTransaction, 'id' | 'created_at'>) => {
    const newTx: FinancialTransaction = {
      ...txData,
      id: 'tx_' + generateId(),
      created_at: new Date().toISOString(),
    };
    setTransactions(prev => [newTx, ...prev]);

    setWallets(prev => prev.map(w => {
      if (w.id === txData.wallet_id) {
        const delta = txData.type === 'income' ? txData.amount : -txData.amount;
        return { ...w, balance: w.balance + delta };
      }
      return w;
    }));

    logActivity('TRANSACAO_REGISTRADA', 'finance', `${txData.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${txData.amount.toFixed(2)}: "${txData.description}"`);
    sounds.playSuccess();
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      setWallets(prev => prev.map(w => {
        if (w.id === tx.wallet_id) {
          const delta = tx.type === 'income' ? -tx.amount : tx.amount;
          return { ...w, balance: w.balance + delta };
        }
        return w;
      }));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
    sounds.playClick();
  };

  const addWallet = (wData: Omit<Wallet, 'id' | 'created_at'>) => {
    const newWallet: Wallet = {
      ...wData,
      id: 'wal_' + generateId(),
      created_at: new Date().toISOString(),
    };
    setWallets(prev => [...prev, newWallet]);
    sounds.playSuccess();
  };

  const updateWalletBalance = (id: string, newBalance: number) => {
    setWallets(prev => prev.map(w => w.id === id ? { ...w, balance: newBalance } : w));
    sounds.playDataBeep();
  };

  const addProject = (projectData: Omit<Project, 'id' | 'created_at'>) => {
    const newProj: Project = {
      ...projectData,
      id: 'prj_' + generateId(),
      created_at: new Date().toISOString(),
    };
    setProjects(prev => [...prev, newProj]);
    logActivity('PROJETO_CRIADO', 'project', `Novo projeto iniciado: "${newProj.title}"`);
    sounds.playSuccess();
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    sounds.playClick();
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    sounds.playClick();
  };

  const setUserPlan = (newPlan: 'free' | 'pro' | 'ultra') => {
    sounds.playSuccess();
    const limit = newPlan === 'ultra' ? 1000 : newPlan === 'pro' ? 200 : 50;
    setUser(prev => ({
      ...prev,
      plan: newPlan,
      daily_quota: {
        limit,
        used_today: prev.daily_quota?.used_today || 0,
        reset_date: new Date().toISOString().split('T')[0]
      }
    }));
  };

  const isMasterAdmin = (email?: string) => {
    if (!email) return false;
    const lower = email.toLowerCase().trim();
    const adminEmails = [
      'mesconsultoria@gmail.com',
      'sampalira@gmail.com',
      'diretoria@msconsultoria.com.br',
      'admin@msconsultoria.com.br',
      'joanasampaio07@gmail.com'
    ];
    if (adminEmails.includes(lower)) return true;
    return lower.includes('mesconsultoria') || lower.includes('sampalira') || lower.includes('admin') || lower.includes('diretoria');
  };

  const getEffectiveQuota = () => {
    const today = new Date().toISOString().split('T')[0];
    const isAdmin = isMasterAdmin(user.email);

    if (isAdmin) {
      return {
        limit: Infinity,
        usedToday: user.daily_quota?.used_today || 0,
        remaining: Infinity,
        percentage: 0,
        isLimitReached: false,
        isUnlimited: true
      };
    }

    const userLimit = user.plan === 'ultra' ? 1000 : user.plan === 'pro' ? 200 : 50;
    const quota = user.daily_quota || { limit: userLimit, used_today: 0, reset_date: today };
    
    // Auto-reset se virou o dia
    const usedToday = quota.reset_date === today ? quota.used_today : 0;
    const remaining = Math.max(0, quota.limit - usedToday);
    const percentage = Math.min(100, Math.round((usedToday / quota.limit) * 100));
    const isLimitReached = usedToday >= quota.limit;

    return {
      limit: quota.limit,
      usedToday,
      remaining,
      percentage,
      isLimitReached,
      isUnlimited: false
    };
  };

  const quotaInfo = getEffectiveQuota();

  // Dynamic Contextual AI Chat Message Sender with Daily Rate Limiting
  const sendChatMessage = async (content: string) => {
    if (!content.trim()) return;

    sounds.playClick();
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, userMsg]);

    const today = new Date().toISOString().split('T')[0];
    const currentQuota = getEffectiveQuota();

    // Verificação de Limite Diário (proteção contra consumo desmedido de tokens)
    if (currentQuota.isLimitReached) {
      sounds.playWarning();
      const quotaWarningMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `⚠️ Comandante, você atingiu o seu limite diário de ${currentQuota.limit} comandos neurais do plano ${user.plan?.toUpperCase() || 'FREE'}. O seu consumo será renovado automaticamente à meia-noite. Para continuar agora sem restrições, faça upgrade para o Plano PRO / ULTRA ou configure sua própria chave de API na aba de Configurações!`,
        timestamp: new Date().toISOString(),
        actions_suggested: [
          { label: '⭐ Fazer Upgrade de Plano', action: 'upgrade' },
          { label: '🔑 Usar Minha API Key (BYOK)', action: 'settings' }
        ]
      };
      setChatMessages(prev => [...prev, quotaWarningMsg]);
      return;
    }

    // Incrementa cota diária utilizada
    setUser(prev => {
      const q = prev.daily_quota || { limit: currentQuota.limit, used_today: 0, reset_date: today };
      const newUsed = (q.reset_date === today ? q.used_today : 0) + 1;
      return {
        ...prev,
        daily_quota: {
          limit: q.limit,
          used_today: newUsed,
          reset_date: today
        }
      };
    });

    const context = {
      userName: user.name,
      userAlias: user.alias || 'Comandante',
      tasks,
      habits,
      wallets,
      recentTransactions: transactions.slice(0, 5),
      personality: user.preferences.personality || 'jarvis'
    };

    // Call dynamic LLM reasoning
    const aiResult = await jarvisAI.processMessage(
      content,
      chatMessages.map(m => ({ role: m.role, content: m.content })),
      context
    );

    // Auto action handling
    if (aiResult.actionDetected?.type === 'add_transaction' && aiResult.actionDetected.data) {
      addTransaction({
        description: aiResult.actionDetected.data.description || content,
        amount: aiResult.actionDetected.data.amount || 50,
        type: 'expense',
        category: 'Geral',
        date: new Date().toISOString().split('T')[0],
        wallet_id: wallets[0]?.id || 'wal_1'
      });
    } else if (aiResult.actionDetected?.type === 'create_task' && aiResult.actionDetected.data) {
      addTask({
        title: aiResult.actionDetected.data.title || content,
        status: 'pending',
        priority: aiResult.actionDetected.data.priority || 'high',
        due_date: new Date().toISOString().split('T')[0],
        category: 'Geral'
      });
    } else if (aiResult.actionDetected?.type === 'check_habit') {
      if (habits.length > 0) toggleHabitForToday(habits[0].id);
    }

    sounds.playJarvisActivate();
    const assistantMsg: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: aiResult.reply,
      timestamp: new Date().toISOString(),
      actions_suggested: [
        { label: '📊 Resumo do Dia', action: 'summary' },
        { label: '✅ Tarefas Pendentes', action: 'tasks' },
        { label: '💰 Balanço Financeiro', action: 'finances' }
      ]
    };
    setChatMessages(prev => [...prev, assistantMsg]);
  };

  const clearChat = () => {
    setChatMessages([initialChatMessages[0]]);
    sounds.playClick();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        tasks,
        habits,
        habitLogs,
        transactions,
        wallets,
        projects,
        reminders,
        chatMessages,
        activityLogs,
        isVoiceListening,
        activeQuickAction,
        quotaInfo,
        updateUserPreferences,
        setUserPlan,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        addHabit,
        toggleHabitForToday,
        deleteHabit,
        addTransaction,
        deleteTransaction,
        addWallet,
        updateWalletBalance,
        addProject,
        updateProject,
        deleteProject,
        sendChatMessage,
        clearChat,
        setIsVoiceListening,
        setActiveQuickAction,
        logActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
