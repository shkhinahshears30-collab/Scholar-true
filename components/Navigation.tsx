
import React from 'react';
import { LayoutDashboard, Settings, BrainCircuit, CalendarDays, Trophy } from 'lucide-react';
import { AppRoute } from '../types';
import { getTranslation } from '../services/i18n';

interface NavigationProps {
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
  language: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentRoute, setRoute, language }) => {
  const t = (key: string) => getTranslation(language, key);

  const navItems = [
    { route: AppRoute.DASHBOARD, icon: <LayoutDashboard />, label: t('nav_home') },
    { route: AppRoute.FLASHCARDS, icon: <BrainCircuit />, label: t('nav_study') },
    { route: AppRoute.LEADERBOARD, icon: <Trophy />, label: t('nav_rank') },
    { route: AppRoute.PLANNER, icon: <CalendarDays />, label: t('nav_plan') },
    { route: AppRoute.SETTINGS, icon: <Settings />, label: t('nav_settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-around items-center h-20 pb-4 px-4 z-40">
      {navItems.map((item) => (
        <button
          key={item.route}
          onClick={() => setRoute(item.route)}
          className={`flex flex-col items-center transition-all duration-300 w-16 ${
            currentRoute === item.route ? 'text-indigo-600 scale-110' : 'text-slate-400'
          }`}
        >
          <div className={`p-2 rounded-2xl ${currentRoute === item.route ? 'bg-indigo-50' : 'bg-transparent'}`}>
            {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24 })}
          </div>
          <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
