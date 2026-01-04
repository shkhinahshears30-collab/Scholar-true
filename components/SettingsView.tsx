import React, { useState } from 'react';
import { 
  X, User, Shield, Bell, CreditCard, ChevronRight, Crown, Zap, 
  Settings as SettingsIcon, LogOut, CheckCircle2, DollarSign,
  Globe, Moon, Smartphone, Lock, ShieldCheck, ChevronDown, Scale, FileText, WifiOff, Link, ChevronLeft
} from 'lucide-react';
import { UserSettings, AppRoute } from '../types';
import { PREMIUM_PLANS, LANG_OPTIONS } from '../constants';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdate: (data: Partial<UserSettings>) => void;
  onClose: () => void;
  onNavigate?: (route: AppRoute) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate, onClose, onNavigate }) => {
  const [activeSection, setActiveSection] = useState<'main' | 'billing' | 'legal'>('main');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms'>('privacy');

  const paymentMethods = [
    { id: 'paypal', name: 'PayPal', color: 'bg-blue-500', textColor: 'text-white' },
    { id: 'googlepay', name: 'Google Pay', color: 'bg-slate-900', textColor: 'text-white' }
  ];

  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`w-10 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${active ? 'left-5' : 'left-1'}`} />
    </button>
  );

  const renderPaymentLogos = () => (
    <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
      {paymentMethods.map(pm => (
        <div key={pm.id} className={`${pm.color} ${pm.textColor} px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm`}>
          {pm.name}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[60] flex flex-col animate-in slide-in-from-right duration-500 ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      {/* Header */}
      <div className={`p-6 border-b flex items-center justify-between shrink-0 ${settings.darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className={`p-3 rounded-2xl ${settings.darkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-400'}`}><ChevronLeft size={20} /></button>
          <div className="p-3 bg-slate-900 text-white rounded-2xl">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Control Center</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scholar Preferences</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {activeSection === 'main' ? (
          <>
            {/* Profile Summary */}
            <div className={`p-6 rounded-[2.5rem] border shadow-sm flex items-center gap-4 ${settings.darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
              <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-3xl shadow-lg">
                {settings.profilePic}
              </div>
              <div className="flex-1">
                <h2 className={`text-lg font-black ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}>{settings.userName}</h2>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${settings.isRoyal ? 'bg-amber-400 text-white' : settings.isPremium ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                    {settings.isRoyal ? 'Royal Scholar' : settings.isPremium ? 'Ultra Member' : 'Standard Tier'}
                  </span>
                </div>
              </div>
              <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Ultra Premium Card */}
            <div className={`rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl ${settings.isPremium || settings.isRoyal ? 'bg-slate-900' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
              <Crown className="text-amber-400 mb-4" size={32} />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">
                {settings.isPremium || settings.isRoyal ? 'Ultra Active' : 'Go Ultra Scholar'}
              </h3>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                {settings.isPremium || settings.isRoyal ? 'Manage your subscription and billing methods below.' : 'Unlock 120m sessions, all heroes, and ad-free focus.'}
              </p>
              
              <button 
                onClick={() => setActiveSection('billing')}
                className="w-full bg-white text-slate-900 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                {(settings.isPremium || settings.isRoyal) ? 'Manage Billing' : 'Upgrade Now'} <CreditCard size={14} />
              </button>
            </div>

            {/* Royal Premium Card (Under Ultra) */}
            <div className={`rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl transition-all ${settings.isRoyal ? 'bg-slate-900 border-2 border-amber-400' : 'bg-gradient-to-br from-amber-400 via-amber-200 to-amber-600 border border-amber-500/30'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full"></div>
              <div className="flex items-center gap-2 mb-4">
                 <Crown className="text-amber-800 fill-amber-800" size={32} />
                 <WifiOff className="text-amber-800" size={24} />
              </div>
              <h3 className={`text-2xl font-black italic uppercase tracking-tighter mb-2 ${settings.isRoyal ? 'text-white' : 'text-amber-900'}`}>
                {settings.isRoyal ? 'Royal Active' : 'Go Royal Scholar'}
              </h3>
              <p className={`text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8 ${settings.isRoyal ? 'text-slate-400' : 'text-amber-800/70'}`}>
                {settings.isRoyal ? 'True Offline Mode and full elite access enabled.' : 'Everything in Premium + Full Offline Use. Study anywhere, anytime.'}
              </p>
              
              <button 
                onClick={() => setActiveSection('billing')}
                className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all ${settings.isRoyal ? 'bg-white text-black' : 'bg-amber-900 text-white shadow-amber-900/40'}`}
              >
                {settings.isRoyal ? 'Manage Royal' : 'Activate Royal Tier'} <Zap size={14} fill="currentColor" />
              </button>
            </div>

            {/* Account & Security */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Account & Security</h4>
              <div className={`rounded-[2.5rem] border overflow-hidden shadow-sm ${settings.darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
                
                {/* Stay Logged In Toggle */}
                <div className={`flex items-center justify-between p-5 border-b last:border-0 ${settings.darkMode ? 'border-white/5' : 'border-slate-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${settings.darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-500'}`}>
                      <Lock size={18} />
                    </div>
                    <span className="text-sm font-bold">Stay Logged In</span>
                  </div>
                  <Toggle 
                    active={settings.rememberMe} 
                    onClick={() => onUpdate({ rememberMe: !settings.rememberMe })} 
                  />
                </div>

                {/* Guardian Link Portal */}
                <button 
                  onClick={() => onNavigate?.(AppRoute.GUARDIAN)}
                  className={`w-full flex items-center justify-between p-5 border-b last:border-0 group ${settings.darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${settings.darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                      <Link size={18} />
                    </div>
                    <span className="text-sm font-bold">Guardian Portal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${settings.guardianLinked ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {settings.guardianLinked ? 'Linked' : 'Not Setup'}
                    </span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Preferences */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">App Settings</h4>
              <div className={`rounded-[2.5rem] border overflow-hidden shadow-sm ${settings.darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
                
                {/* Dark Mode Toggle */}
                <div className={`flex items-center justify-between p-5 border-b last:border-0 ${settings.darkMode ? 'border-white/5' : 'border-slate-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${settings.darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-100 text-slate-400'}`}>
                      <Moon size={18} />
                    </div>
                    <span className="text-sm font-bold">Dark Mode</span>
                  </div>
                  <Toggle 
                    active={settings.darkMode} 
                    onClick={() => onUpdate({ darkMode: !settings.darkMode })} 
                  />
                </div>

                {/* Notifications Toggle */}
                <div className={`flex items-center justify-between p-5 border-b last:border-0 ${settings.darkMode ? 'border-white/5' : 'border-slate-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${settings.darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-100 text-slate-400'}`}>
                      <Bell size={18} />
                    </div>
                    <span className="text-sm font-bold">Notifications</span>
                  </div>
                  <Toggle 
                    active={settings.notificationsEnabled} 
                    onClick={() => onUpdate({ notificationsEnabled: !settings.notificationsEnabled })} 
                  />
                </div>

                {/* Language Selector */}
                <div className={`flex items-center justify-between p-5 border-b last:border-0 ${settings.darkMode ? 'border-white/5' : 'border-slate-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${settings.darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-100 text-slate-400'}`}>
                      <Globe size={18} />
                    </div>
                    <span className="text-sm font-bold">Language</span>
                  </div>
                  <button 
                    onClick={() => setShowLanguagePicker(!showLanguagePicker)}
                    className="flex items-center gap-2 group"
                  >
                    <span className="text-[10px] font-black text-indigo-500 uppercase">
                      {LANG_OPTIONS.find(l => l.id === settings.language)?.name || settings.language.toUpperCase()}
                    </span>
                    <ChevronDown size={14} className={`text-slate-300 transition-transform ${showLanguagePicker ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Hidden Language Grid */}
                {showLanguagePicker && (
                  <div className={`p-4 grid grid-cols-2 gap-2 border-b animate-in fade-in duration-300 ${settings.darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-50'}`}>
                    {LANG_OPTIONS.slice(0, 8).map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => { onUpdate({ language: lang.id }); setShowLanguagePicker(false); }}
                        className={`p-3 rounded-xl text-[10px] font-black uppercase text-center transition-all ${settings.language === lang.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-indigo-500'}`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Safety & Legal */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Safety & Legal</h4>
              <div className={`rounded-[2.5rem] border overflow-hidden shadow-sm ${settings.darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
                <button 
                  onClick={() => { setActiveSection('legal'); setLegalDoc('privacy'); }}
                  className={`w-full flex items-center justify-between p-5 border-b last:border-0 group ${settings.darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                      <Shield size={18} />
                    </div>
                    <span className="text-sm font-bold">Privacy Policy</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => { setActiveSection('legal'); setLegalDoc('terms'); }}
                  className={`w-full flex items-center justify-between p-5 border-b last:border-0 group ${settings.darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                      <Scale size={18} />
                    </div>
                    <span className="text-sm font-bold">Terms of Service</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <button className="w-full py-6 flex items-center justify-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
              <LogOut size={16} /> Sign Out
            </button>
          </>
        ) : activeSection === 'billing' ? (
          <div className="animate-in slide-in-from-bottom-4 duration-300 space-y-8">
            <button 
              onClick={() => setActiveSection('main')}
              className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Back to Settings
            </button>

            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tighter mb-2 italic uppercase">Tier Selection</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select your payment route</p>
            </div>

            {/* Payment Gateways */}
            <div className={`p-8 rounded-[3rem] border shadow-xl space-y-6 ${settings.darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Supported Gateways</h4>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map(pm => (
                    <button 
                      key={pm.id}
                      className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all group ${settings.darkMode ? 'border-white/5 hover:border-indigo-500 hover:bg-white/5' : 'border-slate-100 hover:border-indigo-500 hover:bg-indigo-50'}`}
                    >
                      <div className={`p-3 rounded-2xl ${pm.color} text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                        <CreditCard size={20} />
                      </div>
                      <span className={`text-[10px] font-black uppercase ${settings.darkMode ? 'text-white/70' : 'text-slate-800'}`}>{pm.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-[2rem] border text-center ${settings.darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex justify-center mb-2">
                  <ShieldCheck className="text-emerald-500" size={24} />
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">
                  All transactions are handled through secure, encrypted tunnels powered by our trusted payment partners.
                </p>
              </div>
            </div>

            {/* Plans List */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Current Plans</h4>
              {PREMIUM_PLANS.map(plan => (
                <div key={plan.id} className={`p-6 rounded-[2.5rem] border shadow-sm flex items-center justify-between group ${plan.royal ? 'border-amber-400 bg-amber-50/50' : settings.darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
                  <div>
                    <h3 className={`font-black uppercase text-[10px] tracking-widest mb-1 ${plan.royal ? 'text-amber-600' : ''}`}>{plan.label}</h3>
                    <p className={`text-xl font-black ${plan.royal ? 'text-amber-700' : 'text-indigo-600'}`}>{plan.usd} <span className="text-[10px] text-slate-400 font-bold uppercase">/ {plan.billing}</span></p>
                    {plan.royal && <p className="text-[8px] font-black text-amber-500 uppercase mt-1">Includes Offline Mode</p>}
                  </div>
                  <button 
                    onClick={() => {
                      if (plan.royal) onUpdate({ isRoyal: true, isPremium: true });
                      else onUpdate({ isPremium: true, isRoyal: false });
                      setActiveSection('main');
                    }}
                    className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all ${plan.royal ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'}`}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>

            {renderPaymentLogos()}
          </div>
        ) : (
          /* LEGAL SECTION */
          <div className="animate-in slide-in-from-bottom-4 duration-300 space-y-6">
             <button 
              onClick={() => setActiveSection('main')}
              className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Back to Settings
            </button>

            <div className="flex gap-2">
              <button 
                onClick={() => setLegalDoc('privacy')}
                className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border transition-all ${legalDoc === 'privacy' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 border-slate-200'}`}
              >
                Privacy
              </button>
              <button 
                onClick={() => setLegalDoc('terms')}
                className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border transition-all ${legalDoc === 'terms' ? 'bg-rose-600 border-rose-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 border-slate-200'}`}
              >
                Terms
              </button>
            </div>

            <div className={`p-8 rounded-[3rem] border min-h-[50vh] ${settings.darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
               <h3 className="text-2xl font-black italic uppercase mb-6 flex items-center gap-3 tracking-tighter">
                 {legalDoc === 'privacy' ? <Shield className="text-indigo-600" /> : <Scale className="text-rose-600" />}
                 {legalDoc === 'privacy' ? 'Privacy Hub' : 'Usage Terms'}
               </h3>
               
               <div className="text-[11px] font-medium leading-relaxed space-y-6 text-slate-500">
                  {legalDoc === 'privacy' ? (
                    <>
                      <p>At Scholar, your privacy is literally built into the code. Since we use local device storage for all study materials, we never see your homework.</p>
                      <section>
                        <h4 className="text-indigo-600 font-black uppercase mb-1">Device Sovereignty</h4>
                        <p>Your device is your vault. We do not sell, rent, or trade student data. Your focus history stays offline unless you explicitly share a Guardian Sync link.</p>
                      </section>
                      <section>
                        <h4 className="text-indigo-600 font-black uppercase mb-1">Guardian Link Safety</h4>
                        <p>Sync links are uniquely generated and can be revoked at any time. Guardians only see high-level metrics to ensure accountability without surveillance.</p>
                      </section>
                    </>
                  ) : (
                    <>
                      <p>By using Scholar, you agree to become the best version of yourself through consistent, focused study.</p>
                      <section>
                        <h4 className="text-rose-600 font-black uppercase mb-1">Acceptable Use</h4>
                        <p>The Literacy AI and Tutor Hero features are for educational support. Do not use these tools to cheat or generate prohibited content.</p>
                      </section>
                      <section>
                        <h4 className="text-rose-600 font-black uppercase mb-1">No Guarantee</h4>
                        <p>While Scholar provides the tools for focus, success ultimately depends on your own effort and dedication!</p>
                      </section>
                    </>
                  )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;