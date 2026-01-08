import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { Sparkles } from 'lucide-react';

export const AuthView: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-500/40">
            <Sparkles size={40} className="text-white" strokeWidth={2.5} />
          </div>
          
          <div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
              AutoArchitect
              <br />
              <span className="text-indigo-600">Enterprise Suite</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
              Design, audit, and deploy production-grade automation workflows with AI-powered intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-3xl font-bold text-indigo-600 mb-1">10+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Platforms Supported</div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-3xl font-bold text-indigo-600 mb-1">AI</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Powered Analysis</div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full flex justify-center">
          {mode === 'login' ? (
            <LoginForm onSwitchToSignup={() => setMode('signup')} />
          ) : (
            <SignupForm onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthView;
