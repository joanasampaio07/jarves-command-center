import React from 'react';
import { ShieldAlert, Server, Cpu, Database, Users, Terminal, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Admin: React.FC = () => {
  const { user, tasks, habits, transactions, activityLogs } = useApp();

  const mockUsers = [
    { id: 'usr_01', name: user.name, email: user.email, role: 'SuperAdmin', plan: 'Enterprise', status: 'Ativo' },
    { id: 'usr_02', name: 'Marcela Passamani', email: 'marcela@inteligencia.com', role: 'Operador', plan: 'Pro', status: 'Ativo' },
    { id: 'usr_03', name: 'Equipe Tech Lead', email: 'dev@jarves.ai', role: 'Dev', plan: 'Pro', status: 'Ativo' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-[#0a0515] to-[#040918] border border-red-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-rajdhani tracking-wider text-white">
              PAINEL ADMINISTRATIVO // ROOT ACCESS
            </h1>
            <p className="text-xs text-red-300/80 font-mono">Controle de nós de inteligência, banco de dados e usuários</p>
          </div>
        </div>
      </div>

      {/* Infrastructure Telemetry HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#040918] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Uptime dos Agentes</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-rajdhani text-emerald-400">99.98%</p>
          <span className="text-[10px] text-slate-500 font-mono">Latência: 42ms</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#040918] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Consumo de Tokens IA</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-rajdhani text-cyan-400">142.8k</p>
          <span className="text-[10px] text-slate-500 font-mono">Modelo: GPT-4o / Realtime</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#040918] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Registros no Banco</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-rajdhani text-purple-400">
            {tasks.length + habits.length + transactions.length}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Supabase / Base44 Core</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#040918] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Usuários Registrados</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-rajdhani text-amber-400">3</p>
          <span className="text-[10px] text-slate-500 font-mono">Assinaturas Ativas</span>
        </div>

      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-slate-800">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <span>Usuários do Sistema</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-3">Nome</th>
                <th className="pb-3">E-mail</th>
                <th className="pb-3">Nível</th>
                <th className="pb-3">Plano</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockUsers.map(u => (
                <tr key={u.id} className="text-slate-200">
                  <td className="py-3 font-bold">{u.name}</td>
                  <td className="py-3 font-mono text-slate-400">{u.email}</td>
                  <td className="py-3 font-mono text-cyan-400">{u.role}</td>
                  <td className="py-3 font-mono text-amber-400">{u.plan}</td>
                  <td className="py-3 font-mono text-emerald-400">● {u.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Telemetry Logs */}
      <div className="p-6 rounded-3xl bg-[#030612] border border-slate-800 font-mono text-xs">
        <h3 className="font-rajdhani text-lg font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Logs de Auditoria em Tempo Real</span>
        </h3>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 text-slate-400 text-[11px]">
          {activityLogs.map(log => (
            <div key={log.id} className="flex items-center justify-between border-b border-white/[0.02] py-1">
              <span className="text-cyan-400">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className="text-slate-200 flex-1 mx-3 truncate">{log.description}</span>
              <span className="text-slate-500 uppercase">{log.action}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
