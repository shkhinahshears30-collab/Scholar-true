
import React, { useState, useMemo } from 'react';
import { X, Library, Crown, Book, ChevronRight, Play, Sparkles, Headphones, Lock, Flame, Wind, Coffee, Zap, Search, Globe, Atom, BookOpen, Clock, History, Cpu, FlaskConical, Scale, ScrollText, Filter, Binary, Landmark, Lightbulb, ChevronLeft } from 'lucide-react';

interface RoyalLibraryProps {
  isRoyal: boolean;
  onClose: () => void;
  onGoRoyal: () => void;
}

interface ClassicBook {
  id: string;
  title: string;
  author: string;
  category: 'Science' | 'Maths' | 'History' | 'Technology' | 'Philosophy';
  cover: string;
  year: string;
  source: string;
  description: string;
}

const CLASSICS: ClassicBook[] = [
  // Science
  { id: 's1', title: 'On the Origin of Species', author: 'Charles Darwin', category: 'Science', cover: 'bg-emerald-900', year: '1859', source: 'Project Gutenberg', description: 'The foundation of evolutionary biology.' },
  { id: 's2', title: 'Relativity: The Special and General Theory', author: 'Albert Einstein', category: 'Science', cover: 'bg-emerald-800', year: '1916', source: 'Standard Ebooks', description: 'The revolutionary theory of space and time.' },
  { id: 's3', title: 'Principia Mathematica', author: 'Isaac Newton', category: 'Science', cover: 'bg-emerald-950', year: '1687', source: 'Archive.org', description: 'The laws of motion and universal gravitation.' },
  { id: 's4', title: 'Radioactive Substances', author: 'Marie Curie', category: 'Science', cover: 'bg-emerald-700', year: '1903', source: 'Standard Ebooks', description: 'Pioneering research on radioactivity.' },
  
  // Maths
  { id: 'm1', title: 'Euclid\'s Elements', author: 'Euclid', category: 'Maths', cover: 'bg-indigo-900', year: 'c. 300 BC', source: 'Project Gutenberg', description: 'The geometric foundation of mathematics.' },
  { id: 'm2', title: 'Introductio in analysin infinitorum', author: 'Leonhard Euler', category: 'Maths', cover: 'bg-indigo-800', year: '1748', source: 'Archive.org', description: 'Foundation of modern mathematical analysis.' },
  { id: 'm3', title: 'Calculus Made Easy', author: 'Silvanus P. Thompson', category: 'Maths', cover: 'bg-indigo-950', year: '1910', source: 'Standard Ebooks', description: 'The classic guide to mastering calculus.' },
  { id: 'm4', title: 'The Laws of Thought', author: 'George Boole', category: 'Maths', cover: 'bg-indigo-700', year: '1854', source: 'Project Gutenberg', description: 'The algebraic logic that powered computing.' },

  // History
  { id: 'h1', title: 'The Histories', author: 'Herodotus', category: 'History', cover: 'bg-rose-900', year: 'c. 430 BC', source: 'Project Gutenberg', description: 'The first narrative history of the ancient world.' },
  { id: 'h2', title: 'History of the Peloponnesian War', author: 'Thucydides', category: 'History', cover: 'bg-rose-800', year: 'c. 400 BC', source: 'Archive.org', description: 'The definitive account of the Greek war.' },
  { id: 'h3', title: 'Decline and Fall of the Roman Empire', author: 'Edward Gibbon', category: 'History', cover: 'bg-rose-950', year: '1776', source: 'Standard Ebooks', description: 'The monumental study of Rome\'s collapse.' },
  { id: 'h4', title: 'The History of England', author: 'David Hume', category: 'History', cover: 'bg-rose-700', year: '1754', source: 'Archive.org', description: 'A massive Enlightenment account of England.' },

  // Technology
  { id: 't1', title: 'Alternate Currents of High Potential', author: 'Nikola Tesla', category: 'Technology', cover: 'bg-amber-900', year: '1904', source: 'Project Gutenberg', description: 'Revolutionary experiments in electricity.' },
  { id: 't2', title: 'Experimental Researches in Electricity', author: 'Michael Faraday', category: 'Technology', cover: 'bg-amber-800', year: '1839', source: 'Archive.org', description: 'The experiments that enabled the electric age.' },
  { id: 't3', title: 'The Age of Invention', author: 'Holland Thompson', category: 'Technology', cover: 'bg-amber-950', year: '1921', source: 'Standard Ebooks', description: 'A chronicle of industrial breakthroughs.' },
  { id: 't4', title: 'The Mechanical World', author: 'James Watt', category: 'Technology', cover: 'bg-amber-700', year: '1820', source: 'Scholar Archive', description: 'Steam engine mechanics and design.' },

  // Philosophy
  { id: 'p1', title: 'The Republic', author: 'Plato', category: 'Philosophy', cover: 'bg-slate-900', year: 'c. 375 BC', source: 'Standard Ebooks', description: 'The classic dialogue on justice and society.' },
  { id: 'p2', title: 'Meditations', author: 'Marcus Aurelius', category: 'Philosophy', cover: 'bg-slate-800', year: 'c. 180 AD', source: 'Project Gutenberg', description: 'Stoic wisdom from the Roman Emperor.' },
  { id: 'p3', title: 'Beyond Good and Evil', author: 'Friedrich Nietzsche', category: 'Philosophy', cover: 'bg-slate-950', year: '1886', source: 'Standard Ebooks', description: 'A fundamental text of modern philosophy.' },
  { id: 'p4', title: 'Critique of Pure Reason', author: 'Immanuel Kant', category: 'Philosophy', cover: 'bg-slate-700', year: '1781', source: 'Archive.org', description: 'The limits and scope of human knowledge.' },
];

