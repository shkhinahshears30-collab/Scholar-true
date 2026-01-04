
import React, { useState, useEffect } from 'react';
import { Shield, Clock, Zap, Flame, User, BarChart3, Activity, Wifi, Lock, Bell, CheckCircle2, Heart, ShieldCheck, Sparkles, Plus, Minus, Timer, Crown, AlertTriangle } from 'lucide-react';
import { loadSettings } from '../services/storage';
import { UserSettings, FocusSession } from '../types';

interface GuardianLiveViewProps {
  syncCode: string;
  isRoyal: boolean;
}

const GuardianLiveView: React.FC<GuardianLiveViewProps> = ({ syncCode, isRoyal }) => {
  const [studentData, setStudentData] = useState<UserSettings>(loadSettings());
  const [session, setSession] = useState<FocusSession | null>(null);
  const [pulse, setPulse] = useState(true);
  const [customTime, setCustomTime] = useState('15');
  
  // Real-time synchronization loop
  useEffect(() => {
    const sync = () => {
      setStudentData(loadSettings());
      const sessStr = localStorage.getItem('scholar_active_session');
      if (sessStr) setSession(JSON.parse(sessStr));
    };

    const interval = setInterval(() => {
      sync();
      setPulse(p => !p);
    }, 1000);

    // Also listen for storage events from other tabs
    window.addEventListener('storage', sync);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const adjustTime = (mins: number) => {
    if (!isRoyal || !session?.isActive) return;
    const currentSess = {...session};
    currentSess.timeLeft = Math.max(0, currentSess.timeLeft + (mins * 60));
    localStorage.setItem('scholar_active_session', JSON.stringify(currentSess));
    setSession(currentSess);
  };

  const minutes = session?.isActive ? Math.floor(session.timeLeft / 60) : 0;
  const seconds = session?.isActive ? session.timeLeft % 60 : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6 animate-in fade-in duration-700">
        
        {/* Connection Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${session?.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {session?.isActive ? 'Live Stream Active' : 'Waiting for student...'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black text-indigo-600 uppercase">SYNC: {syncCode}</span>
          </div>
        </div>

        {/* Hero Card */}
        <div className={`rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-500 ${isRoyal ? 'bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-amber-400' : 'bg-slate-900'} ${session?.isActive ? 'scale-[1.02]' : 'grayscale opacity-80'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-lg border border-white/10 ${isRoyal ? 'bg-amber-500' : 'bg-indigo-600'}`}>
              {studentData.profilePic || '🎓'}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">{studentData.userName || 'Student'}</h1>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isRoyal ? 'bg-amber-400/20 text-amber-400' : 'bg-white/10 text-indigo-300'}`}>
                  {isRoyal ? 'Royal Scholar Elite' : `Focus Lv. ${Math.floor(studentData.companionGrowth/10)+1}`}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Real-time Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${session?.isActive ? 'bg-emerald-500' : 'bg-slate-500'} ${pulse && session?.isActive ? 'scale-125' : 'scale-100'} transition-all duration-500`}></div>
                <span className="text-sm font-black uppercase tracking-tighter italic">
                  {session?.isActive ? 'Deep Focus Active' : 'Idle / Offline'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Time Remaining</span>
              <p className={`text-xl font-black tabular-nums tracking-tighter ${session?.isActive ? 'text-white' : 'text-slate-600'}`}>
                {minutes}:{seconds.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        {/* ROYAL FEATURE: Remote Time Control */}
        {isRoyal && session?.isActive && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-[2.5rem] p-6 space-y-4 animate-in slide-in-from-bottom-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-amber-500 text-white rounded-xl"><Timer size={18} /></div>
                   <h3 className="text-xs font-black uppercase tracking-tight text-amber-900 italic">Remote Timer Control</h3>
                </div>
                <Crown size={16} className="text-amber-400" />
             </div>
             
             <div className="flex items-center gap-3">
                <div className="flex-1 bg-white border-2 border-amber-200 rounded-2xl flex items-center px-4 py-3 group focus-within:border-amber-500 transition-all">
                   <input 
                     type="number" 
                     value={customTime} 
                     onChange={(e) => setCustomTime(e.target.value)}
                     className="bg-transparent w-full text-center font-black text-lg text-amber-900 outline-none"
                     placeholder="0"
                   />
                   <span className="text-[8px] font-black text-amber-400 uppercase ml-2">MINS</span>
                </div>
                <div className="flex flex-col gap-2">
                   <button 
                     onClick={() => adjustTime(Number(customTime))} 
                     className="bg-emerald-500 text-white p-4 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                   >
                     <Plus size={20} />
                   </button>
                   <button 
                     onClick={() => adjustTime(-Number(customTime))} 
                     className="bg-rose-500 text-white p-4 rounded-xl shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                   >
                     <Minus size={20} />
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Real-time Activity Feed */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Live Activity Feed</h2>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 flex items-center gap-4 border-b border-slate-50">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${session?.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
                <Activity size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">{session?.isActive ? 'Session in Progress' : 'Last Session Completed'}</p>
                <p className="text-[8px] font-black text-slate-400 uppercase">{session?.isActive ? 'Started recently' : 'No active session'}</p>
              </div>
              {session?.isActive ? <Zap size={16} className="text-amber-500 animate-pulse" /> : <CheckCircle2 size={16} className="text-emerald-500" />}
            </div>
            
            <div className="p-5 flex items-center gap-4 border-b border-slate-50">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                <Heart size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">Companion Health</p>
                <p className="text-[8px] font-black text-slate-400 uppercase">Growth at {studentData.companionGrowth}%</p>
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
            <span className="text-xl font-black text-slate-900">{studentData.currentStreak}</span>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Day Streak</p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-2">
              <Clock size={20} />
            </div>
            <span className="text-xl font-black text-slate-900">{studentData.totalFocusTime}m</span>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Focus</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 text-center pb-12">
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em] mb-4">Secure Guardian Portal by Scholar</p>
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
