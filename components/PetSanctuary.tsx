
import React, { useState, useMemo } from 'react';
import { ALL_COMPANIONS, ACCESSORIES, HABITATS, PET_FOOD } from '../constants';
import { CompanionType, StudyMode } from '../types';
import { getTranslation } from '../services/i18n';
// Added CheckCircle2 to imports
import { 
  Edit2, Check, Sparkles, Zap, Leaf, Target, Watch, Settings as SettingsIcon, Palette, Grid,
  Utensils, Map as MapIcon, ChevronRight, Lock, Crown, Trophy, CheckCircle2
} from 'lucide-react';

interface PetSanctuaryProps {
  companionType: CompanionType;
  customName?: string;
  accessoryId?: string;
  habitatId?: string;
  unlockedHabitats: string[];
  growth: number;
  message: string;
  isFocusing: boolean;
  studyMode: StudyMode;
  language: string;
  onRename?: (newName: string) => void;
  onOpenVault?: () => void;
  onFeed?: (foodGrowth: number) => void;
  onChangeHabitat?: (habitatId: string) => void;
}

const PetSanctuary: React.FC<PetSanctuaryProps> = ({ 
  companionType, 
  customName, 
  accessoryId,
  habitatId,
  unlockedHabitats,
  growth, 
  message, 
  isFocusing, 
  studyMode,
  language,
  onRename,
  onOpenVault,
  onFeed,
  onChangeHabitat
}) => {
  const t = (key: string) => getTranslation(language, key);
  
  const companion = useMemo(() => 
    ALL_COMPANIONS.find(c => c.type === companionType) || ALL_COMPANIONS[0]
  , [companionType]);
  
  const accessory = useMemo(() => 
    ACCESSORIES.find(a => a.id === accessoryId)
  , [accessoryId]);

  const habitat = useMemo(() => 
    HABITATS.find(h => h.id === habitatId) || HABITATS[0]
  , [habitatId]);

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(customName || companion.name);
  const [showFoodPanel, setShowFoodPanel] = useState(false);
  const [showHabitatPanel, setShowHabitatPanel] = useState(false);

  const currentLevel = Math.floor(growth / 10) + 1;

  const handleRenameSubmit = () => {
    if (onRename && tempName.trim()) {
      onRename(tempName.trim());
    }
    setIsEditing(false);
  };

  const getThemeColors = () => {
    return habitat.colors;
  };

  const render3DModel = () => {
    const type = companion.type as string;
    let animationClass = "animate-float";

    if (['sprout', 'groot', 'naruto', 'paul_atreides', 'palm', 'flower', 'volcano'].includes(type)) {
      animationClass = "animate-sway-3d";
    } 
    else if (['kitten', 'panther', 'luffy', 'barbie', 'dustin', 'robin', 'dog', 'bunny', 'hamster', 'monkey', 'panda', 'koala', 'pig', 'ice_cream', 'cookie', 'apple', 'cherry', 'donut', 'watermelon'].includes(type)) {
      animationClass = "animate-kitten";
    } 
    else if (['robot', 'ironman', 'vision', 'gojo', 'strange', 'eleven', 'joker', 'rocket', 'ufo', 'saturn', 'telescope', 'cpu', 'galaxy', 'battery'].includes(type)) {
      animationClass = "animate-robot";
    } 
    else if (['dragon', 'tanjiro', 'thor', 'goku', 'gladiator', 'demogorgon', 'hulk', 'lion', 'tiger', 'gorilla', 'shark', 'whale', 't-rex', 'bronto', 'mammoth', 'hydra', 'kraken'].includes(type)) {
      animationClass = "animate-dragon";
    } 
    else if (['phoenix', 'scarlet', 'spiderman', 'rocket_raccoon', 'parrot', 'pterodactyl', 'fairy', 'comet', 'starman', 'dolphin', 'alien'].includes(type)) {
      animationClass = "animate-phoenix";
    }

    return (
      <div 
        className={`relative z-20 transition-transform duration-1000 ease-out ${isFocusing ? 'scale-[1.35]' : 'scale-100'}`}
      >
        <div className={`flex items-center justify-center ${animationClass}`}>
          <div className="relative">
            <div className={`${companion.color} drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-125`}>
              {companion.icon}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative w-full h-[24rem] rounded-[3.5rem] overflow-hidden bg-gradient-to-br ${getThemeColors()} flex flex-col items-center justify-center shadow-2xl transition-all duration-700 perspective-scene`}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-black/40 blur-[80px] rounded-[100%]"></div>
      </div>

      <div className={`absolute top-10 z-50 px-6 py-4 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-[85%] transform transition-all duration-700 ease-out border border-white/50 ${message ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-90'}`}>
        <p className="text-[12px] font-bold text-slate-800 text-center leading-relaxed italic">
          "{message}"
        </p>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-r border-b border-white/20"></div>
      </div>

      {!isFocusing && (
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-50">
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl text-white/80 border border-white/10 hover:bg-white/20 transition-all"
            >
              <Palette size={16} />
            </button>
            <button 
              onClick={onOpenVault}
              className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl text-white/80 border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Grid size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Vault</span>
            </button>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => { setShowFoodPanel(!showFoodPanel); setShowHabitatPanel(false); }}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-2 ${showFoodPanel ? 'bg-white text-slate-900 border-white' : 'bg-white/10 backdrop-blur-xl text-white/80 border-white/10'}`}
            >
              <Utensils size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Feed</span>
            </button>
            <button 
              onClick={() => { setShowHabitatPanel(!showHabitatPanel); setShowFoodPanel(false); }}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-2 ${showHabitatPanel ? 'bg-white text-slate-900 border-white' : 'bg-white/10 backdrop-blur-xl text-white/80 border-white/10'}`}
            >
              <MapIcon size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Habitat</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Level Indicator */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl text-white">
          <Trophy size={20} className="mb-1 text-amber-400" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Level</span>
          <span className="text-xl font-black">{currentLevel}</span>
        </div>
      </div>

      {/* Food Selection Panel */}
      {showFoodPanel && (
        <div className="absolute inset-x-6 top-24 bottom-24 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] z-[60] p-6 shadow-2xl border border-white animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-black text-slate-900 uppercase tracking-tighter italic">Feed {customName || companion.name}</h3>
             <button onClick={() => setShowFoodPanel(false)} className="text-slate-400"><CheckCircle2 size={24} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
             {PET_FOOD.map(food => (
               <button 
                 key={food.id} 
                 onClick={() => { onFeed?.(food.growth); setShowFoodPanel(false); }}
                 className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
               >
                 <div className="mb-2 group-hover:scale-125 transition-transform">{food.icon}</div>
                 <span className="text-[10px] font-black text-slate-800 uppercase">{food.name}</span>
                 <span className="text-[8px] font-bold text-emerald-500 mt-1">+{food.growth}% Growth</span>
               </button>
             ))}
          </div>
        </div>
      )}

      {/* Habitat Selection Panel */}
      {showHabitatPanel && (
        <div className="absolute inset-x-6 top-24 bottom-24 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] z-[60] p-6 shadow-2xl border border-white animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-black text-slate-900 uppercase tracking-tighter italic">Select Habitat</h3>
             <button onClick={() => setShowHabitatPanel(false)} className="text-slate-400"><CheckCircle2 size={24} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 h-[250px] overflow-y-auto no-scrollbar pb-4">
             {HABITATS.map(h => {
               const isUnlocked = unlockedHabitats.includes(h.id);
               const levelRequired = HABITATS.indexOf(h) * 5;
               const isSelected = habitatId === h.id;
               
               return (
                 <button 
                   key={h.id} 
                   disabled={!isUnlocked}
                   onClick={() => { onChangeHabitat?.(h.id); setShowHabitatPanel(false); }}
                   className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all relative ${!isUnlocked ? 'opacity-40 grayscale' : 'hover:scale-[1.02]'} ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'bg-slate-50 border-slate-100'}`}
                 >
                   {!isUnlocked && (
                     <div className="absolute top-2 right-2 text-slate-400"><Lock size={12} /></div>
                   )}
                   <div className={`mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>{h.icon}</div>
                   <span className={`text-[9px] font-black uppercase ${isSelected ? 'text-indigo-600' : 'text-slate-800'}`}>{h.name}</span>
                   {!isUnlocked && <span className="text-[7px] font-black text-slate-400 mt-1">LVL {levelRequired}</span>}
                 </button>
               );
             })}
          </div>
          <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-2">
             <Crown size={14} className="text-indigo-600" />
             <p className="text-[8px] font-black text-indigo-900 uppercase">Unlock new habitats every 5 levels!</p>
          </div>
        </div>
      )}

      <div className={`relative flex flex-col items-center justify-center transition-all duration-1000 ${isFocusing ? '-translate-y-10' : ''}`}>
        <div className="absolute bottom-[-20px] w-48 h-16 glass-pedestal rounded-[100%] shadow-[0_20px_60px_rgba(0,0,0,0.4)]"></div>
        <div className="relative mb-12">
          {render3DModel()}
          {accessory && accessoryId !== 'none' && (
            <div className="absolute -top-6 -right-6 z-30 transform scale-110 drop-shadow-2xl animate-float">
               <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-slate-100 text-indigo-600 transition-transform hover:rotate-12">
                 {accessory.icon}
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 w-full px-10 z-40">
        <div className={`flex justify-between items-end mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className={`flex flex-col gap-1 group ${language === 'ar' ? 'items-end' : 'items-start'}`}>
            {isEditing ? (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20">
                <input 
                  autoFocus
                  className="bg-transparent text-white text-xs px-2 py-1 focus:outline-none w-32 font-black uppercase tracking-widest placeholder:text-white/30"
                  value={tempName}
                  placeholder={t('rename_placeholder')}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                  onBlur={handleRenameSubmit}
                />
                <button onClick={handleRenameSubmit} className="p-1.5 bg-emerald-500 text-white rounded-xl shadow-lg">
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    {customName || companion.name}
                  </h3>
                  {!isFocusing && (
                    <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-white/10 backdrop-blur-md rounded-xl text-white/80">
                      <Edit2 size={12} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                   <div className="px-2 py-0.5 bg-white/10 rounded-full border border-white/10">
                      <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">
                        {companion.name} {t('level')}{currentLevel}
                      </span>
                   </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white drop-shadow-lg">{growth}</span>
              <span className="text-[10px] font-black text-white/50">%</span>
            </div>
          </div>
        </div>
        <div className="h-2.5 bg-black/40 rounded-full overflow-hidden backdrop-blur-md border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-indigo-400 via-white to-indigo-400 rounded-full transition-all duration-1000" 
            style={{ width: `${growth}%` }}
          ></div>
        </div>
      </div>
      
      {isFocusing && (
        <div className="absolute top-6 right-8 flex flex-col gap-3 items-end z-50">
          <div className="flex items-center gap-2 bg-emerald-500/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-black border border-emerald-400 animate-pulse">
            <Target size={14} />
            {t('deep_sync')}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetSanctuary;
