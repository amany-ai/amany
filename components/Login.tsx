
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Lock, Mail, ChevronRight, ShieldAlert, Globe } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@bridge.com' && password === 'admin') {
      onLogin({ id: '1', email, name: 'Lead Admin', role: UserRole.ADMIN });
    } else if (email === 'pm@bridge.com' && password === 'pm') {
      onLogin({ id: '2', email, name: 'Senior PM', role: UserRole.PROJECT_MANAGER });
    } else {
      setError('Invalid credentials for Rowaad Bridge.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
           <a href="https://rh.net.sa/" target="_blank" rel="noopener noreferrer" className="inline-block group">
             {/* Logo Container - Replace src with your actual logo path */}
             <div className="flex flex-col items-center">
               <div className="bg-emerald-500 p-6 rounded-[32px] mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-all">
                 <img 
                    src="https://rh.net.sa/wp-content/uploads/2021/04/logo-rowaad.png" 
                    alt="Rowaad Logo" 
                    className="h-16 w-auto brightness-0" // Using brightness-0 to make it black on emerald background
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-4xl font-black">R</span>';
                    }}
                 />
               </div>
               <h1 className="text-4xl font-black text-white tracking-tighter uppercase">ROWAAD</h1>
               <p className="text-emerald-500 mt-2 font-bold tracking-[0.2em] uppercase text-[10px]">Project Hub</p>
             </div>
           </a>
        </div>

        <div className="bg-white/5 border border-emerald-900/30 backdrop-blur-xl rounded-[48px] p-10 animate-in zoom-in-95 duration-500 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Identity Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-emerald-900/30 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-white placeholder:text-emerald-900/50"
                  placeholder="admin@bridge.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-emerald-900/30 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-white placeholder:text-emerald-900/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-950/30 text-red-400 p-4 rounded-xl text-xs font-bold border border-red-900/50 flex items-center gap-2 animate-shake">
                <ShieldAlert size={16} /> {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl shadow-emerald-500/20 group active:scale-95"
            >
              Enter Rowaad System <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-emerald-900/20 flex items-center justify-center gap-4">
             <a href="https://rh.net.sa/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full hover:bg-emerald-500 hover:text-black transition-all">
                <Globe size={10} /> Visit rh.net.sa
             </a>
             <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase bg-black/40 px-3 py-1.5 rounded-full">
                <Lock size={10} className="text-emerald-500" /> Secure Node
             </div>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
          Authorized personnel only. <br/> rowaad
        </p>
      </div>
    </div>
  );
};

export default Login;
