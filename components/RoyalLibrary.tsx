import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Library, Crown, Book, ChevronRight, Play, Sparkles, Lock, Flame, Search, Globe, Atom, History, Binary, Lightbulb, ChevronLeft, ExternalLink, Loader2, Volume2, Pause, Square, Highlighter, Zap, Clock, BookOpen, Bookmark, Save, Trash2, LayoutGrid, ChevronUp, ChevronDown, List, CheckCircle2, Book as BookIcon, MoveVertical, Plus } from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';
import VerticalElevator from './VerticalElevator';

interface RoyalLibraryProps {
  isRoyal: boolean;
  onClose: () => void;
  onGoRoyal: () => void;
}

interface Chapter {
  id: string;
  title: string;
  pages: string[][]; // Array of pages, each page is an array of paragraphs
}

interface ClassicBook {
  id: string;
  title: string;
  author: string;
  category: 'Science' | 'Maths' | 'History' | 'Technology' | 'Philosophy' | 'Success' | 'Archive';
  coverGradient: string;
  year: string;
  description: string;
  source: string;
  chapters: Chapter[];
}

const CLASSICS: ClassicBook[] = [
  { 
    id: 'suc1', 
    title: 'Think and Grow Rich', 
    author: 'Napoleon Hill', 
    category: 'Success', 
    coverGradient: 'from-amber-900 to-slate-900', 
    year: '1937', 
    description: 'The full landmark manual of individual achievement and mindset.', 
    source: 'Public Domain',
    chapters: [
      {
        id: 'c1',
        title: 'Introduction',
        pages: [
          [
            "TRULY, 'thoughts are things,' and powerful things at that, when they are mixed with definiteness of purpose, persistence, and a BURNING DESIRE for their translation into riches, or other material objects.",
            "A little more than thirty years ago, Edwin C. Barnes discovered how true it is that men really do THOUGHT THEIR WAY into big things. His discovery did not come about at one sitting. It came little by little, beginning with a BURNING DESIRE to become a business associate of the great Edison."
          ],
          [
            "When this desire, or impulse of thought, first flashed into his mind he was in no position to act upon it. Two difficulties stood in his way. He did not know Mr. Edison, and he did not have enough money to pay his railroad fare to Orange, New Jersey.",
            "He was so determined to find a way to carry out his desire that he finally decided to travel by 'blind baggage,' rather than be defeated."
          ]
        ]
      }
    ]
  },
  { 
    id: 'p2', 
    title: 'Meditations', 
    author: 'Marcus Aurelius', 
    category: 'Philosophy', 
    coverGradient: 'from-slate-800 to-slate-950', 
    year: 'c. 180 AD', 
    description: 'The private journals of the Roman Emperor on Stoic virtue.', 
    source: 'Project Gutenberg',
    chapters: [
      {
        id: 'b1',
        title: 'Book One',
        pages: [
          [
            "1. From my grandfather Verus I learned good morals and the government of my temper.",
            "2. From the reputation and memory of my father, modesty and a manly character.",
            "3. From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts."
          ]
        ]
      }
    ]
  },
  { 
    id: 's1', 
    title: 'On the Origin of Species', 
    author: 'Charles Darwin', 
    category: 'Science', 
    coverGradient: 'from-emerald-900 to-teal-950', 
    year: '1859', 
    description: 'Foundation of evolutionary biology.', 
    source: 'Project Gutenberg',
    chapters: [{ id: 'd1', title: 'Introduction', pages: [["When on board H.M.S. 'Beagle,' as naturalist, I was much struck with certain facts in the distribution of the organic beings inhabiting South America..."]] }]
  },
  { 
    id: 'h1', 
    title: 'The Art of War', 
    author: 'Sun Tzu', 
    category: 'History', 
    coverGradient: 'from-rose-900 to-red-950', 
    year: '5th Century BC', 
    description: 'Ancient Chinese military treatise.', 
    source: 'Public Domain',
    chapters: [{ id: 'sz1', title: 'Laying Plans', pages: [["Sun Tzu said: The art of war is of vital importance to the State."]] }]
  },
  { 
    id: 't1', 
    title: 'The Time Machine', 
    author: 'H.G. Wells', 
    category: 'Technology', 
    coverGradient: 'from-indigo-900 to-slate-950', 
    year: '1895', 
    description: 'Classic science fiction exploration.', 
    source: 'Project Gutenberg',
    chapters: [{ id: 'hg1', title: 'Chapter I', pages: [["The Time Traveller was expounding a recondite matter to us."]] }]
  },
  { 
    id: 'p3', 
    title: 'Beyond Good and Evil', 
    author: 'Friedrich Nietzsche', 
    category: 'Philosophy', 
    coverGradient: 'from-blue-900 to-black', 
    year: '1886', 
    description: 'A critique of moral and religious traditions.', 
    source: 'Public Domain',
    chapters: [{ id: 'fn1', title: 'Prejudices', pages: [["The Will to Truth, which is to tempt us to many a hazardous enterprise..."]] }]
  }
];

