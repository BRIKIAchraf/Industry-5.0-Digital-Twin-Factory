import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Zap, 
  Leaf, 
  ShieldCheck, 
  MessageSquare, 
  TrendingUp,
  AlertTriangle,
  Layers,
  ChevronRight,
  Search,
  User,
  Bot,
  Settings,
  Bell,
  BarChart3,
  Thermometer,
  Gauge
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- Types ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: string[];
  timestamp: Date;
}

// --- Components ---

const App: React.FC = () => {
  const [unsData, setUnsData] = useState<any>({});
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Welcome to the Digital Twin Factory 5.0. I'm your Industrial Copilot. How can I assist you today?", 
      timestamp: new Date() 
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Poll UNS Data
  useEffect(() => {
    const fetchUns = async () => {
      try {
        const res = await axios.get('http://localhost:8000/uns');
        setUnsData(res.data);
      } catch (e) {
        console.error("Failed to fetch UNS", e);
      }
    };

    const interval = setInterval(fetchUns, 1500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAiChat = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || chatInput;
    if (!query) return;
    
    const userMsg: Message = { role: 'user', content: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsAiLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/ai/copilot', { question: query });
      const botMsg: Message = { 
        role: 'assistant', 
        content: res.data.answer, 
        actions: res.data.actions,
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: Message = { 
        role: 'assistant', 
        content: "I'm having trouble connecting to the industrial brain. Please ensure the backend is running.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Mock History for the chart
  const mockHistory = [
    { time: '10:00', oee: 82, energy: 1.1 },
    { time: '11:00', oee: 85, energy: 1.3 },
    { time: '12:00', oee: 88, energy: 1.2 },
    { time: '13:00', oee: 84, energy: 1.4 },
    { time: '14:00', oee: 91, energy: 1.1 },
    { time: '15:00', oee: 89, energy: 1.3 },
    { time: '16:00', oee: 87, energy: 1.2 },
  ];

  return (
    <div className="flex h-screen w-full bg-industrial-900 text-slate-200 overflow-hidden font-sans selection:bg-industrial-blue/30">
      <div className="scanline" />

      {/* --- SIDEBAR --- */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-industrial-900/50 flex flex-col p-4 z-30">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-industrial-blue rounded-lg flex items-center justify-center glow-blue shrink-0">
            <Cpu className="text-white" size={24} />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <h1 className="text-xl font-bold tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent truncate">
              DT FACTORY <span className="text-industrial-blue">5.0</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono">INDUSTRY 5.0 CORE</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={Activity} label="Overview" active />
          <NavItem icon={Layers} label="Unified Namespace" />
          <NavItem icon={BarChart3} label="Analytics" />
          <NavItem icon={Leaf} label="Sustainability" />
          <NavItem icon={ShieldCheck} label="OT Security" />
          <NavItem icon={Settings} label="Configuration" />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 glass-panel border-l-2 border-industrial-green bg-industrial-green/5">
            <div className="flex items-center gap-2 mb-1 text-[10px] font-bold text-industrial-green uppercase">
              <div className="w-1.5 h-1.5 bg-industrial-green rounded-full animate-pulse" />
              Production Active
            </div>
            <p className="text-[10px] text-slate-400">Shift: Alpha-2026</p>
          </div>
          
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-industrial-700 flex items-center justify-center">
              <User size={16} className="text-slate-400" />
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold">Operator #42</p>
              <p className="text-[10px] text-slate-500">Master Level</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN DASHBOARD --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-industrial-900/30 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-full max-w-md focus-within:border-industrial-blue/50 transition-all">
            <Search size={18} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Query factory state (e.g. 'm3 temp')..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-600" 
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-industrial-red rounded-full border-2 border-industrial-900" />
            </button>
            <div className="h-8 w-px bg-white/5" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Line Status</p>
                <p className="text-sm font-bold text-industrial-green">OPTIMIZED</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-industrial-blue/20 flex items-center justify-center text-industrial-blue">
                <Gauge size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* KPI STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard icon={TrendingUp} label="Total OEE" value="88.4%" trend="+2.1%" color="blue" />
              <KpiCard icon={Zap} label="Energy / Unit" value="0.42 kWh" trend="-5.4%" color="yellow" />
              <KpiCard icon={Leaf} label="CO2 Neutrality" value="94%" trend="+0.8%" color="green" />
              <KpiCard icon={AlertTriangle} label="Active Risks" value="1 Low" trend="Steady" color="red" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* PERFORMANCE ANALYTICS */}
              <div className="xl:col-span-8 industrial-card !p-0 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Real-time Production Analytics</h3>
                    <p className="text-xs text-slate-500">Live correlation between OEE and Energy Consumption</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-industrial-blue/10 text-industrial-blue text-xs rounded-full font-bold">Live</button>
                    <button className="px-3 py-1 hover:bg-white/5 text-slate-500 text-xs rounded-full transition-colors">History</button>
                  </div>
                </div>
                <div className="p-6 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockHistory}>
                      <defs>
                        <linearGradient id="colorOee" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0062ff" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#0062ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="time" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#121214', border: '1px solid #ffffff10', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="oee" stroke="#0062ff" strokeWidth={3} fillOpacity={1} fill="url(#colorOee)" />
                      <Line type="monotone" dataKey="energy" stroke="#ffcc00" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* UNS TREE EXPLORER */}
              <div className="xl:col-span-4 flex flex-col gap-8">
                <div className="industrial-card flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Database className="text-industrial-blue" size={20} />
                      UNS Explorer
                    </h3>
                    <span className="text-[10px] font-mono text-industrial-blue bg-industrial-blue/10 px-2 py-0.5 rounded">MQTT LIVE</span>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {Object.entries(unsData).length > 0 ? (
                        Object.entries(unsData).map(([topic, data]: [string, any]) => (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={topic} 
                            className="group p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all cursor-pointer"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px] group-hover:text-slate-300 transition-colors">{topic.split('/').pop()}</span>
                              <span className={`w-1.5 h-1.5 rounded-full ${data.value > 90 ? 'bg-industrial-red animate-pulse' : 'bg-industrial-green'}`} />
                            </div>
                            <div className="flex justify-between items-end">
                              <span className="text-base font-bold tracking-tight text-white">
                                {data.value} <span className="text-[10px] text-slate-500 font-normal">{data.unit}</span>
                              </span>
                              <span className="text-[9px] text-slate-600 font-mono">{topic.split('/')[2]}</span>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-600 gap-3">
                          <div className="w-8 h-8 border-2 border-slate-700 border-t-industrial-blue rounded-full animate-spin" />
                          <p className="text-xs italic">Awaiting UNS topics...</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* LOWER GRID: MACHINE DETAIL & SIMULATION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="industrial-card">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Thermometer className="text-industrial-red" size={20} />
                    Machine Health Monitor
                  </h3>
                  <div className="space-y-6">
                    <HealthBar label="Motor Temperature" value={72} unit="°C" color="red" />
                    <HealthBar label="Bearing Vibration" value={24} unit="mm/s" color="blue" />
                    <HealthBar label="Lubricant Quality" value={92} unit="%" color="green" />
                  </div>
               </div>
               <div className="industrial-card bg-gradient-to-br from-industrial-800 to-industrial-900 border-industrial-blue/20">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Zap className="text-industrial-yellow" size={20} />
                    What-if Simulation
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">Test the impact of operational changes on factory OEE and Energy.</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Line Speed Control</span>
                      <span className="font-mono text-industrial-blue">115%</span>
                    </div>
                    <input type="range" className="w-full accent-industrial-blue bg-white/5 h-1.5 rounded-full appearance-none" />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase">Est. OEE Impact</p>
                        <p className="text-lg font-bold text-industrial-green">+4.2%</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase">Est. Energy cost</p>
                        <p className="text-lg font-bold text-industrial-red">+12.8%</p>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-industrial-blue/10 hover:bg-industrial-blue/20 text-industrial-blue text-sm font-bold rounded-xl border border-industrial-blue/30 transition-all mt-4">
                      RUN SIMULATION MODEL
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- AI COPILOT PANEL --- */}
      <aside className="w-full max-w-[360px] border-l border-white/5 bg-industrial-900/80 backdrop-blur-2xl flex flex-col z-30">
        <div className="p-6 border-b border-white/5 bg-industrial-900/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-industrial-blue/10 flex items-center justify-center text-industrial-blue">
              <MessageSquare size={18} />
            </div>
            <h3 className="text-lg font-bold">Industrial Copilot</h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <span className="w-1.5 h-1.5 bg-industrial-green rounded-full shadow-[0_0_8px_#00ff9d]" />
            MODEL: INDUSTRY-L4-RAG
          </div>
        </div>

        {/* CHAT MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar flex flex-col">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex items-center gap-2 mb-1.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${msg.role === 'user' ? 'bg-industrial-700' : 'bg-industrial-blue/20 text-industrial-blue'}`}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={14} />}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{msg.role}</span>
              </div>
              <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-industrial-blue text-white rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
              
              {/* AI Actions */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.actions.map((action, j) => (
                    <button 
                      key={j}
                      onClick={() => handleAiChat(undefined, action)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-industrial-blue transition-all"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
          {isAiLoading && (
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-md bg-industrial-blue/20 flex items-center justify-center text-industrial-blue animate-pulse">
                <Bot size={14} />
              </div>
              <div className="flex gap-1 items-center h-6">
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* CHAT INPUT */}
        <div className="p-6 border-t border-white/5 bg-industrial-900/50">
          <form onSubmit={handleAiChat} className="relative">
            <textarea 
              rows={1}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAiChat();
                }
              }}
              placeholder="Ask Copilot about OEE, Machine 3 or Energy..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-5 pr-14 text-sm outline-none focus:border-industrial-blue/50 transition-all resize-none max-h-32 placeholder:text-slate-600"
            />
            <button 
              type="submit" 
              disabled={isAiLoading || !chatInput.trim()}
              className="absolute right-3 bottom-3.5 w-10 h-10 bg-industrial-blue rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg shadow-industrial-blue/20 disabled:opacity-50 disabled:grayscale"
            >
              <ChevronRight size={22} className="text-white" />
            </button>
          </form>
          <div className="flex justify-between items-center mt-4 px-1">
             <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-industrial-green" />
                <div className="w-1.5 h-1.5 rounded-full bg-industrial-blue" />
                <div className="w-1.5 h-1.5 rounded-full bg-industrial-yellow" />
             </div>
             <p className="text-[9px] text-slate-600 font-mono tracking-tighter">SECURED END-TO-END TLS</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

// --- Helper Components ---

const NavItem = ({ icon: Icon, label, active = false }: any) => (
  <button className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all relative group ${
    active ? 'bg-industrial-blue/10 text-industrial-blue' : 'hover:bg-white/5 text-slate-500 hover:text-slate-200'
  }`}>
    <Icon size={20} className={active ? 'glow-blue' : ''} />
    <span className="hidden lg:block font-bold text-sm tracking-tight">{label}</span>
    {active && <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-industrial-blue rounded-r-full" />}
  </button>
);

const KpiCard = ({ icon: Icon, label, value, trend, color }: any) => {
  const colors: any = {
    blue: 'text-industrial-blue bg-industrial-blue/10',
    green: 'text-industrial-green bg-industrial-green/10',
    red: 'text-industrial-red bg-industrial-red/10',
    yellow: 'text-industrial-yellow bg-industrial-yellow/10'
  };
  return (
    <div className="industrial-card group relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={22} />
        </div>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-industrial-green/20 text-industrial-green' : 'bg-industrial-red/20 text-industrial-red'}`}>
          {trend}
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight mb-1 text-white">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</div>
      <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
        <Icon size={80} />
      </div>
    </div>
  );
};

const HealthBar = ({ label, value, unit, color }: any) => {
  const barColor = color === 'red' ? 'bg-industrial-red' : color === 'blue' ? 'bg-industrial-blue' : 'bg-industrial-green';
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">{value} {unit}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${barColor} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
        />
      </div>
    </div>
  );
};

export default App;
