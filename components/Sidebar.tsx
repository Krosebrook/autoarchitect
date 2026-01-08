
import React from 'react';
import { AppView } from '../types';
import { 
  Workflow, 
  MessageCircle, 
  Eye, 
  Mic2, 
  Layers,
  Radio,
  FlaskConical,
  ChevronRight,
  ShieldAlert,
  Rocket,
  Library,
  Scale,
  BarChart3,
  Terminal,
  UserCircle
} from 'lucide-react';

interface SidebarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const sections = [
    {
      title: 'Design',
      items: [
        { id: AppView.GENERATOR, label: 'Blueprint Gen', icon: Workflow, color: 'text-blue-500' },
        { id: AppView.IMAGE_ANALYSIS, label: 'Vision Extract', icon: Eye, color: 'text-emerald-500' },
        { id: AppView.TTS, label: 'Voice Lab', icon: Mic2, color: 'text-orange-500' },
      ]
    },
    {
      title: 'Explore',
      items: [
        { id: AppView.COMPARATOR, label: 'Benchmarker', icon: Scale, color: 'text-emerald-600' },
        { id: AppView.CHATBOT, label: 'Advisor AI', icon: MessageCircle, color: 'text-purple-500' },
        { id: AppView.LIVE_CONSULTANT, label: 'Live Architect', icon: Radio, color: 'text-indigo-500' },
      ]
    },
    {
      title: 'Verify',
      items: [
        { id: AppView.AUDIT, label: 'Audit Hub', icon: ShieldAlert, color: 'text-orange-500' },
        { id: AppView.LOGIC_SANDBOX, label: 'Logic Sandbox', icon: FlaskConical, color: 'text-pink-500' },
        { id: AppView.TERMINAL, label: 'API Terminal', icon: Terminal, color: 'text-slate-700' },
      ]
    },
    {
      title: 'Manage',
      items: [
        { id: AppView.VAULT, label: 'Blueprint Vault', icon: Library, color: 'text-indigo-600' },
        { id: AppView.ANALYTICS, label: 'Analytics', icon: BarChart3, color: 'text-blue-600' },
        { id: AppView.DEPLOYMENT, label: 'Deploy & Export', icon: Rocket, color: 'text-indigo-600' },
      ]
    },
    {
      title: 'Account',
      items: [
        { id: AppView.PROFILE, label: 'User Profile', icon: UserCircle, color: 'text-slate-500' },
      ]
    }
  ];

  return (
    <aside className="w-20 lg:w-72 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-900 flex flex-col h-full z-20 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)] transition-colors duration-500">
      <div className="p-8 flex items-center gap-4">
        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none text-white transform hover:rotate-6 transition-transform">
          <Layers size={22} strokeWidth={2.5} />
        </div>
        <div className="lg:block overflow-hidden">
          <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight leading-none">AutoArchitect</h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 block">Pro Suite 2.5</span>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-8 overflow-y-auto custom-scrollbar pb-10">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-4 text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] mb-4">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative ${
                      isActive 
                        ? 'bg-indigo-50/80 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                      <Icon size={18} className={isActive ? item.color : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                    </div>
                    <span className="font-bold text-xs group-hover:translate-x-1 transition-transform">
                      {item.label}
                    </span>
                    
                    <div className="ml-auto">
                       <ChevronRight size={12} className="text-indigo-400" />
                    </div>

                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-5 hidden lg:block border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Architect Pulse</p>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[85%] rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">85% Cap</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
