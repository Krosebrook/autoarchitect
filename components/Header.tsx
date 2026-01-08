
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  activeView: AppView;
}

const Header: React.FC<HeaderProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case AppView.GENERATOR: return 'Automation Generator';
      case AppView.CHATBOT: return 'Advisor AI';
      case AppView.IMAGE_ANALYSIS: return 'Vision Extract';
      case AppView.TTS: return 'Voice Lab';
      case AppView.LIVE_CONSULTANT: return 'Live Architect';
      case AppView.LOGIC_SANDBOX: return 'Logic Sandbox';
      case AppView.AUDIT: return 'Audit Hub';
      case AppView.DEPLOYMENT: return 'Deployment Hub';
      case AppView.ANALYTICS: return 'System Analytics';
      case AppView.VAULT: return 'Logic Vault';
      case AppView.COMPARATOR: return 'Platform Benchmarker';
      case AppView.TERMINAL: return 'API Terminal';
      case AppView.PROFILE: return 'Account Profile';
      default: return 'Architect Console';
    }
  };

  const getSubtitle = () => {
    switch (activeView) {
      case AppView.GENERATOR: return 'Synthesize production-grade automation blueprints.';
      case AppView.CHATBOT: return 'Fine-tuned Gemini intelligence for API strategy.';
      case AppView.IMAGE_ANALYSIS: return 'Reverse-engineer workflows from visual UI documentation.';
      case AppView.TTS: return 'Generate high-fidelity audio instructions for procedures.';
      case AppView.LIVE_CONSULTANT: return 'Low-latency native audio brainstorming session.';
      case AppView.LOGIC_SANDBOX: return 'Stress-test logical branches in a dry-run kernel.';
      case AppView.AUDIT: return 'Security analysis and estimated monthly ROI / Cost.';
      case AppView.DEPLOYMENT: return 'Configure secrets and export production-ready assets.';
      case AppView.ANALYTICS: return 'Visualize ecosystem distribution and node efficiency.';
      case AppView.VAULT: return 'Local persistent storage for architectural artifacts.';
      case AppView.COMPARATOR: return 'Deep-dive comparison across automation platforms.';
      case AppView.TERMINAL: return 'Direct low-level model execution environment.';
      case AppView.PROFILE: return 'Manage identity and system-wide preferences.';
      default: return '';
    }
  };

  return (
    <div className="flex items-center justify-between flex-1">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          {getTitle()}
          <span className="text-[9px] bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Active</span>
        </h1>
        <p className="text-xs text-slate-500 font-semibold hidden sm:block uppercase tracking-widest mt-0.5 opacity-70">{getSubtitle()}</p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
           <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] leading-none">Protocol v3.0</span>
           <span className="text-[8px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest mt-1">Multi-Agent Synthesis Engine</span>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/5 shadow-inner group cursor-default">
           <div className="relative">
             <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse-soft" />
             <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
           </div>
           <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ready</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
