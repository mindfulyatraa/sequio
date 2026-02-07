import React from 'react';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header section */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">Dashboard Overview</h2>
          <p className="text-slate-400 mt-1">Welcome back! Monitoring your 12 active learning paths.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-slate-400 hover:text-white transition-colors">
            <Icon name="search" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none text-white">{user?.name || 'Alex Rivera'}</p>
              <p className="text-xs text-primary font-medium mt-1">Premium Plan</p>
            </div>
            <div 
              className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-primary/20" 
              style={{backgroundImage: `url('${user?.avatar || "https://picsum.photos/40/40?random=1"}')`}}
            ></div>
          </div>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: 'video_library', color: 'text-primary', label: 'Total Playlists', value: '12', change: '+2%', changeColor: 'text-success bg-success/10' },
          { icon: 'pending_actions', color: 'text-primary', label: 'Pending Videos', value: '48', change: '+15%', changeColor: 'text-success bg-success/10' },
          { icon: 'alarm_on', color: 'text-primary', label: 'Active Reminders', value: '5', change: '-5%', changeColor: 'text-warning bg-warning/10' },
          { icon: 'visibility', color: 'text-primary', label: 'Watched This Week', value: '18', change: '+10%', changeColor: 'text-success bg-success/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface p-6 rounded-xl border border-border group hover:border-primary/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-lg bg-primary/10 ${stat.color} flex items-center justify-center`}>
                <Icon name={stat.icon} className="text-3xl" filled />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${stat.changeColor}`}>{stat.change}</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-black mt-1 text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Videos List */}
      <section className="bg-surface rounded-xl border border-border overflow-hidden mb-10">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Recent New Videos</h3>
            <p className="text-sm text-slate-400">Newly synced content from your monitored channels</p>
          </div>
          <button className="text-primary text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="divide-y divide-border">
          {[
            { 
              title: 'Next-JS 14 Authentication Tutorial with NextAuth', 
              playlist: 'Fullstack Dev Course', 
              time: '2 hours ago', 
              duration: '14:22', 
              bg: 'https://picsum.photos/400/225?random=10',
              status: 'New Sync',
              statusStyle: 'text-primary bg-primary/10'
            },
            { 
              title: 'Mastering CSS Grid in 10 Minutes', 
              playlist: 'UI/UX Masterclass', 
              time: '5 hours ago', 
              duration: '08:45', 
              bg: 'https://picsum.photos/400/225?random=11',
              status: 'Watched',
              statusStyle: 'text-slate-400 bg-border'
            },
            { 
              title: 'System Design Interview Questions', 
              playlist: 'FAANG Prep 2024', 
              time: 'Yesterday', 
              duration: '25:10', 
              bg: 'https://picsum.photos/400/225?random=12',
              status: 'Notification Sent',
              isNotification: true
            },
            { 
              title: 'Advanced Typescript Patterns for Large Apps', 
              playlist: 'Fullstack Dev Course', 
              time: '2 days ago', 
              duration: '1:12:05', 
              bg: 'https://picsum.photos/400/225?random=13',
              status: 'Watched',
              statusStyle: 'text-slate-400 bg-border'
            },
          ].map((video, i) => (
            <div key={i} className="p-4 hover:bg-white/5 transition-colors flex flex-col sm:flex-row items-center gap-6 group">
              <div className="relative shrink-0">
                <div 
                  className="w-20 h-20 rounded-lg bg-cover bg-center overflow-hidden" 
                  style={{backgroundImage: `url('${video.bg}')`}}
                >
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="play_arrow" className="text-white" filled />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white font-bold px-1 rounded">{video.duration}</span>
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h4 className="text-base font-bold text-white truncate">{video.title}</h4>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <Icon name="folder" className="text-sm text-slate-400" filled />
                  <p className="text-sm text-slate-400">Playlist: {video.playlist}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-white">{video.time}</p>
                {video.isNotification ? (
                  <div className="flex items-center gap-1 mt-2 justify-end">
                    <Icon name="chat" className="text-primary text-[14px]" filled />
                    <span className="text-[10px] font-bold text-primary">{video.status}</span>
                  </div>
                ) : (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${video.statusStyle}`}>{video.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-surface/50 text-center border-t border-border">
          <button className="text-slate-400 text-sm font-medium flex items-center gap-2 mx-auto hover:text-primary transition-colors">
            Load More
            <Icon name="keyboard_arrow_down" className="text-[18px]" />
          </button>
        </div>
      </section>

      {/* Secondary row: Reminders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface p-6 rounded-xl border border-border">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-white">
            <Icon name="schedule" className="text-primary" filled />
            Smart Reminders (Active)
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
                  <Icon name="menu_book" filled />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">FAANG Interview Daily</p>
                  <p className="text-[11px] text-slate-400">Every day at 09:00 AM via Telegram</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-success">Active</span>
                <button className="text-slate-400 hover:text-white"><Icon name="more_vert" /></button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
                  <Icon name="code" filled />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">React Project Practice</p>
                  <p className="text-[11px] text-slate-400">Mon, Wed, Fri at 06:00 PM via WhatsApp</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-success">Active</span>
                <button className="text-slate-400 hover:text-white"><Icon name="more_vert" /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary rounded-xl p-6 text-white flex flex-col justify-between shadow-2xl shadow-primary/20">
          <div>
            <h3 className="text-xl font-black mb-2">Upgrade to Pro</h3>
            <p className="text-sm text-blue-100 mb-6 leading-relaxed">Unlock unlimited playlists, AI-powered video summarization, and priority notifications.</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm">
                <Icon name="check_circle" className="text-[18px]" filled />
                Unlimited Reminders
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Icon name="check_circle" className="text-[18px]" filled />
                Video Summary Extracts
              </li>
            </ul>
          </div>
          <button className="w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg">
            Go Pro - $9/mo
          </button>
        </div>
      </div>
    </div>
  );
};

export const PlaylistDetail: React.FC = () => {
    return (
        <div className="text-white text-center p-10 bg-surface border border-border rounded-xl">
            <Icon name="playlist_play" className="text-6xl text-slate-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Playlist Details</h2>
            <p className="text-slate-400">Select a playlist from the dashboard to view details.</p>
        </div>
    )
}

export const Settings: React.FC = () => {
    const { user } = useAuth();
    return (
        <div className="max-w-3xl space-y-8">
            <h2 className="text-3xl font-black text-white">Settings</h2>
            <section className="bg-surface p-6 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-6">
                    <Icon name="person" className="text-primary text-xl" />
                    <h3 className="text-lg font-semibold text-white">Profile</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name</label>
                        <input type="text" defaultValue={user?.name} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
                        <input type="email" defaultValue={user?.email} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none" />
                    </div>
                </div>
            </section>
        </div>
    )
}

export const Reminders: React.FC = () => {
    return (
        <div className="max-w-4xl space-y-8">
            <h2 className="text-3xl font-black text-white">All Reminders</h2>
             <div className="bg-surface p-8 rounded-xl border border-border text-center">
                 <p className="text-slate-400">Your reminder configurations will appear here.</p>
             </div>
        </div>
    )
}

export const VideoSummary: React.FC = () => {
    return (
        <div className="max-w-4xl space-y-8">
            <h2 className="text-3xl font-black text-white">Video Insights</h2>
             <div className="bg-surface p-8 rounded-xl border border-border text-center">
                 <p className="text-slate-400">Select a video to generate AI summary.</p>
             </div>
        </div>
    )
}