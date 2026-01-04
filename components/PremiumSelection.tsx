import React, { useState, useRef } from 'react';
import { Crown, CheckCircle2, Zap, ShieldCheck, Grid, Clock, Star, X, Infinity, Smartphone, ChevronDown, ChevronUp, WifiOff, ChevronLeft } from 'lucide-react';
import { PREMIUM_PLANS } from '../constants';

interface PremiumSelectionProps {
  onPurchase: (isRoyal?: boolean) => void;
  onClose: () => void;
}

const PremiumSelection: React.FC<PremiumSelectionProps> = ({ onPurchase, onClose }) => {
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const [selectedPlan, setSelectedPlan] = useState(PREMIUM_PLANS[1].id);
  const featureListRef = useRef<HTMLDivElement>(null);

  const features = [
    { icon: <Clock className="text-amber-400" />, text: "Extended 120m Sessions" },
    { icon: <Grid className="text-blue-400" />, text: "All Marvel & Anime Heroes" },
    { icon: <ShieldCheck className="text-emerald-400" />, text: "Ad-Free Deep Work" },
    { icon: <Infinity className="text-indigo-400" />, text: "Unlimited Flashcard Sets" },
    { icon: <Smartphone className="text-pink-400" />, text: "Real App Blocking Simulation" },
    { icon: <WifiOff className="text-amber-600" />, text: "True Offline Mode (Royal)" },
  ];

  const scrollFeatures = (dir: 'up' | 'down') => {
    if (featureListRef.current) {
      featureListRef.current.scrollBy({ top: dir === 'up' ? -100 : 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center overflow-y-auto no-scrollbar pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-[60vh] bg-gradient-to-b from-indigo-900/40 to-black pointer-events-none"></div>
      
      <div className="relative w-full max-w-md px-8 py-12 flex flex-col items-center">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-3 text-white/30 hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="inline-flex items-center justify-center p-4 bg-amber-400 rounded-3xl mb-6 shadow-[0_0_40px_rgba(251,191,36,0.4)] animate-float">
          <Crown size={40} className="text-white fill-white" />
        </div>

        <h1 className="text-4xl font-black text-white text-center tracking-tighter mb-2 italic">ULTRA SCHOLAR</h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[8px] mb-10 text-center">Navigate up & down for more</p>

        {/* Currency Toggle */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-8 self-center">
          <button onClick={() => setCurrency('USD')} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${currency === 'USD' ? 'bg-white text-black' : 'text-white/40'}`}>USD</button>
          <button onClick={() => setCurrency('EUR')} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${currency === 'EUR' ? 'bg-white text-black' : 'text-white/40'}`}>EUR</button>
        </div>

        {/* Plan Cards */}
        <div className="grid gap-4 w-full mb-10">
          {PREMIUM_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-6 rounded-[2.5rem] border-2 transition-all text-left flex items-center justify-between ${selectedPlan === plan.id ? (plan.royal ? 'bg-amber-50 border-amber-500 shadow-2xl' : 'bg-white border-indigo-500 shadow-2xl') : 'bg-white/5 border-white/10'}`}
            >
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Most Popular</div>}
              {plan.royal && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">ELITE OFFLINE</div>}
              
              <div>
                <h3 className={`font-black uppercase text-[10px] tracking-wider mb-1 ${selectedPlan === plan.id ? (plan.royal ? 'text-amber-600' : 'text-indigo-600') : 'text-slate-400'}`}>{plan.label}</h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black ${selectedPlan === plan.id ? 'text-black' : 'text-white'}`}>{currency === 'USD' ? plan.usd : plan.eur}</span>
                  <span className={`text-[10px] font-bold ${selectedPlan === plan.id ? 'text-slate-400' : 'text-slate-500'}`}>/ {plan.billing}</span>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? (plan.royal ? 'border-amber-600 bg-amber-600' : 'border-indigo-600 bg-indigo-600') : 'border-white/20'}`}>
                {selectedPlan === plan.id && <CheckCircle2 size={16} className="text-white" />}
              </div>
            </button>
          ))}
        </div>

        {/* Vertical Feature Explorer */}
        <div className="w-full relative mb-12">
          <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 text-white/10 animate-pulse"><ChevronUp size={20} /></div>
          
          <div 
            ref={featureListRef}
            className="h-40 overflow-y-auto no-scrollbar space-y-4 px-2 scroll-smooth border-y border-white/5 py-4"
          >
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                  {React.cloneElement(f.icon as React.ReactElement<any>, { size: 18 })}
                </div>
                <span className="text-xs font-bold text-slate-300">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-[-25px] left-1/2 -translate-x-1/2 text-white/20 animate-bounce cursor-pointer" onClick={() => scrollFeatures('down')}>
            <ChevronDown size={20} />
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => onPurchase(PREMIUM_PLANS.find(p => p.id === selectedPlan)?.royal)}
          className={`w-full py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all ${PREMIUM_PLANS.find(p => p.id === selectedPlan)?.royal ? 'bg-amber-500 text-white' : 'bg-white text-black'}`}
        >
          ACTIVATE {PREMIUM_PLANS.find(p => p.id === selectedPlan)?.royal ? 'ROYAL' : 'ULTRA'} <Zap size={20} className="fill-current" />
        </button>
        
        <p className="mt-8 text-[8px] text-slate-600 font-bold uppercase tracking-widest text-center leading-relaxed">
          SECURE 256-BIT ENCRYPTION • CANCEL ANYTIME<br/>
          RESTORE PURCHASE • TERMS OF SERVICE
        </p>
      </div>
    </div>
  );
};

export default PremiumSelection;
