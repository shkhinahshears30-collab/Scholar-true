
import React, { useState, useRef } from 'react';
import { X, Search, Crown, Sparkles, Filter, ChevronRight, Zap, CheckCircle2, Lock } from 'lucide-react';
import { ALL_COMPANIONS, BASE_COMPANIONS, MARVEL_COMPANIONS, ANIME_COMPANIONS, FARM_FRIENDS, JUNGLE_ROYALTY, DEEP_SEA, COSMIC_VOYAGERS, MYTHIC_BEASTS, PREHISTORIC_PALS, FOODIE_PETS } from '../constants';
import { CompanionType } from '../types';
import VerticalElevator from './VerticalElevator';

interface CompanionVaultProps {
  currentType: CompanionType;
  isPremium: boolean;
  onSelect: (type: CompanionType) => void;
  onClose: () => void;
  onGoPremium: () => void;
}

const CATEGORIES = [
  { id: 'all', name: 'All Heroes', list: ALL_COMPANIONS },
  { id: 'base', name: 'Base', list: BASE_COMPANIONS },
  { id: 'marvel', name: 'Marvel', list: MARVEL_COMPANIONS },
  { id: 'anime', name: 'Anime', list: ANIME_COMPANIONS },
  { id: 'farm', name: 'Farm', list: FARM_FRIENDS },
  { id: 'jungle', name: 'Jungle', list: JUNGLE_ROYALTY },
  { id: 'sea', name: 'Ocean', list: DEEP_SEA },
  { id: 'space', name: 'Cosmic', list: COSMIC_VOYAGERS },
  { id: 'mythic', name: 'Mythic', list: MYTHIC_BEASTS },
  { id: 'dino', name: 'Prehistoric', list: PREHISTORIC_PALS },
  { id: 'food', name: 'Foodie', list: FOODIE_PETS },
];

const CompanionVault: React.FC<CompanionVaultProps> = ({ currentType, isPremium, onSelect, onClose, onGoPremium }) => {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredList = CATEGORIES.find(c => c.id === activeCat)!.list.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (type: string, isPremiumPet: boolean) => {
    if (isPremiumPet && !isPremium) {
      onGoPremium();
      return;
    }
    setSyncing(type);
    setTimeout(() => {
      onSelect(type);
      setSyncing(null);
      onClose();
    }, 1500);
  };

  const vaultLiftActions = [
    { id: 'top', icon: <Search size={18} />, label: 'Search' },
    { id: 'mid', icon: <Sparkles size={18} />, label: 'Heroes' },
    { id: 'bottom', icon: <Crown size={18} />, label: 'Premium' },
  ];

  return (
    <div className="fixed inset-0 bg-[#f8fafc] z-[100] flex flex-col animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
      
      {/* Vault Lift */}
      <VerticalElevator 
        actions={vaultLiftActions}
        onSelect={(id) => {
          if (id === 'top') scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          if (id === 'bottom') scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }}
        onScrollUp={() => scrollRef.current?.scrollBy({ top: -300, behavior: 'smooth' })}
        onScrollDown={() => scrollRef.current?.scrollBy({ top: 300, behavior: 'smooth' })}
      />

      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 pr-16">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">The Vault</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">90+ Scholar Companions</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Category Scroller */}
      <div className="p-4 bg-white border-b border-slate-50 overflow-x-auto no-scrollbar flex gap-2 shrink-0 pr-16">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCat === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-6 py-4 bg-slate-50 shrink-0 pr-16">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or type..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-slate-50 no-scrollbar pb-32 pr-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredList.map((pet) => {
            const isSelected = currentType === pet.type;
            const isLocked = pet.isPremium && !isPremium;
            return (
              <button
                key={pet.type}
                onClick={() => handleSelect(pet.type, pet.isPremium)}
                className={`relative bg-white rounded-[2.5rem] p-6 border transition-all flex flex-col items-center justify-center group overflow-hidden ${isSelected ? 'border-indigo-500 shadow-2xl scale-[1.02]' : 'border-slate-100 shadow-sm hover:border-indigo-200 hover:scale-[1.01]'}`}
              >
                {/* Syncing Overlay */}
                {syncing === pet.type && (
                  <div className="absolute inset-0 bg-indigo-600 z-10 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                    <Zap size={32} className="animate-bounce mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Deep Syncing...</span>
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-1">
                  {pet.isPremium && <Crown size={14} className="text-amber-500 fill-amber-500" />}
                  {isLocked && <Lock size={12} className="text-slate-200" />}
                  {isSelected && <CheckCircle2 size={16} className="text-indigo-600" />}
                </div>

                <div className={`mb-4 transition-transform duration-500 group-hover:scale-125 ${pet.color} ${isLocked ? 'opacity-30' : 'opacity-100'}`}>
                  {React.cloneElement(pet.icon as React.ReactElement<any>, { size: 48 })}
                </div>

                <div className="text-center">
                  <h3 className={`text-xs font-black uppercase tracking-tighter ${isLocked ? 'text-slate-300' : 'text-slate-900'}`}>{pet.name}</h3>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{pet.type.replace('_', ' ')}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompanionVault;
