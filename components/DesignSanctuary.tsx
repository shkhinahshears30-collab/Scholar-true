
import React, { useState, useRef, useEffect } from 'react';
import { X, Layout, Plus, Palette, Trash2, Maximize2, Move, Type, Clock, CheckSquare, Quote, Sparkles, Crown, Download, Save, Grid3X3, Layers, Image as ImageIcon, MousePointer2, ChevronLeft } from 'lucide-react';

interface Widget {
  id: string;
  type: 'timer' | 'todo' | 'quote' | 'text' | 'decor' | 'header';
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
  color?: string;
}

interface DesignSanctuaryProps {
  isPremium: boolean;
  onClose: () => void;
  onGoPremium: () => void;
}

const DesignSanctuary: React.FC<DesignSanctuaryProps> = ({ isPremium, onClose, onGoPremium }) => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'midnight' | 'sakura' | 'forest' | 'cyber'>('midnight');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      x: 100,
      y: 100 + (widgets.length * 20),
      w: type === 'header' ? 400 : type === 'timer' || type === 'quote' ? 240 : 180,
      h: type === 'header' ? 100 : type === 'todo' ? 260 : 140,
      content: type === 'quote' ? "Efficiency is doing things right; effectiveness is doing the right things." : 
               type === 'timer' ? '25:00' : 
               type === 'header' ? 'MY WEEKLY FOCUS' : 'New Study Component'
    };
    setWidgets([...widgets, newWidget]);
    setSelectedId(newWidget.id);
  };

  const getThemeBg = () => {
    switch(theme) {
      case 'sakura': return 'bg-[#fff5f7]';
      case 'forest': return 'bg-[#f0fdf4]';
      case 'cyber': return 'bg-black';
      default: return 'bg-slate-50';
    }
  };

  const getWidgetStyle = (type: string) => {
    switch(theme) {
      case 'sakura': return 'bg-white border-pink-100 text-pink-900 shadow-pink-100';
      case 'forest': return 'bg-white border-emerald-100 text-emerald-900 shadow-emerald-100';
      case 'cyber': return 'bg-slate-900 border-indigo-500 text-indigo-400 shadow-indigo-500/20';
      default: return 'bg-white border-slate-100 text-slate-800 shadow-slate-200';
    }
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const widget = widgets.find(w => w.id === id);
    if (!widget) return;
    
    setSelectedId(id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - widget.x,
      y: e.clientY - widget.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId) return;

    setWidgets(prev => prev.map(w => {
      if (w.id === selectedId) {
        return {
          ...w,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
      }
      return w;
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-white z-[95] flex flex-col text-slate-900 animate-in slide-in-from-bottom-10 duration-500 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Studio Navigation */}
      <div className="p-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-90"><ChevronLeft size={28} /></button>
          <div className="p-4 bg-rose-500 rounded-[2.2rem] shadow-xl text-white transform hover:rotate-6 transition-transform">
            <Layout size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Design Sanctuary</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
               Visual Dashboard Lab <Sparkles size={10} className="text-rose-400" />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mr-4 border border-slate-200 shadow-inner">
            {(['midnight', 'sakura', 'forest', 'cyber'] as const).map(t => (
              <button 
                key={t}
                onClick={() => setTheme(t)}
                className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${theme === t ? 'bg-white shadow-md scale-105' : 'hover:scale-105'} ${t === 'midnight' ? 'text-slate-800' : t === 'sakura' ? 'text-pink-400' : t === 'forest' ? 'text-emerald-500' : t === 'cyber' ? 'text-indigo-600' : ''}`}
              >
                <Palette size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Scholar Designer Sidebar (Elements) */}
        <div className="w-32 bg-white border-r border-slate-100 flex flex-col items-center py-8 gap-8 shrink-0 overflow-y-auto no-scrollbar">
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 w-full text-center pb-2">Assets</p>
           
           <button onClick={() => addWidget('header')} className="group flex flex-col items-center gap-2 p-3 hover:scale-110 transition-all">
              <div className="p-4 bg-slate-100 rounded-2xl text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-sm"><ImageIcon size={24} /></div>
              <span className="text-[8px] font-black uppercase">Header</span>
           </button>

           <button onClick={() => addWidget('timer')} className="group flex flex-col items-center gap-2 p-3 hover:scale-110 transition-all">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm"><Clock size={24} /></div>
              <span className="text-[8px] font-black uppercase">Clock</span>
           </button>

           <button onClick={() => addWidget('todo')} className="group flex flex-col items-center gap-2 p-3 hover:scale-110 transition-all">
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm"><CheckSquare size={24} /></div>
              <span className="text-[8px] font-black uppercase">Checklist</span>
           </button>

           <button onClick={() => addWidget('quote')} className="group flex flex-col items-center gap-2 p-3 hover:scale-110 transition-all">
              <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-sm"><Quote size={24} /></div>
              <span className="text-[8px] font-black uppercase">Motto</span>
           </button>

           <button onClick={() => addWidget('text')} className="group flex flex-col items-center gap-2 p-3 hover:scale-110 transition-all">
              <div className="p-4 bg-purple-50 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm"><Type size={24} /></div>
              <span className="text-[8px] font-black uppercase">Note</span>
           </button>

           <button onClick={() => addWidget('decor')} className="group flex flex-col items-center gap-2 p-3 hover:scale-110 transition-all">
              <div className="p-4 bg-rose-50 rounded-2xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors shadow-sm"><Sparkles size={24} /></div>
              <span className="text-[8px] font-black uppercase">Deco</span>
           </button>

           <div className="mt-auto flex flex-col items-center gap-4 pb-8">
              <button className="p-4 bg-slate-900 text-white rounded-[1.5rem] shadow-xl active:scale-95 transition-all hover:bg-black"><Save size={20} /></button>
           </div>
        </div>

        {/* Design Canvas Workspace */}
        <div className={`flex-1 ${getThemeBg()} p-16 relative overflow-hidden flex items-center justify-center transition-colors duration-500`}>
           <div 
             ref={canvasRef}
             className={`w-full h-full max-w-5xl bg-white border-2 border-dashed border-slate-200 rounded-[4rem] relative shadow-2xl overflow-hidden`}
           >
              {/* Canva-style Grid Overlay */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>
              
              {widgets.map(w => (
                <div 
                  key={w.id}
                  onMouseDown={(e) => handleMouseDown(e, w.id)}
                  style={{ 
                    left: w.x, 
                    top: w.y, 
                    width: w.w, 
                    height: w.h, 
                    position: 'absolute',
                    zIndex: selectedId === w.id ? 50 : 10
                  }}
                  className={`p-6 rounded-[2.5rem] border-2 shadow-xl cursor-move group transition-all select-none ${getWidgetStyle(w.type)} ${selectedId === w.id ? 'ring-4 ring-rose-500/30 scale-105 border-rose-400' : 'hover:scale-[1.01]'}`}
                >
                   <div className="flex flex-col h-full pointer-events-none">
                      <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${selectedId === w.id ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`}></div>
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{w.type}</span>
                         </div>
                         {selectedId === w.id && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setWidgets(widgets.filter(x => x.id !== w.id)); }} 
                              className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors pointer-events-auto"
                            >
                              <Trash2 size={10} />
                            </button>
                         )}
                      </div>

                      {w.type === 'header' && (
                        <div className="flex-1 flex flex-col items-center justify-center">
                           <h2 className="text-4xl font-black italic tracking-tighter text-center uppercase leading-none">{w.content}</h2>
                           <div className="w-12 h-1 bg-current opacity-30 mt-4 rounded-full"></div>
                        </div>
                      )}

                      {w.type === 'timer' && (
                        <div className="flex-1 flex flex-col items-center justify-center">
                           <h2 className="text-5xl font-black italic tracking-tighter tabular-nums">{w.content}</h2>
                           <p className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-50 mt-2">Deep Focus Session</p>
                        </div>
                      )}

                      {w.type === 'quote' && (
                        <p className="text-sm font-bold italic leading-relaxed text-center flex-1 flex items-center px-4">"{w.content}"</p>
                      )}

                      {w.type === 'todo' && (
                        <div className="space-y-4 mt-2 px-2">
                           {[1,2,3,4].map(i => (
                             <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-lg border-2 border-current opacity-30"></div>
                                <div className="h-2 flex-1 bg-current opacity-10 rounded-full"></div>
                             </div>
                           ))}
                           <p className="text-[8px] font-black uppercase text-center mt-6 pt-6 border-t border-current border-opacity-10 tracking-[0.2em]">Academic Targets</p>
                        </div>
                      )}

                      {w.type === 'text' && (
                        <div className="font-bold text-sm leading-relaxed pointer-events-auto outline-none" contentEditable suppressContentEditableWarning>{w.content}</div>
                      )}

                      {w.type === 'decor' && (
                        <div className="flex-1 flex items-center justify-center">
                           <Sparkles size={80} className="opacity-10 animate-pulse text-indigo-500" />
                        </div>
                      )}
                   </div>

                   {selectedId === w.id && (
                     <div className="absolute -bottom-3 -right-3 p-2.5 bg-white rounded-2xl shadow-2xl text-slate-400 border border-slate-100 pointer-events-none">
                        <Maximize2 size={14} />
                     </div>
                   )}
                </div>
              ))}

              {widgets.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.04] pointer-events-none">
                   <Grid3X3 size={160} className="mb-6" />
                   <p className="text-4xl font-black uppercase tracking-[0.6em] italic text-slate-900">Workspace Active</p>
                   <p className="text-xs font-bold mt-4 tracking-[0.3em]">SELECT ASSETS FROM SIDEBAR TO BEGIN</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Canva-style Floating Toolbar Hub */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-950 p-6 rounded-[3rem] shadow-[0_30px_90px_rgba(0,0,0,0.5)] flex items-center gap-10 animate-in slide-in-from-bottom-12 text-white border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4 border-r border-white/10 pr-10">
             <div className="p-4 bg-rose-500 rounded-3xl shadow-lg shadow-rose-500/20"><Layers size={24} /></div>
             <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Design Flow</p>
                <h4 className="text-xl font-black italic">{widgets.length} Layers</h4>
             </div>
          </div>
          <div className="flex items-center gap-8">
             <button onClick={() => addWidget('text')} className="flex flex-col items-center gap-2 hover:text-rose-400 transition-colors group">
                <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all"><Plus size={24} /></div>
                <span className="text-[8px] font-black uppercase tracking-widest">Add Element</span>
             </button>
             <button onClick={() => setTheme(theme === 'cyber' ? 'midnight' : 'cyber')} className="flex flex-col items-center gap-2 hover:text-rose-400 transition-colors group">
                <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all"><Palette size={24} /></div>
                <span className="text-[8px] font-black uppercase tracking-widest">Style Flip</span>
             </button>
             <div className="w-px h-12 bg-white/10"></div>
             <button 
               onClick={() => !isPremium ? onGoPremium() : alert("Exporting High-Res PDF Template...")}
               className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-95 ${isPremium ? 'bg-white text-black hover:bg-slate-100 shadow-xl' : 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.3)]'}`}
             >
                {isPremium ? (
                  <>EXPORT STUDIO <Download size={18} /></>
                ) : (
                  <>UNLOCK EXPORT <Crown size={18} fill="currentColor" /></>
                )}
             </button>
          </div>
      </div>
    </div>
  );
};

export default DesignSanctuary;
