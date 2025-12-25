
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Hash, User, Paperclip, Smile, Search, Sparkles, Smartphone, Code, ShieldCheck, X, File, Image as ImageIcon, Download } from 'lucide-react';
import { FileAttachment } from '../types';

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  timestamp: string;
  type: 'user' | 'ai';
  attachments?: FileAttachment[];
}

const ChatNode: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Ahmed BA', role: 'Business Analyst', text: 'Just finished the Nafath integration logic for Project Core.', timestamp: '10:05 AM', type: 'user' },
    { id: '2', sender: 'Rowaad AI', role: 'System Orchestrator', text: 'I have analyzed the Nafath logic. It meets A21 standards. Suggested T-17 update: 85% completion.', timestamp: '10:06 AM', type: 'ai' },
    { id: '3', sender: 'Sara Design', role: 'UI/UX Designer', text: 'Uploading new real estate card mockups. Please review @Omar Backend.', timestamp: '10:15 AM', type: 'user' }
  ]);
  const [input, setInput] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<FileAttachment[]>([]);
  const [activeChannel, setActiveChannel] = useState('production-main');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const channels = [
    { id: 'production-main', name: 'production-main', icon: <ShieldCheck size={14}/> },
    { id: 'dev-backend', name: 'dev-backend', icon: <Code size={14}/> },
    { id: 'dev-mobile', name: 'dev-mobile', icon: <Smartphone size={14}/> },
    { id: 'ops-alerts', name: 'ops-alerts', icon: <Sparkles size={14}/> }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // // Fix: Explicitly type 'file' as File to avoid 'unknown' type errors and ensure compatibility with Blob parameters
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newAttachment: FileAttachment = {
          id: `ATT-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: reader.result as string
        };
        setPendingAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePending = (id: string) => {
    setPendingAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSend = () => {
    if (!input.trim() && pendingAttachments.length === 0) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Current User',
      role: 'Project Manager',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'user',
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined
    };
    setMessages([...messages, newMessage]);
    setInput('');
    setPendingAttachments([]);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-[40px] overflow-hidden border border-slate-200 shadow-sm animate-in fade-in duration-500">
      {/* Channels Sidebar */}
      <div className="w-72 bg-slate-900 border-r border-white/5 flex flex-col">
        <div className="p-8 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-300 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-4">Internal Channels</p>
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                activeChannel === ch.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <div className={activeChannel === ch.id ? 'text-white' : 'text-emerald-500'}>{ch.icon}</div>
              <span className="text-xs font-black uppercase tracking-tight">{ch.name}</span>
              {ch.id === 'ops-alerts' && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>}
            </button>
          ))}
        </div>
        <div className="p-8 bg-black/40 border-t border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-black">A</div>
              <div>
                 <p className="text-xs font-black text-white uppercase tracking-tighter">Current Admin</p>
                 <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> ACTIVE NODE
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        <header className="px-10 py-6 border-b border-slate-200 bg-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
               <Hash className="text-emerald-500" size={18} />
               <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{activeChannel}</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">A21 Production Governance Channel</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all">
               <Sparkles size={14} className="text-emerald-400" /> AI Standup Summary
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-5 animate-in slide-in-from-bottom-2 duration-300 ${msg.type === 'ai' ? 'items-start' : ''}`}>
              <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 border-2 ${
                msg.type === 'ai' ? 'bg-black text-emerald-500 border-emerald-500/30' : 'bg-white text-slate-400 border-slate-100'
              }`}>
                {msg.type === 'ai' ? <Sparkles size={20} /> : msg.sender.charAt(0)}
              </div>
              <div className="max-w-2xl flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${msg.type === 'ai' ? 'text-emerald-500' : 'text-slate-900'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{msg.role}</span>
                  <span className="text-[9px] text-slate-300 font-medium">• {msg.timestamp}</span>
                </div>
                <div className={`p-6 rounded-[28px] text-sm leading-relaxed shadow-sm mb-3 ${
                  msg.type === 'ai' ? 'bg-emerald-50 border border-emerald-100 text-emerald-900 font-medium' : 'bg-white border border-slate-100 text-slate-700'
                }`}>
                  {msg.text}
                </div>
                
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {msg.attachments.map(att => (
                      <div key={att.id} className="group relative bg-white border border-slate-100 rounded-2xl p-2 shadow-sm hover:shadow-md transition-all overflow-hidden max-w-[200px]">
                         {att.type.startsWith('image/') ? (
                           <img src={att.url} alt={att.name} className="w-full h-32 object-cover rounded-xl" />
                         ) : (
                           <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                              <File size={20} className="text-emerald-500" />
                              <div className="overflow-hidden">
                                 <p className="text-[10px] font-black text-slate-800 truncate">{att.name}</p>
                                 <p className="text-[8px] text-slate-400 font-bold uppercase">{(att.size / 1024).toFixed(1)} KB</p>
                              </div>
                           </div>
                         )}
                         <a href={att.url} download={att.name} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download size={20} className="text-white" />
                         </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-white border-t border-slate-200">
          {/* Pending Attachments Preview */}
          {pendingAttachments.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4 p-4 bg-slate-50 rounded-[28px] border border-slate-100 animate-in slide-in-from-bottom-4">
              {pendingAttachments.map(att => (
                <div key={att.id} className="relative group">
                  <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-white flex items-center justify-center shadow-sm">
                    {att.type.startsWith('image/') ? (
                      <img src={att.url} className="w-full h-full object-cover" />
                    ) : (
                      <File size={20} className="text-slate-400" />
                    )}
                  </div>
                  <button 
                    onClick={() => removePending(att.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative bg-slate-50 rounded-[32px] border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder={`Message #${activeChannel}...`}
              className="w-full bg-transparent outline-none p-4 text-sm font-medium text-slate-700 resize-none max-h-32"
              rows={1}
            />
            <div className="flex justify-between items-center px-4 py-2">
               <div className="flex gap-1">
                 <input 
                    type="file" 
                    multiple 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileSelect} 
                 />
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                 >
                    <Paperclip size={18} />
                 </button>
                 <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><Smile size={18} /></button>
               </div>
               <button 
                onClick={handleSend}
                className="bg-black text-white p-3 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-black/10 active:scale-95"
               >
                 <Send size={18} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatNode;
