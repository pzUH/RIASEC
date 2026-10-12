import React from 'react';
import { ActiveView } from '../types/riasec';
import { Compass, Sparkles, Home, PlayCircle, History, BookOpen, Award, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  hasActiveResult: boolean;
  isAdmin?: boolean;
}

export const TopNavbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isAdmin }) => {
  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 bg-[#090D16]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                RIASEC Explorer
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
              Holland Career Personality Assessment
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Admin Portal Button */}
          <button
            onClick={() => onNavigate('admin')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'admin'
                ? 'bg-indigo-600/30 border-indigo-400 text-cyan-300'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
            title="Halaman Admin"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isAdmin ? 'text-emerald-400' : 'text-indigo-400'}`} />
            <span className="hidden sm:inline">Admin</span>
          </button>

          <button
            onClick={() => onNavigate('test')}
            className="px-3.5 py-1.5 rounded-xl glass-button-primary text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Mulai Tes</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export const BottomNavbar: React.FC<NavbarProps> = ({ currentView, onNavigate, hasActiveResult }) => {
  const navItems = [
    {
      id: 'home' as ActiveView,
      label: 'Beranda',
      icon: Home
    },
    {
      id: 'test' as ActiveView,
      label: 'Mulai Tes',
      icon: PlayCircle
    },
    {
      id: (hasActiveResult ? 'result' : 'history') as ActiveView,
      label: hasActiveResult ? 'Hasil Saya' : 'Riwayat',
      icon: hasActiveResult ? Award : History
    },
    {
      id: 'about' as ActiveView,
      label: 'Teori Holland',
      icon: BookOpen
    }
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md">
      <div className="glass-panel px-3 py-2 rounded-2xl border border-white/20 shadow-2xl flex items-center justify-around bg-slate-900/85 backdrop-blur-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentView === item.id ||
            (item.id === 'result' && currentView === 'history') ||
            (item.id === 'history' && currentView === 'result');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-cyan-300' : ''}`} />
              <span className="text-[10px] font-semibold tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-4 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
