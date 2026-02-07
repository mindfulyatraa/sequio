import React from 'react';
import { Icon } from '../components/Icon';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

// Mock Data for Charts
const DATA = [
  { time: '00:00', value: 20 },
  { time: '04:00', value: 40 },
  { time: '08:00', value: 30 },
  { time: '12:00', value: 70 },
  { time: '16:00', value: 50 },
  { time: '20:00', value: 60 },
  { time: '23:59', value: 85 },
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                System Overview 
                <span className="px-2 py-1 rounded-full bg-success/10 text-success border border-success/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Operational
                </span>
            </h2>
            <div className="flex gap-3">
                 <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primaryHover">Manual Sync</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: 'Total Users', value: '42,892', change: '+12.5%', icon: 'group', color: 'text-primary' },
                { label: 'Active Subs', value: '1,204', change: '+4.2%', icon: 'stars', color: 'text-accent' },
                { label: 'API Quota', value: '78%', sub: 'Resets in 4h', icon: 'key', color: 'text-warning' },
                { label: 'Notifications', value: '128.4K', sub: 'Today', icon: 'campaign', color: 'text-success' },
            ].map((stat) => (
                <div key={stat.label} className="bg-surface border border-border p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg bg-surfaceHighlight ${stat.color}`}><Icon name={stat.icon} /></div>
                        {stat.change && <span className="text-success text-xs font-bold bg-success/10 px-2 py-0.5 rounded">{stat.change}</span>}
                        {stat.sub && <span className="text-textMuted text-xs font-bold">{stat.sub}</span>}
                    </div>
                    <p className="text-textMuted text-sm font-medium">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                    {stat.label === 'API Quota' && (
                        <div className="w-full bg-surfaceHighlight h-1.5 rounded-full mt-3 overflow-hidden">
                            <div className="bg-warning h-full rounded-full" style={{width: '78%'}}></div>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Chart Section */}
        <div className="bg-surface border border-border rounded-xl p-6 h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg text-white">Job Execution History</h3>
                    <p className="text-textMuted text-xs">Real-time system load (Last 24h)</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Success</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-danger"></span> Failure</div>
                </div>
            </div>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DATA}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{backgroundColor: '#151521', border: '1px solid #2D2D44', borderRadius: '8px'}} />
                        <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* System Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface border border-border rounded-xl overflow-hidden">
                 <div className="p-4 border-b border-border flex justify-between items-center bg-surfaceHighlight/30">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <Icon name="terminal" className="text-danger" /> Critical Failure Log
                    </h3>
                    <button className="text-xs font-bold text-textMuted hover:text-white">View All</button>
                 </div>
                 <div className="divide-y divide-border">
                    {[
                        { time: '14:23:05', service: 'Redis Cache', msg: 'Connection Lost: Host 10.0.4.1 unreachable', type: 'CRITICAL' },
                        { time: '13:45:12', service: 'YouTube API', msg: 'Daily Quota Exceeded for Project "YT-Monitor-Prod"', type: 'WARNING' },
                        { time: '12:10:00', service: 'OpenAI Service', msg: 'Latency spike detected in gpt-4-turbo endpoint', type: 'INFO' },
                    ].map((log, i) => (
                        <div key={i} className="p-4 flex gap-4 hover:bg-surfaceHighlight/50 transition-colors">
                            <span className="text-textMuted text-xs font-mono pt-1">{log.time}</span>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-white text-xs font-bold">{log.service}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                        log.type === 'CRITICAL' ? 'bg-danger/10 text-danger' : 
                                        log.type === 'WARNING' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                                    }`}>{log.type}</span>
                                </div>
                                <p className="text-textMuted text-xs font-mono">{log.msg}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="bg-primary rounded-xl p-6 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                 <h3 className="font-bold text-sm uppercase tracking-widest opacity-80 mb-6">Cluster Health</h3>
                 <div className="space-y-6 relative z-10">
                     {[
                         { label: 'CPU USAGE', val: '24.5%' },
                         { label: 'RAM USAGE', val: '6.8 / 16 GB' },
                         { label: 'QUEUE DEPTH', val: 'Normal' },
                     ].map((item) => (
                         <div key={item.label}>
                             <div className="flex justify-between text-xs font-bold mb-2">
                                 <span>{item.label}</span>
                                 <span>{item.val}</span>
                             </div>
                             <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                                 <div className="h-full bg-white w-1/3 rounded-full"></div>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    </div>
  );
};

export const AdminQueues: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                     <h1 className="text-3xl font-black text-white">Queue Monitor</h1>
                     <p className="text-textMuted flex items-center gap-2 mt-1">
                        Real-time status of <span className="font-mono bg-surfaceHighlight px-1 rounded text-xs">Bull/Redis</span> processing clusters
                     </p>
                </div>
                 <div className="flex gap-3">
                    <button className="px-4 py-2 bg-surfaceHighlight border border-border text-white text-sm font-bold rounded-lg hover:bg-border">Pause All</button>
                    <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primaryHover shadow-lg shadow-primary/20">Scale Cluster</button>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                    { title: 'Playlist Scraper', jobs: '842', throughput: '52/min', active: '4 / 8', time: '1.2s', status: 'Healthy' },
                    { title: 'Transcript Fetcher', jobs: '2,105', throughput: '12/min', active: '2 / 4', time: '8.4s', status: 'Rate Limited', warning: true },
                    { title: 'Notification Dispatcher', jobs: '42', throughput: '120/min', active: '12 / 16', time: '0.1s', status: 'Healthy' },
                ].map((queue) => (
                    <div key={queue.title} className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <h3 className="font-bold text-white">{queue.title}</h3>
                            <button className="text-textMuted hover:text-white"><Icon name="more_vert" /></button>
                        </div>
                        <div className="p-4 flex-1">
                             <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-3xl font-bold text-white">{queue.jobs}</p>
                                    <p className="text-xs text-textMuted">Jobs in Queue</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-xs font-medium ${queue.warning ? 'text-warning' : 'text-success'}`}>{queue.throughput}</p>
                                    <p className="text-xs text-textMuted">{queue.status}</p>
                                </div>
                             </div>
                             {/* Progress Bar Mock */}
                             <div className="flex h-2 w-full rounded-full overflow-hidden mb-6">
                                <div className="bg-primary w-1/3"></div>
                                <div className="bg-success w-1/3"></div>
                                <div className="bg-danger w-[5%]"></div>
                                <div className="bg-surfaceHighlight w-full"></div>
                             </div>

                             <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-textMuted">Active Threads</span>
                                    <span className="font-mono text-white">{queue.active}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-textMuted">Avg. Process Time</span>
                                    <span className="font-mono text-white">{queue.time}</span>
                                </div>
                             </div>
                        </div>
                        <div className="p-3 bg-surfaceHighlight/30 flex gap-2 border-t border-border">
                            <button className="flex-1 py-1.5 text-xs font-bold border border-border rounded bg-surface text-textMuted hover:text-white transition-colors">Pause</button>
                            <button className="flex-1 py-1.5 text-xs font-bold border border-border rounded bg-surface text-textMuted hover:text-white transition-colors">Clean</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border">
                    <h3 className="font-bold text-white">Live Job Stream</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-textMuted">
                        <thead className="bg-surfaceHighlight/50 text-xs font-bold uppercase text-textMuted">
                            <tr>
                                <th className="px-6 py-3">Job ID</th>
                                <th className="px-6 py-3">Queue</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Started</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[
                                { id: '#PL-84920-X', queue: 'Playlist Scraper', status: 'ACTIVE', color: 'text-primary', bg: 'bg-primary/10', time: '2s ago' },
                                { id: '#TF-12003-B', queue: 'Transcript Fetcher', status: 'FAILED', color: 'text-danger', bg: 'bg-danger/10', time: '14m ago' },
                                { id: '#ND-00341-S', queue: 'Notification Dispatcher', status: 'WAITING', color: 'text-textMuted', bg: 'bg-surfaceHighlight', time: 'Just now' },
                            ].map((job) => (
                                <tr key={job.id} className="hover:bg-surfaceHighlight/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-primary">{job.id}</td>
                                    <td className="px-6 py-4">{job.queue}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${job.bg} ${job.color}`}>{job.status}</span>
                                    </td>
                                    <td className="px-6 py-4">{job.time}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-textMuted hover:text-white"><Icon name="more_horiz" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export const CostAnalysis: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                     <h1 className="text-3xl font-black text-white mb-2">Cost Optimization</h1>
                     <p className="text-textMuted max-w-xl">AI-driven analysis of your API usage and infrastructure costs.</p>
                </div>
                <button className="bg-primary hover:bg-primaryHover text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
                    <Icon name="bolt" /> Bulk Apply Fixes
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface border border-border p-6 rounded-xl">
                    <div className="flex justify-between mb-4"><span className="text-sm font-medium text-textMuted">Current Burn</span><Icon name="payments" className="text-primary" /></div>
                    <h3 className="text-3xl font-bold text-white">$1,240<span className="text-sm text-textMuted font-normal">/mo</span></h3>
                </div>
                 <div className="bg-surface border border-border border-l-4 border-l-success p-6 rounded-xl">
                    <div className="flex justify-between mb-4"><span className="text-sm font-medium text-textMuted">Projected Savings</span><Icon name="savings" className="text-success" /></div>
                    <h3 className="text-3xl font-bold text-success">-$380<span className="text-sm text-textMuted font-normal">/mo</span></h3>
                </div>
                 <div className="bg-surface border border-border p-6 rounded-xl">
                    <div className="flex justify-between mb-4"><span className="text-sm font-medium text-textMuted">Efficiency Score</span><Icon name="speed" className="text-warning" /></div>
                    <h3 className="text-3xl font-bold text-white">84%</h3>
                </div>
             </div>

             <div className="space-y-4">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2"><Icon name="recommend" className="text-primary" /> Recommendations</h3>
                 
                 <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-all flex flex-col md:flex-row gap-6 items-start">
                     <div className="w-full md:w-48 aspect-video bg-background rounded-lg flex items-center justify-center border border-border shrink-0">
                         <Icon name="query_stats" className="text-4xl text-textMuted" />
                     </div>
                     <div className="flex-1">
                         <div className="flex gap-2 mb-2">
                             <span className="px-2 py-0.5 bg-danger/10 text-danger text-[10px] font-bold uppercase rounded border border-danger/20">High Impact</span>
                             <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded border border-primary/20">API</span>
                         </div>
                         <h4 className="text-lg font-bold text-white mb-2">Adjust Polling Frequency</h4>
                         <p className="text-sm text-textMuted leading-relaxed mb-4">Your current monitoring cycle polls YouTube every 10 minutes. Switching to 15 minutes for non-priority channels would reduce quota usage by 30%.</p>
                         <div className="bg-background rounded p-3 flex justify-between items-center text-sm">
                             <span className="font-bold text-success">Save 30% Quota</span>
                             <span className="text-textMuted">Trade-off: 5m delay</span>
                         </div>
                     </div>
                     <button className="w-full md:w-auto px-6 py-3 bg-primary hover:bg-primaryHover text-white font-bold rounded-lg transition-colors">Apply</button>
                 </div>

                  <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-all flex flex-col md:flex-row gap-6 items-start">
                     <div className="w-full md:w-48 aspect-video bg-background rounded-lg flex items-center justify-center border border-border shrink-0">
                         <Icon name="smart_toy" className="text-4xl text-textMuted" />
                     </div>
                     <div className="flex-1">
                         <div className="flex gap-2 mb-2">
                             <span className="px-2 py-0.5 bg-warning/10 text-warning text-[10px] font-bold uppercase rounded border border-warning/20">Med Impact</span>
                             <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold uppercase rounded border border-accent/20">AI</span>
                         </div>
                         <h4 className="text-lg font-bold text-white mb-2">Smart Model Switching</h4>
                         <p className="text-sm text-textMuted leading-relaxed mb-4">Use GPT-3.5 Turbo for videos under 10 minutes. AI logic confirms summary quality remains &gt;98% for short content.</p>
                         <div className="bg-background rounded p-3 flex justify-between items-center text-sm">
                             <span className="font-bold text-success">-$120 / month</span>
                             <span className="text-textMuted">Negligible quality impact</span>
                         </div>
                     </div>
                     <button className="w-full md:w-auto px-6 py-3 bg-primary hover:bg-primaryHover text-white font-bold rounded-lg transition-colors">Apply</button>
                 </div>
             </div>
        </div>
    )
}