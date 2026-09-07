import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Server, 
  Cpu, 
  Database, 
  Users, 
  Terminal, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  MessageSquare, 
  Headphones, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Plus, 
  Send, 
  Zap, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../lib/sound';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'starter' | 'ultra_vip';
  price: number;
  status: 'active' | 'trial' | 'cancelled';
  tokensUsedToday: number;
  tokensLimit: number;
  joinedAt: string;
  gateway: 'Kiwify' | 'Hotmart' | 'Stripe' | 'Mercado Pago' | 'Asaas';
}

interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  response?: string;
}

export const Admin: React.FC = () => {
  const { user, tasks, habits, transactions, activityLogs, logActivity } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'support' | 'checkout_guide' | 'telemetry'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEmailTemplate, setCopiedEmailTemplate] = useState(false);
  
  // Mock Customers Data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'cust_01',
      name: user.name || 'Comandante Stark',
      email: user.email || 'comandante@jarves.ai',
      phone: '+55 11 98888-7777',
      plan: 'ultra_vip',
      price: 99,
      status: 'active',
      tokensUsedToday: 42,
      tokensLimit: 1000,
      joinedAt: '2026-09-01',
      gateway: 'Kiwify'
    },
    {
      id: 'cust_02',
      name: 'Marcela Passamani',
      email: 'marcela.passamani@gestao.com',
      phone: '+55 27 99999-1234',
      plan: 'ultra_vip',
      price: 99,
      status: 'active',
      tokensUsedToday: 180,
      tokensLimit: 1000,
      joinedAt: '2026-09-03',
      gateway: 'Hotmart'
    },
    {
      id: 'cust_03',
      name: 'Rodrigo Albuquerque',
      email: 'rodrigo.tech@startup.io',
      phone: '+55 11 97777-3333',
      plan: 'starter',
      price: 29,
      status: 'active',
      tokensUsedToday: 85,
      tokensLimit: 200,
      joinedAt: '2026-09-05',
      gateway: 'Stripe'
    },
    {
      id: 'cust_04',
      name: 'Juliana Mendes Silveira',
      email: 'juliana.adv@direitodigital.com',
      phone: '+55 31 99888-4444',
      plan: 'starter',
      price: 29,
      status: 'active',
      tokensUsedToday: 30,
      tokensLimit: 200,
      joinedAt: '2026-09-06',
      gateway: 'Asaas'
    },
    {
      id: 'cust_05',
      name: 'Carlos Eduardo Stark',
      email: 'carlos.e@investimentos.com',
      phone: '+55 41 98765-4321',
      plan: 'starter',
      price: 29,
      status: 'active',
      tokensUsedToday: 12,
      tokensLimit: 200,
      joinedAt: '2026-09-07',
      gateway: 'Mercado Pago'
    }
  ]);

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'tkt_101',
      customerName: 'Rodrigo Albuquerque',
      customerEmail: 'rodrigo.tech@startup.io',
      subject: 'Como ativar a voz neural customizada do ElevenLabs?',
      message: 'Olá suporte! Gostaria de saber se no plano de R$ 29 consigo colocar minha voz clonada do ElevenLabs ou preciso migrar para o plano VIP de R$ 99?',
      priority: 'medium',
      status: 'open',
      createdAt: '2026-09-07 09:30',
      response: ''
    },
    {
      id: 'tkt_102',
      customerName: 'Juliana Mendes Silveira',
      customerEmail: 'juliana.adv@direitodigital.com',
      subject: 'Dúvida sobre integração do WhatsApp Comercial',
      message: 'Gostaria de conectar o WhatsApp da minha empresa para o JARVES responder meus clientes automaticamente. Já está disponível?',
      priority: 'high',
      status: 'in_progress',
      createdAt: '2026-09-07 08:15',
      response: 'Olá Juliana! Sim, a integração com WhatsApp está ativa na aba Integrações via QR Code ou Webhook Z-API.'
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReply, setTicketReply] = useState('');

  // Financial Calculations
  const totalMRR = customers.filter(c => c.status === 'active').reduce((sum, c) => sum + c.price, 0);
  const starterCount = customers.filter(c => c.plan === 'starter' && c.status === 'active').length;
  const ultraVipCount = customers.filter(c => c.plan === 'ultra_vip' && c.status === 'active').length;
  const estimatedTokenCost = customers.length * 1.85; // Custo médio de ~R$ 1,85 por cliente com Groq/Gemini/ElevenLabs
  const netProfit = totalMRR - estimatedTokenCost;
  const marginPercentage = Math.round((netProfit / (totalMRR || 1)) * 100);

  const handleSimulateNewSale = () => {
    sounds.playDataBeep();
    const isVip = Math.random() > 0.5;
    const price = isVip ? 99 : 29;
    const planName = isVip ? 'ultra_vip' : 'starter';
    const gateways: Customer['gateway'][] = ['Kiwify', 'Hotmart', 'Stripe', 'Mercado Pago', 'Asaas'];
    const randomGateway = gateways[Math.floor(Math.random() * gateways.length)];

    const randomNames = ['Lucas Ferreira', 'Fernanda Lima', 'Gabriel Barbosa', 'Camila Nogueira', 'Bruno Covas'];
    const name = randomNames[Math.floor(Math.random() * randomNames.length)] + ' (Novo)';
    const email = `cliente_${Math.floor(Math.random() * 1000)}@gmail.com`;

    const newCust: Customer = {
      id: 'cust_' + Date.now().toString().slice(-4),
      name,
      email,
      phone: '+55 11 9' + Math.floor(10000000 + Math.random() * 90000000),
      plan: planName,
      price,
      status: 'active',
      tokensUsedToday: 0,
      tokensLimit: isVip ? 1000 : 200,
      joinedAt: new Date().toISOString().split('T')[0],
      gateway: randomGateway
    };

    setCustomers(prev => [newCust, ...prev]);
    sounds.playSuccess();
    logActivity('nova_venda', 'finance', `Nova venda confirmada: ${name} comprou Plano ${isVip ? 'ULTRA VIP (R$ 99)' : 'STARTER (R$ 29)'} via ${randomGateway}`);
  };

  const handleUpgradeCustomer = (id: string) => {
    sounds.playClick();
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          plan: 'ultra_vip',
          price: 99,
          tokensLimit: 1000
        };
      }
      return c;
    }));
    sounds.playSuccess();
  };

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !ticketReply.trim()) return;

    sounds.playClick();
    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: 'resolved',
          response: ticketReply
        };
      }
      return t;
    }));

    setSelectedTicket(prev => prev ? { ...prev, status: 'resolved', response: ticketReply } : null);
    setTicketReply('');
    sounds.playSuccess();
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.gateway.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/50 via-[#0a0515] to-[#040918] border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <ShieldAlert className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-rajdhani tracking-wider text-white">
                PAINEL DE VENDAS & ADMIN // ROOT
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-bold border border-red-500/30">
                PROD v3.0
              </span>
            </div>
            <p className="text-xs text-red-300/80 font-mono">
              Gestão de compradores, faturamento recorrente (MRR), suporte e cotas de IA
            </p>
          </div>
        </div>

        {/* Action: Simulate Sale Webhook */}
        <button
          onClick={handleSimulateNewSale}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-rajdhani font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Simular Venda (Kiwify/Stripe)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => { sounds.playClick(); setActiveTab('overview'); }}
          className={`px-4 py-2 rounded-xl text-xs font-rajdhani font-bold uppercase tracking-wider transition-all ${
            activeTab === 'overview'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Visão Geral & Faturamento
        </button>

        <button
          onClick={() => { sounds.playClick(); setActiveTab('customers'); }}
          className={`px-4 py-2 rounded-xl text-xs font-rajdhani font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            activeTab === 'customers'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Compradores & Clientes ({customers.length})</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); setActiveTab('support'); }}
          className={`px-4 py-2 rounded-xl text-xs font-rajdhani font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            activeTab === 'support'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Suporte Técnico ({tickets.filter(t => t.status !== 'resolved').length} abertos)</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); setActiveTab('checkout_guide'); }}
          className={`px-4 py-2 rounded-xl text-xs font-rajdhani font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            activeTab === 'checkout_guide'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
          <span>Como Vender & Receber (Checkouts & E-mail)</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); setActiveTab('telemetry'); }}
          className={`px-4 py-2 rounded-xl text-xs font-rajdhani font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            activeTab === 'telemetry'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Logs & Telemetria</span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB: SaaS Financials & Key Metrics */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Revenue & Profit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total MRR */}
            <div className="p-5 rounded-2xl bg-[#040918] border border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,254,0.1)]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Receita Mensal (MRR)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold font-rajdhani text-emerald-400">
                R$ {totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-mono mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>{customers.length} assinaturas ativas</span>
              </div>
            </div>

            {/* Net Profit & Margin */}
            <div className="p-5 rounded-2xl bg-[#040918] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Lucro Líquido Estimado</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-bold font-rajdhani text-purple-400">
                R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[11px] text-purple-300 font-mono">Margem de {marginPercentage}% de lucro</span>
            </div>

            {/* Plan Breakdown */}
            <div className="p-5 rounded-2xl bg-[#040918] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Mix de Planos Vendidos</span>
                <CreditCard className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold font-rajdhani text-cyan-400">{starterCount}x R$29</p>
                <span className="text-slate-500">|</span>
                <p className="text-2xl font-bold font-rajdhani text-purple-400">{ultraVipCount}x R$99</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Taxa de Upgrade: {Math.round((ultraVipCount / customers.length) * 100)}%</span>
            </div>

            {/* Token Infrastructure Cost */}
            <div className="p-5 rounded-2xl bg-[#040918] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Custo das Chaves IA (Tokens)</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-3xl font-bold font-rajdhani text-cyan-300">
                R$ {estimatedTokenCost.toFixed(2)}
              </p>
              <span className="text-[10px] text-slate-500 font-mono">Groq Llama 3.3 + Gemini + ElevenLabs</span>
            </div>

          </div>

          {/* Quick Customers Snapshot & Conversion Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Recent Buyers */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#040918] border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-rajdhani text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Últimos Compradores Registrados</span>
                </h3>
                <button
                  onClick={() => setActiveTab('customers')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                >
                  <span>Ver todos ({customers.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 font-mono uppercase text-[10px]">
                      <th className="pb-3">Comprador</th>
                      <th className="pb-3">Plano</th>
                      <th className="pb-3">Valor</th>
                      <th className="pb-3">Gateway</th>
                      <th className="pb-3">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {customers.slice(0, 4).map(c => (
                      <tr key={c.id} className="text-slate-200">
                        <td className="py-3">
                          <p className="font-bold text-white">{c.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{c.email}</p>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            c.plan === 'ultra_vip' 
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {c.plan === 'ultra_vip' ? 'ULTRA VIP' : 'STARTER'}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-emerald-400">R$ {c.price}/mês</td>
                        <td className="py-3 font-mono text-slate-300">{c.gateway}</td>
                        <td className="py-3 font-mono text-slate-400">{c.joinedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: SaaS Strategy Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0c1836] to-[#040918] border border-cyan-500/30 space-y-4">
              <h3 className="font-rajdhani text-lg font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Estratégia de Escala (Milhões de Usuários)</span>
              </h3>
              
              <p className="text-xs text-slate-300 leading-relaxed">
                Ao vender o JARVES a <strong>R$ 29/mês</strong> de entrada e oferecer o upgrade para <strong>R$ 99/mês</strong>:
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex justify-between">
                  <span className="text-slate-400">1.000 Usuários:</span>
                  <strong className="text-emerald-400">R$ 29.000 / mês</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex justify-between">
                  <span className="text-slate-400">10.000 Usuários:</span>
                  <strong className="text-emerald-400">R$ 290.000 / mês</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex justify-between">
                  <span className="text-slate-400">100.000 Usuários:</span>
                  <strong className="text-emerald-400">R$ 2.900.000 / mês</strong>
                </div>
              </div>

              <p className="text-[11px] text-cyan-300/80">
                🔒 O limite diário de 200 comandos garante que nenhum usuário consuma além do previsto na cota.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* 2. CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, e-mail ou gateway (ex: Kiwify)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Total: {filteredCustomers.length} clientes</span>
            </div>
          </div>

          {/* Table */}
          <div className="p-6 rounded-3xl bg-[#040918] border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="pb-3">Comprador</th>
                    <th className="pb-3">WhatsApp / Contato</th>
                    <th className="pb-3">Plano Atual</th>
                    <th className="pb-3">Consumo de IA Hoje</th>
                    <th className="pb-3">Gateway</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCustomers.map(c => (
                    <tr key={c.id} className="text-slate-200 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5">
                        <p className="font-bold text-white text-sm">{c.name}</p>
                        <p className="text-[11px] text-cyan-400/80 font-mono">{c.email}</p>
                      </td>
                      <td className="py-3.5 font-mono text-slate-300">
                        <a 
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="hover:text-emerald-400 flex items-center gap-1"
                        >
                          <span>{c.phone}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      </td>
                      <td className="py-3.5">
                        <span className={`text-[10px] px-2 py-1 rounded-lg font-mono font-bold ${
                          c.plan === 'ultra_vip' 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {c.plan === 'ultra_vip' ? 'ULTRA VIP (R$ 99)' : 'STARTER (R$ 29)'}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-200">{c.tokensUsedToday} / {c.tokensLimit}</span>
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-cyan-400 h-full rounded-full" 
                              style={{ width: `${Math.min(100, (c.tokensUsedToday / c.tokensLimit) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-slate-300 font-bold">{c.gateway}</td>
                      <td className="py-3.5 font-mono text-emerald-400">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Ativo</span>
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        {c.plan === 'starter' && (
                          <button
                            onClick={() => handleUpgradeCustomer(c.id)}
                            className="px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-mono hover:bg-purple-900 transition-colors"
                            title="Fazer Upgrade Manual para Plano de R$ 99"
                          >
                            Upgrade R$ 99
                          </button>
                        )}
                        <a
                          href={`mailto:${c.email}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono hover:bg-slate-700 transition-colors inline-block"
                        >
                          E-mail
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 3. SUPPORT TAB */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Left: Tickets List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-rajdhani text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Headphones className="w-4 h-4 text-cyan-400" />
              <span>Chamados de Suporte ({tickets.length})</span>
            </h3>

            <div className="space-y-2.5">
              {tickets.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTicket(t);
                    setTicketReply(t.response || '');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedTicket?.id === t.id
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                      : 'bg-[#040918] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white truncate">{t.customerName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      t.status === 'resolved' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : t.status === 'in_progress'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {t.status === 'resolved' ? 'Resolvido' : t.status === 'in_progress' ? 'Em Atendimento' : 'Aberto'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium truncate">{t.subject}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">{t.createdAt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Ticket Detail & Response Editor */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/30 space-y-5">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Chamado #{selectedTicket.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{selectedTicket.createdAt}</span>
                  </div>
                  <h3 className="text-lg font-bold font-rajdhani text-white mt-1">{selectedTicket.subject}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    De: <strong className="text-slate-200">{selectedTicket.customerName}</strong> ({selectedTicket.customerEmail})
                  </p>
                </div>

                {/* Customer Message */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Mensagem do Cliente:</p>
                  {selectedTicket.message}
                </div>

                {/* Existing Response or Reply Form */}
                <form onSubmit={handleSendTicketReply} className="space-y-3">
                  <label className="block text-xs font-mono uppercase text-cyan-300 font-bold">
                    Responder ao Cliente (Via JARVES Suporte / E-mail):
                  </label>
                  <textarea
                    rows={4}
                    value={ticketReply}
                    onChange={e => setTicketReply(e.target.value)}
                    placeholder="Digite a resposta do suporte técnico..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Status atual: <strong>{selectedTicket.status.toUpperCase()}</strong>
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-rajdhani font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar Resposta & Resolver</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-[#040918] border border-slate-800 text-center text-slate-500">
                <Headphones className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-xs">Selecione um chamado à esquerda para visualizar e responder.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. CHECKOUT & EMAIL GUIDE TAB */}
      {activeTab === 'checkout_guide' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Top Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#04101e] to-[#040918] border border-emerald-500/30 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>GUIA DE VENDAS, CHECKOUT & RECEBIMENTO PIX/CARTÃO</span>
            </div>
            <h2 className="text-2xl font-bold font-rajdhani text-white">
              Como Cobrar R$ 29 / R$ 99 e Receber o Dinheiro Diretamente na Sua Conta
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Você pode usar qualquer plataforma de pagamentos do Brasil (Kiwify, Mercado Pago, Asaas, Hotmart ou Stripe). O cliente paga no PIX ou Cartão e recebe o acesso imediatamente com o e-mail de boas-vindas.
            </p>
          </div>

          {/* 3 Step Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-[#040918] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-rajdhani font-bold text-lg">
                1
              </div>
              <h3 className="font-rajdhani text-lg font-bold text-white uppercase tracking-wider">
                Cadastre o Produto no Checkout
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Crie uma conta gratuita na <strong>Kiwify</strong>, <strong>Mercado Pago</strong> ou <strong>Asaas</strong> e crie o produto:
              </p>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <p>• Nome: <strong>JARVES IA - M&S Consultoria</strong></p>
                <p>• Preço: <strong>R$ 29,00 / mês</strong> (Plano Starter)</p>
                <p>• Upsell: <strong>R$ 99,00 / mês</strong> (Plano VIP)</p>
                <p>• Tipo: <strong>Assinatura Recorrente</strong></p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-[#040918] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-rajdhani font-bold text-lg">
                2
              </div>
              <h3 className="font-rajdhani text-lg font-bold text-white uppercase tracking-wider">
                O Dinheiro Cai na Sua Conta
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quando o cliente compra via PIX ou Cartão:
              </p>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <p>• PIX: <strong>Aprovado em 2 segundos</strong></p>
                <p>• Saldo liberado no seu painel da Kiwify/Asaas</p>
                <p>• Saque automático para sua chave PIX/banco</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-[#040918] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-rajdhani font-bold text-lg">
                3
              </div>
              <h3 className="font-rajdhani text-lg font-bold text-white uppercase tracking-wider">
                E-mail de Boas-Vindas Automático
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A plataforma de pagamento (ou você) envia as instruções e o link oficial do JARVES para o comprador logar com o e-mail dele.
              </p>
            </div>

          </div>

          {/* Email Template Card */}
          <div className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <span>Modelo de E-mail de Boas-Vindas Pronto para Enviar</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Copie e configure na sua plataforma de checkout (Kiwify, Hotmart, etc.) no campo "E-mail pós-venda".
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  const emailText = `Assunto: 🎉 Seu Acesso ao JARVES da M&S Consultoria Foi Liberado!\n\nOlá Comandante,\n\nParabéns! Seu pagamento foi confirmado e seu acesso ao JARVES (Sistema Operacional de Inteligência Artificial da M&S Consultoria) já está 100% liberado.\n\n🔗 Link de Acesso Oficial:\nhttps://jarves-command-center.onrender.com\n\n📌 Como Acessar:\n1. Acesse o link acima.\n2. Clique em 'Continuar com Google' ou faça login com o mesmo e-mail que você usou na compra.\n3. Seu painel com comando de voz neural, robô 3D, gestão de tarefas e finanças será inicializado automaticamente.\n\nCaso precise de suporte, conte com nosso time.\n\nAtenciosamente,\nEquipe M&S Consultoria\nhttps://jarves-command-center.onrender.com`;
                  navigator.clipboard.writeText(emailText);
                  setCopiedEmailTemplate(true);
                  sounds.playSuccess();
                  setTimeout(() => setCopiedEmailTemplate(false), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-rajdhani font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center gap-2"
              >
                {copiedEmailTemplate ? <CheckCircle2 className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                <span>{copiedEmailTemplate ? 'Copiado para a Área de Transferência!' : 'Copiar Modelo de E-mail'}</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-line">
              {`Assunto: 🎉 Seu Acesso ao JARVES da M&S Consultoria Foi Liberado!

Olá Comandante,

Parabéns! Seu pagamento foi confirmado e seu acesso ao JARVES (Sistema de Inteligência Artificial da M&S Consultoria) já está liberado.

🔗 Link de Acesso Oficial:
https://jarves-command-center.onrender.com

📌 Como Acessar:
1. Acesse o link acima.
2. Faça login com o mesmo e-mail que você usou na compra.
3. Seu painel com comando de voz neural, robô 3D e inteligência autônoma será ativado instantaneamente.

Atenciosamente,
Equipe M&S Consultoria`}
            </div>
          </div>

        </div>
      )}

      {/* 5. TELEMETRY TAB */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#040918] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Uptime dos Agentes</span>
                <Server className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold font-rajdhani text-emerald-400">99.98%</p>
              <span className="text-[10px] text-slate-500 font-mono">Latência: 38ms</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#040918] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Tokens Consumidos</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold font-rajdhani text-cyan-400">142.8k</p>
              <span className="text-[10px] text-slate-500 font-mono">Groq + Gemini 2.0 Flash</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#040918] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Registros no Banco</span>
                <Database className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold font-rajdhani text-purple-400">
                {tasks.length + habits.length + transactions.length}
              </p>
              <span className="text-[10px] text-slate-500 font-mono">PostgreSQL / Supabase</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#030612] border border-slate-800 font-mono text-xs">
            <h3 className="font-rajdhani text-lg font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Logs de Auditoria e Eventos de Venda em Tempo Real</span>
            </h3>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2 text-slate-400 text-[11px]">
              {activityLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between border-b border-white/[0.02] py-1.5">
                  <span className="text-cyan-400">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-slate-200 flex-1 mx-3 truncate">{log.description}</span>
                  <span className="text-slate-500 uppercase">{log.action}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
