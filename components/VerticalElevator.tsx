
import React from 'react';
import { ChevronUp, ChevronDown, Circle } from 'lucide-react';

interface ElevatorAction {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface VerticalElevatorProps {
  actions: ElevatorAction[];
  activeId?: string;
  onSelect: (id: string) => void;
  onScrollUp?: () => void;
  onScrollDown?: () => void;
}

const VerticalElevator: React.FC<VerticalElevatorProps> = ({ actions, activeId, onSelect, onScrollUp, onScrollDown }) => {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center gap-2 print:hidden">
      <div className="bg-white/80 backdrop-blur-2xl border border-white/20 p-2 rounded-full shadow-2xl flex flex-col gap-2 animate-in slide-in-from-right-4 duration-500">
        <button 
          onClick={onScrollUp}
          className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
        >
          <ChevronUp size={20} />
        </button>
        
        <div className="flex flex-col gap-2 py-2 border-y border-slate-100">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => onSelect(action.id)}
              className={`group relative p-3 rounded-full transition-all duration-300 ${
                activeId === action.id 
                  ? 'bg-indigo-600 text-white shadow-lg scale-110' 
                  : 'bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {action.icon}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                {action.label}
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={onScrollDown}
          className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
        >
          <ChevronDown size={20} />
        </button>
      </div>
      
      <div className="w-1 h-12 bg-gradient-to-b from-transparent via-slate-200 to-transparent rounded-full mt-2"></div>
    </div>
  );
};

export default VerticalElevator;
