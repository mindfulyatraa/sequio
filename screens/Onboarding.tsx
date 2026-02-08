import React, { useState } from 'react';
import { ScreenType } from '../types';
import { Icon } from '../components/Icon';
import { supabase } from '../src/utils/supabase';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingProps {
    onNavigate: (screen: ScreenType) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onNavigate }) => {
    const { user, connectYouTube } = useAuth();
    const [playlistUrl, setPlaylistUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePlaylistSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!playlistUrl) return;

        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.from('monitors').insert({
                user_id: user?.id,
                type: 'playlist',
                source_url: playlistUrl,
                status: 'active',
                name: 'My Playlist' // Default name, can be fetched later
            });

            if (error) throw error;
            onNavigate('DASHBOARD');
        } catch (err: any) {
            console.error(err);
            // If table doesn't exist, we might get an error. 
            // For now, let's assume we handle it or notify user to run migration.
            if (err.message?.includes('relation "monitors" does not exist')) {
                setError('Database not ready. Please contact admin.');
            } else {
                setError(err.message || 'Failed to add playlist');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleConnectYouTube = async () => {
        try {
            await connectYouTube();
            // User will be redirected to Google for auth
        } catch (err: any) {
            console.error(err);
            setError('Failed to connect YouTube');
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B15] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-4xl w-full relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 shadow-2xl shadow-primary/30 mb-6 animate-bounce-slow">
                        <Icon name="rocket_launch" className="text-3xl text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Let's Get Started
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Connect your content source to start receiving real-time AI summaries.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Option 1: Connect YouTube */}
                    <button
                        onClick={handleConnectYouTube}
                        className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-red-500/50 rounded-2xl p-8 text-left transition-all hover:-translate-y-1"
                    >
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon name="arrow_forward" className="text-white text-sm" />
                        </div>
                        <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon name="smart_display" className="text-3xl text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">Connect YouTube</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Auto-sync your channel's uploads. We'll monitor everything you publish.
                        </p>
                    </button>

                    {/* Option 2: Monitor Playlist */}
                    <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                        <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                            <Icon name="playlist_play" className="text-3xl text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">Monitor Playlist</h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Paste any public YouTube playlist URL to track specific content.
                        </p>

                        <form onSubmit={handlePlaylistSubmit}>
                            <div className="relative">
                                <input
                                    type="url"
                                    required
                                    placeholder="https://youtube.com/playlist?list=..."
                                    value={playlistUrl}
                                    onChange={(e) => setPlaylistUrl(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-1 top-1 bottom-1 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                        </form>
                    </div>
                </div>

                <button
                    onClick={() => onNavigate('DASHBOARD')}
                    className="mt-12 mx-auto block text-slate-500 text-sm hover:text-white transition-colors"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
};
