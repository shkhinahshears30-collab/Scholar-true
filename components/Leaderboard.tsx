
import React from 'react';
import { Trophy, Medal, MapPin, Search, Users, Zap } from 'lucide-react';

interface LeaderboardProps {
  currentUser: {
    name: string;
    pic: string;
    focusTime: number;
  };
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  // Simulated Nationwide data
  const competitors = [
    { id: '1', name: 'FocusMaster_99', pic: '🔥', score: 12450, city: 'New York' },
    { id: '2', name: 'StudyBeast', pic: '⚡', score: 11200, city: 'Los Angeles' },
    { id: '3', name: 'ScholarAnya', pic: '🌟', score: 10850, city: 'Chicago' },
    { id: '4', name: 'DeepWorkGuru', pic: '🧘', score: 9400, city: 'Houston' },
    { id: '5', name: 'Brainiac7', pic: '🧠', score: 8100, city: 'Phoenix' },
    { id: '6', name: 'UniversityPro', pic: '🚀', score: 7200, city: 'Philadelphia' },
  ];

  // Insert current user into the list and sort
  const allEntries = [
    ...competitors,
    { id: 'me', name: currentUser.name || 'You', pic: currentUser.pic || '🎓', score: currentUser.focusTime, city: 'Local' }
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="p-6 pb-24 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg animate-pulse">
          <Trophy size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter">Nationwide Rank</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compete with the best</p>
        </div>
      </div>

      {/* Top 3 Visual */}
      <div className="flex items-end justify-center gap-2 mb-10 h-48 pt-10">
        {/* Silver */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-3xl border-4 border-slate-300 relative">
            {allEntries[1].pic}
            <div className="absolute -top-3 bg-slate-400 text-white text-[8px] px-2 py-0.5 rounded-full font-black">2ND</div>
          </div>
          <div className="h-20 w-16 bg-gradient-to-t from-slate-100 to-slate-200 mt-2 rounded-t-xl flex items-center justify-center">
             <span className="text-slate-500 font-black text-xs">#2</span>
          </div>
        </div>
        
        {/* Gold */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-4xl border-4 border-amber-300 relative shadow-xl shadow-amber-200">
            {allEntries[0].pic}
            <div className="absolute -top-4 bg-amber-500 text-white text-[10px] px-3 py-1 rounded-full font-black animate-bounce">TOP 1</div>
          </div>
          <div className="h-28 w-20 bg-gradient-to-t from-amber-200 to-amber-300 mt-2 rounded-t-xl flex items-center justify-center">
             <Trophy className="text-amber-600" size={24} />
          </div>
        </div>

        {/* Bronze */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl border-4 border-orange-300 relative">
            {allEntries[2].pic}
            <div className="absolute -top-3 bg-orange-400 text-white text-[8px] px-2 py-0.5 rounded-full font-black">3RD</div>
          </div>
          <div className="h-16 w-16 bg-gradient-to-t from-orange-100 to-orange-200 mt-2 rounded-t-xl flex items-center justify-center">
             <span className="text-orange-500 font-black text-xs">#3</span>
          </div>
        </div>
      </div>

      {/* Search/Filter Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
        <input 
          placeholder="Search scholars..." 
          className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-800"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {allEntries.map((entry, index) => {
          const isMe = entry.id === 'me';
          return (
            <div 
              key={entry.id} 
              className={`p-4 rounded-[2rem] border flex items-center justify-between transition-all ${
                isMe ? 'bg-indigo-600 border-indigo-500 text-white scale-[1.02] shadow-xl' : 'bg-white border-slate-100 text-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-xs font-black w-4 ${isMe ? 'text-white/50' : 'text-slate-300'}`}>#{index + 1}</span>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100">
                  {entry.pic}
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">{entry.name}</h3>
                  <div className="flex items-center gap-1">
                    <MapPin size={10} className={isMe ? 'text-indigo-200' : 'text-slate-300'} />
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {entry.city}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <span className="font-black text-sm tabular-nums">{entry.score.toLocaleString()}</span>
                  <Zap size={12} className={isMe ? 'text-white' : 'text-indigo-500'} />
                </div>
                <p className={`text-[8px] font-black uppercase tracking-widest ${isMe ? 'text-white/40' : 'text-slate-300'}`}>Focus Minutes</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
