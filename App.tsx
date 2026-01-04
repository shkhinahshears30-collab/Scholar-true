
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ShieldCheck, Clock, Crown, Zap, Flame, Star, GraduationCap, Grid, Palette, Book, Globe, UserPlus, Shield, Coffee, Clapperboard, Radio, Lock, User, BarChart3, Play, Rocket, Mail, Smartphone, CheckCircle2, Target, X, ScanText, Rabbit, BookOpen, BrainCircuit, Link as LinkIcon, Library as LibraryIcon, Gamepad2, Sparkles, CalendarDays, Trophy, MessageSquareText, Layout, Pencil, Trash2, RotateCcw, PenLine, ChevronDown, ChevronLeft, Pause, Coffee as BreakIcon, Music as MusicIcon, Volume2, VolumeX, Headphones, AudioLines
} from 'lucide-react';
import { AppRoute, UserSettings, FocusSession, StudyMode } from './types';
import { ALL_COMPANIONS, MAX_TIME_FREE, MAX_TIME_PREMIUM, MAX_TIME_ROYAL, HABITATS } from './constants';
import { loadSettings, saveSettings, updateStreak } from './services/storage';
import { getTranslation } from './services/i18n';
import { getCompanionMessage } from './services/gemini';
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
import RoyalLibrary from './components/RoyalLibrary';
import Infosphere from './components/Infosphere';
import DesignSanctuary from './components/DesignSanctuary';
import WritingHaven from './components/WritingHaven';

