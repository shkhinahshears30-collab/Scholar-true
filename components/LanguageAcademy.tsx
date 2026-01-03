
import React, { useState, useEffect } from 'react';
import { X, Volume2, Crown, Rabbit, Sparkles, Globe, Lock, CheckCircle2, Glasses, ChevronLeft, ChevronRight, Star, Play, Trophy, Heart, MessageCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { CompanionType } from '../types';

interface LanguageAcademyProps {
  companionType: CompanionType;
  isPremium: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  type: 'translate' | 'match' | 'choice';
  prompt: string;
  translation?: string;
  options: string[];
  answer: string;
}

const SPANISH_PATH = [
  { id: 1, title: 'Greetings', icon: '👋', status: 'completed' },
  { id: 2, title: 'Basics 1', icon: '🍎', status: 'active' },
  { id: 3, title: 'At School', icon: '🏫', status: 'locked' },
  { id: 4, title: 'Common Verbs', icon: '🏃', status: 'locked' },
  { id: 5, title: 'Final Test', icon: '🎓', status: 'locked' },
];

const MOCK_LESSONS: Record<string, Question[]> = {
  beginner: [
    { id: 1, type: 'choice', prompt: 'How do you say "Hello" in Spanish?', options: ['Hola', 'Adiós', 'Gracias', 'Por favor'], answer: 'Hola' },
    { id: 2, type: 'choice', prompt: 'How do you say "Book"?', options: ['Mesa', 'Libro', 'Silla', 'Pluma'], answer: 'Libro' },
    { id: 3, type: 'translate', prompt: 'The book.', translation: 'El libro.', options: ['El', 'libro', 'la', 'mesa', 'un'], answer: 'El libro.' },
  ],
  ok: [
    { id: 1, type: 'translate', prompt: 'The student studies a lot.', translation: 'El estudiante estudia mucho.', options: ['estudia', 'mucho', 'estudiante', 'El', 'un', 'libro'], answer: 'El estudiante estudia mucho.' },
    { id: 2, type: 'choice', prompt: 'Which means "The library"?', options: ['La escuela', 'La biblioteca', 'El parque', 'La casa'], answer: 'La biblioteca' },
    { id: 3, type: 'translate', prompt: 'I like Spanish.', translation: 'Me gusta el español.', options: ['Me', 'gusta', 'el', 'español', 'No', 'odio'], answer: 'Me gusta el español.' },
  ],
  pro: [
    { id: 1, type: 'translate', prompt: 'If I had time, I would go.', translation: 'Si tuviera tiempo, iría.', options: ['Si', 'tuviera', 'tiempo', 'iría', 'tengo', 'voy'], answer: 'Si tuviera tiempo, iría.' },
    { id: 2, type: 'choice', prompt: 'The subjunctive mood is used for...', options: ['Facts', 'Certainty', 'Desires and doubts', 'Past actions'], answer: 'Desires and doubts' },
    { id: 3, type: 'translate', prompt: 'Notwithstanding the rain, we left.', translation: 'A pesar de la lluvia, salimos.', options: ['A', 'pesar', 'de', 'la', 'lluvia', 'salimos', 'cuando'], answer: 'A pesar de la lluvia, salimos.' },
  ]
};

const LanguageAcademy: React.FC<LanguageAcademyProps> = ({ isPremium, onClose }) => {
  const [view, setView] = useState<'selection' | 'difficulty' | 'path' | 'lesson' | 'blocked'>('selection');
  const [selectedLang, setSelectedLang] = useState('Spanish');
  const [difficulty, setDifficulty] = useState<'beginner' | 'ok' | 'pro' | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [progress, setProgress] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [mySlots, setMySlots] = useState<string[]>(['Spanish', 'French', 'Arabic', 'Chinese', 'Japanese']);
  const [isConfiguringSlots, setIsConfiguringSlots] = useState(false);
  const [isAppLockActive, setIsAppLockActive] = useState(true);

  const allLanguages = [
    'Spanish', 'French', 'Arabic', 'Chinese', 'Japanese', 
    'German', 'Korean', 'Italian', 'Russian', 'Hindi', 
    'Portuguese', 'Greek', 'Turkish', 'Dutch', 'Polish'
  ];

  const handleWordClick = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const currentLessonSet = difficulty ? MOCK_LESSONS[difficulty] : MOCK_LESSONS.beginner;

  const checkAnswer = () => {
    const current = currentLessonSet[currentQuestionIdx];
    let isCorrect = false;

    if (current.type === 'translate') {
      isCorrect = selectedWords.join(' ') === current.translation;
    } else {
      isCorrect = selectedWords[0] === current.answer;
    }

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        setSelectedWords([]);
        if (currentQuestionIdx < currentLessonSet.length - 1) {
          setCurrentQuestionIdx(currentQuestionIdx + 1);
          setProgress(((currentQuestionIdx + 1) / currentLessonSet.length) * 100);
        } else {
          alert("Unit Complete! Great job, Scholar!");
          setView('path');
          setCurrentQuestionIdx(0);
          setProgress(0);
        }
      }, 1500);
    } else {
      setFeedback('incorrect');
      if (!isPremium) {
        const newHearts = Math.max(0, hearts - 1);
        setHearts(newHearts);
        if (newHearts === 0) {
          setTimeout(() => setView('blocked'), 1500);
          return;
        }
      }
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const toggleSlot = (lang: string) => {
    if (mySlots.includes(lang)) {
      setMySlots(mySlots.filter(s => s !== lang));
    } else {
      if (!isPremium && mySlots.length >= 5) {
        alert("Free scholars are limited to 5 language choices. Upgrade for unlimited!");
        return;
      }
      setMySlots([...mySlots, lang]);
    }
  };

  const renderPath = () => (
    <div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-slate-50 flex flex-col items-center">
      <div className="w-full max-sm flex flex-col items-center gap-12 pb-32">
        <div className="flex items-center justify-between w-full bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-black">
               {selectedLang.slice(0, 2).toUpperCase()}
             </div>
             <div>
                <h3 className="text-sm font-black uppercase tracking-tight">{selectedLang} Path</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {difficulty?.toUpperCase()} LEVEL
                </p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <Star className="text-amber-400 fill-amber-400" size={16} />
             <span className="font-black text-slate-800">{isPremium ? '∞' : hearts}</span>
          </div>
        </div>

        {SPANISH_PATH.map((node, i) => (
          <div key={node.id} className="relative flex flex-col items-center group" style={{ marginLeft: i % 2 === 0 ? '0' : i % 3 === 0 ? '-60px' : '60px' }}>
            {i < SPANISH_PATH.length - 1 && (
              <div className="absolute top-full h-12 w-1.5 bg-slate-200 -z-0"></div>
            )}
            <button 
              onClick={() => {
                if (hearts === 0 && !isPremium) {
                  setView('blocked');
                  return;
                }
                node.status !== 'locked' && setView('lesson');
              }}
              className={`w-20 h-20 rounded-full border-[6px] shadow-xl flex items-center justify-center text-3xl transition-all z-10 relative active:scale-90 ${node.status === 'completed' ? 'bg-amber-400 border-amber-500 text-white' : node.status === 'active' ? 'bg-emerald-500 border-emerald-600 text-white scale-110 animate-bounce duration-[3s]' : 'bg-slate-200 border-slate-300 text-slate-400'}`}
            >
              {node.icon}
              {node.status === 'locked' && <div className="absolute inset-0 bg-black/10 rounded-full flex items-center justify-center"><Lock size={16} className="text-white" /></div>}
            </button>
            <span className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{node.title}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDifficulty = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 bg-slate-900">
      <div className="relative mb-10">
        <Sparkles size={64} className="text-emerald-500 animate-pulse" />
      </div>
      <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white">CHOOSE YOUR TIER</h2>
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] max-w-xs leading-relaxed mb-12">Professor Binx will adjust the {selectedLang} scholarship difficulty based on your knowledge.</p>
      
      <div className="w-full max-w-xs space-y-4">
        {[
          { id: 'beginner', label: 'Beginner', desc: 'Starting from scratch' },
          { id: 'ok', label: 'OK', desc: 'I know some basics' },
          { id: 'pro', label: 'Pro', desc: 'Fluent Scholar' }
        ].map(level => (
          <button
            key={level.id}
            onClick={() => { setDifficulty(level.id as any); setView('path'); }}
            className="w-full bg-white text-black p-6 rounded-[2rem] flex flex-col items-start gap-1 hover:scale-105 transition-all shadow-xl group border-b-4 border-slate-200 active:border-b-0 active:translate-y-1"
          >
            <span className="text-sm font-black uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{level.label}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{level.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderBlocked = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-900 animate-in fade-in zoom-in-95">
      <div className="p-8 bg-rose-500/20 rounded-full mb-8 border border-rose-500/30">
        <AlertCircle size={64} className="text-rose-500 animate-bounce" />
      </div>
      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">OUT OF STARS</h2>
      <p className="text-[11px] text-rose-300 font-bold uppercase tracking-[0.3em] max-w-xs leading-relaxed mb-10">
        You've lost all 5 life lines. You cannot continue your {selectedLang} studies right now.
      </p>
      
      <div className="w-full max-w-xs space-y-4">
        <button 
          onClick={() => { setHearts(5); setView('selection'); }}
          className="w-full bg-white text-black py-6 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
        >
          RESET CHALLENGE
        </button>
        <button 
          className="w-full bg-amber-500 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
        >
          <Crown size={18} fill="currentColor" /> UNLIMITED LIVES
        </button>
      </div>
    </div>
  );

  const renderLesson = () => {
    const current = currentLessonSet[currentQuestionIdx];
    return (
      <div className="flex-1 flex flex-col p-8 bg-white text-slate-900 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => setView('path')} className="p-2 text-slate-400"><X size={24} /></button>
          <div className="flex-1 h-3 bg-slate-100 rounded-full mx-6 relative overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex items-center gap-2 text-rose-500 font-black">
            <Star size={20} fill="currentColor" className="text-amber-400" /> {isPremium ? '∞' : hearts}
          </div>
        </div>

        <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0 relative">
              <Rabbit size={32} className="text-white" />
              <Glasses size={14} className="text-white absolute bottom-1 right-1" />
            </div>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none relative">
              <p className="text-sm font-bold italic leading-tight">"{current.prompt}"</p>
              <div className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-slate-50 border-b-[8px] border-b-transparent"></div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="min-h-[120px] border-b-2 border-slate-100 flex flex-wrap gap-2 content-start mb-8 py-4">
              {selectedWords.map((word, i) => (
                <button 
                  key={i} 
                  onClick={() => handleWordClick(word)}
                  className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl font-bold text-sm shadow-sm animate-in zoom-in-95"
                >
                  {word}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {current.options.map((word, i) => (
                <button 
                  key={i}
                  disabled={selectedWords.includes(word)}
                  onClick={() => handleWordClick(word)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${selectedWords.includes(word) ? 'bg-slate-100 border-slate-100 text-transparent' : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 active:scale-95 shadow-sm'}`}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={checkAnswer}
            disabled={selectedWords.length === 0 || feedback !== null}
            className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all ${selectedWords.length > 0 ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}
          >
            Check Answer
          </button>
        </div>

        {/* Feedback Overlay */}
        {feedback && (
          <div className={`fixed bottom-0 left-0 right-0 p-8 pt-10 border-t-4 animate-in slide-in-from-bottom-full duration-300 z-50 ${feedback === 'correct' ? 'bg-emerald-100 border-emerald-500' : 'bg-rose-100 border-rose-500'}`}>
            <div className="flex items-center gap-4 max-w-sm mx-auto">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${feedback === 'correct' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {feedback === 'correct' ? <CheckCircle2 size={24} /> : <X size={24} />}
              </div>
              <div>
                <h4 className={`font-black text-lg uppercase tracking-tight ${feedback === 'correct' ? 'text-emerald-900' : 'text-rose-900'}`}>{feedback === 'correct' ? 'Amazing!' : 'Not quite...'}</h4>
                {feedback === 'incorrect' && <p className="text-xs font-bold text-rose-700">Correct: "{current.answer}"</p>}
                {feedback === 'incorrect' && !isPremium && <p className="text-[10px] font-black text-rose-500 uppercase mt-1">STAR LOST! {hearts} LEFT.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-[95] flex flex-col text-white animate-in fade-in duration-500 overflow-hidden">
      
      {/* Universal Top Nav */}
      {view !== 'lesson' && (
        <div className="p-8 bg-black border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-600 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.4)] relative">
              <Rabbit size={32} className="text-white" />
              <Glasses size={14} className="text-white absolute bottom-3 right-3 drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">Professor Binx</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Language Academy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Small & Neat Interactive App Lock */}
            <button 
              onClick={() => setIsAppLockActive(!isAppLockActive)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
            >
               <ShieldCheck size={14} className={isAppLockActive ? "text-emerald-500" : "text-slate-500"} />
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Lock: {isAppLockActive ? 'ON' : 'OFF'}</span>
            </button>

            <button 
              onClick={() => setIsConfiguringSlots(!isConfiguringSlots)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${isConfiguringSlots ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400'}`}
            >
              Slots ({mySlots.length}/{isPremium ? '∞' : '5'})
            </button>
            <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
          </div>
        </div>
      )}

      {view === 'blocked' ? renderBlocked() : view === 'lesson' ? renderLesson() : (
        <div className="flex-1 flex overflow-hidden">
          {/* ENABLED Language Selection Panel (Left Rail) */}
          <div className="w-28 bg-black border-r border-white/10 flex flex-col items-center py-8 gap-6 shrink-0 overflow-y-auto no-scrollbar">
            {(isConfiguringSlots ? allLanguages : mySlots).map(lang => {
              const isActive = selectedLang === lang;
              const isSelectedSlot = mySlots.includes(lang);
              return (
                <button
                  key={lang}
                  onClick={() => {
                    if (isConfiguringSlots) {
                      toggleSlot(lang);
                    } else {
                      setSelectedLang(lang);
                      if (hearts === 0 && !isPremium) {
                        setView('blocked');
                      } else {
                        setView('difficulty');
                      }
                    }
                  }}
                  className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-xl font-black transition-all border-2 ${
                    isConfiguringSlots 
                      ? (isSelectedSlot ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-white/5 border-white/5 text-slate-800')
                      : (isActive ? 'bg-white border-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'bg-white/5 border-white/10 text-slate-600')
                  }`}
                >
                  {lang.charAt(0)}
                </button>
              );
            })}
          </div>

          {/* Main Area: Selection or Path */}
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
             {view === 'difficulty' ? renderDifficulty() : view === 'path' ? renderPath() : (
               <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 bg-black">
                  <div className="relative mb-8">
                     <div className="absolute -inset-10 bg-emerald-500/20 blur-[60px] rounded-full animate-pulse"></div>
                     <Rabbit size={120} className="text-white drop-shadow-2xl relative" />
                     <Glasses size={40} className="absolute top-10 left-1/2 -translate-x-1/2 text-white/90" />
                  </div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-white">Select a Language Slot</h2>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.4em] max-w-xs leading-relaxed">Choose a language from your slots to start your scholarship.</p>
                  <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
                     {mySlots.map(lang => (
                       <button 
                         key={lang}
                         onClick={() => { 
                           setSelectedLang(lang); 
                           if (hearts === 0 && !isPremium) {
                             setView('blocked');
                           } else {
                             setView('difficulty');
                           }
                         }}
                         className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-between px-8 group active:scale-95 transition-all"
                       >
                         <span className="flex items-center gap-3"><Globe size={14} className="text-emerald-600" /> {lang}</span>
                         <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                     ))}
                  </div>
               </div>
             )}
          </div>
        </div>
      )}
      
      {!isPremium && !isConfiguringSlots && view !== 'lesson' && view !== 'blocked' && (
        <div className="p-6 bg-emerald-950/20 border-t border-white/5 text-center shrink-0">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-3">
            <Crown size={14} fill="currentColor" /> 5 STARS REMAINING • UPGRADE FOR UNLIMITED
          </p>
        </div>
      )}
    </div>
  );
};

export default LanguageAcademy;
