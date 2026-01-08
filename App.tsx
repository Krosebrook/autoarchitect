
import React, { useState, Suspense, useEffect } from 'react';
import { AppView, AutomationResult, UserProfile } from './types';
import { storage } from './services/storageService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AutomationGeneratorView from './views/AutomationGeneratorView';
import ChatbotView from './views/ChatbotView';
import ImageAnalysisView from './views/ImageAnalysisView';
import TTSView from './views/TTSView';
import LiveArchitectView from './views/LiveArchitectView';
import LogicSandboxView from './views/LogicSandboxView';
import AuditView from './views/AuditView';
import DeploymentHubView from './views/DeploymentHubView';
import VaultView from './views/VaultView';
import ComparatorView from './views/ComparatorView';
import TerminalView from './views/TerminalView';
import ProfileView from './views/ProfileView';
import AnalyticsView from './views/AnalyticsView';
import { Loader2, Sparkles, X, ArrowRight, ShieldCheck, Zap, Menu } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.GENERATOR);
  const [activeBlueprint, setActiveBlueprint] = useState<AutomationResult | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize Theme and check for first visit
    const init = async () => {
      const saved = await storage.getProfile();
      if (saved) {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        if (saved.preferences.theme === 'dark' || (saved.preferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          root.classList.add('dark');
        }
      } else {
        setShowWelcome(true);
      }
    };
    init();
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    // Create initial profile
    const defaultProfile: UserProfile = {
      name: 'Lead Architect',
      role: 'Senior Automation Engineer',
      avatarSeed: 'arch_1',
      preferences: {
        theme: 'system',
        defaultPlatform: 'zapier',
        autoAudit: true
      }
    };
    storage.saveProfile(defaultProfile);
    localStorage.setItem('aa_user_profile', JSON.stringify(defaultProfile));
    toast.success("Welcome to AutoArchitect Pro Suite!");
  };

  const handleNavigateWithBlueprint = (view: AppView, blueprint?: AutomationResult) => {
    if (blueprint) setActiveBlueprint(blueprint);
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.GENERATOR: 
        return <AutomationGeneratorView 
          onBlueprintGenerated={(b) => setActiveBlueprint(b)}
          onNavigate={handleNavigateWithBlueprint}
        />;
      case AppView.CHATBOT: return <ChatbotView />;
      case AppView.IMAGE_ANALYSIS: return <ImageAnalysisView />;
      case AppView.TTS: return <TTSView />;
      case AppView.LIVE_CONSULTANT: return <LiveArchitectView />;
      case AppView.LOGIC_SANDBOX: return <LogicSandboxView activeBlueprint={activeBlueprint} />;
      case AppView.AUDIT: return <AuditView activeBlueprint={activeBlueprint} />;
      case AppView.DEPLOYMENT: return <DeploymentHubView activeBlueprint={activeBlueprint} />;
      case AppView.VAULT: return <VaultView onNavigate={handleNavigateWithBlueprint} />;
      case AppView.COMPARATOR: return <ComparatorView />;
      case AppView.TERMINAL: return <TerminalView />;
      case AppView.PROFILE: return <ProfileView />;
      case AppView.ANALYTICS: return <AnalyticsView />;
      default: return <AutomationGeneratorView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFDFF] text-gray-900 overflow-hidden selection:bg-indigo-100 dark:bg-slate-950 dark:text-gray-100 transition-colors duration-500">
      <Toaster position="top-right" expand={true} richColors />
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-[101] lg:static lg:block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar activeView={currentView} onNavigate={handleNavigate} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900 flex items-center justify-between px-6 sm:px-10 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all"
            >
              <Menu size={24} />
            </button>
            <Header activeView={currentView} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-12 custom-scrollbar bg-slate-50/30 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto h-full relative">
            <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>}>
              {renderView()}
            </Suspense>
          </div>
        </main>
        
        {showWelcome && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[4rem] border border-white/10 shadow-[0_0_120px_rgba(79,70,229,0.3)] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="p-12 sm:p-16 space-y-10 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40">
                    <Sparkles size={40} strokeWidth={2.5} />
                  </div>
                  <button onClick={dismissWelcome} className="p-4 text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Welcome to the<br />
                    <span className="text-indigo-600">Architect Suite</span>
                  </h2>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-md">
                    Enterprise-grade AI orchestration for designing, auditing, and deploying multi-agent workflows.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Local Vault Protection</span>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <Zap size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Native Gemini Engine</span>
                  </div>
                </div>

                <button 
                  onClick={dismissWelcome}
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
                >
                  Initialize Workspace <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="px-10 py-3 border-t border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] hidden sm:flex shrink-0">
          <div className="flex items-center gap-4"><span>AutoArchitect Enterprise v2.5</span><div className="h-3 w-[1px] bg-gray-200 dark:bg-gray-700" /><span className="text-indigo-500">Gemini 3 Pro Cluster</span></div>
          <div className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Engine: Nominal</div>
        </footer>
      </div>
    </div>
  );
};

export default App;
