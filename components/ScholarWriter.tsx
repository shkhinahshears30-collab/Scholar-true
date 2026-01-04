import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Save, Download, Sparkles, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Type, Loader2, Crown, Maximize2, Minimize2, Clock, Hash, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface ScholarWriterProps {
  isPremium: boolean;
  onClose: () => void;
  onGoPremium: () => void;
}

interface Draft {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

const ScholarWriter: React.FC<ScholarWriterProps> = ({ isPremium, onClose, onGoPremium }) => {
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    const saved = localStorage.getItem('scholar_writer_drafts');
    return saved ? JSON.parse(saved) : [{ id: '1', title: 'New Academic Draft', content: '', updatedAt: new Date().toISOString() }];
  });
  const [activeDraftId, setActiveDraftId] = useState<string>(drafts[0]?.id || '1');
  const [isAILoading, setIsAILoading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const activeDraft = drafts.find(d => d.id === activeDraftId) || drafts[0];

  useEffect(() => {
    localStorage.setItem('scholar_writer_drafts', JSON.stringify(drafts));
  }, [drafts]);

  const updateContent = (content: string) => {
    setDrafts(prev => prev.map(d => d.id === activeDraftId ? { ...d, content, updatedAt: new Date().toISOString() } : d));
  };

  const updateTitle = (title: string) => {
    setDrafts(prev => prev.map(d => d.id === activeDraftId ? { ...d, title, updatedAt: new Date().toISOString() } : d));
  };

  const createDraft = () => {
    const newDraft: Draft = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Untilted Masterpiece',
      content: '',
      updatedAt: new Date().toISOString()
    };
    setDrafts([newDraft, ...drafts]);
    setActiveDraftId(newDraft.id);
  };

  const deleteDraft = (id: string) => {
    if (drafts.length <= 1) return;
    const next = drafts.filter(d => d.id !== id);
    setDrafts(next);
    setActiveDraftId(next[0].id);
  };

  const handleAIImprove = async () => {
    if (!isPremium) { onGoPremium(); return; }
    if (!activeDraft.content.trim()) return;

    setIsAILoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a senior academic editor. Rewrite this text to be more professional, clear, and concise. Keep the original meaning but improve vocabulary and structure: "${activeDraft.content}"`,
      });
      if (response.text) {
        updateContent(response.text);
      }
    } catch (e) {
      alert("AI Pulse weak. Try again later.");
    } finally {
      setIsAILoading(false);
    }
  };

  const wordCount = activeDraft.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className={`fixed inset-0 bg-white z-[95] flex flex-col animate-in fade-in duration-500 overflow-hidden ${isFocusMode ? 'bg-[#fcfcfd]' : 'bg-white'}`}>
      
      {/* Dynamic Header */}
      {!isFocusMode && (
        <div className="p-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"><ChevronLeft size={24} /></button>
            <div className="p-4 bg-slate-900 rounded-[2rem] shadow-xl text-white">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Scholar Writer</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1 italic">Drafting Suite</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button 
                onClick={() => setIsFocusMode(true)}
                className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"
                title="Enter Focus Mode"
             >
                <Maximize2 size={24} />
             </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Navigation */}
        {!isFocusMode && (
          <div className="w-72 bg-slate-50/50 border-r border-slate-100 flex flex-col p-6 shrink-0">
             <button 
                onClick={createDraft}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all mb-8"
             >
                New Document +
             </button>
             
             <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-4">Recent Documents</p>
                {drafts.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setActiveDraftId(d.id)}
                    className={`w-full p-5 rounded-3xl text-left group transition-all relative ${activeDraftId === d.id ? 'bg-white shadow-md border border-slate-100' : 'hover:bg-white/50'}`}
                  >
                    <h3 className={`text-xs font-black truncate uppercase tracking-tight ${activeDraftId === d.id ? 'text-slate-900' : 'text-slate-400'}`}>{d.title}</h3>
                    <p className="text-[8px] font-bold text-slate-300 mt-1">{new Date(d.updatedAt).toLocaleDateString()}</p>
                    {activeDraftId === d.id && drafts.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteDraft(d.id); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </button>
                ))}
             </div>

             <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center gap-2 text-slate-400">
                      <Hash size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{wordCount} Words</span>
                   </div>
                </div>
                <div className="flex items-center gap-2 px-2 text-slate-400">
                   <Clock size={12} />
                   <span className="text-[10px] font-black uppercase tracking-widest">{readTime} Min Read</span>
                </div>
             </div>
          </div>
        )}

        {/* Main Editor Surface */}
        <div className="flex-1 flex flex-col relative items-center overflow-y-auto no-scrollbar pt-12 pb-32">
           {isFocusMode && (
             <button 
               onClick={() => setIsFocusMode(false)}
               className="fixed top-8 right-8 p-3 bg-white/50 backdrop-blur-md rounded-2xl text-slate-300 hover:text-slate-900 transition-all z-50 border border-slate-100"
             >
               <Minimize2 size={24} />
             </button>
           )}

           <div className="w-full max-w-2xl px-6">
              {/* Toolbar */}
              <div className="mb-10 flex items-center justify-between border-b border-slate-100 pb-4">
                 <div className="flex items-center gap-1">
                    <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900"><Bold size={18} /></button>
                    <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900"><Italic size={18} /></button>
                    <div className="w-px h-6 bg-slate-100 mx-2"></div>
                    <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900"><AlignLeft size={18} /></button>
                    <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900"><AlignCenter size={18} /></button>
                    <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900"><AlignRight size={18} /></button>
                 </div>

                 <button 
                    onClick={handleAIImprove}
                    disabled={isAILoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
                 >
                    {isAILoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    AI Polish
                    {!isPremium && <Crown size={10} className="ml-1 fill-white" />}
                 </button>
              </div>

              {/* Input Header */}
              <input 
                value={activeDraft.title}
                onChange={(e) => updateTitle(e.target.value)}
                placeholder="Document Title"
                className="w-full bg-transparent text-4xl font-black text-slate-900 tracking-tighter uppercase italic outline-none mb-8 placeholder:text-slate-100"
              />

              {/* Large Text Area */}
              <textarea 
                value={activeDraft.content}
                onChange={(e) => updateContent(e.target.value)}
                placeholder="Start your scholarship journey here..."
                className="w-full min-h-[70vh] bg-transparent text-lg font-medium text-slate-800 leading-relaxed outline-none resize-none placeholder:text-slate-100"
                spellCheck="true"
              />
           </div>

           {/* Floating Bottom Status in Focus Mode */}
           {isFocusMode && (
             <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl px-10 py-5 rounded-[2rem] border border-slate-100 shadow-2xl flex items-center gap-10">
                <div className="flex flex-col items-center">
                   <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Progress</span>
                   <span className="text-sm font-black italic">{wordCount} Words</span>
                </div>
                <div className="w-px h-8 bg-slate-100"></div>
                <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 active:scale-90 transition-all"><Save size={18} /></button>
                <div className="w-px h-8 bg-slate-100"></div>
                <div className="flex flex-col items-center">
                   <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Efficiency</span>
                   <span className="text-sm font-black italic">Active</span>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Floating Action Menu (Global) */}
      {!isFocusMode && (
        <div className="absolute bottom-10 right-10 flex flex-col gap-3 items-end">
           <button 
              className="p-5 bg-white border border-slate-100 text-slate-900 rounded-[2rem] shadow-2xl hover:scale-110 active:scale-95 transition-all group relative"
              title="Export Document"
           >
              <Download size={24} />
           </button>
           <button 
              className="p-6 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-4 group"
           >
              <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Sync Status</span>
                 <span className="text-xs font-black italic">Saved Locally</span>
              </div>
              <Save size={24} className="group-hover:rotate-12 transition-transform" />
           </button>
        </div>
      )}
    </div>
  );
};

export default ScholarWriter;
