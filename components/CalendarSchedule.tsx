import React, { useState } from 'react';
import { CalendarDays, Plus, Clock, Trash2, X, ChevronLeft, ChevronRight, BookOpen, Coffee, AlertTriangle } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarScheduleProps {
  events: CalendarEvent[];
  language: string;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
  onClose?: () => void;
}

const CalendarSchedule: React.FC<CalendarScheduleProps> = ({ events, language, onAddEvent, onDeleteEvent, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newCategory, setNewCategory] = useState<CalendarEvent['category']>('study');

  const dateStr = selectedDate.toISOString().split('T')[0];
  const dayEvents = events
    .filter(e => e.date === dateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(selectedDate);
    const day = d.getDay();
    const diff = d.getDate() - day + i;
    return new Date(d.setDate(diff));
  });

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddEvent({
      title: newTitle,
      startTime: newTime,
      duration: 60,
      date: dateStr,
      category: newCategory
    });
    setNewTitle('');
    setIsAdding(false);
  };

  const categories = [
    { id: 'study', icon: <BookOpen size={14} />, label: 'Study', color: 'bg-indigo-500' },
    { id: 'break', icon: <Coffee size={14} />, label: 'Break', color: 'bg-emerald-500' },
    { id: 'exam', icon: <AlertTriangle size={14} />, label: 'Exam', color: 'bg-red-500' },
    { id: 'other', icon: <CalendarDays size={14} />, label: 'Other', color: 'bg-slate-500' },
  ];

  return (
    <div className="p-6 pb-24 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg">
            <CalendarDays size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Planner</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organize your time</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Week Selector */}
      <div className="flex justify-between items-center bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
        {weekDates.map((date, i) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center py-4 px-3 rounded-[1.5rem] transition-all ${
                isSelected ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] font-black uppercase mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}</span>
              <span className="text-sm font-black">{date.getDate()}</span>
            </button>
          );
        })}
      </div>

      {/* Agenda */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Today's Agenda</h2>
          <span className="text-[10px] font-black text-slate-300">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
        </div>

        {dayEvents.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-12 flex flex-col items-center justify-center opacity-50">
            <CalendarDays size={48} className="text-slate-300 mb-4" />
            <p className="font-bold text-slate-400">No events scheduled</p>
            <button onClick={() => setIsAdding(true)} className="mt-2 text-xs font-black text-indigo-500 uppercase tracking-widest">Tap to add</button>
          </div>
        ) : (
          dayEvents.map(event => (
            <div key={event.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group animate-in slide-in-from-right-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${categories.find(c => c.id === event.category)?.color || 'bg-slate-400'}`}>
                  {categories.find(c => c.id === event.category)?.icon}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 leading-tight">{event.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={12} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.startTime} • {event.duration}m</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onDeleteEvent(event.id)}
                className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Event Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black tracking-tighter">New Task</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 bg-slate-50 rounded-full text-slate-400"><X size={20} /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-2">Title</label>
                  <input 
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Deep Study Session..."
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-2">Start Time</label>
                    <input 
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-2">Type</label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                    >
                      <option value="study">Study</option>
                      <option value="break">Break</option>
                      <option value="exam">Exam</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleAdd}
                  className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black shadow-xl hover:bg-slate-800 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSchedule;