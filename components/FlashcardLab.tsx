
import React, { useState, useRef } from 'react';
import { BrainCircuit, Upload, Mic, Trash2, ChevronRight, ChevronLeft, Sparkles, CheckCircle, XCircle, Loader2, Camera } from 'lucide-react';
import { Flashcard } from '../types';
import { generateFlashcards, verifyFlashcardAnswer } from '../services/gemini';

interface FlashcardLabProps {
  sets: { id: string; title: string; cards: Flashcard[]; createdAt: string }[];
  // Fix: Added missing language property to interface
  language: string;
  onSaveSet: (title: string, cards: Flashcard[]) => void;
  onDeleteSet: (id: string) => void;
}

const FlashcardLab: React.FC<FlashcardLabProps> = ({ sets, language, onSaveSet, onDeleteSet }) => {
  const [mode, setMode] = useState<'list' | 'create' | 'study'>('list');
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [inputContent, setInputContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFeedback, setRecordingFeedback] = useState<{ correct: boolean; feedback: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const activeSet = sets.find(s => s.id === activeSetId);

  const handleCreate = async () => {
    if (!inputContent.trim()) return;
    setIsGenerating(true);
    const cards = await generateFlashcards(inputContent);
    if (cards.length > 0) {
      onSaveSet(`Set ${sets.length + 1}`, cards.map((c, i) => ({ ...c, id: Math.random().toString(36).substr(2, 9) })));
      setMode('list');
      setInputContent('');
    }
    setIsGenerating(false);
  };

  const startStudy = (id: string) => {
    setActiveSetId(id);
    setStudyIndex(0);
    setIsFlipped(false);
    setRecordingFeedback(null);
    setMode('study');
  };

  const handleVoiceAnswer = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsVerifying(true);
      const result = await verifyFlashcardAnswer(
        activeSet!.cards[studyIndex].question,
        activeSet!.cards[studyIndex].answer,
        transcript
      );
      setRecordingFeedback(result);
      setIsVerifying(false);
      setIsFlipped(true);
    };
    recognition.start();
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter">Flashcard Lab</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Master your subjects</p>
        </div>
      </div>

      {mode === 'list' && (
        <div className="space-y-4">
          <button 
            onClick={() => setMode('create')}
            className="w-full p-8 rounded-[2.5rem] bg-indigo-50 border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-all group"
          >
            <Sparkles className="mb-2 group-hover:scale-125 transition-transform" />
            <span className="font-black">Generate New Cards</span>
            <span className="text-[10px] font-bold text-indigo-400 mt-1 uppercase">Upload text or notes</span>
          </button>

          <div className="space-y-3">
            {sets.map(set => (
              <div key={set.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => startStudy(set.id)}>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <BrainCircuit size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{set.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{set.cards.length} Cards • {new Date(set.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => onDeleteSet(set.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'create' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Input Source</label>
            <textarea 
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Paste your notes, textbook text, or key facts here..."
              className="w-full h-48 bg-slate-50 border border-slate-100 rounded-3xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none transition-all"
            />
            
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200">
                <Camera size={16} />
                Photo Notes
              </button>
              <button className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200">
                <Upload size={16} />
                Upload PDF
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setMode('list')} className="px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-100">Cancel</button>
            <button 
              onClick={handleCreate}
              disabled={isGenerating || !inputContent.trim()}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              {isGenerating ? 'Generating...' : 'Create Flashcards'}
            </button>
          </div>
        </div>
      )}

      {mode === 'study' && activeSet && (
        <div className="space-y-8 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between">
            <button onClick={() => setMode('list')} className="text-slate-400 hover:text-slate-600"><ChevronLeft size={24} /></button>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Card {studyIndex + 1} of {activeSet.cards.length}</span>
            <div className="w-6 h-6" />
          </div>

          <div className="perspective-[1000px] h-80 w-full relative group">
            <div 
              className={`relative w-full h-full transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-[3rem] border-4 border-indigo-100 shadow-2xl flex flex-col items-center justify-center p-10 text-center">
                <div className="absolute top-6 left-6 text-indigo-200"><BrainCircuit size={32} /></div>
                <p className="text-2xl font-black text-slate-800 leading-tight">{activeSet.cards[studyIndex].question}</p>
                <p className="absolute bottom-10 text-[10px] font-black text-slate-300 uppercase tracking-widest">Tap to reveal answer</p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center text-white">
                 <div className="absolute top-6 right-6 text-indigo-400/50"><Sparkles size={32} /></div>
                 <p className="text-xl font-bold leading-relaxed">{activeSet.cards[studyIndex].answer}</p>
                 
                 {recordingFeedback && (
                   <div className={`mt-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${recordingFeedback.correct ? 'bg-emerald-500/20 text-emerald-100' : 'bg-red-500/20 text-red-100'}`}>
                     {recordingFeedback.correct ? <CheckCircle size={20} /> : <XCircle size={20} />}
                     <p className="text-xs font-bold">{recordingFeedback.feedback}</p>
                   </div>
                 )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={handleVoiceAnswer}
              disabled={isRecording || isVerifying}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${isRecording ? 'bg-red-500 scale-110 animate-pulse' : isVerifying ? 'bg-slate-200 cursor-not-allowed' : 'bg-indigo-600 hover:scale-110 active:scale-95'}`}
            >
              {isVerifying ? <Loader2 className="text-indigo-600 animate-spin" /> : <Mic className="text-white" size={32} />}
            </button>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{isRecording ? 'Listening...' : isVerifying ? 'Checking Answer...' : 'Hold to Speak Answer'}</p>

            <div className="flex gap-4 w-full">
              <button 
                disabled={studyIndex === 0}
                onClick={() => { setStudyIndex(prev => prev - 1); setIsFlipped(false); setRecordingFeedback(null); }}
                className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black disabled:opacity-30"
              >
                Prev
              </button>
              <button 
                disabled={studyIndex === activeSet.cards.length - 1}
                onClick={() => { setStudyIndex(prev => prev + 1); setIsFlipped(false); setRecordingFeedback(null); }}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .rotate-y-180 { transform: rotateY(180deg); }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default FlashcardLab;
