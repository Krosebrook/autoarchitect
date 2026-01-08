
import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { SavedBlueprint } from '../types';
import { Card } from '../components/ui/Card';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Zap, 
  Layers, 
  Clock, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const AnalyticsView: React.FC = () => {
  const [blueprints, setBlueprints] = useState<SavedBlueprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const all = await db.blueprints.toArray();
    setBlueprints(all);
    setLoading(false);
  };

  const platformDistribution = blueprints.reduce((acc, curr) => {
    acc[curr.platform] = (acc[curr.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalSteps = blueprints.reduce((acc, curr) => acc + curr.steps.length, 0);
  const avgSteps = blueprints.length ? (totalSteps / blueprints.length).toFixed(1) : 0;

  return (
    <div className="space-y-8 animate-in pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col items-start p-6" variant="glass">
           <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
             <Layers size={24} />
           </div>
           <h3 className="text-3xl font-black text-slate-900 dark:text-white">{blueprints.length}</h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Blueprints</p>
           <div className="flex items-center gap-1 mt-4 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
             <ArrowUpRight size={14} /> 12% increase
           </div>
        </Card>

        <Card className="flex flex-col items-start p-6">
           <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
             <Zap size={24} />
           </div>
           <h3 className="text-3xl font-black text-slate-900 dark:text-white">{totalSteps}</h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Logic Nodes</p>
           <div className="flex items-center gap-1 mt-4 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
             <ArrowUpRight size={14} /> 8% efficiency gain
           </div>
        </Card>

        <Card className="flex flex-col items-start p-6">
           <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
             <Activity size={24} />
           </div>
           <h3 className="text-3xl font-black text-slate-900 dark:text-white">{avgSteps}</h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Avg. Nodes / Flow</p>
           <div className="flex items-center gap-1 mt-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
             <TrendingUp size={14} /> Stable complexity
           </div>
        </Card>

        <Card className="flex flex-col items-start p-6">
           <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
             <Clock size={24} />
           </div>
           <h3 className="text-3xl font-black text-slate-900 dark:text-white">2.4m</h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Est. Time Saved</p>
           <div className="flex items-center gap-1 mt-4 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
             <ArrowUpRight size={14} /> 24hr improvement
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Infrastructure Distribution" subtitle="Distribution across automation platforms">
           <div className="space-y-6">
             {Object.entries(platformDistribution).map(([platform, count], i) => {
               const percentage = ((count / blueprints.length) * 100).toFixed(0);
               return (
                 <div key={platform} className="space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-slate-900 dark:text-white">{platform}</span>
                     <span className="text-indigo-600">{percentage}%</span>
                   </div>
                   <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                       style={{ width: `${percentage}%`, transitionDelay: `${i * 100}ms` }} 
                     />
                   </div>
                 </div>
               );
             })}
             {blueprints.length === 0 && (
               <div className="h-40 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                 Insufficient metadata for synthesis
               </div>
             )}
           </div>
        </Card>

        <Card title="Activity Pulse" subtitle="Neural synthesis activity over time">
           <div className="h-[240px] flex items-end justify-between gap-2 px-2">
             {[40, 70, 45, 90, 65, 80, 55, 30, 85, 60, 75, 50].map((height, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                 <div 
                   className="w-full bg-indigo-600/10 dark:bg-indigo-600/20 group-hover:bg-indigo-600/40 rounded-t-lg transition-all duration-700 relative overflow-hidden" 
                   style={{ height: `${height}%`, transitionDelay: `${i * 50}ms` }}
                 >
                   <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">M{i+1}</span>
               </div>
             ))}
           </div>
        </Card>
      </div>

      <Card title="Recent Architecture Events" subtitle="Latest synthesis and deployment triggers">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Blueprint</th>
                <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nodes</th>
                <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="text-right py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {blueprints.slice(0, 5).map((b) => (
                <tr key={b.id} className="border-b border-slate-50 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{b.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{b.platform}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{b.steps.length} Nodes</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[10px] font-bold text-slate-400">{new Date(b.timestamp || 0).toLocaleDateString()}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-900/30">
                      <Zap size={10} fill="currentColor" /> Synchronized
                    </span>
                  </td>
                </tr>
              ))}
              {blueprints.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                    No architectural events recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsView;
