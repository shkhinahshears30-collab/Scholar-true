
import React, { useState } from 'react';
import { Tag, X, ChevronRight } from 'lucide-react';
import { SPONSOR_OFFERS } from '../constants';

const SponsorPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className="fixed top-4 right-4 z-30">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-amber-100 border border-amber-200 p-3 rounded-full shadow-lg text-amber-700 flex items-center gap-2 animate-bounce"
        >
          <Tag size={20} />
          <span className="text-xs font-bold">Deals</span>
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-64 overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="bg-amber-50 p-3 flex items-center justify-between border-b border-amber-100">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Sponsor Perks</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-amber-900/50 hover:text-amber-900">
              <X size={16} />
            </button>
          </div>
          <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
            {SPONSOR_OFFERS.map(offer => (
              <a 
                key={offer.id} 
                href={offer.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-100 hover:border-amber-200 transition-all">
                  <img src={offer.image} alt={offer.name} className="w-full h-20 object-cover opacity-80 group-hover:opacity-100" />
                  <div className="p-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{offer.name}</p>
                    <p className="text-xs font-bold text-indigo-600 flex items-center justify-between">
                      {offer.discount}
                      <ChevronRight size={14} />
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <button 
            onClick={() => { setIsOpen(false); setHidden(true); }}
            className="w-full p-2 text-[10px] text-slate-400 hover:text-slate-600 text-center bg-slate-50"
          >
            Hide Panel Forever
          </button>
        </div>
      )}
    </div>
  );
};

export default SponsorPanel;
