import React from 'react';
import { Shield, Lock, X, Construction, Clock, Rocket, Sparkles, ChevronLeft } from 'lucide-react';
import { UserSettings } from '../types';

interface GuardianSyncProps {
  settings: UserSettings;
  onUpdateGuardian: (data: Partial<UserSettings>) => void;
  onClose: () => void;
}

const GuardianSync: React.FC<GuardianSyncProps> = ({ settings, onClose }) => {
  return (
    <div className="p-6 pb-24 min-h-screen bg-slate-900 text-white animate-in slide-in-from-bottom-6 duration-500 flex flex-col items-center justify-center">
      <button onClick={onClose} className="absolute top-6 left-6 p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={24} />
      </button>

      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full"></div>
          <div className="p-10 bg-indigo-600/20 rounded-[3rem] border border-indigo-500/30 relative">
            <Shield size={64} className="text-white animate-pulse" />
            <div className="absolute -bottom-2 -right-2 p-3 bg-amber-500 text-slate-900 rounded-2xl shadow-xl">
               <Construction size={24} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-amber-400 font-black text-[10px] uppercase tracking-[0.5em] animate-bounce">Deploying Q2 2026</p>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-400">
            GUARDIAN SYNC
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-6">
            We are building a secure, encrypted bridge for parents and tutors to celebrate your success without invading your workspace.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-8">
           <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-2">
              <Lock size={20} className="text-indigo-400" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Zero-Knowledge Privacy</span>
           </div>
           <div className={`p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-2 ${settings.isRoyal ? 'border-amber-500/50' : ''}`}>
              <Rocket size={20} className="text-emerald-400" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Live Status Feed</span>
           </div>
        </div>

        <div className="pt-10">
          <div className="flex items-center justify-center gap-2 mb-4">
             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Alpha Testing in Progress</span>
          </div>
          <button 
            onClick={onClose}
            className="w-full bg-white text-black py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
          >
            NOTIFY ME ON RELEASE
          </button>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-2 text-slate-600">
         <Sparkles size={14} />
         <p className="text-[8px] font-black uppercase tracking-[0.3em]">Exclusively for Elite Scholars</p>
      </div>
    </div>
  );
};

export default GuardianSync;
