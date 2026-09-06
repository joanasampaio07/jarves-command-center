export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed';
export type AssistantPersonality = 'jarvis' | 'formal' | 'direct' | 'friendly' | 'coach';
export type AppTheme = 'cyan' | 'purple' | 'emerald' | 'titan_gold' | 'obsidian';

export interface User {
  id: string;
  email: string;
  name: string;
  alias?: string;
  avatar_url?: string;
  preferences: {
    marvis_theme?: AppTheme;
    personality?: AssistantPersonality;
    voice_enabled?: boolean;
    voice_speed?: number;
    sound_effects?: boolean;
    daily_briefing_time?: string;
    whatsapp_notifications?: boolean;
    whatsapp_phone?: string;
    google_calendar_connected?: boolean;
    notion_connected?: boolean;
  };
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: PriorityLevel;
  due_date?: string;
  due_time?: string;
  category?: string;
  project_id?: string;
  is_recurring?: boolean;
  recurrence?: RecurrenceType;
  tags?: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  created_at: string;
  completed_at?: string;
}

export interface TaskOccurrence {
  id: string;
  task_id: string;
  date: string;
  status: TaskStatus;
  completed_at?: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly';
  target_days_per_week?: number;
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  category: string;
  color?: string;
  icon?: string;
  current_streak: number;
  longest_streak: number;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
  completed_at: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: 'bank' | 'wallet' | 'investment' | 'crypto' | 'cash';
  balance: number;
  color: string;
  icon?: string;
  is_default?: boolean;
  created_at: string;
}

export interface FinancialTransaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  wallet_id: string;
  project_id?: string;
  notes?: string;
  tags?: string[];
  is_recurring?: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  color: string;
  deadline?: string;
  budget?: number;
  spent?: number;
  progress: number;
  category?: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  title: string;
  datetime: string;
  task_id?: string;
  is_triggered: boolean;
  repeat_interval?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  audio_url?: string;
  actions_suggested?: { label: string; action: string; data?: any }[];
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: 'task' | 'habit' | 'finance' | 'project' | 'assistant' | 'system';
  entity_id?: string;
  description: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}
