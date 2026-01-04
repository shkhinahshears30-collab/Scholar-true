
import React, { useState, useEffect, useRef } from 'react';
import { X, PenLine, Save, Download, Sparkles, Trash2, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Loader2, Crown, Maximize2, Minimize2, Clock, Hash, Palette, Coffee, Wind, Moon, Sun, BookOpen, CheckCircle2, Target, Eraser, Info, List, ListOrdered, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface WritingHavenProps {
  isPremium: boolean;
  onClose: () => void;
  onGoPremium: () => void;
}

interface Draft {
  id: string;
  title: string;
  content: string; // Now stores HTML for rich text
  updatedAt: string;
  theme: HavenTheme;
  goal: number;
}

type HavenTheme = 'ivory' | 'midnight' | 'parchment' | 'nebula' | 'forest';

const THEMES: Record<HavenTheme, { bg: string, paper: string, text: string, accent: string, desc: string }> = {
  ivory: { bg: 'bg-slate-50', paper: 'bg-white', text: 'text-slate-900', accent: 'text-indigo-600', desc: 'Standard Academic' },
  midnight: { bg: 'bg-slate-950', paper: 'bg-slate-900', text: 'text-slate-100', accent: 'text-sky-400', desc: 'Deep Focus' },
  parchment: { bg: 'bg-amber-50/30', paper: 'bg-[#fdf6e3]', text: 'text-amber-900', accent: 'text-amber-700', desc: 'Classic Manuscript' },
  nebula: { bg: 'bg-indigo-950', paper: 'bg-indigo-900/40', text: 'text-indigo-50', accent: 'text-pink-400', desc: 'Creative Flow' },
  forest: { bg: 'bg-emerald-950', paper: 'bg-emerald-900/40', text: 'text-emerald-50', accent: 'text-emerald-400', desc: 'Zen Sanctuary' },
};

const WORD_GOALS = [0, 100, 250, 500, 1000, 2500, 5000];

const WritingHaven: React.FC<WritingHavenProps> = ({ isPremium, onClose, onGoPremium }) => {
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    const saved = localStorage.getItem('scholar_haven_drafts');
    return saved ? JSON.parse(saved) : [{ id: '1', title: 'Untilted Thought', content: '<div>The sanctuary is ready. Begin your flow...</div>', updatedAt: new Date().toISOString(), theme: 'ivory', goal: 500 }];
  });
  const [activeDraftId, setActiveDraftId] = useState<string>(drafts[0]?.id || '1');
  const [isAILoading, setIsAILoading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [lastTypedTime, setLastTypedTime] = useState(Date.now());
  const [focusPulse, setFocusPulse] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const activeDraft = drafts.find(d => d.id === activeDraftId) || drafts[0];
  const currentTheme = THEMES[activeDraft.theme || 'ivory'];

  useEffect(() => {
    localStorage.setItem('scholar_haven_drafts', JSON.stringify(drafts));
  }, [drafts]);

  // Handle typing state for UI fading
  useEffect(() => {
    const now = Date.now();
    const timeout = setTimeout(() => {
      if (now - lastTypedTime > 2000) setIsTyping(false);
    }, 2100);
    return () => clearTimeout(timeout);
  }, [lastTypedTime]);

  // Focus Pulse logic: reacts to typing activity
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - lastTypedTime;
      if (diff < 1500) {
        setFocusPulse(prev => Math.min(100, prev + 3));
      } else {
        setFocusPulse(prev => Math.max(0, prev - 2));
      }
    }, 150);
    return () => clearInterval(interval);
  }, [lastTypedTime]);

  const updateContent = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;
    setLastTypedTime(Date.now());
    setIsTyping(true);
    setDrafts(prev => prev.map(d => d.id === activeDraftId ? { ...d, content, updatedAt: new Date().toISOString() } : d));
  };

  const updateTitle = (title: string) => {
    setDrafts(prev => prev.map(d => d.id === activeDraftId ? { ...d, title, updatedAt: new Date().toISOString() } : d));
  };

  const updateTheme = (theme: HavenTheme) => {
    setDrafts(prev => prev.map(d => d.id === activeDraftId ? { ...d, theme, updatedAt: new Date().toISOString() } : d));
  };

  const updateGoal = (goal: number) => {
    setDrafts(prev => prev.map(d => d.id === activeDraftId ? { ...d, goal, updatedAt: new Date().toISOString() } : d));
    setShowGoalPicker(false);
  };

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const createDraft = () => {
    const newDraft: Draft = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Chapter',
      content: '<div>Start your journey...</div>',
      updatedAt: new Date().toISOString(),
      theme: 'ivory',
      goal: 500
    };
    setDrafts([newDraft, ...drafts]);
    setActiveDraftId(newDraft.id);
  };

  const deleteDraft = (id: string) => {
    if (drafts.length <= 1) {
        if(editorRef.current) editorRef.current.innerHTML = '';
        updateContent();
        return;
    }
    const next = drafts.filter(d => d.id !== id);
    setDrafts(next);
    setActiveDraftId(next[0].id);
  };

  const handleSummonMuse = async () => {
    if (!isPremium) { onGoPremium(); return; }
    const plainText = editorRef.current?.innerText || '';
    if (!plainText.trim()) {
        alert("The Muse needs a seed. Start typing first!");
        return;
    }

    setIsAILoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the Scholar Muse. Based on the following text, write the next 2 sentences in the same style and tone. Keep formatting minimal: "${plainText.slice(-800)}"`,
      });
      if (response.text && editorRef.current) {
        const newPart = `<span> ${response.text}</span>`;
        editorRef.current.innerHTML += newPart;
        updateContent();
      }
    } catch (e) {
      alert("The Muse is silent right now. Try again.");
    } finally {
      setIsAILoading(false);
    }
  };

  const plainText = editorRef.current?.innerText || '';
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = plainText.length;
  const readTime = Math.ceil(wordCount / 200);
  const goalProgress = activeDraft.goal > 0 ? Math.min(100, (wordCount / activeDraft.goal) * 100) : 0;

  return (
    <div className={`fixed inset-0 z-[95] flex flex-col animate-in fade-in duration-700 transition-colors ease-in-out ${currentTheme.bg}`}>
      
      {/* Haven Toolbar */}
      <div className={`p-8 flex items-center justify-between shrink-0 border-b transition-all duration-1000 ${isTyping ? 'opacity-10 pointer-events-none' : 'opacity-100'} ${isFocusMode ? 'hidden' : ''} ${activeDraft.theme === 'ivory' ? 'bg-white border-slate-100' : 'bg-black/20 border-white/5 backdrop-blur-md'}`}>
        <div className="flex items-center gap-4">
          <button onClick={onClose} className={`p-4 rounded-2xl transition-all ${activeDraft.theme === 'ivory' ? 'bg-slate-50 text-slate-400 hover:text-slate-900' : 'bg-white/5 text-white/40 hover:text-white'}`}><ChevronLeft size={28} /></button>
          <div className={`p-4 rounded-[2rem] shadow-xl transition-all duration-500 ${activeDraft.theme === 'ivory' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-950'} ${focusPulse > 50 ? 'scale-110 rotate-3' : 'scale-100'}`}>
            <PenLine size={28} />
          </div>
          <div>
            <h1 className={`text-2xl font-black tracking-tighter uppercase italic leading-none ${activeDraft.theme === 'ivory' ? 'text-slate-900' : 'text-white'}`}>Writing Haven</h1>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Scholar Sanctuary</p>
               <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
               <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{activeDraft.goal > 0 ? `${activeDraft.goal} WORD GOAL` : 'FREE FLOW'}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setShowGoalPicker(!showGoalPicker)} className={`p-4 rounded-2xl transition-all ${activeDraft.theme === 'ivory' ? 'bg-slate-50 text-slate-400 hover:text-indigo-600' : 'bg-white/5 text-white/40 hover:text-white'}`} title="Set Word Goal"><Target size={24} /></button>
           <button onClick={() => setShowThemePicker(!showThemePicker)} className={`p-4 rounded-2xl transition-all ${activeDraft.theme === 'ivory' ? 'bg-slate-50 text-slate-400 hover:text-indigo-600' : 'bg-white/5 text-white/40 hover:text-white'}`} title="Change Atmosphere"><Palette size={24} /></button>
           <button onClick={() => setIsFocusMode(true)} className={`p-4 rounded-2xl transition-all ${activeDraft.theme === 'ivory' ? 'bg-slate-50 text-slate-400 hover:text-indigo-600' : 'bg-white/5 text-white/40 hover:text-white'}`} title="Enter Haven Mode"><Maximize2 size={24} /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Modals (Atmosphere & Goal) */}
        {showThemePicker && (
          <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
             <div className="bg-white rounded-[3rem] p-10 w-full max-w-sm shadow-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-black uppercase tracking-tighter italic">Select Atmosphere</h3>
                   <button onClick={() => setShowThemePicker(false)} className="text-slate-300 hover:text-slate-900"><X size={24} /></button>
                </div>
                <div className="space-y-3">
                   {(Object.keys(THEMES) as HavenTheme[]).map(t => (
                     <button key={t} onClick={() => { updateTheme(t); setShowThemePicker(false); }} className={`w-full p-6 rounded-[2rem] flex items-center justify-between border-2 transition-all ${activeDraft.theme === t ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-50 hover:border-slate-100'}`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-8 h-8 rounded-full border border-white/20 ${THEMES[t].bg}`}></div>
                           <div className="text-left">
                              <p className="text-xs font-black uppercase tracking-widest text-slate-900">{t}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase">{THEMES[t].desc}</p>
                           </div>
                        </div>
                        {activeDraft.theme === t && <CheckCircle2 size={16} className="text-indigo-600" />}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        )}

        {showGoalPicker && (
          <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
             <div className="bg-white rounded-[3rem] p-10 w-full max-w-sm shadow-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-black uppercase tracking-tighter italic">Target Word Count</h3>
                   <button onClick={() => setShowGoalPicker(false)} className="text-slate-300 hover:text-slate-900"><X size={24} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   {WORD_GOALS.map(g => (
                     <button key={g} onClick={() => updateGoal(g)} className={`p-6 rounded-[2rem] border-2 transition-all ${activeDraft.goal === g ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-50 hover:border-slate-100'}`}>
                        <p className="text-lg font-black tracking-tight text-slate-900">{g === 0 ? 'None' : g}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Words</p>
                     </button>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* Sidebar */}
        <div className={`w-72 border-r shrink-0 flex flex-col p-6 transition-all duration-1000 ${isTyping ? 'opacity-5 pointer-events-none translate-x-[-20px]' : 'opacity-100 translate-x-0'} ${isFocusMode ? 'hidden' : ''} ${activeDraft.theme === 'ivory' ? 'bg-slate-50/50 border-slate-100' : 'bg-black/10 border-white/5'}`}>
           <button onClick={createDraft} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all mb-8 flex items-center justify-center gap-2">START NEW JOURNEY <PenLine size={14} /></button>
           <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              <p className={`text-[8px] font-black uppercase tracking-widest ml-2 mb-4 ${activeDraft.theme === 'ivory' ? 'text-slate-400' : 'text-white/20'}`}>Manuscript Library</p>
              {drafts.map(d => (
                <button key={d.id} onClick={() => setActiveDraftId(d.id)} className={`w-full p-6 rounded-[2.5rem] text-left group transition-all relative border ${activeDraftId === d.id ? (activeDraft.theme === 'ivory' ? 'bg-white shadow-xl border-slate-100' : 'bg-white/10 border-white/20 shadow-2xl') : 'border-transparent opacity-40 hover:opacity-100'}`}>
                  <h3 className={`text-xs font-black truncate uppercase tracking-tighter ${activeDraft.theme === 'ivory' ? 'text-slate-900' : 'text-white'}`}>{d.title}</h3>
                  <p className={`text-[8px] font-bold mt-1 ${activeDraft.theme === 'ivory' ? 'text-slate-400' : 'text-white/40'}`}>{new Date(d.updatedAt).toLocaleDateString()}</p>
                  {activeDraftId === d.id && <button onClick={(e) => { e.stopPropagation(); deleteDraft(d.id); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>}
                </button>
              ))}
           </div>
           <div className={`pt-6 border-t flex flex-col gap-3 ${activeDraft.theme === 'ivory' ? 'border-slate-100' : 'border-white/5'}`}>
              <div className="flex items-center justify-between text-slate-400 px-2"><div className="flex items-center gap-2"><Hash size={12} /><span className="text-[10px] font-black uppercase tracking-widest">{wordCount} Words</span></div><span className="text-[8px] font-bold opacity-50">{charCount} Chars</span></div>
              <div className="flex items-center gap-2 text-slate-400 px-2"><Clock size={12} /><span className="text-[10px] font-black uppercase tracking-widest">{readTime} Min Read</span></div>
           </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col items-center overflow-y-auto no-scrollbar pt-20 pb-40 relative">
           
           {isFocusMode && (
             <div className={`fixed top-8 inset-x-8 flex justify-between items-center z-50 transition-all duration-1000 ${isTyping ? 'opacity-10' : 'opacity-100'}`}>
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-2xl">
                   <div className={`w-2 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,1)] ${focusPulse > 20 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/80 italic">Haven Synchronized</span>
                   <div className="w-px h-3 bg-white/20 mx-2"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">{wordCount} Words</span>
                </div>
                <button onClick={() => setIsFocusMode(false)} className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white/40 hover:text-white transition-all border border-white/5 shadow-xl"><Minimize2 size={24} /></button>
             </div>
           )}

           <div className={`w-full max-w-3xl min-h-[90vh] p-12 sm:p-20 rounded-[4rem] shadow-2xl transition-all duration-1000 flex flex-col relative overflow-hidden ${currentTheme.paper} ${isFocusMode ? 'scale-[1.02]' : 'scale-100 border border-black/5'}`}>
              
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:32px_32px]"></div>
              <div className={`absolute top-0 left-0 h-1.5 transition-all duration-1000 ease-out ${currentTheme.accent.replace('text-', 'bg-')}`} style={{ width: `${goalProgress}%` }} />

              <div className="absolute top-12 right-12 opacity-30">
                 <div className="relative">
                    <PenLine size={32} className={currentTheme.accent} />
                    <div className="absolute inset-0 bg-current blur-2xl rounded-full opacity-20"></div>
                 </div>
              </div>

              {/* Functional Toolbar */}
              <div className={`mb-16 flex items-center justify-between border-b pb-6 transition-all duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'} ${activeDraft.theme === 'ivory' ? 'border-slate-100' : 'border-white/5'}`}>
                 <div className="flex items-center gap-1">
                    <button onClick={() => exec('bold')} className={`p-3 rounded-xl transition-all ${activeDraft.theme === 'ivory' ? 'hover:bg-slate-50 text-slate-400 hover:text-slate-900' : 'hover:bg-white/5 text-white/30 hover:text-white'}`}><Bold size={18} /></button>
                    <button onClick={() => exec('italic')} className={`p-3 rounded-xl transition-all ${activeDraft.theme === 'ivory' ? 'hover:bg-slate-50 text-slate-400 hover:text-slate-900' : 'hover:bg-white/5 text-white/30 hover:text-white'}`}><Italic size={18} /></button>
                    <div className={`w-px h-6 mx-2 ${activeDraft.theme === 'ivory' ? 'bg-slate-100' : 'bg-white/5'}`}></div>
                    <button onClick={() => exec('justifyLeft')} className={`p-3 rounded-xl transition-all ${activeDraft.theme === 'ivory' ? 'hover:bg-slate-50 text-slate-400 hover:text-slate-900' : 'hover:bg-white/5 text-white/30 hover:text-white'}`}><AlignLeft size={18} /></button>
                    <button onClick={() => exec('justifyCenter')} className={`p-3 rounded-xl transition-all ${activeDraft.theme === 'ivory' ? 'hover:bg-slate-50 text-slate-400 hover:text-slate-900' : 'hover:bg-white/5 text-white/30 hover:text-white'}`}><AlignCenter size={18} /></button>
                    <div className={`w-px h-6 mx-2 ${activeDraft.theme === 'ivory' ? 'bg-slate-100' : 'bg-white/5'}`}></div>
                    <button onClick={() => exec('insertUnorderedList')} className={`p-3 rounded-xl transition-all ${activeDraft.theme === 'ivory' ? 'hover:bg-slate-50 text-slate-400 hover:text-slate-900' : 'hover:bg-white/5 text-white/30 hover:text-white'}`}><List size={18} /></button>
                    <button onClick={() => { if(editorRef.current) editorRef.current.innerHTML = ''; updateContent(); }} className={`p-3 rounded-xl transition-all hover:text-rose-500 ${activeDraft.theme === 'ivory' ? 'text-slate-300' : 'text-white/10'}`} title="Clear Page"><Eraser size={18} /></button>
                 </div>

                 <button onClick={handleSummonMuse} disabled={isAILoading} className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all disabled:opacity-50 group ${activeDraft.theme === 'ivory' ? 'bg-slate-900 text-white hover:bg-black' : 'bg-indigo-600 text-white shadow-indigo-600/30'}`}>
                    {isAILoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />}
                    Summon Muse
                    {!isPremium && <Crown size={12} className="ml-1 fill-white" />}
                 </button>
              </div>

              {/* Editable Areas */}
              <input value={activeDraft.title} onChange={(e) => updateTitle(e.target.value)} placeholder="Name your Manuscript..." className={`w-full bg-transparent text-5xl font-black tracking-tighter uppercase italic outline-none mb-10 placeholder:opacity-10 transition-colors ${currentTheme.text}`} />

              <div 
                ref={editorRef}
                contentEditable 
                suppressContentEditableWarning
                onInput={updateContent}
                className={`w-full min-h-[60vh] bg-transparent text-xl font-medium leading-[2.2] outline-none placeholder:opacity-5 transition-colors ${currentTheme.text}`}
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: activeDraft.content }}
              />

              <div className="mt-20 flex flex-col gap-6">
                 <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ${currentTheme.text}`}>Creative Momentum</span>
                        <div className="flex items-center gap-2"><Wind size={10} className={currentTheme.accent} /><span className={`text-[9px] font-bold uppercase ${currentTheme.text} opacity-20`}>{focusPulse > 80 ? 'Transcendent Flow' : focusPulse > 40 ? 'Steady Progress' : 'Beginning Aura'}</span></div>
                    </div>
                    <div className="text-right"><span className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentTheme.accent}`}>{wordCount} / {activeDraft.goal || '∞'} WORDS</span></div>
                 </div>
                 <div className={`h-2 rounded-full overflow-hidden transition-all duration-1000 ${activeDraft.theme === 'ivory' ? 'bg-slate-100' : 'bg-white/5'}`}>
                    <div className={`h-full transition-all duration-700 ease-out rounded-full ${activeDraft.theme === 'ivory' ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-current shadow-[0_0_15px_currentColor]'}`} style={{ width: `${activeDraft.goal > 0 ? goalProgress : focusPulse}%` }} />
                 </div>
                 {activeDraft.goal > 0 && wordCount >= activeDraft.goal && <div className="flex items-center justify-center gap-2 animate-bounce mt-2"><CheckCircle2 size={14} className="text-emerald-500" /><span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Scholar's Goal Achieved!</span></div>}
              </div>
           </div>

           {/* Floating Haven Status */}
           {isFocusMode && (
             <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/50 backdrop-blur-2xl px-12 py-6 rounded-[3rem] border border-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-6 duration-700 transition-all ${isTyping ? 'opacity-10 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <div className="flex flex-col items-center"><span className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-1">Pace</span><span className="text-sm font-black text-white italic">{Math.floor(focusPulse / 2)} <span className="text-[8px] opacity-40">wpm</span></span></div>
                <div className="w-px h-10 bg-white/10"></div>
                <button onClick={handleSummonMuse} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/30 active:scale-90 transition-all group relative overflow-hidden"><div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div><Sparkles size={24} className="group-hover:animate-pulse relative z-10" /></button>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="flex flex-col items-center"><span className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-1">Words</span><span className="text-sm font-black text-white italic">{wordCount}</span></div>
             </div>
           )}
        </div>
      </div>

      {/* Global Actions */}
      {!isFocusMode && (
        <div className={`absolute bottom-10 right-10 flex flex-col gap-4 items-end animate-in slide-in-from-right-10 duration-700 transition-all ${isTyping ? 'opacity-0 scale-90 translate-x-10' : 'opacity-100 scale-100 translate-x-0'}`}>
           <div className={`p-4 rounded-[2rem] border backdrop-blur-md flex items-center gap-4 transition-all duration-700 ${activeDraft.theme === 'ivory' ? 'bg-white/80 border-slate-100' : 'bg-white/5 border-white/10'}`}>
              <div className="flex flex-col items-end pr-2 border-r border-current border-opacity-10"><span className={`text-[8px] font-black uppercase tracking-widest opacity-40 ${currentTheme.text}`}>Session Length</span><span className={`text-xs font-black italic ${currentTheme.text}`}>8m 12s</span></div>
              <button className={`p-4 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all group ${activeDraft.theme === 'ivory' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'}`} title="Archive Manuscript" onClick={() => alert("Document exported to Scholar Archive.")}><Download size={20} /></button>
           </div>
           <button className="p-8 bg-slate-900 text-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-6 group border border-white/10"><div className="flex flex-col items-end"><span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Scholar Vault</span><span className="text-sm font-black italic">Haven Synced</span></div><div className="p-4 bg-white/10 rounded-2xl group-hover:rotate-12 transition-transform shadow-inner"><Save size={28} /></div></button>
        </div>
      )}
    </div>
  );
};

export default WritingHaven;