const RoyalLibrary: React.FC<RoyalLibraryProps> = ({ isRoyal, onClose, onGoRoyal }) => {
  const [selectedBook, setSelectedBook] = useState<ClassicBook | null>(null);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [readingMode, setReadingMode] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(-1);
  const [showChapters, setShowChapters] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [savedHighlights, setSavedHighlights] = useState<{text: string, bookTitle: string}[]>(() => {
    const saved = localStorage.getItem('scholar_book_highlights');
    return saved ? JSON.parse(saved) : [];
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const bookScrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isPlayingRef = useRef(false);

  function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) { bytes[i] = binaryString.charCodeAt(i); }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const stopAudio = () => {
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch(e) {}
      currentSourceRef.current = null;
    }
    setIsPlayingAudio(false);
    isPlayingRef.current = false;
    setActiveParagraphIndex(-1);
    setIsQuotaExceeded(false);
  };

  const playParagraph = async (pIndex: number, retryCount = 0) => {
    if (!selectedBook || !isPlayingRef.current) return;
    const currentChapter = selectedBook.chapters[activeChapterIdx];
    if (!currentChapter) return;
    const currentPage = currentChapter.pages[activePageIdx];
    if (!currentPage) return;
    
    if (pIndex >= currentPage.length) {
      if (activePageIdx < currentChapter.pages.length - 1) {
        setActivePageIdx(prev => prev + 1);
        setTimeout(() => playParagraph(0), 500);
      } else if (activeChapterIdx < selectedBook.chapters.length - 1) {
        setActiveChapterIdx(prev => prev + 1);
        setActivePageIdx(0);
        setTimeout(() => playParagraph(0), 500);
      } else { stopAudio(); }
      return;
    }

    setIsAudioLoading(true);
    setActiveParagraphIndex(pIndex);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: currentPage[pIndex] }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            // Realistic Voice Selection: 'Puck' provides a professional, deep scholarly tone
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && isPlayingRef.current) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
        if (currentSourceRef.current) { try { currentSourceRef.current.stop(); } catch(e) {} }
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = 0.95; // Slightly slower for realism
        source.connect(audioContextRef.current.destination);
        source.onended = () => { if (isPlayingRef.current) playParagraph(pIndex + 1); };
        currentSourceRef.current = source;
        setIsAudioLoading(false);
        setIsPlayingAudio(true);
        source.start();
      }
    } catch (e: any) {
      setIsAudioLoading(false);
      if (e?.status === 429) {
        setIsQuotaExceeded(true);
        if (retryCount < 2) {
          setTimeout(() => isPlayingRef.current && playParagraph(pIndex, retryCount + 1), 3000);
        } else { stopAudio(); }
      }
    }
  };

  const startReading = (book: ClassicBook) => {
    setSelectedBook(book);
    setActiveChapterIdx(0);
    setActivePageIdx(0);
    setReadingMode(true);
    isPlayingRef.current = true;
    playParagraph(0); 
  };

  const handleBookElevator = (id: string) => {
    if (id === 'top') bookScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    if (id === 'contents') setShowChapters(true);
    if (id === 'next') {
        const ch = selectedBook?.chapters[activeChapterIdx];
        if (ch && activePageIdx < ch.pages.length - 1) setActivePageIdx(p => p + 1);
        else if (selectedBook && activeChapterIdx < selectedBook.chapters.length - 1) { setActiveChapterIdx(c => c + 1); setActivePageIdx(0); }
        stopAudio();
    }
    if (id === 'prev') {
        if (activePageIdx > 0) setActivePageIdx(p => p - 1);
        else if (activeChapterIdx > 0) { setActiveChapterIdx(c => c - 1); setActivePageIdx(selectedBook?.chapters[activeChapterIdx - 1].pages.length! - 1); }
        stopAudio();
    }
  };

  if (!isRoyal) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-[110] p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-1000">
        <Crown size={80} className="text-amber-500 mb-8" />
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Royal Tier</h1>
        <p className="text-slate-400 text-sm max-w-xs mb-10">Exclusive access to full public domain books with AI deep narration.</p>
        <button onClick={onGoRoyal} className="bg-amber-500 text-black px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95">Upgrade Now</button>
        <button onClick={onClose} className="mt-8 text-slate-600 font-black text-[10px] uppercase tracking-widest">Return to Dashboard</button>
      </div>
    );
  }

  if (readingMode && selectedBook) {
    const currentChapter = selectedBook.chapters[activeChapterIdx];
    const currentPage = currentChapter?.pages[activePageIdx];
    return (
      <div className="fixed inset-0 bg-[#0d0d0d] z-[130] flex flex-col items-center justify-center p-4 animate-in fade-in duration-700 overflow-hidden">
        <VerticalElevator 
            actions={[{ id: 'top', icon: <ChevronUp size={18} />, label: 'Top' }, { id: 'prev', icon: <ChevronLeft size={18} />, label: 'Prev' }, { id: 'contents', icon: <List size={18} />, label: 'Index' }, { id: 'next', icon: <ChevronRight size={18} />, label: 'Next' }]} 
            onSelect={handleBookElevator} 
        />
        <div className="w-full max-w-4xl h-full bg-[#fcf9f2] rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] border-[10px] border-[#2c1810] flex flex-col overflow-hidden relative">
           <div className="bg-[#2c1810] text-[#d7ccc8] p-4 px-8 flex items-center justify-between shrink-0 z-20">
              <button onClick={() => { setReadingMode(false); stopAudio(); }} className="text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all flex items-center gap-2"><ChevronLeft size={14} /> Library</button>
              <div className="text-center"><h3 className="text-[10px] font-black uppercase tracking-[0.3em]">{selectedBook.title}</h3></div>
              <button onClick={() => isPlayingAudio ? stopAudio() : (isPlayingRef.current = true, playParagraph(0))} className="px-6 py-1.5 rounded-full text-[9px] font-black uppercase bg-[#8d6e63] text-white">
                {isAudioLoading ? '...' : isPlayingAudio ? 'Pause' : 'Listen'}
              </button>
           </div>
           <div ref={bookScrollRef} className="flex-1 flex overflow-y-auto no-scrollbar relative scroll-smooth">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 via-black/10 to-black/5 z-10"></div>
              {currentPage && (
                <>
                  <div className="w-1/2 p-12 pr-14 border-r border-black/5 flex flex-col">
                    <div className="mb-8 pb-4 border-b border-black/5">
                        <span className="text-[10px] font-black text-[#8d6e63] uppercase tracking-[0.2em]">{currentChapter.title}</span>
                    </div>
                    {currentPage.slice(0, 1).map((p, i) => (
                        <div key={i} className={`p-4 rounded-xl transition-all ${activeParagraphIndex === i ? 'bg-white shadow-lg ring-1 ring-[#8d6e63]' : ''}`}>
                          <p className="text-lg font-serif text-[#4e342e] leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:mr-2 first-letter:float-left first-letter:text-[#2c1810]">{p}</p>
                        </div>
                    ))}
                  </div>
                  <div className="w-1/2 p-12 pl-14 flex flex-col bg-[#fbf7ee]">
                    {currentPage.slice(1).map((p, i) => (
                        <div key={i+1} className={`p-4 rounded-xl transition-all ${activeParagraphIndex === i+1 ? 'bg-white shadow-lg ring-1 ring-[#8d6e63]' : ''}`}>
                          <p className="text-lg font-serif text-[#4e342e] leading-relaxed">{p}</p>
                        </div>
                    ))}
                    <div className="mt-auto pt-8 flex justify-between items-center opacity-30 text-[9px] font-black text-[#3e2723] uppercase">
                        <span>Scholar Press</span><span>Page {activePageIdx + 1}</span>
                    </div>
                  </div>
                </>
              )}
           </div>
        </div>
        {showChapters && (
          <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-8">
             <div className="bg-[#fcf9f2] rounded-2xl w-full max-w-sm p-8 border-[6px] border-[#2c1810]">
                <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-serif italic">Index</h2><button onClick={() => setShowChapters(false)}><X size={24} /></button></div>
                {selectedBook.chapters.map((ch, idx) => (
                  <button key={ch.id} onClick={() => { setActiveChapterIdx(idx); setActivePageIdx(0); setShowChapters(false); stopAudio(); }} className={`w-full p-4 text-left border-b border-black/5 text-[10px] font-black uppercase tracking-tight ${activeChapterIdx === idx ? 'bg-[#8d6e63] text-white' : 'hover:bg-black/5'}`}>0{idx + 1}. {ch.title}</button>
                ))}
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#080808] z-[110] flex flex-col text-white animate-in slide-in-from-bottom-10 duration-1000 overflow-hidden">
      <div className="p-10 pb-6 flex items-center justify-between shrink-0 z-10 pr-20">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"><ChevronLeft size={28} /></button>
          <div className="p-4 bg-gradient-to-br from-amber-400 to-amber-600 text-black rounded-2xl shadow-xl"><Library size={32} /></div>
          <div><h1 className="text-3xl font-black uppercase italic leading-none text-white">Royal Archive</h1><p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-2 border border-amber-500/20 px-3 py-1 rounded-full inline-block">Elite Public Domain Titles</p></div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-10 pb-48 pr-24 scroll-smooth z-10">
         <div className="max-w-6xl mx-auto space-y-16">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {CLASSICS.map(book => (
                  <button key={book.id} onClick={() => startReading(book)} className="group flex flex-col bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all active:scale-95 shadow-lg">
                    <div className={`w-full aspect-[2/3] rounded-xl bg-gradient-to-br ${book.coverGradient} mb-4 shadow-xl overflow-hidden relative group-hover:scale-[1.03] transition-transform`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-4 left-4 right-4"><h3 className="text-sm font-black text-white leading-tight uppercase italic drop-shadow-lg">{book.title}</h3></div>
                    </div>
                    <div className="text-left px-1">
                       <p className="text-[8px] font-black text-white/50 uppercase tracking-widest truncate">{book.author}</p>
                       <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                          <span className="text-[7px] font-black text-amber-500 uppercase">{book.category}</span>
                          <Play size={10} className="text-white opacity-20 group-hover:opacity-100 group-hover:text-amber-500 transition-all" />
                       </div>
                    </div>
                  </button>
                ))}
                <div className="flex flex-col bg-black/40 border border-white/5 border-dashed rounded-2xl p-6 items-center justify-center text-center opacity-40">
                   {/* Fix: Added Plus icon from imports */}
                   <Plus size={24} className="text-slate-600 mb-2" /><p className="text-[8px] font-black uppercase tracking-widest text-slate-500">More Ingesting...</p>
                </div>
            </div>
         </div>
      </div>
      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default RoyalLibrary;