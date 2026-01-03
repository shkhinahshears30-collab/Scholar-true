
import React, { useState, useEffect } from 'react';
// Added ShieldCheck and Sparkles to the lucide-react imports
import { Shield, Clock, Zap, Flame, User, BarChart3, Activity, Wifi, Lock, Bell, CheckCircle2, Heart, ShieldCheck, Sparkles } from 'lucide-react';

interface GuardianLiveViewProps {
  studentName: string;
  syncCode: string;
}

const GuardianLiveView: React.FC<GuardianLiveViewProps> = ({ studentName, syncCode }) => {
  const [pulse, setPulse] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6 animate-in fade-in duration-700">
        
        {/* Connection Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Voice Link Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black text-indigo-600 uppercase">{syncCode}</span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-3xl shadow-lg border border-white/10">
              🎓
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">{studentName}</h1>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-indigo-300">Scholar ID: #{syncCode.slice(0,4)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Current Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${pulse ? 'bg-emerald-500' : 'bg-emerald-800'} transition-colors duration-500`}></div>
                <span className="text-sm font-black uppercase tracking-tighter italic">Deep Focus Mode</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Time Remaining</span>
              <p className="text-xl font-black tabular-nums tracking-tighter text-indigo-400">18:42</p>
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Live Activity Feed</h2>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 flex items-center gap-4 border-b border-slate-50">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Activity size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">Study Session Started</p>
                <p className="text-[8px] font-black text-slate-400 uppercase">25 mins ago</p>
              </div>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>
            <div className="p-5 flex items-center gap-4 border-b border-slate-50">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Lock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">Distraction Filter Applied</p>
                <p className="text-[8px] font-black text-slate-400 uppercase">22 mins ago</p>
              </div>
              <ShieldCheck size={16} className="text-indigo-500" />
            </div>
            <div className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                <Heart size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">Companion "Mochi" Fed</p>
                <p className="text-[8px] font-black text-slate-400 uppercase">5 mins ago</p>
              </div>
              <Sparkles size={16} className="text-amber-400" />
            </div>
          </div>
        </div>

        {/* Weekly Insights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-2">
              <Flame size={20} />
            </div>
            <span className="text-xl font-black text-slate-900">7</span>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Day Streak</p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-2">
              <Clock size={20} />
            </div>
            <span className="text-xl font-black text-slate-900">12.5h</span>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Focus</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 text-center">
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em] mb-4">Encrypted Guardian link by Scholar</p>
          <div className="flex items-center justify-center gap-2">
             <Shield size={12} className="text-slate-300" />
             <span className="text-[8px] font-black text-slate-300 uppercase">End-to-End Privacy Certified</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GuardianLiveView;
