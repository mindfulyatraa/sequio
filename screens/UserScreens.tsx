import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../src/utils/supabase';

interface Monitor {
  id: string;
  user_id: string;
  playlist_url: string;
  created_at: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonitors();
  }, [user]);

  const fetchMonitors = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('monitors')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setMonitors(data || []);
    } catch (err) {
      console.error('Error fetching monitors:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasMonitors = monitors.length > 0;

  // Empty state if no monitors
  if (!loading && !hasMonitors) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="bg-surface p-12 rounded-2xl border border-border">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Icon name="playlist_add" className="text-5xl text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">No Playlists Yet</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Start monitoring your favorite YouTube playlists to get instant notifications when new videos are uploaded.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primaryHover text-white font-bold py-3 px-8 rounded-xl transition-all"
          >
            Add Your First Playlist
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header section */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">Dashboard Overview</h2>
          <p className="text-slate-400 mt-1">
            Welcome back! Monitoring {monitors.length} {monitors.length === 1 ? 'playlist' : 'playlists'}.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-slate-400 hover:text-white transition-colors">
            <Icon name="search" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-primary font-medium mt-1">Premium Plan</p>
            </div>
            <div
              className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-primary/20"
              style={{ backgroundImage: `url('${user?.avatar || "https://ui-avatars.com/api/?name=User&background=random"}')` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: 'video_library', color: 'text-primary', label: 'Total Playlists', value: monitors.length.toString(), change: '+2%', changeColor: 'text-success bg-success/10' },
          { icon: 'pending_actions', color: 'text-primary', label: 'Pending Videos', value: '0', change: '0%', changeColor: 'text-slate-400 bg-slate-400/10' },
          { icon: 'alarm_on', color: 'text-primary', label: 'Active Reminders', value: '0', change: '0%', changeColor: 'text-slate-400 bg-slate-400/10' },
          { icon: 'visibility', color: 'text-primary', label: 'Watched This Week', value: '0', change: '+0%', changeColor: 'text-slate-400 bg-slate-400/10' },
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

      {/* Monitored Playlists */}
      <section className="bg-surface rounded-xl border border-border overflow-hidden mb-10">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Your Monitored Playlists</h3>
            <p className="text-sm text-slate-400">Active playlist monitoring</p>
          </div>
          <button className="text-primary text-sm font-bold hover:underline">Add New</button>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : monitors.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p>No playlists monitored yet</p>
            </div>
          ) : (
            monitors.map((monitor) => (
              <div key={monitor.id} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="playlist_play" className="text-primary text-3xl" filled />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-white truncate">{monitor.playlist_url}</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Added {new Date(monitor.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-success/10 text-success">Active</span>
                  <button className="text-slate-400 hover:text-white">
                    <Icon name="more_vert" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SYNC Status */}
      <section className="bg-surface rounded-xl border border-border overflow-hidden mb-10 p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
          <Icon name="chat" className="text-blue-500 text-3xl" filled />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Sync Status</h3>
        <p className="text-slate-400 mb-6">Connect Telegram or WhatsApp to receive notifications</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
            <Icon name="send" filled />
            Connect Telegram
          </button>
          <button className="px-6 py-3 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
            <Icon name="chat" filled />
            Connect WhatsApp
          </button>
        </div>
      </section>
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