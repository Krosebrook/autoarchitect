
import React, { useState, useMemo } from 'react';
import { generateAutomation, generateWorkflowDocs } from '../services/geminiService';
import { AutomationResult, Platform, AsyncState, AutomationStep, AppView, SavedBlueprint, WorkflowDocumentation } from '../types';
import { Card } from '../components/ui/Card';
import { db } from '../services/storageService';
import { toast } from 'sonner';
import { 
  Loader2, 
  CheckCircle2, 
  X,
  Zap,
  Layers,
  Rocket,
  Save,
  FileText
} from 'lucide-react';

interface PlatformConfig {
  id: Platform;
  label: string;
  tagline: string;
  logo: string;
  brandIcon: string;
  color: string;
  tooltip: string;
  tier: string;
}

const PLATFORMS: PlatformConfig[] = [
  { id: 'openai', label: 'OpenAI', tagline: 'Intelligence Hub', logo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400&h=250', brandIcon: 'https://logo.clearbit.com/openai.com', color: 'bg-[#10a37f]', tier: 'Tier-1 AI', tooltip: 'Neural integration with GPT-4o and Assistants API for advanced cognitive reasoning.' },
  { id: 'anthropic', label: 'Anthropic', tagline: 'Safe Reasoning', logo: 'https://images.unsplash.com/photo-1620712943543-bcc4628c71d5?auto=format&fit=crop&q=80&w=400&h=250', brandIcon: 'https://logo.clearbit.com/anthropic.com', color: 'bg-[#cc9b7a]', tier: 'Enterprise AI', tooltip: 'High-trust logic using Claude-3 models for specialized document processing.' },
  { id: 'langchain', label: 'LangChain', tagline: 'Agent Framework', logo: 'https://images.unsplash.com/photo-1677442135121-6b199920b784?auto=format&fit=crop&q=80&w=400&h=250', brandIcon: 'https://avatars.githubusercontent.com/u/126733545?s=200&v=4', color: 'bg-[#00A67E]', tier: 'AI-Native', tooltip: 'Orchestration framework for chaining large language models with external toolsets.' },
  { id: 'zapier', label: 'Zapier', tagline: 'Universal Bridge', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=250', brandIcon: 'https://logo.clearbit.com/zapier.com', color: 'bg-[#FF4A00]', tier: 'Essential', tooltip: 'Zero-code platform connecting over 6,000 enterprise and consumer SaaS applications.' },
  { id: 'make', label: 'Make', tagline: 'Visual Canvas', logo: 'https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&q=80&w=400&h=250', brandIcon: 'https://logo.clearbit.com/make.com', color: 'bg-[#8A2BE2]', tier: 'Pro-Visual', tooltip: 'Advanced visual automation builder for complex data transformation and logic loops.' },
  { id: 'n8n', label: 'n8n.io', tagline: 'Self-Hosted Flow', logo: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400&h=250', brandIcon: 'https://logo.clearbit.com/n8n.io', color: 'bg-[#FF6D5A]', tier: 'Fair-Code', tooltip: 'Open-source nodes providing full data sovereignty and extensive custom code support.' },
  { id: 'shopify', label: 'Shopify', tagline: 'Commerce Engine', logo: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=400&h=250', brandIcon: 'https://logo.clearbit.com/shopify.com', color: 'bg-[#95BF47]', tier: 'Retail', tooltip: 'Automate commerce operations, inventory synchronization, and customer fulfillment.' },
  { id: 'google-sheets', label: 'Sheets', tagline: 'Data Bridge', logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400&h=250', brandIcon: 'https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png', color: 'bg-[#0F9D58]', tier: 'Hybrid', tooltip: 'Cloud-based spreadsheet infrastructure as a universal data collection and reporting node.' },
  { id: 'airtable', label: 'Airtable', tagline: 'Cloud DB', logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400&h=250', brandIcon: 'https://logo.clearbit.com/airtable.com', color: 'bg-[#18BFFF]', tier: 'Relational', tooltip: 'Hybrid database-spreadsheet for structured data modeling and internal tool development.' },
  { id: 'pipedream', label: 'Pipedream', tagline: 'Dev Workflows', logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=400&h=250', brandIcon: 'https://logo.clearbit.com/pipedream.com', color: 'bg-[#191970]', tier: 'Dev-Centric', tooltip: 'Low-code serverless platform for connecting APIs using managed components and custom code.' },
];

const StepItem: React.FC<{ step: AutomationStep; index: number }> = ({ step, index }) => (
  <div className="flex gap-10 relative group">
    <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0 font-black text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${step.type === 'trigger' ? 'bg-orange-500 shadow-orange-500/30' : 'bg-indigo-600 shadow-indigo-600/30'}`}>{index + 1}</div>
    <div className="pt-2 flex-1">
      <div className="flex items-center gap-3 mb-2">
        <h4 className="font-black text-slate-900 text-xl tracking-tight group-hover:text-indigo-600 transition-colors">{step.title}</h4>
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${step.type === 'trigger' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>{step.type}</span>
      </div>
      <p className="text-slate-500 text-sm font-semibold leading-relaxed group-hover:text-slate-700">{step.description}</p>
    </div>
  </div>
);

interface Props { onBlueprintGenerated?: (b: AutomationResult) => void; onNavigate?: (v: AppView, b?: AutomationResult) => void; }

const QUICK_STARTS = [
  { icon: Layers, title: "Lead Processor", description: "Sync CRM leads with AI tagging" },
  { icon: Zap, title: "Order Automator", description: "Shopify fulfillment logic" },
  { icon: FileText, title: "Doc Summarizer", description: "Slack to PDF intelligence" }
];

const AutomationGeneratorView: React.FC<Props> = ({ onBlueprintGenerated, onNavigate }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('openai');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<AsyncState<AutomationResult>>({ data: null, loading: false, error: null });
  const [docsState, setDocsState] = useState<AsyncState<WorkflowDocumentation>>({ data: null, loading: false, error: null });
  const [activeTab, setActiveTab] = useState<'blueprint' | 'docs'>('blueprint');

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveVersion, setSaveVersion] = useState('1.0.0');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validation = useMemo(() => ({ isValid: description.trim().length >= 20, progress: Math.min(100, (description.trim().length / 20) * 100) }), [description]);

  const handleGenerate = async () => {
    if (!validation.isValid) return;
    setState({ ...state, loading: true, error: null });
    setDocsState({ data: null, loading: false, error: null });
    setActiveTab('blueprint');
    
    try {
      const data = await generateAutomation(selectedPlatform, description);
      setState({ data, loading: false, error: null });
      if (onBlueprintGenerated) onBlueprintGenerated(data);
      
      setDocsState(prev => ({ ...prev, loading: true }));
      const docs = await generateWorkflowDocs(data);
      setDocsState({ data: docs, loading: false, error: null });
    } catch (err: any) {
      setState({ data: null, loading: false, error: { message: err.message } });
      setDocsState({ data: null, loading: false, error: null });
    }
  };

  const handleSaveToVault = async () => {
    if (!state.data || !saveName.trim()) return;
    try {
      const newSaved: SavedBlueprint = {
        ...state.data,
        id: crypto.randomUUID(),
        name: saveName,
        version: saveVersion,
        timestamp: Date.now()
      };
      await db.blueprints.put(newSaved);
      toast.success("Blueprint archived successfully", {
        description: "Artifact synchronized with persistent storage."
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setShowSaveModal(false);
        setSaveSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to save blueprint:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start pb-20 animate-in">
      <div className="xl:col-span-4 space-y-8">
        <Card title="Architect Config" subtitle="Infrastructure parameters">
          <div className="space-y-8">
            <div className="space-y-5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Target</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {PLATFORMS.map((p) => (
                   <div key={p.id} className="relative group">
                     <button 
                       onClick={() => setSelectedPlatform(p.id)} 
                       className={`relative w-full flex flex-col items-start rounded-3xl border-2 transition-all duration-300 overflow-hidden outline-none ${
                         selectedPlatform === p.id 
                           ? 'bg-white border-indigo-600 shadow-xl scale-[1.03] z-10' 
                           : 'bg-white border-slate-100 hover:border-indigo-300 hover:scale-[1.03] opacity-80 hover:opacity-100'
                       }`}
                     >
                       <div className="w-full h-24 relative overflow-hidden">
                         <img src={p.logo} alt={p.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className={`absolute inset-0 bg-gradient-to-t ${selectedPlatform === p.id ? 'from-indigo-900/80' : 'from-slate-900/80'} to-transparent`} />
                         <div className="absolute bottom-3 left-4 flex items-center gap-2">
                           <img src={p.brandIcon} alt="" className="w-5 h-5 object-contain bg-white rounded-md p-0.5" />
                           <div className="flex flex-col items-start text-white">
                             <span className="text-[10px] font-black uppercase tracking-widest leading-none">{p.label}</span>
                             <span className="text-[7px] font-bold opacity-70 uppercase tracking-widest mt-0.5">{p.tagline}</span>
                           </div>
                         </div>
                       </div>
                     </button>
                     
                     <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-[260px] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-[100]">
                        <div className="bg-[#0f111a] text-white p-5 rounded-[2rem] shadow-2xl border border-indigo-500/20 relative">
                           <div className="space-y-3">
                             <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                               <img src={p.brandIcon} alt="" className="w-5 h-5 object-contain bg-white rounded-md p-1" />
                               <span className="text-[11px] font-black uppercase tracking-[0.1em]">{p.label} Architecture</span>
                             </div>
                             <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                               {p.tooltip}
                             </p>
                           </div>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-[#0f111a]" />
                     </div>
                   </div>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scope Definition</label>
                <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${validation.isValid ? 'bg-indigo-600' : 'bg-orange-400'}`} style={{ width: `${validation.progress}%` }} />
                </div>
              </div>
              <textarea value={description} onBlur={() => setTouched(true)} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Synchronize Shopify leads with Anthropic for automated sentiment tagging..." className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 min-h-[160px] text-sm font-medium focus:ring-4 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
            </div>
            <button onClick={handleGenerate} disabled={state.loading || !validation.isValid} className={`w-full py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 transition-all ${state.loading || !validation.isValid ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 active:scale-95'}`}>
              {state.loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
              <span>{state.loading ? 'Synthesizing Path...' : 'Architect Automation'}</span>
            </button>
          </div>
        </Card>
      </div>

      <div className="xl:col-span-8 space-y-8 relative">
        {state.data ? (
          <div className="space-y-6 animate-in">
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl w-fit">
              <button onClick={() => setActiveTab('blueprint')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'blueprint' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Blueprint</button>
              <button onClick={() => setActiveTab('docs')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'docs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>AI Docs</button>
            </div>

            {activeTab === 'blueprint' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in">
                <Card title="Manifest" subtitle={state.data.platform.toUpperCase()} headerAction={<button onClick={() => setShowSaveModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase border border-indigo-100 hover:bg-indigo-100 transition-colors"><Save size={14} /> Save to Vault</button>}>
                  <div className="mb-10 p-8 bg-indigo-50/30 rounded-[2.5rem] italic text-slate-700 font-semibold leading-relaxed border border-indigo-100/50">"{state.data.explanation}"</div>
                  <div className="space-y-12 relative pl-6 mb-8">
                    <div className="absolute left-[41px] top-8 bottom-8 w-1 bg-slate-100" />
                    {state.data.steps.map((step, idx) => <StepItem key={step.id} step={step} index={idx} />)}
                  </div>
                  <button onClick={() => onNavigate?.(AppView.DEPLOYMENT, state.data!)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"><Rocket size={18} /> Launch Deployment</button>
                </Card>
                <Card title="Config Schema">
                  <div className="bg-[#0d0f14] rounded-[3rem] p-10 overflow-hidden shadow-3xl border border-white/5 relative group">
                    <div className="absolute top-6 right-8 opacity-20 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => navigator.clipboard.writeText(state.data?.codeSnippet || '')} className="text-white bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all"><FileText size={18} /></button>
                    </div>
                    <pre className="text-indigo-300 font-mono text-xs overflow-x-auto custom-scrollbar"><code>{state.data.codeSnippet}</code></pre>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="animate-in">
                {docsState.data ? (
                  <Card title="Specification" subtitle="Behavioral Protocol">
                    <div className="space-y-8">
                      <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={14} className="text-amber-500" /> Primary Objective</h5>
                        <p className="text-sm text-slate-700 font-bold leading-relaxed">{docsState.data.purpose}</p>
                      </div>
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Logical Sequence Flow</h5>
                        <div className="grid grid-cols-1 gap-3">
                          {docsState.data.logicFlow.map((flow, i) => (
                            <div key={i} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-indigo-200 transition-colors">
                              <span className="text-indigo-600 font-black text-xs shrink-0 w-6 h-6 flex items-center justify-center bg-indigo-50 rounded-lg">{i+1}</span>
                              <p className="text-[13px] text-slate-600 font-semibold leading-relaxed">{flow}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-8 bg-indigo-50/20 rounded-[2.5rem] border border-indigo-100/50">
                        <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Operations & Maintenance</h5>
                        <p className="text-xs text-indigo-900/60 font-semibold leading-relaxed">{docsState.data.maintenanceGuide}</p>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <div className="h-80 flex flex-col items-center justify-center gap-6 opacity-40">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Generating Technical Protocols...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in duration-700">
            <div className="h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[4rem] flex flex-col items-center justify-center text-center bg-white/40 dark:bg-slate-900/40 group">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700 rounded-[3rem] flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-500">
                <Zap size={48} fill="currentColor" className="opacity-20" />
              </div>
              <h3 className="text-2xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">Awaiting Command</h3>
              <p className="text-slate-400 dark:text-slate-600 text-xs mt-4 font-bold uppercase tracking-widest opacity-60">Neural synthesis requires logic parameters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {QUICK_STARTS.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => setDescription(q.description)}
                  className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-start text-left group hover:border-indigo-500 transition-all hover:shadow-xl"
                >
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <q.icon size={24} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">{q.title}</h4>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">{q.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <Card title="Save to Vault" className="w-full max-w-md shadow-[0_0_100px_rgba(79,70,229,0.2)]" headerAction={<button onClick={() => setShowSaveModal(false)} className="hover:rotate-90 transition-transform"><X size={24} className="text-slate-400" /></button>}>
            <div className="space-y-8">
              {saveSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-black uppercase tracking-[0.2em] text-emerald-600">Archived Successfully</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Artifact synchronized with persistent storage.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Blueprint Identity</label>
                    <input type="text" value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="System Name (e.g. Lead Sync v1)" className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-5 text-sm font-bold focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Version String</label>
                    <input type="text" value={saveVersion} onChange={(e) => setSaveVersion(e.target.value)} placeholder="1.0.0" className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-5 text-sm font-bold focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <button onClick={handleSaveToVault} disabled={!saveName.trim()} className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-all">Persist Logic Artifact</button>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AutomationGeneratorView;
