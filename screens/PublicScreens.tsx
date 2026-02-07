import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import { ScreenType } from '../types';

interface PublicProps {
    onNavigate: (screen: ScreenType) => void;
}

export const Landing: React.FC<PublicProps> = ({ onNavigate }) => {
    const [scrolled, setScrolled] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-[#101022] text-slate-100 min-h-screen font-sans selection:bg-primary/30">
            {/* Navigation Bar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#101022]/90 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-transparent border-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(60,60,246,0.5)]">
                            <Icon name="smart_display" className="text-white text-2xl" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">YouTube Monitor</span>
                    </div>
                    <div className="hidden md:flex items-center gap-10">
                        {['Features', 'Pricing', 'Integrations', 'FAQ'].map((item) => (
                            <button key={item} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                {item}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => onNavigate('LOGIN')} className="text-sm font-semibold text-white px-4 py-2 hover:text-primary transition-colors">
                            Login
                        </button>
                        <button onClick={() => onNavigate('SIGNUP')} className="bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                            Get Started Free
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 hero-glow -z-10"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    {/* Icon Highlight */}
                    <div className="inline-flex mb-8 items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 shadow-[0_0_50px_rgba(60,60,246,0.2)] animate-pulse">
                        <Icon name="video_library" className="text-primary text-5xl" />
                    </div>

                    {/* Headlines */}
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-[1.1]">
                        Never Miss a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">YouTube Video</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        Monitor your favorite playlists, get instant notifications via Telegram or WhatsApp. Stay updated without checking your feed.
                    </p>

                    {/* Hero Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => onNavigate('SIGNUP')} className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primaryHover text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/30 transition-all hover:-translate-y-1">
                            Get Started Free
                        </button>
                    </div>

                    {/* Visual Mockup */}
                    <div className="mt-20 relative mx-auto max-w-5xl">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur-2xl opacity-50"></div>
                        <div className="relative bg-[#0B0B15]/80 border border-white/10 rounded-2xl p-4 md:p-8 backdrop-blur-md shadow-2xl">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* WhatsApp Preview */}
                                <div className="text-left bg-slate-900/50 p-6 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <Icon name="chat" className="text-green-500 text-xl" filled />
                                        </div>
                                        <span className="font-bold text-white text-lg">WhatsApp Alerts</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-slate-800 p-4 rounded-xl border border-white/5 shadow-lg relative">
                                            <div className="absolute -left-2 top-4 w-2 h-3 bg-slate-800 clip-path-triangle"></div>
                                            <p className="text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-wide">YouTube Monitor • Just now</p>
                                            <p className="text-sm text-white font-medium leading-relaxed">
                                                🚀 <strong>New Upload:</strong> "The Future of AI" by TechCrunch.<br />
                                                <span className="text-slate-400 text-xs mt-1 block">Click to watch summary or video.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Telegram Preview */}
                                <div className="text-left bg-slate-900/50 p-6 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <Icon name="send" className="text-blue-400 text-xl" filled />
                                        </div>
                                        <span className="font-bold text-white text-lg">Telegram Notifications</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-slate-800 p-4 rounded-xl border border-white/5 shadow-lg relative">
                                            <div className="absolute -left-2 top-4 w-2 h-3 bg-slate-800 clip-path-triangle"></div>
                                            <p className="text-[10px] text-blue-400 mb-1 font-bold uppercase tracking-wide">Sequio Bot • 2m ago</p>
                                            <p className="text-sm text-white font-medium leading-relaxed">
                                                🎬 <strong>Summary Ready:</strong> "Coding with GPT-5"<br />
                                                <span className="text-slate-400 text-xs mt-2 block bg-black/20 p-2 rounded border-l-2 border-blue-500">
                                                    "This video explains how the new context window allows for entire codebase refactoring..."
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center border-t border-white/5 pt-6">
                                <p className="text-slate-400 text-sm">
                                    Get instant summaries & links delivered to your favorite app.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            {/* Social Proof / Trusted By */}
            <div className="py-10 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Trusted by Content Creators from</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['YouTube', 'Patreon', 'Discord', 'Twitch', 'Shopify'].map((brand) => (
                            <span key={brand} className="text-xl font-black text-white px-4">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-24 bg-[#101022] relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
                            Everything you need to <span className="text-primary">dominate</span> your feed
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Stop wasting time refreshing pages. Let our smart monitors do the heavy lifting while you focus on consuming content that matters.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: 'bolt', title: 'Real-time Detection', desc: 'Our engines scan YouTube APIs every 60 seconds. You wil know about a new video before the notification bell even rings.' },
                            { icon: 'notifications_active', title: 'Multi-Channel Alerts', desc: 'Get notified where you are most active. We support Telegram, WhatsApp, Discord, and Slack integrations out of the box.' },
                            { icon: 'psychology', title: 'AI-Powered Summaries', desc: "Skip the clickbait. Our AI watches the video for you and sends a 3-bullet summary instantly, so you decide if it's worth your time." },
                            { icon: 'history', title: 'Archive & Search', desc: 'Never lose a video again. We maintain a searchable archive of every notification sent, even if the creator deletes the video later.' },
                            { icon: 'tune', title: 'Custom Filters', desc: 'Only want videos longer than 10 minutes? Or containing specific keywords? Our granular filters give you full control.' },
                            { icon: 'security', title: 'Enterprise Security', desc: 'Your data is encrypted at rest and in transit. We use OAuth 2.0 for secure access without storing your password.' },
                        ].map((feature, i) => (
                            <div key={feature.title} className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/30 transition-all hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                                    <Icon name={feature.icon} className="text-primary text-2xl" filled />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 bg-[#0B0B15]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/20 rounded-lg p-1.5 flex items-center justify-center">
                                <Icon name="smart_display" className="text-primary text-xl" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white">YouTube Monitor</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'].map((item) => (
                                <a key={item} href="#" className="text-sm text-slate-500 hover:text-white transition-colors">
                                    {item}
                                </a>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"></path></svg>
                            </a>
                        </div>
                    </div>
                    <div className="text-center text-sm text-slate-600">
                        © 2024 YouTube Monitor. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}

export const Login: React.FC<PublicProps> = ({ onNavigate }) => {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await login("alex@flow.io", "password"); // Mock login for demo
            onNavigate('DASHBOARD');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-[#101022] flex flex-col font-sans antialiased text-slate-100">
            {/* Header / Navbar */}
            <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('LANDING')}>
                    <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                        <Icon name="smart_display" className="text-white text-xl" />
                    </div>
                    <span className="text-gray-900 dark:text-white font-bold text-lg tracking-tight">YouTube Monitor</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-sm text-gray-600 dark:text-gray-400 font-medium hover:text-primary transition-colors">Documentation</button>
                    <button className="text-sm bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-white/20 transition-all">Support</button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background decorative mesh similar to image */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(at 0% 0%, rgba(60, 60, 246, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(60, 60, 246, 0.1) 0px, transparent 50%)' }}></div>
                </div>

                <div className="w-full max-w-[400px] animate-in fade-in zoom-in duration-500 relative z-10">
                    {/* Auth Card */}
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-xl shadow-2xl shadow-black/50 border border-gray-200 dark:border-white/5 overflow-hidden">

                        {/* Card Header */}
                        <div className="p-8 pb-4 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-6">
                                <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z"></path>
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Welcome Back</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">
                                Sign in with your YouTube account to continue monitoring your favorite playlists
                            </p>
                        </div>

                        {/* Features Preview */}
                        <div className="px-8 py-4 flex justify-center gap-6">
                            <div className="flex flex-col items-center gap-1 opacity-60">
                                <Icon name="notifications_active" className="text-primary text-xl" filled />
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">Alerts</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 opacity-60">
                                <Icon name="send" className="text-primary text-xl" filled />
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">Telegram</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 opacity-60">
                                <Icon name="smart_toy" className="text-primary text-xl" filled />
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">AI Logic</span>
                            </div>
                        </div>

                        {/* Card Action */}
                        <div className="p-8 pt-6">
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primaryHover text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/25 group"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Z"></path>
                                        </svg>
                                        <span>Sign in with YouTube</span>
                                    </>
                                )}
                            </button>
                            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-gray-500 dark:text-gray-500 uppercase font-bold tracking-widest text-center opacity-70">
                                <Icon name="lock" className="text-sm" filled />
                                Secure OAuth2 Encryption
                            </div>
                        </div>

                        {/* Subtle Bottom Bar */}
                        <div className="bg-gray-50 dark:bg-black/20 px-8 py-4 border-t border-gray-100 dark:border-white/5">
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">
                                By signing in, you grant read-only access to your public and unlisted playlists. We never post on your behalf.
                            </p>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <footer className="mt-8 flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-600 font-medium">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <span>•</span>
                        <a href="#" className="hover:text-primary transition-colors">Contact</a>
                    </footer>
                </div>
            </main>

            {/* Bottom Decorative Gradient */}
            <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
        </div>
    )
}

export const Signup: React.FC<PublicProps> = ({ onNavigate }) => {
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup(name, email, password);
            onNavigate('DASHBOARD');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute bottom-[10%] left-[10%] w-96 h-96 bg-success/10 rounded-full blur-[100px]"></div>
                <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md bg-surface border border-border p-8 rounded-2xl shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-textMuted text-sm">Start monitoring your content in seconds.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-danger/10 border border-danger/20 text-danger text-sm font-bold rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-textMuted mb-1.5">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                            placeholder="Alex Rivers"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-textMuted mb-1.5">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-textMuted mb-1.5">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                            placeholder="Min. 6 characters"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-textMuted">
                    Already have an account? <button onClick={() => onNavigate('LOGIN')} className="text-primary hover:text-white font-bold transition-colors">Sign in</button>
                </p>
            </div>
        </div>
    )
}