const AFFIRMATIONS = [
  "You are capable of amazing things.",
  "Focus is your secret superpower.",
  "Every small step leads to a giant leap.",
  "Scholar, your potential is infinite.",
  "Deep work leads to deep wisdom.",
  "Consistency is the key to mastery.",
  "Believe in the power of 'yet'.",
  "Your future self will thank you today.",
  "Success is the sum of small efforts.",
  "The expert in anything was once a beginner.",
  "Your only limit is your mind.",
  "Make today count."
];

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [session, setSession] = useState<FocusSession>({ isActive: false, timeLeft: 0, duration: 25, startTime: null });
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [secondsInCurrentFocusSegment, setSecondsInCurrentFocusSegment] = useState(0); 
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [showCelebration, setShowCelebration] = useState(false);
  const [companionMessage, setCompanionMessage] = useState<string>('');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [draggingStickerId, setDraggingStickerId] = useState<string | null>(null);
  const [currentAffirmation, setCurrentAffirmation] = useState(AFFIRMATIONS[0]);
  const [musicStalled, setMusicStalled] = useState(false); 
  const dashboardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const isGuardianView = urlParams.get('view') === 'guardian';
  const guardianStudentName = urlParams.get('user') || 'Student';
  const guardianSyncCode = urlParams.get('code') || '####';
  const isRoyalMode = urlParams.get('tier') === 'royal';

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

  // World-Class Background Music Controller
  useEffect(() => {
    if (!audioRef.current) {
      // Premium Deep Focus Brain Waves track - High quality ambient
      audioRef.current = new Audio('https://cdn.pixabay.com/audio/2023/06/05/audio_51af396265.mp3'); 
      audioRef.current.loop = true;
      audioRef.current.volume = 0.12;
    }

    const syncPlayback = () => {
      if (settings.musicEnabled) {
        audioRef.current?.play()
          .then(() => setMusicStalled(false))
          .catch(() => {
            // Autoplay blocked by browser policy
            setMusicStalled(true);
          });
      } else {
        audioRef.current?.pause();
        setMusicStalled(false);
      }
    };

    syncPlayback();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [settings.musicEnabled]);

  // Robust Interaction-Based Autoplay Activation
  useEffect(() => {
    const handleInteraction = () => {
      if (settings.musicEnabled && audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => {
            setMusicStalled(false);
            console.log("Scholar Ambience Synchronized");
          })
          .catch(() => {});
      }
    };
    
    // Listen for any standard user interaction to wake up the audio context
    window.addEventListener('mousedown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [settings.musicEnabled]);

  // Timer logic for focus segments and breaks
  useEffect(() => {
    let interval: any;
    if (isOnBreak && breakTimeLeft > 0) {
      interval = setInterval(() => {
        setBreakTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isOnBreak && breakTimeLeft === 0) {
      setIsOnBreak(false);
      setSecondsInCurrentFocusSegment(0); 
      if (route === AppRoute.BREAK) setRoute(AppRoute.FOCUS);
    } else if (session.isActive && session.timeLeft > 0) {
      interval = setInterval(() => {
        setSession(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
        setSecondsInCurrentFocusSegment(prev => prev + 1);
      }, 1000);
    } else if (session.isActive && session.timeLeft === 0) {
      completeSession(true);
    }
    return () => clearInterval(interval);
  }, [session.isActive, session.timeLeft, isOnBreak, breakTimeLeft, route]);

  // Affirmation cycle every 50 seconds
  useEffect(() => {
    const cycleAffirmation = () => {
      setCurrentAffirmation(prev => {
        const remaining = AFFIRMATIONS.filter(a => a !== prev);
        return remaining[Math.floor(Math.random() * remaining.length)];
      });
    };
    cycleAffirmation();
    const interval = setInterval(cycleAffirmation, 50000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isGuardianView) return;
    if (!settings.userName || settings.age === undefined) {
      setRoute(AppRoute.WELCOME);
    }
  }, [settings.userName, settings.age, isGuardianView]);

  useEffect(() => {
    const fetchMessage = async () => {
      const companionName = settings.customCompanionName || 
        (ALL_COMPANIONS.find(c => c.type === settings.selectedCompanion)?.name || 'Companion');
      
      const msg = await getCompanionMessage(
        companionName,
        settings.companionGrowth,
        session.isActive,
        settings.language
      );
      setCompanionMessage(msg);
    };

    fetchMessage();
  }, [settings.selectedCompanion, settings.customCompanionName, settings.companionGrowth, session.isActive, settings.language]);

  const completeSession = useCallback((isFullCompletion: boolean = false) => {
    if (isFullCompletion) {
      const growthGain = Math.floor(session.duration / 5);
      const newGrowth = Math.min(100, settings.companionGrowth + growthGain);
      const oldLevel = Math.floor(settings.companionGrowth / 10) + 1;
      const newLevel = Math.floor(newGrowth / 10) + 1;
      let updatedHabitats = [...settings.unlockedHabitats];
      
      if (newLevel !== oldLevel && newLevel % 5 === 0) {
        const habitatToUnlock = HABITATS.find(h => !updatedHabitats.includes(h.id));
        if (habitatToUnlock) updatedHabitats.push(habitatToUnlock.id);
      }

      const updated = { 
        ...settings, 
        totalFocusTime: settings.totalFocusTime + session.duration, 
        companionGrowth: newGrowth, 
        unlockedHabitats: updatedHabitats 
      };
      const final = updateStreak(updated);
      setSettings(final);
      
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }

    setSession({ isActive: false, timeLeft: 0, duration: session.duration, startTime: null });
    setIsOnBreak(false);
    setBreakTimeLeft(0);
    setSecondsInCurrentFocusSegment(0);
    setRoute(AppRoute.DASHBOARD);
  }, [settings, session.duration, session.timeLeft]);

  const startSession = (mins: number) => {
    setSession({ isActive: true, timeLeft: mins * 60, duration: mins, startTime: Date.now() });
    setSecondsInCurrentFocusSegment(0);
    setRoute(AppRoute.FOCUS);
  };

  const handlePause = () => {
    const isUnlocked = secondsInCurrentFocusSegment >= 300;
    if (!isOnBreak && !isUnlocked) return; 

    if (isOnBreak) {
      setIsOnBreak(false);
      setSecondsInCurrentFocusSegment(0); 
    } else {
      setIsOnBreak(true);
      setBreakTimeLeft(300); 
    }
  };

  const handleUpdateSettings = (data: Partial<UserSettings>) => {
    const updated = { ...settings, ...data };
    saveSettings(updated);
    setSettings(updated);
  };

  const addSticker = (emoji: string) => {
    if (!settings.dashboardCustomization) return;
    const newSticker = {
      id: Math.random().toString(36).substring(2, 9),
      emoji,
      x: 50,
      y: 50
    };
    handleUpdateSettings({
      dashboardCustomization: {
        ...settings.dashboardCustomization,
        stickers: [...settings.dashboardCustomization.stickers, newSticker]
      }
    });
  };

  const removeSticker = (id: string) => {
    if (!settings.dashboardCustomization) return;
    handleUpdateSettings({
      dashboardCustomization: {
        ...settings.dashboardCustomization,
        stickers: settings.dashboardCustomization.stickers.filter(s => s.id !== id)
      }
    });
  };

  const handleStickerDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isCustomizing || !draggingStickerId || !dashboardRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rect = dashboardRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    handleUpdateSettings({
      dashboardCustomization: {
        ...settings.dashboardCustomization!,
        stickers: settings.dashboardCustomization!.stickers.map(s => 
          s.id === draggingStickerId ? { ...s, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) } : s
        )
      }
    });
  };

  const clearStickers = () => {
    if (!settings.dashboardCustomization) return;
    handleUpdateSettings({
      dashboardCustomization: {
        ...settings.dashboardCustomization,
        stickers: []
      }
    });
  };

  const updateDashboardTheme = (color: string) => {
    if (!settings.dashboardCustomization) return;
    handleUpdateSettings({
      dashboardCustomization: {
        ...settings.dashboardCustomization,
        themeColor: color
      }
    });
  };

  if (isGuardianView) {
    return <GuardianLiveView syncCode={guardianSyncCode} isRoyal={isRoyalMode} />;
  }

  const breakUnlocked = secondsInCurrentFocusSegment >= 300;
  const secondsToBreakUnlock = Math.max(0, 300 - secondsInCurrentFocusSegment);

  return (
    <div 
      className="min-h-screen transition-colors duration-1000" 
      style={{ backgroundColor: settings.dashboardCustomization?.themeColor || '#fcfcfd' }}
      onMouseMove={handleStickerDragMove}
      onTouchMove={handleStickerDragMove}
      onMouseUp={() => setDraggingStickerId(null)}
      onTouchEnd={() => setDraggingStickerId(null)}
    >
      {showCelebration && (
        <div className="fixed inset-0 z-[1000] pointer-events-none bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="firework firework-gold" style={{ left: '15%', animationDelay: '0s' }}></div>
          <div className="firework firework-blue" style={{ left: '85%', animationDelay: '0.4s' }}></div>
          <div className="firework firework-gold" style={{ left: '50%', animationDelay: '0.8s' }}></div>
          <div className="firework firework-blue" style={{ left: '30%', animationDelay: '1.2s' }}></div>
          <div className="firework firework-gold" style={{ left: '70%', animationDelay: '1.6s' }}></div>
          <div className="absolute text-white font-black text-6xl italic uppercase tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-center animate-bounce">
            BOOM!<br/><span className="text-2xl tracking-[0.2em]">MISSION COMPLETE</span>
          </div>
        </div>
      )}

      {route === AppRoute.WELCOME ? (
        <WelcomeScreen 
          onComplete={(userName, profilePic, language, age, guardianChoice, rememberMe) => {
            handleUpdateSettings({ 
              userName, profilePic, language, age, rememberMe,
              isRoyal: settings.isRoyal, guardianLinked: guardianChoice, unlockedHabitats: ['default'],
              studyMode: age >= 18 ? 'university' : 'school',
              musicEnabled: true // Enable by default for a premium feel
            });
            if (guardianChoice) setRoute(AppRoute.GUARDIAN);
            else setRoute(AppRoute.DASHBOARD);
          }} 
          onUnlockPremium={(isRoyal) => handleUpdateSettings({ isPremium: true, isRoyal: !!isRoyal })} 
        />
      ) : (
        <>
          <SponsorPanel />
          <AdSimulator isPremium={settings.isPremium || settings.isRoyal} />
          {route === AppRoute.PREMIUM && <PremiumSelection onClose={() => setRoute(AppRoute.DASHBOARD)} onPurchase={(isRoyal) => { handleUpdateSettings({ isPremium: true, isRoyal: !!isRoyal }); setRoute(AppRoute.DASHBOARD); }} />}
          {route === AppRoute.GALLERY && <CompanionVault currentType={settings.selectedCompanion} isPremium={settings.isPremium || settings.isRoyal} onSelect={(type) => handleUpdateSettings({ selectedCompanion: type })} onClose={() => setRoute(AppRoute.DASHBOARD)} onGoPremium={() => setRoute(AppRoute.PREMIUM)} />}
          
          <main className="max-w-md mx-auto min-h-screen relative">
            {route === AppRoute.DASHBOARD && (
              <div ref={dashboardRef} className={`pb-40 p-6 pt-12 overflow-y-auto h-screen no-scrollbar relative`}>
                
                <div className={`absolute inset-0 z-0 overflow-hidden transition-all ${isCustomizing ? 'pointer-events-auto bg-black/5' : 'pointer-events-none'}`}>
                   {settings.dashboardCustomization?.stickers.map(s => (
                     <div 
                       key={s.id} 
                       onMouseDown={() => setDraggingStickerId(s.id)}
                       onTouchStart={() => setDraggingStickerId(s.id)}
                       className={`absolute text-5xl select-none transition-transform group/sticker ${isCustomizing ? 'cursor-move opacity-100 scale-125 z-50' : 'animate-float opacity-30 z-0'}`} 
                       style={{ 
                         left: `${s.x}%`, 
                         top: `${s.y}%`, 
                         transform: 'translate(-50%, -50%)',
                         animationDelay: `${Math.random() * 2}s` 
                       }}
                     >
                       {s.emoji}
                       {isCustomizing && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); removeSticker(s.id); }}
                           className="absolute -top-3 -right-3 p-1.5 bg-rose-500 text-white rounded-full shadow-lg border-2 border-white hover:scale-125 transition-transform"
                         >
                           <X size={12} strokeWidth={4} />
                         </button>
                       )}
                     </div>
                   ))}
                </div>

                <VerticalElevator actions={dashboardLiftActions} onSelect={handleLiftSelect} onScrollUp={() => dashboardRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} onScrollDown={() => dashboardRef.current?.scrollTo({ top: dashboardRef.current.scrollHeight, behavior: 'smooth' })} />
                
                <div id="profile-section" className="flex justify-between items-start mb-4 pr-16 relative z-10">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setRoute(AppRoute.SETTINGS)} className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white/20 hover:scale-110 transition-transform active:scale-95">{settings.profilePic}</button>
                    <div><h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Scholar {settings.userName?.split(' ')[0]}</h1><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('ready_focus')}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 shadow-sm">
                      <Flame size={14} className="text-orange-500 fill-orange-500" />
                      <span className="text-xs font-black text-orange-600 tabular-nums">{settings.currentStreak}</span>
                    </div>
                    {/* Immersive Music Controller Toggle */}
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleUpdateSettings({ musicEnabled: !settings.musicEnabled })}
                        className={`p-2.5 rounded-full border transition-all active:scale-90 shadow-xl flex items-center gap-1.5 ${settings.musicEnabled ? 'bg-indigo-600 text-white border-indigo-400 shadow-indigo-500/50' : 'bg-white text-slate-300 border-slate-100'}`}
                        title={settings.musicEnabled ? "Pause Focus Ambience" : "Play Focus Ambience"}
                      >
                        {settings.musicEnabled ? (
                          <>
                            <AudioLines size={14} className="animate-pulse" />
                            <div className="flex gap-0.5 items-end h-3">
                               <div className="w-0.5 bg-white animate-[music_0.8s_ease-in-out_infinite]" style={{ height: '60%' }}></div>
                               <div className="w-0.5 bg-white animate-[music_1.2s_ease-in-out_infinite]" style={{ height: '100%' }}></div>
                               <div className="w-0.5 bg-white animate-[music_1s_ease-in-out_infinite]" style={{ height: '80%' }}></div>
                            </div>
                          </>
                        ) : (
                          <VolumeX size={14} />
                        )}
                      </button>
                      {musicStalled && settings.musicEnabled && (
                        <button 
                          onClick={() => audioRef.current?.play().then(() => setMusicStalled(false))}
                          className="bg-emerald-500 text-white px-3 py-2 rounded-full text-[8px] font-black uppercase tracking-widest animate-bounce shadow-lg flex items-center gap-1"
                        >
                          <Headphones size={10} /> Sync Audio
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6 px-1 relative z-10 animate-in fade-in duration-1000 key={currentAffirmation}">
                   <div className="p-4 bg-white/60 backdrop-blur-md border border-indigo-100 rounded-3xl shadow-sm">
                      <div className="flex items-center gap-2 mb-1.5">
                         <Sparkles size={12} className="text-indigo-500" />
                         <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] italic">Daily Affirmation</p>
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"{currentAffirmation}"</p>
                   </div>
                </div>

                <div id="pet-section" className="mb-4 pr-16 relative z-10">
                  <PetSanctuary 
                    companionType={settings.selectedCompanion} 
                    customName={settings.customCompanionName} 
                    growth={settings.companionGrowth} 
                    habitatId={settings.selectedHabitat} 
                    unlockedHabitats={settings.unlockedHabitats} 
                    isFocusing={false} 
                    language={settings.language} 
                    message={companionMessage}
                    studyMode={settings.studyMode}
                    onOpenVault={() => setRoute(AppRoute.GALLERY)} 
                    onFeed={(g) => handleUpdateSettings({ companionGrowth: Math.min(100, settings.companionGrowth + g) })} 
                    onChangeHabitat={(id) => handleUpdateSettings({ selectedHabitat: id })} 
                    onRename={(name) => handleUpdateSettings({ customCompanionName: name })} 
                  />
                </div>

                <div 
                  className="flex flex-col items-center justify-center py-6 mb-4 pr-16 opacity-30 cursor-pointer hover:opacity-60 transition-opacity"
                  onClick={() => handleLiftSelect('suites')}
                >
                   <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Scroll for Suites</span>
                   <div className="animate-bounce p-2 bg-slate-100 rounded-full">
                      <ChevronDown size={14} className="text-slate-400" />
                   </div>
                </div>
                
                <div id="suites-section" className="grid grid-cols-2 gap-4 mb-8 pr-16 relative z-10">
                  <button onClick={() => setRoute(AppRoute.ACADEMY)} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform active:scale-95 group text-left">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors"><ScanText size={24} /></div>
                    <div><h3 className="text-[10px] font-black uppercase tracking-tight">Academy</h3><p className="text-[8px] font-bold text-slate-400 uppercase">AI Learning</p></div>
                  </button>
                  <button onClick={() => setRoute(AppRoute.AI_LAB)} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform active:scale-95 group text-left">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors"><Sparkles size={24} /></div>
                    <div><h3 className="text-[10px] font-black uppercase tracking-tight">Veo Lab</h3><p className="text-[8px] font-bold text-slate-400 uppercase">AI Video</p></div>
                  </button>

                  <button onClick={() => setRoute(AppRoute.FLASHCARDS)} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform active:scale-95 group text-left">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors"><BrainCircuit size={24} /></div>
                    <div><h3 className="text-[10px] font-black uppercase tracking-tight">Scholar Lab</h3><p className="text-[8px] font-bold text-slate-400 uppercase">Flashcards</p></div>
                  </button>
                  <button onClick={() => setRoute(AppRoute.BREAK)} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform active:scale-95 group text-left">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Gamepad2 size={24} /></div>
                    <div><h3 className="text-[10px] font-black uppercase tracking-tight">Games</h3><p className="text-[8px] font-bold text-slate-400 uppercase">The Break Room</p></div>
                  </button>

                  <button onClick={() => setRoute(AppRoute.DESIGN_SANCTUARY)} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform active:scale-95 group text-left">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-colors"><Layout size={24} /></div>
                    <div><h3 className="text-[10px] font-black uppercase tracking-tight">Sanctuary</h3><p className="text-[8px] font-bold text-slate-400 uppercase">Visual Design</p></div>
                  </button>
                  <button onClick={() => setRoute(AppRoute.WRITING_HAVEN)} className="p-6 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform active:scale-95 group text-left">
                    <div className="p-3 bg-indigo-600 text-white rounded-2xl group-hover:bg-indigo-700 transition-colors shadow-lg"><PenLine size={24} /></div>
                    <div><h3 className="text-[10px] font-black uppercase tracking-tight text-indigo-900">Haven</h3><p className="text-[8px] font-bold text-indigo-400 uppercase">Writing Suite</p></div>
                  </button>

                  <button onClick={() => setRoute(AppRoute.INFOSPHERE)} className="p-6 bg-indigo-900 border-indigo-700 rounded-[2.5rem] flex flex-col items-start gap-4 shadow-xl hover:scale-[1.02] transition-all group overflow-hidden relative text-left">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 blur-xl rounded-full group-hover:bg-white/10 transition-colors"></div>
                    <div className="p-3 bg-indigo-400 text-indigo-950 rounded-2xl"><MessageSquareText size={24} /></div>
                    <div><h3 className="text-[10px] font-black uppercase tracking-tight text-white">Infosphere</h3><p className="text-[8px] font-bold text-indigo-300 uppercase">AI Voice Chat</p></div>
                  </button>
                  <button onClick={() => setRoute(AppRoute.LEADERBOARD)} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform active:scale-95 group text-left">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors"><Trophy size={24} /></div>
                    <div><h3 className="text-[10px] font-black uppercase tracking-tight">Ranks</h3><p className="text-[8px] font-bold text-slate-400 uppercase">Top Scholars</p></div>
                  </button>

                  <button onClick={() => setRoute(AppRoute.PLANNER)} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform active:scale-95 group text-left">
                    <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl group-hover:bg-sky-600 group-hover:text-white transition-colors"><CalendarDays size={24} /></div>
                    <div><h3 className="text-[10px] font-black uppercase tracking-tight">Planner</h3><p className="text-[8px] font-bold text-slate-400 uppercase">Organization</p></div>
                  </button>

                  {settings.isRoyal && (
                    <button onClick={() => setRoute(AppRoute.LIBRARY)} className="p-6 bg-slate-900 border-2 border-amber-400 rounded-[2.5rem] flex flex-col items-start gap-4 shadow-xl hover:scale-[1.02] transition-all text-left">
                       <div className="p-3 bg-amber-400 text-slate-900 rounded-2xl"><LibraryIcon size={24} /></div>
                       <div><h3 className="text-[10px] font-black uppercase text-white italic">Royal Library</h3><p className="text-[8px] font-bold text-amber-400 uppercase tracking-widest">5M+ Titles Integrated</p></div>
                    </button>
                  )}
                </div>

                <div id="focus-section" className="mb-8 pr-16 relative z-10">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('session_length')}</h2>
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase border border-indigo-100">MAX {settings.isRoyal ? '300' : '120'}m</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {[15, 25, 45, 60, 120, 300].map(m => (
                      <button key={m} onClick={() => setSelectedDuration(m)} className={`py-3 rounded-2xl font-black text-xs border transition-all ${selectedDuration === m ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}>{m}m</button>
                    ))}
                  </div>
                  <button onClick={() => startSession(selectedDuration)} className="w-full bg-slate-900 text-white p-8 rounded-[3rem] font-black text-2xl flex items-center justify-between shadow-2xl active:scale-95 transition-all hover:bg-black group">
                    <span>{t('start_focus_btn')}</span>
                    <Zap size={32} className="text-indigo-400 group-hover:scale-125 transition-transform" fill="currentColor" />
                  </button>
                </div>
              </div>
            )}

            {route === AppRoute.FOCUS && (
              <div className="fixed inset-0 bg-slate-950 z-50 p-8 flex flex-col items-center justify-center animate-in fade-in duration-1000 text-white overflow-hidden">
                <button onClick={() => completeSession(false)} className="absolute top-8 left-8 p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all flex items-center gap-2">
                  <ChevronLeft size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Quit</span>
                </button>
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.1),transparent_70%)]"></div>
                
                <PetSanctuary 
                  companionType={settings.selectedCompanion} 
                  customName={settings.customCompanionName} 
                  growth={settings.companionGrowth} 
                  habitatId={settings.selectedHabitat} 
                  unlockedHabitats={settings.unlockedHabitats} 
                  isFocusing={!isOnBreak} 
                  language={settings.language} 
                  message={isOnBreak ? "Rest is part of the work! Recharge your mind." : companionMessage}
                  studyMode={settings.studyMode}
                  onOpenVault={() => {}} 
                />

                <div className="mt-16 text-center w-full max-w-xs relative z-10">
                  {isOnBreak ? (
                    <div className="animate-in zoom-in-95 duration-500">
                       <div className="flex items-center justify-center gap-2 mb-2 text-indigo-400">
                          <BreakIcon size={20} className="animate-bounce" />
                          <span className="text-xs font-black uppercase tracking-[0.3em]">Break in Progress</span>
                       </div>
                       <h2 className="text-8xl font-black tabular-nums tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-indigo-300 to-indigo-600">
                         {Math.floor(breakTimeLeft / 60)}:{(breakTimeLeft % 60).toString().padStart(2, '0')}
                       </h2>
                    </div>
                  ) : (
                    <h2 className="text-8xl font-black tabular-nums tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                      {Math.floor(session.timeLeft / 60)}:{(session.timeLeft % 60).toString().padStart(2, '0')}
                    </h2>
                  )}

                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={handlePause} 
                      disabled={!breakUnlocked && !isOnBreak}
                      className={`w-full py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex flex-col items-center justify-center gap-1 transition-all ${isOnBreak ? 'bg-indigo-600 text-white shadow-xl' : breakUnlocked ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                    >
                      {isOnBreak ? (
                        <div className="flex items-center gap-3">RESUME SESSION <Play size={18} fill="currentColor" /></div>
                      ) : breakUnlocked ? (
                        <div className="flex items-center gap-3">PAUSE & 5M BREAK <Pause size={18} fill="currentColor" /></div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3"><Lock size={14} /> BREAK LOCKED</div>
                          <span className="text-[8px] font-black opacity-60 italic">FOCUS {Math.floor(secondsToBreakUnlock / 60)}:{(secondsToBreakUnlock % 60).toString().padStart(2, '0')} MORE TO UNLOCK</span>
                        </>
                      )}
                    </button>

                    {isOnBreak && (
                      <button 
                        onClick={() => setRoute(AppRoute.BREAK)}
                        className="w-full py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 bg-emerald-500 text-white shadow-xl animate-in zoom-in-95"
                      >
                        ENTER BREAK ROOM <Gamepad2 size={18} />
                      </button>
                    )}
                    
                    <button 
                      onClick={() => completeSession(false)} 
                      className="text-white/20 font-black uppercase tracking-[0.3em] px-8 py-3 rounded-2xl hover:text-rose-500 transition-all text-[10px]"
                    >
                      ABANDON SESSION
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {route === AppRoute.BREAK && <BreakRoom timeLeft={isOnBreak ? breakTimeLeft : undefined} onClose={() => {
              if (session.isActive) setRoute(AppRoute.FOCUS);
              else setRoute(AppRoute.DASHBOARD);
            }} />}
            {route === AppRoute.AI_LAB && <AILab isPremium={settings.isPremium} onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.LIVE_CHAT && <LiveTutor language={settings.language} onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.GUARDIAN && <GuardianSync settings={settings} onUpdateGuardian={handleUpdateSettings} onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.LIBRARY && <RoyalLibrary isRoyal={settings.isRoyal} onClose={() => setRoute(AppRoute.DASHBOARD)} onGoRoyal={() => setRoute(AppRoute.PREMIUM)} />}
            {route === AppRoute.INFOSPHERE && <Infosphere onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.DESIGN_SANCTUARY && <DesignSanctuary isPremium={settings.isPremium} onClose={() => setRoute(AppRoute.DASHBOARD)} onGoPremium={() => setRoute(AppRoute.PREMIUM)} />}
            {route === AppRoute.WRITING_HAVEN && <WritingHaven isPremium={settings.isPremium} onClose={() => setRoute(AppRoute.DASHBOARD)} onGoPremium={() => setRoute(AppRoute.PREMIUM)} />}
            {route === AppRoute.ACADEMY && <AcademyHub vocabulary={settings.vocabulary} onAddWord={(w) => handleUpdateSettings({ vocabulary: [...settings.vocabulary, w] })} onRemoveWord={(w) => handleUpdateSettings({ vocabulary: settings.vocabulary.filter(v => v.word !== w) })} isPremium={settings.isPremium} isRoyal={settings.isRoyal} onClose={() => setRoute(AppRoute.DASHBOARD)} />}
            {route === AppRoute.SETTINGS && <SettingsView settings={settings} onUpdate={handleUpdateSettings} onClose={() => setRoute(AppRoute.DASHBOARD)} onNavigate={setRoute} />}
            {route === AppRoute.FLASHCARDS && <div className="animate-in fade-in duration-500 min-h-screen bg-[#fcfcfd]"><FlashcardLab sets={settings.flashcardSets} language={settings.language} onSaveSet={(title, cards) => handleUpdateSettings({ flashcardSets: [...settings.flashcardSets, { id: Math.random().toString(), title, cards, createdAt: new Date().toISOString() }] })} onDeleteSet={(id) => handleUpdateSettings({ flashcardSets: settings.flashcardSets.filter(s => s.id !== id) })} onClose={() => setRoute(AppRoute.DASHBOARD)} /></div>}
            {route === AppRoute.PLANNER && <div className="animate-in fade-in duration-500 min-h-screen bg-[#fcfcfd]"><CalendarSchedule events={settings.calendarEvents} language={settings.language} onAddEvent={(e) => handleUpdateSettings({ calendarEvents: [...settings.calendarEvents, { ...e, id: Math.random().toString() }] })} onDeleteEvent={(id) => handleUpdateSettings({ calendarEvents: settings.calendarEvents.filter(ev => ev.id !== id) })} onClose={() => setRoute(AppRoute.DASHBOARD)} /></div>}
            {route === AppRoute.LEADERBOARD && <div className="animate-in fade-in duration-500 min-h-screen bg-[#fcfcfd]"><Leaderboard currentUser={{ name: settings.userName || 'Student', pic: settings.profilePic || '🎓', focusTime: settings.totalFocusTime }} onClose={() => setRoute(AppRoute.DASHBOARD)} /></div>}
          </main>

          {route !== AppRoute.FOCUS && (
            <div className="fixed bottom-24 left-6 z-50 pointer-events-auto">
              <a href="mailto:scholarmvp.help@gmail.com" className="flex items-center gap-1.5 px-2.5 py-1 bg-white/40 backdrop-blur-md border border-white/20 rounded-full text-slate-400 text-[6px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-sm"><Mail size={8} /> Support</a>
            </div>
          )}

          {route === AppRoute.DASHBOARD && (
            <button 
              onClick={() => setIsCustomizing(!isCustomizing)}
              className={`fixed bottom-24 right-20 z-[60] p-4 border rounded-full shadow-xl transition-all active:scale-95 ${isCustomizing ? 'bg-rose-500 border-rose-400 text-white animate-none' : 'bg-white/80 backdrop-blur-md border-slate-200 text-indigo-600 animate-bounce'}`}
              title="Customize Dashboard"
            >
              {isCustomizing ? <CheckCircle2 size={24} /> : <Pencil size={24} />}
            </button>
          )}

          {isCustomizing && (
             <div className="fixed bottom-32 inset-x-6 z-[100] bg-white rounded-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] border border-slate-100 p-8 animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none">Home Styling</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Personalize your Workspace</p>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={clearStickers} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-rose-500 transition-colors" title="Clear Stickers"><RotateCcw size={18} /></button>
                      <button onClick={() => setIsCustomizing(false)} className="p-3 bg-indigo-600 text-white rounded-2xl"><X size={18} /></button>
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3 block">Dashboard Tint</span>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                         {['#fcfcfd', '#fff5f7', '#f0fdf4', '#f0f9ff', '#f5f3ff', '#fffbeb', '#fafafa', '#fee2e2', '#ffedd5', '#fef9c3', '#dcfce7', '#d1fae5', '#e0f2fe', '#e0e7ff', '#f3e8ff', '#fae8ff', '#fce7f3', '#334155', '#1e293b'].map(c => (
                           <button 
                             key={c} 
                             onClick={() => updateDashboardTheme(c)}
                             className={`w-10 h-10 rounded-full shrink-0 border-2 transition-transform hover:scale-110 ${settings.dashboardCustomization?.themeColor === c ? 'border-indigo-600 scale-110 shadow-lg' : 'border-slate-100'}`}
                             style={{ backgroundColor: c }}
                           />
                         ))}
                      </div>
                   </div>

                   <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3 block">Sticker Pack</span>
                      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 text-3xl">
                         {['⭐', '🔥', '🧠', '🚀', '🌟', '📚', '🧪', '💡', '✅', '📍', '🎓', '🎯', '⚡', '📝', '📂', '🍦', '🍩', '🍕', '🌮', '🍣', '🍎', '🍄', '🌍', '🪐', '🎨', '🎮', '🎧'].map(s => (
                           <button 
                             key={s} 
                             onClick={() => addSticker(s)}
                             className="hover:scale-125 transition-transform active:scale-90 flex-shrink-0"
                           >
                             {s}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 text-center">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">TIP: Drag stickers on the dashboard to move them</p>
                </div>
             </div>
          )}

          {![AppRoute.FOCUS, AppRoute.PREMIUM, AppRoute.SETTINGS, AppRoute.BREAK, AppRoute.AI_LAB].includes(route) && <Navigation currentRoute={route} setRoute={setRoute} language={settings.language} />}
        </>
      )}
      <style>{`
        @keyframes music {
          0%, 100% { height: 40%; }
          50% { height: 100%; }
        }
      `}</style>
    </div>
  );
};

export default App;
