
import React, { useState, useRef } from 'react';
import { Palette, Printer, X, Layout, Crown, Sparkles, Trash2, Type, Layers, MousePointer2, Plus, Shapes, Save, FileText, LayoutTemplate } from 'lucide-react';

interface Element {
  id: string;
  type: 'text' | 'sticker' | 'box' | 'line';
  content: string;
  x: number;
  y: number;
  fontSize?: number;
}

interface TemplateDesignerProps {
  isPremium: boolean;
  onGoPremium: () => void;
  onClose: () => void;
}

const STICKERS = ['⭐', '🔥', '🧠', '🚀', '🌟', '📚', '🧪', '💡', '✅', '📍', '🎓', '🎯', '⚡', '📝', '📂'];

const PRESETS = [
  { id: 'plan', name: 'STUDY PLAN', desc: 'Structure your week' },
  { id: 'notes', name: 'LECTURE NOTES', desc: 'Organized hierarchy' },
  { id: 'map', name: 'CONCEPT MAP', desc: 'Relational thinking' },
  { id: 'flash', name: 'FLASHCARDS', desc: 'Printable set' }
];

const TemplateDesigner: React.FC<TemplateDesignerProps> = ({ isPremium, onGoPremium, onClose }) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [activePreset, setActivePreset] = useState('plan');
  const canvasRef = useRef<HTMLDivElement>(null);

  const addElement = (type: Element['type'], content: string = '') => {
    const newEl: Element = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: content || (type === 'text' ? 'SCHOLAR NOTE' : '⭐'),
      x: 150,
      y: 150 + (elements.length * 15),
      fontSize: type === 'text' ? 18 : 36
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const handlePrint = () => {
    if (!isPremium) { onGoPremium(); return; }
    setIsPrinting(true);
    setTimeout(() => { window.print(); setIsPrinting(false); }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black z-[95] flex flex-col text-white animate-in slide-in-from-bottom-10 duration-500 overflow-hidden print:bg-white print:text-black">
      
      {/* Studio Header */}
      <div className="p-8 bg-black border-b border-white/10 flex items-center justify-between shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-[2rem] border border-indigo-400/30">
            <Palette size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Scholar Studio</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1 italic">Design your Future</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={handlePrint} className="bg-white text-black px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 active:scale-95 transition-all">
             <Printer size={18} /> EXPORT TEMPLATE
           </button>
           <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors"><X size={28} /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Toolbar - Scholar Unique Design */}
        <div className="w-28 bg-black border-r border-white/10 flex flex-col items-center py-10 gap-10 shrink-0 print:hidden overflow-y-auto no-scrollbar">
           <div className="flex flex-col gap-6">
             <button onClick={() => addElement('text')} className="p-5 bg-white/5 rounded-[1.8rem] text-slate-400 hover:text-white hover:bg-white/10 transition-all flex flex-col items-center gap-2">
               <Type size={24} /><span className="text-[8px] font-black uppercase tracking-widest">Type</span>
             </button>
             <button onClick={() => addElement('box')} className="p-5 bg-white/5 rounded-[1.8rem] text-slate-400 hover:text-white hover:bg-white/10 transition-all flex flex-col items-center gap-2">
               <Shapes size={24} /><span className="text-[8px] font-black uppercase tracking-widest">Frame</span>
             </button>
             <button onClick={() => addElement('sticker')} className="p-5 bg-white/5 rounded-[1.8rem] text-slate-400 hover:text-white hover:bg-white/10 transition-all flex flex-col items-center gap-2">
               <Sparkles size={24} /><span className="text-[8px] font-black uppercase tracking-widest">Deco</span>
             </button>
           </div>
           
           <div className="w-12 h-px bg-white/10"></div>
           
           <div className="flex flex-col gap-5 py-2">
             {STICKERS.map(s => (
               <button 
                 key={s} 
                 onClick={() => addElement('sticker', s)} 
                 className="text-4xl hover:scale-125 transition-transform filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
               >
                 {s}
               </button>
             ))}
           </div>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 bg-[#0a0a0a] p-12 flex flex-col items-center relative print:p-0 print:bg-white overflow-hidden">
          
          {/* Preset System */}
          <div className="absolute top-6 left-6 z-20 flex gap-3 print:hidden">
            {PRESETS.map(p => (
              <button 
                key={p.id}
                onClick={() => setActivePreset(p.id)}
                className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activePreset === p.id ? 'bg-white text-black shadow-xl' : 'bg-white/5 border border-white/10 text-slate-500 hover:text-white'}`}
              >
                <LayoutTemplate size={12} /> {p.name}
              </button>
            ))}
          </div>

          {/* Canvas Component */}
          <div 
            ref={canvasRef}
            className="w-full max-w-[700px] aspect-[1/1.414] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-md relative overflow-hidden print:shadow-none print:rounded-none"
          >
             {/* Header Design for Presets */}
             <div className="absolute top-12 left-12 right-12 flex justify-between items-end border-b-2 border-black/10 pb-4">
                <div>
                   <h2 className="text-3xl font-black text-black tracking-tighter uppercase italic">{activePreset.replace('_', ' ')}</h2>
                   <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em] mt-1">EST. {new Date().getFullYear()}</p>
                </div>
                <div className="flex gap-2">
                   <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                   <div className="w-4 h-4 bg-black/10 rounded-full"></div>
                </div>
             </div>

             {/* Dynamic Elements */}
             {elements.map(el => (
               <div
                 key={el.id}
                 onMouseDown={() => setSelectedId(el.id)}
                 style={{ 
                   left: el.x, 
                   top: el.y, 
                   position: 'absolute', 
                   zIndex: selectedId === el.id ? 50 : 10, 
                   cursor: 'move',
                   fontSize: el.fontSize 
                 }}
                 className={`group p-4 rounded-2xl transition-all ${selectedId === el.id ? 'ring-2 ring-indigo-500 bg-indigo-500/5' : 'hover:ring-1 hover:ring-black/10'}`}
               >
                 {el.type === 'text' && (
                   <div 
                     className="font-black text-black outline-none min-w-[80px] whitespace-nowrap uppercase tracking-tight text-xl italic" 
                     contentEditable 
                     suppressContentEditableWarning
                   >
                     {el.content}
                   </div>
                 )}
                 {el.type === 'sticker' && <div className="text-6xl filter drop-shadow-xl">{el.content}</div>}
                 {el.type === 'box' && <div className="w-56 h-32 border-[8px] border-black/5 rounded-[2.5rem] flex items-center justify-center text-[10px] font-black text-black/20 uppercase tracking-widest italic">Scholar Frame</div>}
                 
                 {selectedId === el.id && (
                   <button 
                    onClick={() => setElements(elements.filter(e => e.id !== el.id))} 
                    className="absolute -top-4 -right-4 p-2 bg-black text-white rounded-full shadow-2xl print:hidden border-2 border-white"
                   >
                     <Trash2 size={14} />
                   </button>
                 )}
               </div>
             ))}
             
             {/* Background Textures */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:25px_25px]"></div>

             {!elements.length && (
               <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.03] pointer-events-none">
                 <MousePointer2 size={160} className="mb-6" />
                 <p className="text-4xl font-black uppercase tracking-[0.5em] italic text-black">SCHOLAR CANVAS</p>
               </div>
             )}
          </div>
          
          {/* Controls Panel */}
          {selectedId && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white p-6 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center gap-8 animate-in slide-in-from-bottom-6 text-black print:hidden">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-slate-400 mb-2">Layer Scale</span>
                <div className="flex gap-3">
                   <button onClick={() => setElements(elements.map(e => e.id === selectedId ? {...e, fontSize: (e.fontSize || 18) + 4} : e))} className="p-3 bg-slate-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Plus size={18} /></button>
                   <button onClick={() => setElements(elements.map(e => e.id === selectedId ? {...e, fontSize: Math.max(12, (e.fontSize || 18) - 4)} : e))} className="p-3 bg-slate-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Layers size={18} /></button>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-100"></div>
              <button onClick={() => setSelectedId(null)} className="px-8 py-4 bg-black text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">FINALIZE LAYER</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateDesigner;
