
import React, { useState, useRef } from 'react';
import { Search, SpellCheck, Book, Trash2, CheckCircle2, Loader2, Sparkles, X, Globe, FileUp, Lock, Crown, Headphones, Volume2, BrainCircuit, GraduationCap, Camera, ScanText, Zap, Lightbulb, Users, UserPlus, MessageCircle, PhoneCall, Share2, Video, Mic, MonitorUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { getDefinition, researchQuery, generateSpellingQuiz, generateFlashcards, analyzeImage } from '../services/gemini';
import { VocabularyWord, AppRoute } from '../types';

interface AcademyHubProps {
  vocabulary: VocabularyWord[];
  onAddWord: (word: VocabularyWord) => void;
  onRemoveWord: (word: string) => void;
  isPremium: boolean;
  setAppRoute?: (route: AppRoute) => void;
  onClose: () => void;
}

const AcademyHub: React.FC<AcademyHubProps> = ({ vocabulary, onAddWord, onRemoveWord, isPremium, setAppRoute, onClose }) => {
  const [activeTab, setActiveTab] = useState<'lexicon' | 'spelling' | 'voicetutor' | 'filetest' | 'research' | 'scanner' | 'group'>('lexicon');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Group states
  const [groupView, setGroupView] = useState<'menu' | 'chat' | 'call'>('menu');
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Scanner states
  const [scannerSubject, setScannerSubject] = useState<string | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const literacyTabs = [
    { id: 'lexicon', icon: <Search size={16} />, label: 'Lexicon (Free)', premium: false },
    { id: 'spelling', icon: <SpellCheck size={16} />, label: 'Spelling Bee (Free)', premium: false },
    { id: 'group', icon: <Users size={16} />, label: 'Scholar Group', premium: false },
    { id: 'voicetutor', icon: <Headphones size={16} />, label: 'AI Vocab Voice', premium: true },
  ];

  const studyTabs = [
    { id: 'scanner', icon: <ScanText size={16} />, label: 'Scholar Scanner', premium: false },
    { id: 'filetest', icon: <FileUp size={16} />, label: 'Exam Forge', premium: true },
    { id: 'research', icon: <Globe size={16} />, label: 'Research Hive', premium: true },
  ];

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: '➗' },
    { id: 'science', name: 'Science', icon: '🧪' },
    { id: 'history', name: 'History', icon: '🏛️' },
    { id: 'coding', name: 'Coding', icon: '💻' }
  ];

  const handleAction = async () => {
    if (!searchQuery.trim() && activeTab !== 'spelling' && activeTab !== 'scanner') return;
    const currentTab = [...literacyTabs, ...studyTabs].find(t => t.id === activeTab);
    if (currentTab?.premium && !isPremium) return;
    
    setLoading(true);
    setResult(null);
    try {
      if (activeTab === 'lexicon') {
        const data = await getDefinition(searchQuery);
        setResult({ text: data.definition, example: data.example });
      } else if (activeTab === 'spelling') {
        const data = await generateSpellingQuiz("advanced");
        setResult({ type: 'spelling', words: data });
      } else if (activeTab === 'filetest') {
        const cards = await generateFlashcards(searchQuery);
        setResult({ type: 'test', questions: cards });
      } else if (activeTab === 'research') {
        const data = await researchQuery(searchQuery);
        setResult(data);
      } else if (activeTab === 'scanner' && scannedImage) {
        const prompt = `You are a Scholar Tutor. Analyze this ${scannerSubject} problem from the image. Provide a clear solution and a detailed explanation of the steps taken.`;
        const aiResponse = await analyzeImage(scannedImage, prompt);
        setResult({ type: 'solution', text: aiResponse });
      }
    } catch (e) {
      setResult({ text: "Scholar Link Error. Please check connection." });
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setScannedImage((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    }
  };

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const renderGroupFeature = () => {
    if (groupView === 'chat') {
      return (
        <div className="flex flex-col h-[500px] bg-slate-900/50 rounded-[2.5rem] border border-white/10 overflow-hidden animate-in slide-in-from-right duration-500">
           <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                 <button onClick={() => setGroupView('menu')} className="p-2 text-slate-500 hover:text-white transition-colors"><ChevronLeft size={20} /></button>
                 <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-xl">📚</div>
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-tight">Scholar Focus #1</h3>
                    <p className="text-[8px] font-bold text-emerald-500 uppercase">4 Scholars Active</p>
                 </div>
              </div>
              <button onClick={() => setGroupView('call')} className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg hover:scale-105 transition-transform"><PhoneCall size={18} /></button>
           </div>
           <div className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar">
              <div className="flex flex-col items-start gap-1">
                 <span className="text-[8px] font-black text-slate-500 uppercase ml-3 tracking-widest">Sarah (Lv.12)</span>
                 <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none text-xs font-medium max-w-[80%] text-slate-100">Anyone ready for the chemistry review session tonight?</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <span className="text-[8px] font-black text-indigo-400 uppercase mr-3 tracking-widest">You (Lv.8)</span>
                 <div className="bg-indigo-600 p-4 rounded-2xl rounded-tr-none text-xs font-medium max-w-[80%] text-white">Count me in! Just finished my daily spelling challenge.</div>
              </div>
              <div className="flex flex-col items-start gap-1">
                 <span className="text-[8px] font-black text-slate-500 uppercase ml-3 tracking-widest">Mike (Lv.15)</span>
                 <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none text-xs font-medium max-w-[80%] text-slate-100">I'll share my screen to show the formulas.</div>
              </div>
           </div>
           <div className="p-4 bg-black/40 border-t border-white/10">
              <div className="flex gap-2">
                 <input placeholder="Message group..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600" />
                 <button className="p-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 transition-colors"><Zap size={18} /></button>
              </div>
           </div>
        </div>
      );
    }

    if (groupView === 'call') {
      return (
        <div className="flex flex-col h-[500px] bg-slate-950 rounded-[3rem] border border-white/10 overflow-hidden animate-in zoom-in-95 duration-500 relative">
           <div className="p-6 flex items-center justify-between absolute top-0 inset-x-0 z-10">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                 <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Live Group Call</span>
              </div>
              <button onClick={() => setGroupView('menu')} className="p-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"><X size={20} /></button>
           </div>

           <div className="flex-1 grid grid-cols-2 gap-2 p-2 pt-20">
              <div className="bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5">
                 {isScreenSharing ? (
                   <div className="absolute inset-0 bg-indigo-600 flex flex-col items-center justify-center animate-pulse">
                      <MonitorUp size={48} className="text-white mb-2" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-center px-4">Sharing my screen...</span>
                   </div>
                 ) : (
                   <div className="text-4xl filter drop-shadow-lg">🎓</div>
                 )}
                 <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">You</div>
              </div>
              <div className="bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5">
                 <div className="text-4xl filter drop-shadow-lg">🔬</div>
                 <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">Sarah</div>
              </div>
              <div className="bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5">
                 <div className="text-4xl filter drop-shadow-lg">🧪</div>
                 <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">Mike</div>
              </div>
              <div className="bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5">
                 <div className="text-4xl filter drop-shadow-lg">🎨</div>
                 <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">Jade</div>
              </div>
           </div>

           <div className="p-8 flex items-center justify-center gap-6 shrink-0 bg-black/40 border-t border-white/10">
              <button className="p-5 bg-white/5 rounded-full text-white/40 hover:bg-white/10 hover:text-white transition-all"><Mic size={24} /></button>
              <button className="p-5 bg-white/5 rounded-full text-white/40 hover:bg-white/10 hover:text-white transition-all"><Video size={24} /></button>
              <button 
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-5 rounded-full transition-all border ${isScreenSharing ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
              >
                <MonitorUp size={24} />
              </button>
              <button onClick={() => setGroupView('menu')} className="p-6 bg-rose-500 text-white rounded-full shadow-2xl shadow-rose-500/20 active:scale-90 transition-all"><PhoneCall size={28} className="rotate-[135deg]" /></button>
           </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-8 bg-indigo-600/20 rounded-full mb-6 border border-indigo-500/30">
            <Users size={48} className="text-indigo-400" />
          </div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Scholar Group</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 px-10 leading-relaxed">Connect with study buddies, join calls, and share screens in real-time.</p>
          
          <div className="mt-10 grid grid-cols-1 w-full gap-3">
             <button onClick={() => setGroupView('chat')} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
                <MessageCircle size={18} /> Open Group Chat
             </button>
             <button onClick={() => setGroupView('call')} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-indigo-500/20">
                <Video size={18} /> Join Study Call
             </button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Invite Scholar Friends</h4>
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 space-y-4">
             <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-lg">👤</div>
                   <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tight text-white">Alex Rivera</span>
                      <span className="text-[8px] font-bold text-slate-500 uppercase">Focus Lv. 4</span>
                   </div>
                </div>
                <button className="p-2 text-indigo-400 hover:text-white transition-colors bg-indigo-400/10 rounded-xl"><UserPlus size={18} /></button>
             </div>
             <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-lg">👤</div>
                   <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tight text-white">Chloe Zhang</span>
                      <span className="text-[8px] font-bold text-slate-500 uppercase">Focus Lv. 9</span>
                   </div>
                </div>
                <button className="p-2 text-indigo-400 hover:text-white transition-colors bg-indigo-400/10 rounded-xl"><UserPlus size={18} /></button>
             </div>
             <button className="w-full py-5 bg-indigo-600/10 border border-indigo-600/30 rounded-2xl text-[10px] font-black uppercase text-indigo-400 hover:bg-indigo-600/20 transition-all flex items-center justify-center gap-2">
                <Share2 size={16} /> Search All Contacts
             </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-[90] flex flex-col p-6 animate-in fade-in duration-500 overflow-hidden text-white">
      <div className="flex items-center justify-between mb-8 pr-16">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/10 backdrop-blur-md">
            <Book size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">THE ACADEMY</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Level {isPremium ? 'Elite' : 'Basic'} Active</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={32} /></button>
      </div>

      <div className="space-y-6 shrink-0 pr-16 pb-6">
        <div>
          <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-2">Literacy Suite</label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {literacyTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setResult(null); setGroupView('menu'); }}
                className={`flex-none px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === tab.id ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-white/10 text-slate-500'}`}
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                  {tab.premium && !isPremium && <Crown size={10} className="text-white ml-1" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-2">Study Suite</label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {studyTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setResult(null); setGroupView('menu'); }}
                className={`flex-none px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === tab.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.2)]' : 'bg-white/5 border-white/10 text-slate-500'}`}
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                  {tab.premium && !isPremium && <Crown size={10} className="text-amber-500 ml-1" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pr-16 space-y-6 pb-20">
        {activeTab === 'group' ? renderGroupFeature() : activeTab === 'scanner' ? (
          <div className="space-y-6">
            {!scannerSubject ? (
              <div className="space-y-4 animate-in slide-in-from-bottom-4">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-center">Select Subject for Scan</h3>
                <div className="grid grid-cols-2 gap-3">
                  {subjects.map(sub => (
                    <button 
                      key={sub.id}
                      onClick={() => setScannerSubject(sub.name)}
                      className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-all group"
                    >
                      <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{sub.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{sub.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95">
                <div className="flex items-center justify-between px-2">
                  <button onClick={() => {setScannerSubject(null); setScannedImage(null); setResult(null);}} className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <X size={14} /> Back to Subjects
                  </button>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">{scannerSubject} Active</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  {scannedImage ? (
                    <div className="w-full relative aspect-square rounded-2xl overflow-hidden border border-white/10">
                      <img src={`data:image/jpeg;base64,${scannedImage}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay animate-[scan_2s_ease-in-out_infinite]"></div>
                      <button onClick={() => setScannedImage(null)} className="absolute top-4 right-4 p-3 bg-black/60 rounded-full text-white backdrop-blur-md">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="p-8 bg-indigo-600/20 rounded-full mb-6 border border-indigo-500/30">
                        <Camera size={48} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="text-xl font-black uppercase italic">Scan Your Work</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 max-w-[200px] mx-auto">Upload a clear photo of your problem for AI solution.</p>
                      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                      <button onClick={() => fileInputRef.current?.click()} className="mt-8 bg-white text-black px-12 py-5 rounded-3xl font-black text-xs cursor-pointer shadow-2xl active:scale-95 transition-all">TAKE PHOTO</button>
                    </>
                  )}
                </div>

                {scannedImage && (
                  <button 
                    onClick={handleAction}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-indigo-500/30 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
                    {loading ? 'Analyzing Complexity...' : 'Solve & Explain'}
                  </button>
                )}

                {result?.type === 'solution' && (
                  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 animate-in slide-in-from-bottom-4 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <Lightbulb size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><Sparkles size={16} /></div>
                        <h4 className="text-lg font-black italic uppercase tracking-tighter">AI Solution Analysis</h4>
                      </div>
                      <div className="h-px bg-white/5"></div>
                      <div className="text-sm font-medium text-slate-300 leading-relaxed whitespace-pre-line">
                        {result.text}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <style>{`
              @keyframes scan {
                0%, 100% { transform: translateY(-100%); opacity: 0; }
                50% { transform: translateY(100%); opacity: 1; }
              }
            `}</style>
          </div>
        ) : activeTab === 'voicetutor' ? (
          <div className="space-y-6">
            <div className={`bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-center transition-opacity ${!isPremium ? 'opacity-40' : 'opacity-100'}`}>
              {!isPremium ? (
                <div className="flex flex-col items-center">
                  <Lock size={48} className="text-slate-700 mb-4" />
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Premium AI Vocab Voice</h3>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 px-6">Upgrade to have the AI voice coach you through your word bank.</p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(79,70,229,0.4)] animate-pulse">
                    <Headphones size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">AI Voice Tutor</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 leading-relaxed">Hear your personalized vocabulary bank read by Scholar AI</p>
                </>
              )}
            </div>
            
            {isPremium && (
              <div className="grid gap-3">
                {vocabulary.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                    <span className="text-[10px] font-black uppercase tracking-widest">Vault is empty. Add words from the Lexicon.</span>
                  </div>
                ) : (
                  vocabulary.map((v, i) => (
                    <button 
                      key={i}
                      onClick={() => speakWord(v.word)}
                      className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                      <div className="text-left">
                        <h4 className="font-black text-white uppercase text-sm tracking-tight">{v.word}</h4>
                        <p className="text-[10px] text-slate-500 font-bold italic mt-1">{v.definition.slice(0, 50)}...</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-indigo-600 transition-colors">
                        <Volume2 size={16} />
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ) : activeTab === 'filetest' ? (
          <div className="space-y-6">
            <div className={`p-10 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center text-center transition-all ${isPremium ? 'border-white/20 bg-white/5' : 'border-slate-800 bg-slate-900/50 opacity-60'}`}>
              {!isPremium ? (
                <>
                  <Lock size={48} className="text-slate-700 mb-6" />
                  <h3 className="text-xl font-black uppercase text-slate-500 italic tracking-tighter">Premium Exam Forge</h3>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 px-10">Upload any file for unlimited AI-generated tests and quizzes.</p>
                </>
              ) : (
                <>
                  <FileUp size={48} className="text-indigo-400 mb-6 animate-bounce" />
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Forge Unlimited Quizzes</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Unlimited file-to-test conversions active.</p>
                  <input type="file" className="hidden" id="file-test-upload-v4" />
                  <label htmlFor="file-test-upload-v4" className="mt-8 bg-white text-black px-10 py-5 rounded-3xl font-black text-xs cursor-pointer shadow-2xl active:scale-95 transition-all">CHOOSE FILE</label>
                </>
              )}
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Paste Content (Premium - Unlimited)</label>
              <textarea 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                spellCheck="true"
                placeholder="Paste key notes or chapter text here for instant AI testing..."
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[180px] resize-none"
              />
              <button 
                onClick={handleAction}
                disabled={loading || !isPremium}
                className="w-full mt-4 bg-indigo-600 text-white py-6 rounded-3xl font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20 uppercase tracking-[0.2em]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />}
                GENERATE UNLIMITED TEST
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative group">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                spellCheck="true"
                placeholder={activeTab === 'lexicon' ? "Search the Lexicon..." : activeTab === 'spelling' ? "Start Spelling Bee..." : "Explore Knowledge..."}
                className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-8 pl-10 pr-24 font-black text-white focus:ring-4 focus:ring-white/5 focus:outline-none shadow-2xl placeholder:text-slate-700 transition-all uppercase tracking-tighter"
              />
              <button 
                onClick={handleAction}
                disabled={loading}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white text-black rounded-2xl shadow-xl disabled:opacity-50 active:scale-95 transition-all"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
              </button>
            </div>

            {result && (
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 animate-in slide-in-from-bottom-4 shadow-2xl">
                {activeTab === 'lexicon' ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white text-black rounded-xl"><GraduationCap size={20} /></div>
                      <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter">{searchQuery}</h3>
                    </div>
                    <div className="h-px bg-white/5 w-full"></div>
                    <p className="text-xl font-bold text-slate-300 leading-relaxed italic border-l-4 border-indigo-500 pl-6">"{result.text}"</p>
                    {result.example && (
                      <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-3xl mt-4">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-3 italic">Example Usage</span>
                        <p className="text-sm text-indigo-100 font-medium italic leading-relaxed">"{result.example}"</p>
                      </div>
                    )}
                  </div>
                ) : activeTab === 'spelling' ? (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">SPELLING CHALLENGE</h3>
                    {result.words.map((w: any, i: number) => (
                      <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/20 transition-all shadow-inner">
                        <span className="font-black blur-md group-hover:blur-none transition-all duration-700 text-2xl uppercase tracking-tighter text-indigo-300">{w.word}</span>
                        <div className="text-right max-w-[60%]">
                          <span className="text-[9px] font-black text-slate-600 uppercase block mb-1">CLUE</span>
                          <span className="text-xs text-slate-400 font-bold italic">{w.hint}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-300 font-medium whitespace-pre-line text-sm leading-relaxed">{result.text}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AcademyHub;
