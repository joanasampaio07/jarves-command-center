import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Wallet as WalletIcon, 
  Trash2, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { sounds } from '../lib/sound';

export const Finances: React.FC = () => {
  const { wallets, transactions, deleteTransaction, setActiveQuickAction } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const filteredTxs = transactions.filter(t => filterType === 'all' || t.type === filterType);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            <span>CENTRAL FINANCEIRA & CARTEIRAS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de patrimônio, fluxo de caixa e controle de múltiplas contas
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveQuickAction('transaction');
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-rajdhani font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Transação</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-[#060e22] border border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,254,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-slate-400">Saldo Total Consolidado</span>
            <WalletIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold font-rajdhani text-white">{formatCurrency(totalBalance)}</p>
          <p className="text-xs text-cyan-400 mt-2 font-mono">Disponível em {wallets.length} carteiras</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#060e22] border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-slate-400">Receitas Registradas</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold font-rajdhani text-emerald-400">+{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-emerald-400/70 mt-2 font-mono">Entradas contabilizadas</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#060e22] border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-slate-400">Despesas Registradas</span>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold font-rajdhani text-red-400">-{formatCurrency(totalExpense)}</p>
          <p className="text-xs text-red-400/70 mt-2 font-mono">Saídas e custos operacionais</p>
        </div>
      </div>

      {/* Wallets Row */}
      <div className="space-y-3">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider">Carteiras e Contas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {wallets.map((w) => (
            <div
              key={w.id}
              className="p-5 rounded-2xl bg-[#040918] border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: w.color }}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{w.name}</h4>
                  <span className="text-[10px] font-mono uppercase text-slate-400">{w.type}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold font-rajdhani text-white">{formatCurrency(w.balance)}</p>
                {w.is_default && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">PADRÃO</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table & Filters */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider">Histórico de Transações</h3>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                filterType === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                filterType === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                filterType === 'expense' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Despesas
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {filteredTxs.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-500">Nenhuma transação encontrada no período.</p>
          ) : (
            filteredTxs.map((tx) => {
              const isIncome = tx.type === 'income';
              const wallet = wallets.find(w => w.id === tx.wallet_id);
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-[#060c1e] border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isIncome ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{tx.description}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px]">{wallet?.name || 'Carteira'}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px]">{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-base font-bold font-rajdhani ${
                      isIncome ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
