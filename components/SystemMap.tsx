
import React from 'react';
import { 
  Cpu, Database, Globe, Layers, Zap, ShieldCheck, Share2, 
  ArrowRight, Terminal, Server, Users, BarChart3, Cloud,
  Code, Smartphone, Layout, MessageSquare, Lock, Activity
} from 'lucide-react';

const SystemMap: React.FC = () => {
  const agents = [
    { id: 'A', name: 'Scope Extractor', icon: <Search size={16} />, color: 'emerald' },
    { id: 'B', name: 'Methodology Selector', icon: <Layers size={16} />, color: 'blue' },
    { id: 'C', name: 'Time Estimator', icon: <Clock size={16} />, color: 'indigo' },
    { id: 'D', name: 'Budget Planner', icon: <DollarSign size={16} />, color: 'amber' },
    { id: 'E', name: 'Integration Designer', icon: <Share2 size={16} />, color: 'purple' },
    { id: 'F', name: 'Export Architect', icon: <FileCode size={16} />, color: 'slate' },
    { id: 'G', name: 'Validation Guard', icon: <ShieldCheck size={16} />, color: 'red' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700 font-inter lowercase-ui">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter lowercase generous-spacing">Sovereign OS Architecture</h2>
        <p className="text-slate-500 mt-2 font-medium italic lowercase generous-spacing">نظام الأتمتة الشامل - خارطة تدفق العمل والذكاء الاصطناعي</p>
      </header>

      {/* Layer 1: Inputs & Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col items-center text-center group hover:border-blue-500 transition-all">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <Cloud size={32} />
          </div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Zoho Projects Node</h4>
          <p className="text-[10px] text-slate-400 font-bold leading-relaxed lowercase">مصدر البيانات الأساسي للمهام والموظفين. يتم جلبها عبر Webhooks و REST APIs.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col items-center text-center group hover:border-emerald-500 transition-all">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <Activity size={32} />
          </div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Time Doctor Sentinel</h4>
          <p className="text-[10px] text-slate-400 font-bold leading-relaxed lowercase">مراقب الإنتاجية والالتزام. يرسل تنبيهات فورية في حالة الخمول أو نقص الكود.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col items-center text-center group hover:border-indigo-500 transition-all">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <MessageSquare size={32} />
          </div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Slack Pulse Bridge</h4>
          <p className="text-[10px] text-slate-400 font-bold leading-relaxed lowercase">نقطة التواصل التلقائية. تحديثات الخطة والمخاطر تُرسل فوراً للقنوات المعنية.</p>
        </div>
      </div>

      {/* Layer 2: Core Processing (The Mesh) */}
      <div className="relative mb-16">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>
        
        <div className="bg-slate-900 rounded-[60px] p-12 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Cpu size={240} className="text-emerald-500" />
           </div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-900">
                    <Zap size={24} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase">The Orchestration Mesh</h3>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">7-Agent AI Core Process</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                 {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((agent, i) => (
                    <div key={agent} className="flex flex-col items-center group">
                       <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl font-black mb-3 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-all cursor-default">
                          {agent}
                       </div>
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Agent {i+1}</p>
                    </div>
                 ))}
              </div>

              <div className="mt-12 p-8 bg-black/40 rounded-[32px] border border-white/5">
                 <div className="flex gap-10">
                    <div className="flex-1">
                       <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Internal Logic Flow</h5>
                       <ul className="space-y-3 text-[11px] text-slate-400 font-medium italic lowercase">
                          <li className="flex items-center gap-2"><ArrowRight size={12} className="text-emerald-500"/> تحليل وثيقة المتطلبات (BRD)</li>
                          <li className="flex items-center gap-2"><ArrowRight size={12} className="text-emerald-500"/> حساب الميزانية بناءً على قواعد الـ 22 يوم</li>
                          <li className="flex items-center gap-2"><ArrowRight size={12} className="text-emerald-500"/> توليد كود الـ Backend (Laravel) و الـ Frontend (React)</li>
                       </ul>
                    </div>
                    <div className="w-px bg-white/10"></div>
                    <div className="flex-1">
                       <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Compliance Node</h5>
                       <ul className="space-y-3 text-[11px] text-slate-400 font-medium italic lowercase">
                          <li className="flex items-center gap-2"><ShieldCheck size={12} className="text-emerald-500"/> التدقيق التلقائي للعمليات (Agent G)</li>
                          <li className="flex items-center gap-2"><Lock size={12} className="text-emerald-500"/> تشفير المفاتيح والرموز في الخزنة</li>
                       </ul>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Layer 3: Tech Stack & Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
               <Database className="text-blue-600" size={24} />
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Persistence Layer</h4>
            </div>
            <div className="flex gap-8">
               <div className="flex-1">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Database Engine</p>
                     <p className="text-lg font-black text-slate-900">MongoDB Atlas</p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed lowercase">تخزين المهام، سجلات الحضور، والموظفين في بيئة NoSQL مرنة.</p>
               </div>
               <div className="flex-1">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Logic Framework</p>
                     <p className="text-lg font-black text-slate-900">Laravel 11</p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed lowercase">محرك الـ API والأتمتة. يستخدم Artisan للتحكم في العمليات الخلفية.</p>
               </div>
            </div>
         </div>

         <div className="bg-emerald-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
            <header className="relative z-10 flex justify-between items-start mb-10">
               <div>
                  <h4 className="text-3xl font-black tracking-tighter uppercase leading-none">The Production Lifecycle</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-80">22-Day Speed Protocol</p>
               </div>
               <Activity className="animate-pulse" size={32} />
            </header>
            
            <div className="relative z-10 grid grid-cols-2 gap-4">
               {[
                 { label: 'UAT Gate', val: 'Agent F' },
                 { label: 'DoD Check', val: 'Agent G' },
                 { label: 'Code Node', val: 'Artisan' },
                 { label: 'Sync Status', val: 'Live' }
               ].map(item => (
                 <div key={item.label} className="bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <p className="text-[9px] font-black uppercase text-emerald-200 mb-1">{item.label}</p>
                    <p className="text-sm font-black">{item.val}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <footer className="mt-16 text-center text-slate-400">
         <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-50 border border-slate-200 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sovereign OS Internal Node • Verified</span>
         </div>
      </footer>
    </div>
  );
};

const Search = ({ size }: { size: number }) => <Globe size={size} />;
const Clock = ({ size }: { size: number }) => <Activity size={size} />;
const DollarSign = ({ size }: { size: number }) => <BarChart3 size={size} />;
const FileCode = ({ size }: { size: number }) => <Code size={size} />;

export default SystemMap;
