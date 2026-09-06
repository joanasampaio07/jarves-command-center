import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Volume2, Shield, Download, RefreshCw, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../lib/sound';

export const Settings: React.FC = () => {
  const { user, updateUserPreferences, tasks, habits, transactions, wallets } = useApp();
  const [name, setName] = useState(user.name);
  const [alias, setAlias] = useState(user.alias || '');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    user.name = name;
    user.alias = alias;
    updateUserPreferences({});
    setSaved(true);
    sounds.playSuccess();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportData = () => {
    sounds.playDataBeep();
    const fullData = {
      user,
      tasks,
      habits,
      transactions,
      wallets,
      exported_at: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarves_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-rajdhani tracking-wider text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-cyan-400" />
          <span>CONFIGURAÇÕES DO SISTEMA & PERFIL</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ajuste as preferências de usuário, notificações, exportação de dados e segurança
        </p>
      </div>

      {/* Profile Settings */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-cyan-500/20">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          <span>Perfil do Comandante</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Seu Nome</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Como a IA deve te chamar (Alias)</label>
              <input
                type="text"
                value={alias}
                onChange={e => setAlias(e.target.value)}
                placeholder="Ex: Chefe, Comandante, Stark"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-rajdhani font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center gap-2"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? 'Perfil Atualizado!' : 'Salvar Alterações'}</span>
          </button>
        </form>
      </div>

      {/* Backup & Export Data */}
      <div className="p-6 rounded-3xl bg-[#040918] border border-slate-800">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" />
          <span>Exportação & Backup dos Dados</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Baixe uma cópia completa de suas tarefas, hábitos, finanças e configurações em formato JSON.
        </p>

        <button
          onClick={handleExportData}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Backup (JSON)</span>
        </button>
      </div>

    </div>
  );
};
