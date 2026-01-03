
import React, { useState } from 'react';
import { Shield, UserPlus, Link, Copy, Check, X, ShieldCheck, Share2, Trash2 } from 'lucide-react';
import { UserSettings } from '../types';

interface GuardianSyncProps {
  settings: UserSettings;
  onUpdateGuardian: (data: Partial<UserSettings>) => void;
  onClose: () => void;
}

const GuardianSync: React.FC<GuardianSyncProps> = ({ settings, onUpdateGuardian, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [syncKey, setSyncKey] = useState(settings.guardianCode || "");

  const generateLink = () => {
    const newKey = Math.random().toString(36).substr(2, 8).toUpperCase();
    setSyncKey(newKey);
    onUpdateGuardian({ guardianCode: newKey, guardianLinked: true });
  };

  const shareLink = `${window.location.origin}${window.location.pathname}?view=guardian&code=${syncKey}&user=${encodeURIComponent(settings.userName || 'Student')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-slate-50 animate-in slide-in-from-bottom-6 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg"><Shield size={24} /></div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Security Portal</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Establishing Guardian Sync</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
      </div>

      <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-2xl flex flex-col items-center text-center">
        <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl transition-all duration-700 ${syncKey ? 'bg-emerald-50 text-emerald-600 animate-float' : 'bg-slate-50 text-slate-300'}`}>
          {syncKey ? <ShieldCheck size={48} /> : <UserPlus size={48} />}
        </div>
        
        {syncKey ? (
          <div className="w-full space-y-8 animate-in zoom-in-95">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Sync Link Ready</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Active Encrypted Tunnel</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 group">
              <input readOnly value={shareLink} className="bg-transparent border-none text-[10px] font-black text-indigo-600 flex-1 truncate select-all" />
              <button onClick={handleCopy} className="text-slate-400 hover:text-indigo-600 active:scale-90 transition-all">
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => window.open(`mailto:?subject=Guardian Access Link&body=Use this link to monitor my focus progress: ${shareLink}`)} 
                className="flex-1 bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
              >
                <Share2 size={18} /> Send via Mail
              </button>
              <button 
                onClick={() => { setSyncKey(""); onUpdateGuardian({ guardianCode: undefined, guardianLinked: false }); }} 
                className="p-6 bg-white border border-slate-100 text-slate-300 rounded-[2rem] hover:text-rose-500 transition-colors"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-2xl font-black italic uppercase mb-4 tracking-tighter">Accountability</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-12 leading-relaxed max-w-[280px] mx-auto">
              Securely share focus sessions, streaks, and knowledge metrics with your guardian.
            </p>
            <button 
              onClick={generateLink} 
              className="w-full bg-slate-900 text-white py-7 rounded-[2.5rem] font-black text-sm uppercase shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all"
            >
              GENERATE SYNC LINK <Link size={20} />
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-8 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
        <div className="flex items-center gap-3 mb-2">
           <ShieldCheck size={16} className="text-indigo-600" />
           <span className="text-[10px] font-black uppercase text-indigo-900">Guardian Honor Code</span>
        </div>
        <p className="text-[10px] text-indigo-600/70 font-medium leading-relaxed italic">
          Guardian Sync only shares metrics, never the content of your notes or specific app data. Your privacy remains absolute.
        </p>
      </div>
    </div>
  );
};

export default GuardianSync;
