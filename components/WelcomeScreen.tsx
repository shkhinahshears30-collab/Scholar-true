
import React, { useState } from 'react';
import { Shield, Check, Sparkles, Zap, KeyRound, Terminal, X, GraduationCap, ChevronRight, Calendar, Scale, Mail, Lock, User, BookOpen, GraduationCap as UniIcon, AlertCircle, Eye, EyeOff, Globe } from 'lucide-react';
import { getTranslation } from '../services/i18n';
import { LANG_OPTIONS } from '../constants';

interface WelcomeScreenProps {
  onComplete: (userName: string, profilePic: string, language: string, age: number, guardianChoice: boolean) => void;
  onUnlockPremium?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete, onUnlockPremium }) => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState('🎓');
  const [selectedLang, setSelectedLang] = useState('en');
  const [age, setAge] = useState<number>(14);
  const [studyMode, setStudyMode] = useState<'school' | 'university' | null>(null);
  const [guardianChoice, setGuardianChoice] = useState<boolean | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [showSecretPanel, setShowSecretPanel] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [unlockSuccess, setUnlockSuccess] = useState(false);
  
  // Validation states
  const [error, setError] = useState<string | null>(null);

  const t = (key: string) => getTranslation(selectedLang, key);

  const avatarGroups = [
    { label: 'Scholars', icons: ['🎓', '🧠', '📚', '🌟', '🚀', '🔥', '🧪', '🔭'] },
    { label: 'Suits', icons: ['👔', '🧥', '🥼', '👮', '👨‍🚀', '🦸', '🤵', '🕴️'] },
    { label: 'Anime', icons: ['🍥', '🦊', '👁️', '👒', '🏴‍☠️', '🐉', '🤞', '👹'] },
  ];

  const validateCredentials = () => {
    const takenUsernames = ['admin', 'scholar', 'test', 'root'];
    
    if (takenUsernames.includes(userName.toLowerCase())) {
      setError("Username is already taken.");
      return false;
    }

    if (userName.length < 3) {
      setError("Min 3 characters required.");
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("8+ chars, 1 Upper, 1 Number.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleProceed = () => {
    if (validateCredentials() && agreed) {
      setStep(2);
    }
  };

  const handleStart = () => {
    if (userName.trim() && agreed && guardianChoice !== null && studyMode) {
      onComplete(userName, profilePic, selectedLang, age, guardianChoice);
    }
  };

  const handleSecretCodeInput = (val: string) => {
    setSecretCode(val);
    if (val === "2056" || val === "sapphire012._") {
      setUnlockSuccess(true);
      setTimeout(() => {
        if (onUnlockPremium) onUnlockPremium();
        setShowSecretPanel(false);
        setSecretCode('');
        setUnlockSuccess(false);
      }, 1200);
    }
    if (val === "6964") {
      setUnlockSuccess(true);
      setTimeout(() => {
        if (!userName) setUserName("Scholar Prime");
        if (!email) setEmail("prime@scholar.ai");
        if (!password) setPassword("Scholar123!");
        setAgreed(true);
        setStep(2);
        setShowSecretPanel(false);
        setSecretCode('');
        setUnlockSuccess(false);
      }, 1200);
    }
  };

  const selectStudyMode = (mode: 'school' | 'university') => {
    setStudyMode(mode);
    if (mode === 'school') {
      if (age < 12) setAge(12);
    } else {
      if (age < 18) setAge(18);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start overflow-y-auto no-scrollbar relative">
      <div className="fixed inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.1),transparent_70%)]"></div>
        {/* Much Brighter Fireworks for the First Page */}
        {step === 1 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-100">
            <div className="firework" style={{ left: '15%', top: '20%', animationDelay: '0s' }}></div>
            <div className="firework" style={{ left: '85%', top: '35%', animationDelay: '0.4s' }}></div>
            <div className="firework" style={{ left: '50%', top: '15%', animationDelay: '1.2s' }}></div>
            <div className="firework" style={{ left: '25%', top: '50%', animationDelay: '0.8s' }}></div>
            <div className="firework" style={{ left: '75%', top: '60%', animationDelay: '1.6s' }}></div>
          </div>
        )}
      </div>

      <div className="absolute top-6 right-6 z-[100]">
        <button 
          onClick={() => setShowSecretPanel(!showSecretPanel)}
          className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/20 hover:text-indigo-400 backdrop-blur-md transition-colors"
        >
          <KeyRound size={18} />
        </button>
      </div>

      {showSecretPanel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center">
          <div className="w-64 bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <Terminal className="text-indigo-400" size={16} />
              <button onClick={() => setShowSecretPanel(false)} className="text-white/20 hover:text-white"><X size={20} /></button>
            </div>
            <input 
              type="text"
              value={secretCode}
              onChange={(e) => handleSecretCodeInput(e.target.value)}
              placeholder="CODE"
              className={`w-full bg-black/50 border border-white/10 rounded-2xl py-4 text-center text-xl font-black transition-all ${unlockSuccess ? 'border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-white'}`}
            />
          </div>
        </div>
      )}

      <div className="w-full max-w-sm space-y-6 animate-in fade-in zoom-in-95 duration-700 relative z-10 px-6 pt-12 pb-32">
        {step === 1 && (
          <>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-indigo-600/30 rounded-[2rem] mb-4 border border-indigo-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(79,70,229,0.4)] animate-float">
                <GraduationCap className="text-white" size={48} />
              </div>
              <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.6em] mb-2 animate-pulse">HAPPY 2026</p>
              <h1 className="text-5xl font-black tracking-tighter mb-1 italic bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-400 uppercase leading-none">
                {t('welcome_title')}
              </h1>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">{t('welcome_subtitle')}</p>
            </div>

            {/* Smaller Enabled Language Selection Panel */}
            <div className="space-y-3 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md mb-2">
               <div className="flex items-center gap-2 mb-2 px-1">
                 <Globe size={12} className="text-indigo-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t('select_lang')}</span>
               </div>
               <div className="grid grid-cols-4 gap-2">
                 {LANG_OPTIONS.slice(0, 8).map(lang => (
                   <button
                     key={lang.id}
                     onClick={() => setSelectedLang(lang.id)}
                     className={`flex flex-col items-center justify-center py-2 rounded-xl border-2 transition-all ${selectedLang === lang.id ? 'bg-white border-white text-black scale-105 shadow-md' : 'bg-black/40 border-white/5 text-slate-600 hover:border-white/20'}`}
                   >
                     <span className="text-base">{lang.flag}</span>
                     <span className="text-[7px] font-black uppercase mt-0.5">{lang.id}</span>
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2.5 bg-white/5 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 pl-11 pr-6 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder={t('display_name')}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 pl-11 pr-6 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all placeholder:text-slate-600"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-4 py-2 bg-rose-500/20 border border-rose-500/30 rounded-2xl flex items-center gap-3">
                  <AlertCircle size={14} className="text-rose-400" />
                  <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">{error}</p>
                </div>
              )}

              <div className="flex items-start gap-4 px-2">
                <button 
                  onClick={() => setAgreed(!agreed)} 
                  className={`flex-shrink-0 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${agreed ? 'bg-indigo-600 border-indigo-600 shadow-md' : 'border-slate-800 bg-white/5'}`}
                >
                  {agreed && <Check size={14} className="text-white" strokeWidth={3} />}
                </button>
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed text-left">
                  {t('agree_to')} <button onClick={() => setLegalModal('privacy')} className="text-indigo-400 underline underline-offset-4">{t('privacy_policy')}</button> and <button onClick={() => setLegalModal('terms')} className="text-indigo-400 underline underline-offset-4">{t('terms_service')}</button>.
                </div>
              </div>

              <button 
                onClick={handleProceed}
                disabled={!userName.trim() || !email.trim() || !password.trim() || !agreed}
                className="w-full bg-white text-black py-6 rounded-[2.5rem] font-black text-lg shadow-2xl disabled:opacity-20 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {t('start_focusing')} <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">{t('suits_gear')}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Profile Gear</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 text-left">Knowledge Path</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => selectStudyMode('school')}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${studyMode === 'school' ? 'bg-white border-white text-black' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                  >
                    <BookOpen size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">School 12+</span>
                  </button>
                  <button 
                    onClick={() => selectStudyMode('university')}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${studyMode === 'university' ? 'bg-white border-white text-black' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                  >
                    <UniIcon size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">University</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 pt-2">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2.2rem] flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-white/20">
                  {profilePic}
                </div>
                <div className="w-full grid grid-cols-6 gap-2 overflow-y-auto max-h-32 no-scrollbar py-4 border-y border-white/10 bg-black/20 rounded-2xl px-4 text-center">
                  {avatarGroups.flatMap(g => g.icons).map(a => (
                    <button 
                      key={a} 
                      onClick={() => setProfilePic(a)} 
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${profilePic === a ? 'bg-white text-black scale-110 shadow-lg' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">{t('level')} (Age)</p>
                <input 
                  type="range" min="8" max="25" value={age} 
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between mt-4 font-black text-2xl text-indigo-400 italic">
                  <span>8</span>
                  <span className="text-5xl text-white underline decoration-indigo-500 underline-offset-8 decoration-4">{age}</span>
                  <span>25</span>
                </div>
              </div>

              <button 
                onClick={handleStart}
                disabled={guardianChoice === null && !studyMode}
                className="w-full bg-white text-black py-7 rounded-[2.5rem] font-black text-xl shadow-2xl disabled:opacity-20 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                {t('start_focus_btn')} <Zap size={22} fill="currentColor" />
              </button>

              <button 
                onClick={() => setStep(1)}
                className="w-full text-slate-600 font-black text-[10px] uppercase tracking-widest py-2"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
