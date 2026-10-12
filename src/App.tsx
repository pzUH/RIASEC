/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ActiveView, AssessmentResult, LikertValue } from './types/riasec';
import {
  calculateRiasecResult,
  getLastResultFromStorage,
  getHistoryFromStorage,
  saveResultToStorage,
  clearHistoryFromStorage,
  deleteResultFromStorage
} from './utils/riasecCalculator';
import { isAdminSessionActive } from './utils/adminAuth';
import { TopNavbar, BottomNavbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { TestView } from './components/TestView';
import { ResultView } from './components/ResultView';
import { HistoryView } from './components/HistoryView';
import { AboutView } from './components/AboutView';
import { AdminView } from './components/AdminView';
import { RegistrationModal } from './components/RegistrationModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Compass, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [activeUser, setActiveUser] = useState<{ name: string; age: number }>({
    name: '',
    age: 21
  });
  const [testSessionId, setTestSessionId] = useState<number>(() => Date.now());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [preloaderDone, setPreloaderDone] = useState<boolean>(false);

  // Initialize from LocalStorage and run preloader animation
  useEffect(() => {
    const lastRes = getLastResultFromStorage();
    if (lastRes) {
      setCurrentResult(lastRes);
      setActiveUser({ name: lastRes.userName, age: lastRes.userAge });
    }

    const savedHistory = getHistoryFromStorage();
    setHistory(savedHistory);

    // Initial preloader duration
    const timer = setTimeout(() => {
      setPreloaderDone(true);
    }, 750);

    return () => clearTimeout(timer);
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStartTestClick = () => {
    setTestSessionId(Date.now());
    setIsRegisterOpen(true);
  };

  const handleRegistrationSubmit = (name: string, age: number) => {
    setActiveUser({ name, age });
    setIsRegisterOpen(false);
    setCurrentView('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishTest = (answers: Record<number, LikertValue>) => {
    const newResult = calculateRiasecResult(activeUser.name, activeUser.age, answers);
    saveResultToStorage(newResult);
    setCurrentResult(newResult);
    setHistory(getHistoryFromStorage());
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('success', `Tes selesai! Holland Code Anda: ${newResult.topCode}`);
  };

  const handleClearHistory = () => {
    clearHistoryFromStorage();
    setHistory([]);
    setCurrentResult(null);
  };

  const handleDeleteSingleResult = (id: string) => {
    deleteResultFromStorage(id);
    const updated = getHistoryFromStorage();
    setHistory(updated);
    if (currentResult && currentResult.id === id) {
      setCurrentResult(updated[0] || null);
    }
  };

  const handleSelectHistoryItem = (res: AssessmentResult) => {
    setCurrentResult(res);
    setActiveUser({ name: res.userName, age: res.userAge });
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: ActiveView) => {
    if (view === 'test') {
      handleStartTestClick();
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Preloader with pulse glow animation */}
      {!preloaderDone && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090D16] transition-opacity duration-500">
          <div className="relative flex items-center justify-center">
            {/* Concentric pulsing glow rings */}
            <div className="absolute w-36 h-36 rounded-full bg-indigo-500/20 blur-xl animate-ping" />
            <div className="absolute w-28 h-28 rounded-full bg-cyan-500/30 blur-lg animate-pulse" />

            <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-2xl shadow-indigo-500/50 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Compass className="w-10 h-10 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="text-lg font-black tracking-wider text-white flex items-center justify-center gap-1.5">
              <span>RIASEC EXPLORER</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs text-slate-400 mt-1 tracking-wide">
              Menyiapkan Matriks Tipologi Holland...
            </p>
          </div>
        </div>
      )}

      {/* Ambient Atmospheric Glowing Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-[120px] animate-orb-1" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-cyan-600/15 blur-[130px] animate-orb-2" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-pink-600/15 blur-[140px] animate-orb-3" />
      </div>

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Registration Modal Dialog */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onStart={handleRegistrationSubmit}
        defaultName={activeUser.name}
        defaultAge={activeUser.age}
      />

      {/* Top Header Navbar */}
      <TopNavbar
        currentView={currentView}
        onNavigate={handleNavigate}
        hasActiveResult={!!currentResult}
        isAdmin={isAdminSessionActive()}
      />

      {/* Main Content Modules (SPA View Switching via showView logic) */}
      <main className={`relative z-10 flex-1 ${currentView === 'test' ? 'overflow-hidden flex flex-col' : ''}`}>
        {/* VIEW: HOME */}
        <div className={`transition-opacity duration-300 ${currentView === 'home' ? 'block' : 'hidden'}`}>
          <HomeView
            lastResult={currentResult}
            onStartTest={handleStartTestClick}
            onViewResult={() => setCurrentView('result')}
            onOpenAbout={() => setCurrentView('about')}
          />
        </div>

        {/* VIEW: TEST ENGINE */}
        <div className={`transition-opacity duration-300 ${currentView === 'test' ? 'block' : 'hidden'}`}>
          {currentView === 'test' && (
            <TestView
              key={testSessionId}
              userName={activeUser.name || 'Peserta'}
              userAge={activeUser.age || 20}
              onFinish={handleFinishTest}
              onCancel={() => setCurrentView('home')}
            />
          )}
        </div>

        {/* VIEW: RESULT & ANALYTICS */}
        <div className={`transition-opacity duration-300 ${currentView === 'result' ? 'block' : 'hidden'}`}>
          {currentResult ? (
            <ResultView
              result={currentResult}
              onRetake={handleStartTestClick}
              onShowToast={addToast}
            />
          ) : (
            <div className="max-w-md mx-auto p-8 text-center mt-12 glass-panel rounded-3xl">
              <p className="text-sm text-slate-300 mb-4">
                Belum ada data hasil tes aktif. Silakan lakukan tes terlebih dahulu.
              </p>
              <button
                onClick={handleStartTestClick}
                className="px-6 py-2.5 rounded-xl glass-button-primary text-white text-xs font-bold"
              >
                Mulai Tes Sekarang
              </button>
            </div>
          )}
        </div>

        {/* VIEW: HISTORY */}
        <div className={`transition-opacity duration-300 ${currentView === 'history' ? 'block' : 'hidden'}`}>
          <HistoryView
            history={history}
            onSelectResult={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
            onStartNewTest={handleStartTestClick}
            onShowToast={addToast}
          />
        </div>

        {/* VIEW: ABOUT & THEORY */}
        <div className={`transition-opacity duration-300 ${currentView === 'about' ? 'block' : 'hidden'}`}>
          <AboutView onStartTest={handleStartTestClick} />
        </div>

        {/* VIEW: ADMIN PORTAL */}
        <div className={`transition-opacity duration-300 ${currentView === 'admin' ? 'block' : 'hidden'}`}>
          {currentView === 'admin' && (
            <AdminView
              history={history}
              onSelectResult={handleSelectHistoryItem}
              onDeleteSingle={handleDeleteSingleResult}
              onClearAll={handleClearHistory}
              onShowToast={addToast}
            />
          )}
        </div>
      </main>

      {/* Mobile-First Fixed Bottom Navigation Bar (Disembunyikan saat sedang tes aktif agar tampilan 100% pas di layar) */}
      {currentView !== 'test' && (
        <BottomNavbar
          currentView={currentView}
          onNavigate={handleNavigate}
          hasActiveResult={!!currentResult}
        />
      )}
    </div>
  );
}
