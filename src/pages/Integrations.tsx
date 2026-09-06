import React, { useState } from 'react';
import { 
  Puzzle, 
  Mail, 
  Calendar as CalendarIcon, 
  HardDrive, 
  FolderSync, 
  Users, 
  MessageSquare, 
  Home, 
  Webhook, 
  Github, 
  Trello as TrelloIcon, 
  Radio, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Key,
  Smartphone,
  RefreshCw,
  Send,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../lib/sound';

interface IntegrationItem {
  id: string;
  name: string;
  category: 'email' | 'cloud' | 'productivity' | 'iot' | 'comms';
  icon: any;
  color: string;
  badge: 'ATIVO' | 'CONFIGURAR' | 'EM BREVE';
  badgeColor: 'emerald' | 'amber' | 'cyan' | 'slate';
  description: string;
  howToUse: string;
  configType: 'oauth' | 'token' | 'qr' | 'webhook';
  connected: boolean;
  fields?: { label: string; placeholder: string; type?: string }[];
}

export const Integrations: React.FC = () => {
  const { user, updateUserPreferences } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'email' | 'cloud' | 'productivity' | 'iot' | 'comms'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('gmail');
  
  // Custom connected states
  const [connections, setConnections] = useState<Record<string, boolean>>({
    whatsapp: true,
    gmail: true,
    google_calendar: true,
    outlook: false,
    google_drive: true,
    onedrive: false,
    teams: false,
    notion: false,
    home_assistant: false,
    n8n: false,
    github: false,
    trello: false,
    alexa: false,
    google_home: false,
    slack: false,
  });

  const [formInputs, setFormInputs] = useState<Record<string, string>>({});
  const [saveSuccessId, setSaveSuccessId] = useState<string | null>(null);

  const integrationsList: IntegrationItem[] = [
    // 1. WhatsApp
    {
      id: 'whatsapp',
      name: 'WhatsApp (Oficial)',
      category: 'comms',
      icon: MessageSquare,
      color: '#25D366',
      badge: connections.whatsapp ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.whatsapp ? 'emerald' : 'amber',
      description: 'Já integrado! Converse com o Mega Jarves diretamente pelo WhatsApp para criar tarefas, registrar despesas e ouvir respostas por áudio.',
      howToUse: 'Mande uma mensagem ou áudio para o número do Mega Jarves: "Jarves, gastei 80 reais no almoço" ou "O que tenho hoje?".',
      configType: 'qr',
      connected: connections.whatsapp,
    },

    // 2. Gmail (Google Workspace)
    {
      id: 'gmail',
      name: 'Gmail (Google Workspace)',
      category: 'email',
      icon: Mail,
      color: '#EA4335',
      badge: connections.gmail ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.gmail ? 'emerald' : 'amber',
      description: 'Leitura inteligente da caixa de entrada, resumos de emails urgentes, rascunhos de resposta gerados por IA e conversão de emails em tarefas.',
      howToUse: 'Diga ao Mega Jarves: "Jarves, resuma os emails não lidos do Gmail de hoje" ou "Crie uma tarefa a partir do email do cliente".',
      configType: 'oauth',
      connected: connections.gmail,
      fields: [
        { label: 'Conta do Google Conectada', placeholder: user.email || 'seu-email@gmail.com' },
        { label: 'Permissão de Leitura & Resumos', placeholder: 'Habilitado (OAuth 2.0)' }
      ]
    },

    // 3. Microsoft Outlook / Office 365
    {
      id: 'outlook',
      name: 'Microsoft Outlook (365)',
      category: 'email',
      icon: Mail,
      color: '#0078D4',
      badge: connections.outlook ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.outlook ? 'emerald' : 'amber',
      description: 'Integração completa com caixas corporativas Microsoft 365, sincronização de contatos, convites de reunião e alertas de emails prioritários.',
      howToUse: 'Diga ao Mega Jarves: "Verifique minha caixa de entrada do Outlook corporativo e avise se há reuniões pendentes".',
      configType: 'oauth',
      connected: connections.outlook,
      fields: [
        { label: 'Client ID / Tenant (Microsoft Entra)', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
        { label: 'E-mail Corporativo Outlook', placeholder: 'usuario@empresa.com' }
      ]
    },

    // 4. Google Drive
    {
      id: 'google_drive',
      name: 'Google Drive',
      category: 'cloud',
      icon: HardDrive,
      color: '#34A853',
      badge: connections.google_drive ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.google_drive ? 'emerald' : 'amber',
      description: 'Indexação e busca semântica em arquivos do Drive. O Jarves pode ler relatórios em PDF, planilhas e documentos para responder perguntas complexas.',
      howToUse: 'Diga ao Mega Jarves: "Encontre no meu Google Drive a planilha de orçamento de 2026 e resuma os totais".',
      configType: 'oauth',
      connected: connections.google_drive,
      fields: [
        { label: 'Pastas Sincronizadas', placeholder: '/Documentos/Projetos, /Finanças' },
        { label: 'Indexação com Embeddings IA', placeholder: 'Ativo (Busca Neural Habilitada)' }
      ]
    },

    // 5. Microsoft OneDrive
    {
      id: 'onedrive',
      name: 'Microsoft OneDrive',
      category: 'cloud',
      icon: FolderSync,
      color: '#0078D4',
      badge: connections.onedrive ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.onedrive ? 'emerald' : 'amber',
      description: 'Acesso seguro à nuvem da Microsoft para sincronizar backups, arquivar recibos financeiros e ler apresentações e relatórios corporativos.',
      howToUse: 'Diga ao Mega Jarves: "Salve o backup de transações do mês na minha pasta do OneDrive".',
      configType: 'oauth',
      connected: connections.onedrive,
      fields: [
        { label: 'Pasta Raiz no OneDrive', placeholder: '/Jarves_Backups' },
        { label: 'Sincronização Automática', placeholder: 'Diária às 23:00' }
      ]
    },

    // 6. Microsoft Teams
    {
      id: 'teams',
      name: 'Microsoft Teams',
      category: 'comms',
      icon: Users,
      color: '#6264A7',
      badge: connections.teams ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.teams ? 'emerald' : 'amber',
      description: 'Bot inteligente integrado aos canais do Teams. Notifique equipes sobre marcos de projetos, resuma chats de canais e receba menções de reuniões.',
      howToUse: 'No canal do Teams, digite: "@Jarves o que temos de entregas para esta sprint?" ou envie avisos automáticos.',
      configType: 'webhook',
      connected: connections.teams,
      fields: [
        { label: 'Teams Incoming Webhook URL', placeholder: 'https://outlook.office.com/webhook/...' },
        { label: 'Canal de Alertas Padrão', placeholder: '#geral-operacao' }
      ]
    },

    // 7. Google Calendar
    {
      id: 'google_calendar',
      name: 'Google Calendar',
      category: 'productivity',
      icon: CalendarIcon,
      color: '#4285F4',
      badge: connections.google_calendar ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.google_calendar ? 'emerald' : 'amber',
      description: 'Sincronize seus lembretes e tarefas com o Google Calendar e nunca perca um compromisso ou prazo.',
      howToUse: 'Diga ao Mega Jarves: "Agendar reunião com time comercial na quinta às 10h no Google Agenda".',
      configType: 'oauth',
      connected: connections.google_calendar,
      fields: [
        { label: 'Calendário Principal', placeholder: 'primary (Sincronização Ativa)' }
      ]
    },

    // 8. Notion
    {
      id: 'notion',
      name: 'Notion',
      category: 'productivity',
      icon: Key,
      color: '#000000',
      badge: connections.notion ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.notion ? 'emerald' : 'amber',
      description: 'Exporte suas tarefas, hábitos, finanças e evolução pessoal direto para bases de dados do Notion.',
      howToUse: 'Diga ao Mega Jarves: "Exportar meu resumo da semana para o Notion" ou "Sincronizar minhas tarefas de hoje no Notion".',
      configType: 'token',
      connected: connections.notion,
      fields: [
        { label: 'Notion Internal Integration Token', placeholder: 'secret_xxxxxxxxxxxxxxxxxxxxxxxx' },
        { label: 'Database ID de Tarefas', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }
      ]
    },

    // 9. Home Assistant
    {
      id: 'home_assistant',
      name: 'Home Assistant (Casa Inteligente)',
      category: 'iot',
      icon: Home,
      color: '#18B0F2',
      badge: connections.home_assistant ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.home_assistant ? 'emerald' : 'amber',
      description: 'Controle sua casa inteligente e dispositivos IoT através do Mega Jarves (luzes, ar-condicionado, tomadas e câmeras).',
      howToUse: 'Diga ao Mega Jarves: "Acenda as luzes da sala" ou "Ativar modo bom dia" ou "Desligar o ar-condicionado".',
      configType: 'token',
      connected: connections.home_assistant,
      fields: [
        { label: 'URL do Home Assistant (Local ou Nabu Casa)', placeholder: 'http://homeassistant.local:8123' },
        { label: 'Long-Lived Access Token', placeholder: 'Bearer eyJhbGciOiJIUzI1NiIsInR5c...' }
      ]
    },

    // 10. n8n
    {
      id: 'n8n',
      name: 'n8n Workflow Automation',
      category: 'productivity',
      icon: Webhook,
      color: '#EA4B71',
      badge: connections.n8n ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.n8n ? 'emerald' : 'amber',
      description: 'Automatize rotinas e conecte as ações do Mega Jarves a centenas de outras ferramentas sem limites de código.',
      howToUse: 'Diga ao Mega Jarves: "Disparar fluxo de onboarding" ou configure webhooks acionados por eventos.',
      configType: 'webhook',
      connected: connections.n8n,
      fields: [
        { label: 'Webhook Production URL', placeholder: 'https://n8n.seu-dominio.com/webhook/jarves' },
        { label: 'API Key de Autenticação', placeholder: 'n8n_api_key_xxxxxxxx' }
      ]
    },

    // 11. GitHub
    {
      id: 'github',
      name: 'GitHub',
      category: 'productivity',
      icon: Github,
      color: '#24292e',
      badge: connections.github ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.github ? 'emerald' : 'amber',
      description: 'Vincule commits, pull requests e issues às suas tarefas e projetos de desenvolvimento com relatórios automáticos.',
      howToUse: 'Diga ao Mega Jarves: "Listar PRs abertos no repositório principal" ou "Vincular tarefa à issue #42".',
      configType: 'token',
      connected: connections.github,
      fields: [
        { label: 'Personal Access Token (classic ou fine-grained)', placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxx' },
        { label: 'Repositório Padrão (owner/repo)', placeholder: 'empresa/projeto-principal' }
      ]
    },

    // 12. Trello
    {
      id: 'trello',
      name: 'Trello',
      category: 'productivity',
      icon: TrelloIcon,
      color: '#0079BF',
      badge: connections.trello ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.trello ? 'emerald' : 'amber',
      description: 'Deixe o Mega Jarves transformar suas tarefas em cards do Trello e gerenciar a organização dos seus quadros Kanban.',
      howToUse: 'Diga ao Mega Jarves: "Criar um card no Trello na lista A Fazer chamado Revisar Contrato".',
      configType: 'token',
      connected: connections.trello,
      fields: [
        { label: 'Trello API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
        { label: 'Trello User Token', placeholder: 'ATTAxxxxxxxxxxxxxxxxxxxxxxxx' }
      ]
    },

    // 13. Amazon Alexa
    {
      id: 'alexa',
      name: 'Amazon Alexa',
      category: 'iot',
      icon: Radio,
      color: '#00CAFF',
      badge: connections.alexa ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.alexa ? 'emerald' : 'amber',
      description: 'Conecte o Mega Jarves à Alexa usando Rotinas + Webhooks. Diga "Alexa, falar com Mega Jarves" para acionar tarefas e lembretes.',
      howToUse: 'Diga: "Alexa, ativar Mega Jarves — adicionar uma tarefa para amanhã às 10h".',
      configType: 'webhook',
      connected: connections.alexa,
      fields: [
        { label: 'Webhook de Disparo Alexa Skill', placeholder: 'https://api.megajarvis.ai/v1/alexa/webhook' }
      ]
    },

    // 14. Google Home / Google Assistant
    {
      id: 'google_home',
      name: 'Google Home / Google Assistant',
      category: 'iot',
      icon: Home,
      color: '#FBBC05',
      badge: connections.google_home ? 'ATIVO' : 'CONFIGURAR',
      badgeColor: connections.google_home ? 'emerald' : 'amber',
      description: 'Conecte o Mega Jarves ao Google Home usando Rotinas do Google Assistant no seu smartphone ou caixa Nest Audio.',
      howToUse: 'Diga: "Ok Google, falar com Mega Jarves — registrar despesa de 50 reais".',
      configType: 'webhook',
      connected: connections.google_home,
      fields: [
        { label: 'Google Assistant Action Endpoint', placeholder: 'https://api.megajarvis.ai/v1/google-assistant' }
      ]
    },
  ];

  const handleToggleAccordion = (id: string) => {
    sounds.playClick();
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleToggleConnection = (id: string) => {
    sounds.playJarvisActivate();
    setConnections(prev => {
      const next = !prev[id];
      return { ...prev, [id]: next };
    });
    setSaveSuccessId(id);
    setTimeout(() => setSaveSuccessId(null), 3000);
  };

  const filteredIntegrations = integrationsList.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>HUB DE CONEXÕES // 14 INTEGRAÇÕES DISPONÍVEIS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
          <Puzzle className="w-9 h-9 text-cyan-400" />
          <span>CENTRAL DE INTEGRAÇÕES INTELIGENTES</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Conecte o JARVES a seus emails (Gmail, Outlook), armazenamento cloud (Google Drive, OneDrive), mensageiros (WhatsApp, Teams), automações e dispositivos IoT.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-3xl bg-[#040918] border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'Todas as Integrações' },
            { id: 'email', label: 'Emails (Gmail & Outlook)' },
            { id: 'cloud', label: 'Nuvem (Drive & OneDrive)' },
            { id: 'comms', label: 'Comunicação (WhatsApp & Teams)' },
            { id: 'productivity', label: 'Produtividade & Automação' },
            { id: 'iot', label: 'Casa Inteligente (IoT)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(cat.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filtrar integrações..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

      </div>

      {/* Grid of Integration Cards (Matching the user screenshot style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIntegrations.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedId === item.id;
          const isConnected = connections[item.id];

          return (
            <div
              key={item.id}
              className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isConnected
                  ? 'bg-[#040c1e]/90 border-cyan-500/40 shadow-[0_0_25px_rgba(0,242,254,0.12)]'
                  : 'bg-[#040816]/90 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {/* Card Header & Description */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center p-2.5 shadow-lg"
                      style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <div>
                      <h3 className="font-rajdhani text-xl font-bold text-white tracking-wide">{item.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {item.category.toUpperCase()} // INTEGRATION
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {isConnected ? 'ATIVO' : 'CONFIGURAR'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* COMO USAR BOX (Cyan dashed/bordered box matching screenshot) */}
                <div className="p-3.5 rounded-2xl bg-[#031526]/60 border border-cyan-500/30 text-xs text-cyan-200/90 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                    COMO USAR:
                  </span>
                  <p className="italic text-[11px] leading-relaxed">
                    "{item.howToUse}"
                  </p>
                </div>
              </div>

              {/* Expandable Configuration Drawer */}
              <div className="border-t border-white/5 bg-[#02050f]/80 px-6 py-4">
                
                {/* Accordion Toggle Header */}
                <button
                  onClick={() => handleToggleAccordion(item.id)}
                  className="w-full flex items-center justify-between text-xs font-rajdhani font-bold uppercase tracking-wider text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isExpanded ? 'Ocultar Configuração' : 'Configurar Agora'}</span>
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-in fade-in duration-200">
                    
                    {/* QR Code view for WhatsApp */}
                    {item.configType === 'qr' && (
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-2xl bg-black/40 border border-emerald-500/20">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://megajarvis.base44.app"
                          alt="QR Code"
                          className="w-20 h-20 rounded-xl bg-white p-1"
                        />
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-emerald-300">Conexão Ativa via Webhook</p>
                          <p className="text-slate-400 text-[11px]">Seu número está pareado para receber áudios e transcrever comandos instantaneamente.</p>
                        </div>
                      </div>
                    )}

                    {/* Inputs for Token / OAuth / Webhook */}
                    {item.fields && (
                      <div className="space-y-3">
                        {item.fields.map((field, idx) => (
                          <div key={idx}>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                              {field.label}
                            </label>
                            <input
                              type={field.type || 'text'}
                              defaultValue={field.placeholder}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Connection Toggle Action Button */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                        <span className="text-[11px] font-mono text-slate-400">
                          {isConnected ? 'Status: Conectado e Sincronizado' : 'Status: Desconectado'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleConnection(item.id)}
                        className={`px-4 py-2 rounded-xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          isConnected
                            ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/50'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                        }`}
                      >
                        {saveSuccessId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Atualizado!</span>
                          </>
                        ) : isConnected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Desconectar</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Conectar e Autorizar</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
