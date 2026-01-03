
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ShieldCheck, Clock, Crown, Zap, Flame, Star, GraduationCap, Grid, Palette, Book, Globe, UserPlus, Shield, Coffee, Clapperboard, Radio, Lock, User, BarChart3, Play, Rocket, Mail, Smartphone, CheckCircle2, Target, X, ScanText, Rabbit, BookOpen, BrainCircuit
} from 'lucide-react';
import { AppRoute, UserSettings, FocusSession, StudyMode } from './types';
import { ALL_COMPANIONS, MAX_TIME_FREE, HABITATS } from './constants';
import { loadSettings, saveSettings, updateStreak } from './services/storage';
import { getTranslation } from './services/i18n';
import Navigation from './components/Navigation';
import AdSimulator from './components/AdSimulator';
import SponsorPanel from './components/SponsorPanel';
import PetSanctuary from './components/PetSanctuary';
import FlashcardLab from './components/FlashcardLab';
import CalendarSchedule from './components/CalendarSchedule';
import WelcomeScreen from './components/WelcomeScreen';
import Leaderboard from './components/Leaderboard';
import PremiumSelection from './components/PremiumSelection';
import LanguageAcademy from './components/LanguageAcademy';
import AcademyHub from './components/AcademyHub';
import GuardianSync from './components/GuardianSync';
import BreakRoom from './components/BreakRoom';
import AILab from './components/AILab';
import LiveTutor from './components/LiveTutor';
import SettingsView from './components/SettingsView';
import CompanionVault from './components/CompanionVault';
import TemplateDesigner from './components/TemplateDesigner';
import VerticalElevator from './components/VerticalElevator';
import GuardianLiveView from './components/GuardianLiveView';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [session, setSession] = useState<FocusSession>({ isActive: false, timeLeft: 0, duration: 25, startTime: null });
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const isGuardianView = urlParams.get('view') === 'guardian';
  const guardianStudentName = urlParams.get('user') || 'Student';
  const guardianSyncCode = urlParams.get('code') || '####';

  const t = (key: string) => getTranslation(settings.language, key);

  const dashboardLiftActions = [
    { id: 'top', icon: <User size={18} />, label: 'Profile' },
    { id: 'pet', icon: <Star size={18} />, label: 'Companion' },
    { id: 'suites', icon: <Grid size={18} />, label: 'Suites' },
    { id: 'focus', icon: <Play size={18} />, label: 'Session' },
  ];

  const handleLiftSelect = (id: string) => {
    if (!dashboardRef.current) return;
    const elementId = id === 'top' ? 'profile-section' : id === 'pet' ? 'pet-section' : id === 'suites' ? 'suites-section' : 'focus-section';
    const element = document.getElementById(elementId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isGuardianView) return;
    if (!settings.userName || settings.age === undefined) {
      setRoute(AppRoute.WELCOME);
    }
  }, [settings.userName, settings.age, isGuardianView]);

  useEffect(() => {
    let interval: any;
    if (session.isActive && session.timeLeft > 0) {
      interval = setInterval(() => {
        setSession(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (session.isActive && session.timeLeft === 0) {
      completeSession();
    }
    return () => clearInterval(interval);
  }, [session.isActive, session.timeLeft]);

  const completeSession = useCallback(() => {
    const growthGain = Math.floor(session.duration / 5);
    const newGrowth = Math.min(100, settings.companionGrowth + growthGain);
    const oldLevel = Math.floor(settings.companionGrowth / 10) + 1;
    const newLevel = Math.floor(newGrowth / 10) + 1;
    let updatedHabitats = [...settings.unlockedHabitats];
    if (newLevel !== oldLevel && newLevel % 5 === 0) {
      const habitatToUnlock = HABITATS.find(h => !updatedHabitats.includes(h.id));
      if (habitatToUnlock) updatedHabitats.push(habitatToUnlock.id);
    }
    const updated = { ...settings, totalFocusTime: settings.totalFocusTime + session.duration, companionGrowth: newGrowth, unlockedHabitats: updatedHabitats };
    const final = updateStreak(updated);
    setSettings(final);
    
    setSession({ isActive: false, timeLeft: 0, duration: session.duration, startTime: null });
    setRoute(AppRoute.DASHBOARD);
  }, [settings, session.duration]);

  const startSession = (mins: number) => {
    setSession({ 
      isActive: true, 
      timeLeft: mins * 60, 
      duration: mins, 
      startTime: Date.now()
    });
    setRoute(AppRoute.FOCUS);
  };

  const handleUpdateSettings = (data: Partial<UserSettings>) => {
    const updated = { ...settings, ...data };
    saveSettings(updated);
    setSettings(updated);
  };

  const navigateToAIRoute = (targetRoute: AppRoute) => {
    if (!settings.isPremium) {
      setRoute(AppRoute.PREMIUM);
    } else {
      setRoute(targetRoute);
    }
  };

  const handleFeed = (growthGain: number) => {
    const newGrowth = Math.min(100, settings.companionGrowth + growthGain);
    handleUpdateSettings({ companionGrowth: newGrowth });
  };

  if (isGuardianView) {
    return <GuardianLiveView studentName={guardianStudentName} syncCode={guardianSyncCode} />;
  }

  const renderDashboard = () => (
    <div ref={dashboardRef} className={`pb-32 p-6 pt-12 overflow-y-auto h-screen no-scrollbar ${settings.language === 'ar' ? 'text-right' : ''}`} dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
      <VerticalElevator 
        actions={dashboardLiftActions}
        onSelect={handleLiftSelect}
        onScrollUp={() => dashboardRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        onScrollDown={() => dashboardRef.current?.scrollTo({ top: dashboardRef.current.scrollHeight, behavior: 'smooth' })}
      />

      <div id="profile-section" className={`flex justify-between items-start mb-8 pr-16 ${settings.language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setRoute(AppRoute.SETTINGS)} className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-lg animate-float relative group overflow-hidden border-2 border-white/20">
            {settings.profilePic}
          </button>
          <div className="text-left">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{t('hi')}, {settings.userName?.split(' ')[0]}!</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t('ready_focus')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigateToAIRoute(AppRoute.LIVE_CHAT)} className={`p-3 rounded-2xl border transition-all relative ${settings.isPremium ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'}`}>
            <Radio size={20} />
            {!settings.isPremium && <Crown size={10} className="absolute -top-1 -right-1 text-amber-500 fill-amber-500" />}
          </button>
          <button onClick={() => setRoute(AppRoute.BREAK)} className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm"><Coffee size={20} /></button>
        </div>
      </div>

      <div id="pet-section" className="mb-8 pr-16">
        <PetSanctuary companionType={settings.selectedCompanion} customName={settings.customCompanionName} accessoryId={settings.selectedAccessory} habitatId={settings.selectedHabitat} unlockedHabitats={settings.unlockedHabitats || ['default']} growth={settings.companionGrowth} message={""} isFocusing={false} studyMode={settings.studyMode} language={settings.language} onRename={(name) => handleUpdateSettings({ customCompanionName: name })} onOpenVault={() => setRoute(AppRoute.GALLERY)} onFeed={(g) => handleFeed(g)} onChangeHabitat={(id) => handleUpdateSettings({ selectedHabitat: id })} />
      </div>

      <div id="stats-section" className="grid grid-cols-3 gap-3 my-8 pr-16">
        {[
          { icon: <Flame size={20} className="text-orange-500" />, label: t('streak'), val: settings.currentStreak },
          { icon: <Clock size={20} className="text-blue-500" />, label: t('total_min'), val: settings.totalFocusTime },
          { icon: <ShieldCheck size={20} className="text-emerald-500" />, label: t('locked'), val: settings.unlockedHabitats.length }
        ].map(stat => (
          <div key={stat.label} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center">
            {stat.icon}
            <p className="text-sm font-black mt-1">{stat.val}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div id="suites-section" className="space-y-4 mb-8 pr-16">
         <div className="flex items-center justify-between mb-4 px-2">
           <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Scholar Suites</h2>
           <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider italic">EXPERT TOOLS</span>
         </div>
         
         <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setRoute(AppRoute.ACADEMY)}
              className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 hover:border-indigo-200 transition-all group"
            >
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform"><ScanText size={24} /></div>
              <div className="text-left">
                <h3 className="text-xs font-black uppercase tracking-tight">Scholar Scanner</h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Scan & Solve</p>
              </div>
            </button>

            <button 
              onClick={() => setRoute(AppRoute.LANGUAGE_TUTOR)}
              className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 hover:border-emerald-200 transition-all group"
            >
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform"><Rabbit size={24} /></div>
              <div className="text-left">
                <h3 className="text-xs font-black uppercase tracking-tight">Language Academy</h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bunny Tutor</p>
              </div>
            </button>

            <button 
              onClick={() => setRoute(AppRoute.ACADEMY)}
              className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 hover:border-amber-200 transition-all group"
            >
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform"><Book size={24} /></div>
              <div className="text-left">
                <h3 className="text-xs font-black uppercase tracking-tight">Literacy Suite</h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lexicon & Spell</p>
              </div>
            </button>

            <button 
              onClick={() => setRoute(AppRoute.ACADEMY)}
              className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 hover:border-rose-200 transition-all group"
            >
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform"><BrainCircuit size={24} /></div>
              <div className="text-left">
                <h3 className="text-xs font-black uppercase tracking-tight">Study Suite</h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Exam Forge & AI</p>
              </div>
            </button>
         </div>
      </div>

      <div id="focus-section" className="mb-8 pr-16 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('session_length')}</h2>
            <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">MAX {settings.isPremium ? '120' : '60'}m</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[15, 25, 45, 60, 90, 120].map((mins) => {
              const isPremiumOnly = mins > MAX_TIME_FREE;
              const isLocked = isPremiumOnly && !settings.isPremium;
              return (<button key={mins} disabled={isLocked} onClick={() => setSelectedDuration(mins)} className={`py-3 rounded-2xl font-black text-xs transition-all border ${selectedDuration === mins ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'} ${isLocked ? 'opacity-20 grayscale' : ''}`}>{mins}m</button>);
            })}
          </div>
        </div>
      </div>

      <button onClick={() => startSession(selectedDuration)} className="w-full bg-slate-900 text-white p-8 rounded-[3rem] font-black text-2xl flex items-center justify-between group overflow-hidden relative shadow-2xl active:scale-95 transition-all">
        <div className={`relative z-10 flex flex-col items-start ${settings.language === 'ar' ? 'items-end' : 'items-start'}`}>
           <span>{t('start_focus_btn')}</span>
           <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{selectedDuration} {t('minute_session')}</span>
        </div>
        <Zap size={32} className="text-indigo-400 relative z-10 group-hover:scale-125 transition-transform" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      {route === AppRoute.WELCOME ? (
        <WelcomeScreen 
          onComplete={(userName, profilePic, language, age, guardianChoice) => {
            handleUpdateSettings({ 
              userName, 
              profilePic, 
              language, 
              age, 
              guardianLinked: guardianChoice, 
              unlockedHabitats: ['default'],
              studyMode: age >= 18 ? 'university' : 'school'
            });
            setRoute(AppRoute.DASHBOARD);
          }} 
          onUnlockPremium={() => handleUpdateSettings({ isPremium: true })} 
        />
      ) : (
        <>
          <SponsorPanel />
          <AdSimulator isPremium={settings.isPremium} />
          {route === AppRoute.PREMIUM && <PremiumSelection onClose={() => setRoute(AppRoute.DASHBOARD)} onPurchase={() => { handleUpdateSettings({ isPremium: true }); setRoute(AppRoute.DASHBOARD); }} />}
          {route === AppRoute.GALLERY && <CompanionVault currentType={settings.selectedCompanion} isPremium={settings.isPremium} onSelect={(type) => handleUpdateSettings({ selectedCompanion: type })} onClose={() => setRoute(AppRoute.DASHBOARD)} onGoPremium={() => setRoute(AppRoute.PREMIUM)} />}
          <main className="max-w-md mx-auto min-h-screen relative">
            {route === AppRoute.DASHBOARD && renderDashboard()}
            {route === AppRoute.BREAK && <BreakRoom onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.AI_LAB && <AILab isPremium={settings.isPremium} onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.LIVE_CHAT && <LiveTutor language={settings.language} onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.GUARDIAN && <GuardianSync settings={settings} onUpdateGuardian={(data) => handleUpdateSettings(data)} onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.LANGUAGE_TUTOR && <LanguageAcademy companionType={settings.selectedCompanion} isPremium={settings.isPremium} onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.ACADEMY && <AcademyHub vocabulary={settings.vocabulary} onAddWord={(w) => { if (!settings.isPremium && settings.vocabulary.length >= 10) return; handleUpdateSettings({ vocabulary: [...settings.vocabulary, w] }); }} onRemoveWord={(w) => handleUpdateSettings({ vocabulary: settings.vocabulary.filter(v => v.word !== w) })} isPremium={settings.isPremium} setAppRoute={setRoute} onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.DESIGN_STUDIO && <TemplateDesigner isPremium={settings.isPremium} onGoPremium={() => setRoute(AppRoute.PREMIUM)} onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.FLASHCARDS && <FlashcardLab sets={settings.flashcardSets || []} language={settings.language} onSaveSet={(title, cards) => { if (!settings.isPremium && settings.dailyGenCount >= 2) { setRoute(AppRoute.PREMIUM); return; } const newSet = { id: Math.random().toString(36).substr(2, 9), title, cards, createdAt: new Date().toISOString() }; handleUpdateSettings({ flashcardSets: [...(settings.flashcardSets || []), newSet], dailyGenCount: settings.dailyGenCount + 1 }); }} onDeleteSet={(id) => handleUpdateSettings({ flashcardSets: settings.flashcardSets.filter(s => s.id !== id) })} />}
            {route === AppRoute.PLANNER && <CalendarSchedule events={settings.calendarEvents || []} language={settings.language} onAddEvent={(ev) => handleUpdateSettings({ calendarEvents: [...settings.calendarEvents, { ...ev, id: Math.random().toString() }] })} onDeleteEvent={(id) => handleUpdateSettings({ calendarEvents: settings.calendarEvents.filter(e => e.id !== id) })} />}
            {route === AppRoute.LEADERBOARD && <Leaderboard currentUser={{ name: settings.userName || 'You', pic: settings.profilePic || '🎓', focusTime: settings.totalFocusTime }} />}
            {route === AppRoute.SETTINGS && <SettingsView settings={settings} onUpdate={handleUpdateSettings} onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            
            {route === AppRoute.FOCUS && (
              <div className="fixed inset-0 bg-slate-950 z-50 p-8 flex flex-col items-center justify-center animate-in fade-in duration-1000">
                <PetSanctuary 
                  companionType={settings.selectedCompanion} 
                  customName={settings.customCompanionName} 
                  accessoryId={settings.selectedAccessory} 
                  habitatId={settings.selectedHabitat} 
                  unlockedHabitats={settings.unlockedHabitats || ['default']} 
                  growth={settings.companionGrowth} 
                  message={""} 
                  isFocusing={true} 
                  studyMode={settings.studyMode} 
                  language={settings.language} 
                  onOpenVault={() => {}} 
                />
                
                <div className="mt-16 text-center w-full max-w-xs relative z-10">
                  <div className="flex items-center justify-center gap-4 mb-4">
                     <Lock size={20} className="text-rose-500 animate-pulse" />
                     <h2 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Focus Mode Active</h2>
                  </div>
                  
                  <h1 className="text-8xl font-black text-white tabular-nums tracking-tighter mb-8">{Math.floor(session.timeLeft / 60)}:{(session.timeLeft % 60).toString().padStart(2, '0')}</h1>
                  
                  <button 
                    onClick={() => {
                      completeSession();
                    }} 
                    className="text-white/20 font-black uppercase tracking-[0.3em] border border-white/5 px-8 py-3 rounded-2xl hover:text-rose-500 hover:border-rose-500 transition-all text-[10px]"
                  >
                    QUIT SESSION
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Persistent Gmail Link */}
          {route !== AppRoute.FOCUS && (
            <div className="fixed bottom-2 left-2 z-50 pointer-events-auto">
              <a 
                href="mailto:scholarmvp.help@gmail.com" 
                className="flex items-center gap-1 px-1.5 py-0.5 bg-white/20 backdrop-blur-md rounded border border-white/5 text-slate-400 hover:text-indigo-400 transition-all text-[6px] font-black uppercase tracking-widest"
              >
                <Mail size={8} />
                scholarmvp.help@gmail.com
              </a>
            </div>
          )}

          {![AppRoute.FOCUS, AppRoute.PREMIUM, AppRoute.LANGUAGE_TUTOR, AppRoute.BREAK, AppRoute.AI_LAB, AppRoute.LIVE_CHAT, AppRoute.SETTINGS, AppRoute.GALLERY, AppRoute.DESIGN_STUDIO].includes(route) && <Navigation currentRoute={route} setRoute={setRoute} language={settings.language} />}
        </>
      )}
    </div>
  );
};

export default App;