const GENRES = [
  { id: 'All', name: 'All Archives', icon: <Library size={14} /> },
  { id: 'Science', name: 'Science', icon: <Atom size={14} /> },
  { id: 'Maths', name: 'Maths', icon: <Binary size={14} /> },
  { id: 'History', name: 'History', icon: <History size={14} /> },
  { id: 'Technology', name: 'Technology', icon: <Cpu size={14} /> },
  { id: 'Philosophy', name: 'Philosophy', icon: <Lightbulb size={14} /> },
];

const RoyalLibrary: React.FC<RoyalLibraryProps> = ({ isRoyal, onClose, onGoRoyal }) => {
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<ClassicBook | null>(null);

  const filteredBooks = useMemo(() => {
    return CLASSICS.filter(book => {
      const matchesGenre = activeGenre === 'All' || book.category === activeGenre;
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [activeGenre, searchQuery]);

  if (!isRoyal) {
    return (
      <div className="fixed inset-0 bg-slate-950 z-[110] p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="p-8 bg-amber-400 rounded-[2.5rem] mb-8 shadow-[0_0_50px_rgba(251,191,36,0.3)] animate-float">
          <Crown size={64} className="text-white fill-white" />
        </div>
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">Royal Tier Required</h1>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-xs leading-relaxed mb-12">
          The Scholar Library is a private archive for Royal Premium users. Enter secret code "2059" or upgrade to access 5,000,000+ public domain titles.
        </p>
        <button 
          onClick={onGoRoyal}
          className="w-full max-w-xs bg-amber-400 text-slate-950 py-6 rounded-[2rem] font-black text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          UPGRADE TO ROYAL <Zap size={20} fill="currentColor" />
        </button>
        <button onClick={onClose} className="mt-8 text-slate-600 font-black text-[10px] uppercase tracking-widest">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950 z-[110] flex flex-col text-white animate-in slide-in-from-bottom-10 duration-700 overflow-hidden">
      {/* Dynamic Header */}
      <div className="p-8 pb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
          <div className="p-4 bg-amber-500 text-slate-900 rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            <Library size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Scholar Archive</h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-amber-500/20">Royal Sync: 5M+ Titles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Genre Sidebar + Main Content Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Genres */}
        <div className="w-24 sm:w-32 bg-black/40 border-r border-white/5 flex flex-col py-6 gap-2 shrink-0 overflow-y-auto no-scrollbar">
          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest text-center mb-4">Categories</p>
          {GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGenre(g.id)}
              className={`flex flex-col items-center justify-center py-4 px-2 gap-2 transition-all border-r-4 ${activeGenre === g.id ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              <div className={`p-2.5 rounded-xl ${activeGenre === g.id ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' : 'bg-white/5'}`}>
                {g.icon}
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter text-center">{g.name}</span>
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 shrink-0 border-b border-white/5">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={16} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search global public archives..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50 uppercase tracking-tight"
              />
            </div>
          </div>

          {/* Book Scroller */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
            <div className="grid grid-cols-2 gap-4">
              {filteredBooks.map(book => (
                <button 
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="group relative flex flex-col items-start text-left bg-white/5 rounded-[2.5rem] border border-white/10 p-5 hover:bg-white/10 transition-all active:scale-95"
                >
                  <div className={`w-full aspect-[3/4] rounded-2xl ${book.cover} mb-4 shadow-2xl relative overflow-hidden transition-transform group-hover:scale-[1.02]`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <div className="absolute top-3 right-3">
                       <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[7px] font-black text-amber-400">PDF VERIFIED</div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                       <span className="text-[7px] font-black uppercase text-white/40 tracking-[0.2em]">{book.category}</span>
                       <h3 className="text-[10px] font-black text-white leading-tight mt-1">{book.title}</h3>
                    </div>
                  </div>
                  <div className="w-full">
                    <p className="text-[8px] font-black text-slate-500 uppercase truncate mb-1">{book.author}</p>
                    <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-1">
                          <Clock size={8} className="text-slate-600" />
                          <span className="text-[7px] font-bold text-slate-600">{book.year}</span>
                       </div>
                       <div className="text-[6px] font-black text-indigo-400/60 uppercase">{book.source}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-slate-950 z-[120] flex flex-col p-8 animate-in fade-in duration-300">
           <div className="flex justify-end mb-8">
              <button onClick={() => setSelectedBook(null)} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white"><X size={24} /></button>
           </div>
           
           <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
              <div className={`w-48 aspect-[3/4] rounded-[2rem] ${selectedBook.cover} mb-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                 <div className="absolute bottom-6 left-6 right-6">
                    <Book size={40} className="text-white/20 mb-4 mx-auto" />
                 </div>
              </div>
              
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2 leading-tight">{selectedBook.title}</h2>
              <p className="text-amber-500 font-black text-xs uppercase tracking-widest mb-6">by {selectedBook.author}</p>
              
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-8">
                 <p className="text-sm font-medium text-slate-400 leading-relaxed italic">"{selectedBook.description}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                    <span className="text-[7px] font-black text-slate-500 uppercase mb-1">Source</span>
                    <span className="text-[9px] font-black text-white uppercase">{selectedBook.source}</span>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                    <span className="text-[7px] font-black text-slate-500 uppercase mb-1">Status</span>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1"><Sparkles size={8} /> Public Domain</span>
                 </div>
              </div>

              <button className="w-full bg-white text-black py-6 rounded-[2.5rem] font-black text-lg shadow-2xl mt-12 active:scale-95 transition-all flex items-center justify-center gap-3">
                 READ ARCHIVE PDF <Play size={18} fill="currentColor" />
              </button>
              
              <button onClick={() => setSelectedBook(null)} className="mt-6 text-slate-600 font-black text-[10px] uppercase tracking-widest">Back to Library</button>
           </div>
        </div>
      )}

      {/* Floating Status Bar */}
      <div className="absolute bottom-8 inset-x-8 print:hidden">
        <div className="bg-amber-400 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(251,191,36,0.3)] flex items-center justify-between group cursor-pointer active:scale-95 transition-all">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-950 text-amber-400 rounded-2xl group-hover:rotate-12 transition-transform shadow-xl">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="text-slate-950 font-black uppercase tracking-tighter italic text-sm">Offline Global Archive</h4>
                <p className="text-[8px] text-slate-950/60 font-black uppercase tracking-widest mt-0.5">5,000,000+ Local Titles Synced</p>
              </div>
           </div>
           <ChevronRight size={20} className="text-slate-950" />
        </div>
      </div>
    </div>
  );
};

export default RoyalLibrary;
