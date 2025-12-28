
import React from 'react';
import { 
  Cpu, Database, Globe, Layers, Zap, ShieldCheck, Share2, 
  ArrowRight, Terminal, Server, Users, BarChart3, Cloud,
  Code, Smartphone, Layout, MessageSquare, Lock, Activity,
  GitBranch, Clock, DollarSign, FileCode, Briefcase, FileText
} from 'lucide-react';

const SystemMap: React.FC = () => {

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700 font-inter lowercase-ui">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter lowercase generous-spacing">Sovereign OS Architecture</h2>
        <p className="text-slate-500 mt-2 font-medium italic lowercase generous-spacing">خارطة تدفق العمل والوكلاء الذكيين</p>
      </header>

      {/* Layer 1: Inputs & Integrations */}
      <div className="mb-16">
        <h3 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Layer 1: Data Ingress Nodes</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <NodeCard 
            title="Google Sheet"
            description="مصدر الهويات، الأدوار، والهيكل التنظيمي للموظفين."
            icon={<FileText size={32} />}
            color="emerald"
          />
          <NodeCard 
            title="Zoho Projects"
            description="مصدر بيانات المهام وتحديثات المشاريع عبر Webhooks."
            icon={<Briefcase size={32} />}
            color="blue"
          />
          <NodeCard 
            title="Time Doctor"
            description="مراقب الإنتاجية والالتزام بقواعد العمل."
            icon={<Clock size={32} />}
            color="amber"
          />
          <NodeCard 
            title="GitLab"
            description="مصدر تحديثات الكود البرمجي وربطها بالمهام."
            icon={<GitBranch size={32} />}
            color="slate"
          />
        </div>
      </div>
      
      {/* Layer 2: Core Processing Agents */}
      <div className="mb-16">
        <h3 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Layer 2: Sovereign Agent Mesh</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AgentCard 
            name="HR Agent"
            icon={<Users size={24} />}
            color="blue"
            subAgents={["Roster Sync (Sheet)", "Hierarchy Graph", "AI Identity Control"]}
          />
          <AgentCard 
            name="Estimator Mesh"
            icon={<Cpu size={24} />}
            color="emerald"
            subAgents={["Scope Extractor", "Budget Planner", "Validation Guard"]}
            isCentral
          />
          <AgentCard 
            name="Planner Agent"
            icon={<Layers size={24} />}
            color="indigo"
            subAgents={["Resource Mapping", "Capacity Monitor", "Slack Alerter"]}
          />
        </div>
      </div>

      {/* Layer 3: Tech Stack & Storage */}
      <div className="mb-16">
        <h3 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Layer 3: Persistence & Egress Nodes</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                 <Database className="text-emerald-600" size={24} />
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tech Stack</h4>
              </div>
              <div className="flex gap-8">
                 <div className="flex-1">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Database Engine</p>
                       <p className="text-lg font-black text-slate-900">MongoDB Atlas</p>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed lowercase">تخزين المهام، سجلات الحضور، والموظفين في بيئة NoSQL.</p>
                 </div>
                 <div className="flex-1">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Logic Framework</p>
                       <p className="text-lg font-black text-slate-900">Laravel 11</p>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed lowercase">محرك الـ API والأتمتة. يستخدم Artisan للتحكم.</p>
                 </div>
              </div>
           </div>
  
           <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent"></div>
              <header className="relative z-10 flex justify-between items-start mb-10">
                 <div>
                    <h4 className="text-3xl font-black tracking-tighter uppercase leading-none">Production Lifecycle</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-80">22-Day Speed Protocol</p>
                 </div>
                 <Activity className="animate-pulse" size={32} />
              </header>
              <p className="text-xs font-bold text-slate-400 italic lowercase">
                كل المخرجات والتقارير يتم تصديرها بتنسيقات متوافقة مع أنظمة Zoho و Slack لضمان تكامل دورة العمل.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

interface NodeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'amber' | 'slate';
}

const NodeCard: React.FC<NodeCardProps> = ({ title, description, icon, color }) => {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:border-emerald-500',
    blue: 'bg-blue-50 text-blue-600 group-hover:border-blue-500',
    amber: 'bg-amber-50 text-amber-600 group-hover:border-amber-500',
    slate: 'bg-slate-50 text-slate-600 group-hover:border-slate-500',
  };
  
  return (
    <div className={`bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col items-center text-center group ${colors[color]} transition-all`}>
      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${colors[color]}`}>
         {icon}
      </div>
      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">{title}</h4>
      <p className="text-[10px] text-slate-400 font-bold leading-relaxed lowercase">{description}</p>
    </div>
  );
};

interface AgentCardProps {
  name: string;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'indigo';
  subAgents: string[];
  isCentral?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, icon, color, subAgents, isCentral }) => {
  const colors = {
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-200', border: 'border-emerald-500' },
    blue: { bg: 'bg-blue-600', text: 'text-blue-200', border: 'border-blue-500' },
    indigo: { bg: 'bg-indigo-600', text: 'text-indigo-200', border: 'border-indigo-500' },
  };

  return (
    <div className={`rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden border-2 ${isCentral ? 'border-emerald-500 bg-slate-950' : `border-transparent ${colors[color].bg}`}`}>
      <header className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 ${isCentral ? 'bg-emerald-500 text-slate-900' : 'bg-black/20'} rounded-2xl flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tighter uppercase">{name}</h3>
        </div>
      </header>
      <div>
        <h5 className={`text-[9px] font-black uppercase tracking-[0.2em] mb-4 ${isCentral ? 'text-emerald-500' : colors[color].text}`}>Sub-Agent Nodes</h5>
        <ul className="space-y-2">
          {subAgents.map(agent => (
            <li key={agent} className="flex items-center gap-2 bg-black/20 p-3 rounded-xl border border-white/5">
              <ArrowRight size={12} className={isCentral ? 'text-emerald-500' : colors[color].text} />
              <span className="text-xs font-bold lowercase italic">{agent}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default SystemMap;
