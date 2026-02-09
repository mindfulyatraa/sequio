import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import { getUserPlaylists, deletePlaylist } from '../src/utils/playlist';

interface Playlist {
  id: string;
  user_id: string;
  playlist_id: string;
  playlist_url: string;
  title?: string;
  thumbnail?: string;
  channel_name?: string;
  video_count: number;
  last_checked_at?: string;
  created_at: string;
}

interface DashboardProps {
  onNavigate: (screen: any) => void;
  onSelectPlaylist: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectPlaylist }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaylists();
  }, [user]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchPlaylists = async () => {
    if (!user) return;

    try {
      const data = await getUserPlaylists(user.id);
      setPlaylists(data);
    } catch (err) {
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to limit monitoring for this playlist?')) return;

    try {
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      await deletePlaylist(playlistId);
    } catch (err) {
      console.error('Error deleting playlist:', err);
      fetchPlaylists(); // Revert on error
    }
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    onSelectPlaylist(playlist.id);
    onNavigate('PLAYLIST_DETAIL');
  };

  const hasPlaylists = playlists.length > 0;

  // Empty state if no monitors
  if (!loading && !hasPlaylists) {
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
            onClick={() => onNavigate('ONBOARDING')}
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
            Welcome back! Monitoring {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}.
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
          { icon: 'video_library', color: 'text-primary', label: 'Total Playlists', value: playlists.length.toString(), change: '+2%', changeColor: 'text-success bg-success/10' },
          { icon: 'pending_actions', color: 'text-primary', label: 'Pending Videos', value: '0', change: '0%', changeColor: 'text-slate-400 bg-slate-400/10' },
          { icon: 'alarm_on', color: 'text-primary', label: 'Active Reminders', value: '0', change: '0%', changeColor: 'text-slate-400 bg-slate-400/10' },
          { icon: 'visibility', color: 'text-primary', label: 'Watched This Week', value: '0', change: '+0%', changeColor: 'text-slate-400 bg-slate-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface p-6 rounded-2xl border border-border hover:border-primary/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-surface-hover ${stat.color} group-hover:scale-110 transition-transform`}>
                <Icon name={stat.icon} className="text-2xl" filled />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.changeColor}`}>{stat.change}</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-black text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Monitored Playlists */}
      <section className="bg-surface rounded-2xl border border-border overflow-hidden mb-10">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">Your Monitored Playlists</h3>
            <p className="text-sm text-slate-400 mt-1">Active playlist monitoring</p>
          </div>
          <button
            onClick={() => onNavigate('ONBOARDING')}
            className="text-primary hover:text-primary-hover font-bold text-sm bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors"
          >
            Add New
          </button>
        </div>
        <div>
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading playlists...</div>
          ) : !hasPlaylists ? (
            <div className="p-8 text-center text-slate-500">
              <p>No playlists monitored yet</p>
            </div>
          ) : (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4 cursor-pointer group"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  {playlist.thumbnail ? (
                    <img src={playlist.thumbnail} alt={playlist.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Icon name="playlist_play" className="text-primary text-3xl" filled />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-white truncate group-hover:text-primary transition-colors">{playlist.title || playlist.playlist_url}</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    {playlist.video_count} videos • Added {new Date(playlist.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 relative">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-success/10 text-success">Active</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === playlist.id ? null : playlist.id);
                    }}
                    className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Icon name="more_vert" />
                  </button>

                  {activeMenuId === playlist.id && (
                    <div className="absolute right-0 top-10 w-48 bg-surface border border-border rounded-xl shadow-xl z-10 overflow-hidden">
                      <button
                        onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-white/5 flex items-center gap-2"
                      >
                        <Icon name="delete" className="text-lg" />
                        Delete Playlist
                      </button>
                    </div>
                  )}
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

import { getPlaylistVideos } from '../src/utils/playlist';
import { supabase } from '../src/utils/supabase';

interface PlaylistDetailProps {
  playlistId: string | null;
  onNavigate: (screen: any) => void;
}

export const PlaylistDetail: React.FC<PlaylistDetailProps> = ({ playlistId, onNavigate }) => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistDetails();
    }
  }, [playlistId]);

  const fetchPlaylistDetails = async () => {
    try {
      setLoading(true);
      // Fetch playlist metadata
      const { data: playlistData, error: playlistError } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', playlistId)
        .single();

      if (playlistError) throw playlistError;
      setPlaylist(playlistData);

      // Fetch videos
      const videosData = await getPlaylistVideos(playlistId!);
      setVideos(videosData);
    } catch (err) {
      console.error('Error fetching playlist details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!playlistId) {
    return (
      <div className="text-white text-center p-10 bg-surface border border-border rounded-xl">
        <Icon name="playlist_play" className="text-6xl text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Playlist Details</h2>
        <p className="text-slate-400">Select a playlist from the dashboard to view details.</p>
        <button
          onClick={() => onNavigate('DASHBOARD')}
          className="mt-6 text-primary hover:text-primary-hover font-bold"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Playlist not found.</p>
        <button
          onClick={() => onNavigate('DASHBOARD')}
          className="mt-4 text-primary hover:text-primary-hover font-bold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => onNavigate('DASHBOARD')}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <Icon name="arrow_back" />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden mb-8">
        <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-48 aspect-video md:aspect-square rounded-xl overflow-hidden bg-black/20 shrink-0">
            {playlist.thumbnail ? (
              <img src={playlist.thumbnail} alt={playlist.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="playlist_play" className="text-5xl text-primary" filled />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-white mb-2">{playlist.title}</h1>
            <p className="text-lg text-slate-300 mb-4">{playlist.channel_name}</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
              <span className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-lg border border-border">
                <Icon name="movie" className="text-primary" />
                {playlist.video_count} videos
              </span>
              <span className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-lg border border-border">
                <Icon name="calendar_today" className="text-primary" />
                Added {new Date(playlist.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-4">
              <a
                href={playlist.playlist_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primaryHover text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2"
              >
                <Icon name="open_in_new" />
                Open in YouTube
              </a>
              <button className="bg-surface hover:bg-white/5 border border-border text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2">
                <Icon name="refresh" />
                Sync Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <Icon name="movie" className="text-primary" />
        Latest Videos
      </h3>

      <div className="grid gap-4">
        {videos.length === 0 ? (
          <div className="bg-surface p-12 text-center rounded-2xl border border-border">
            <p className="text-slate-400">No videos synced yet. Click "Sync Now" to fetch videos.</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="bg-surface p-4 rounded-xl border border-border hover:border-primary/50 transition-colors flex gap-4 group">
              <div className="w-40 aspect-video bg-black/20 rounded-lg overflow-hidden shrink-0 relative">
                <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {new Date(video.published_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h4 className="text-lg font-bold text-white truncate group-hover:text-primary transition-colors">{video.title}</h4>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{video.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    Watch Video <Icon name="open_in_new" className="text-[10px]" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

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