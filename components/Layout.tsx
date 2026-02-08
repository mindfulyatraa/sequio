import React from 'react';
import { ScreenType } from '../types';
import { Icon } from './Icon';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentScreen, onNavigate, children }) => {
  const { logout } = useAuth();

  // For Landing, Login, Signup, Onboarding pages, render without sidebar
  if (['LANDING', 'LOGIN', 'SIGNUP', 'ONBOARDING'].includes(currentScreen)) {
    return <>{children}</>;
  }

  const NavItem = ({ id, icon, label, hasDot }: { id: ScreenType, icon: string, label: string, hasDot?: boolean }) => (
    <button
      onClick={() => onNavigate(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group ${currentScreen === id
        ? 'bg-primary text-white shadow-lg shadow-primary/20'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
    >
      <Icon name={icon} className="text-[22px]" filled={currentScreen === id} />
      <span className="text-sm font-medium">{label}</span>
      {hasDot && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></span>
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-background text-textMain">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-surface border-r border-border flex flex-col z-50">
        <div className="p-6">
          <div className="flex items-center gap-3">
            {/* Logo - Clickable to navigate home */}
            <button
              onClick={() => onNavigate(currentScreen === 'DASHBOARD' || currentScreen === 'SETTINGS' ? 'DASHBOARD' : 'LANDING')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img src="/logo.png" alt="Sequio" className="h-10 w-auto" />
              <h1 className="text-xl font-bold leading-none text-white hidden sm:block">Sequio</h1>
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem id="DASHBOARD" icon="dashboard" label="Dashboard" />
          <NavItem id="PLAYLIST_DETAIL" icon="playlist_play" label="Playlists" />
          <NavItem id="REMINDERS" icon="notification_important" label="Reminders" hasDot />
          <NavItem id="SETTINGS" icon="settings" label="Settings" />

          {/* Admin Items (Hidden from main UI logic for now, accessible if needed) */}
          {currentScreen.startsWith('ADMIN') && (
            <>
              <div className="my-4 border-t border-border"></div>
              <p className="px-3 text-xs font-bold text-slate-500 uppercase mb-2">Admin</p>
              <NavItem id="ADMIN_DASHBOARD" icon="admin_panel_settings" label="Overview" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Sync Status</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-[13px] font-medium text-white">Telegram Connected</span>
            </div>
            <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
              Sync Now
            </button>
          </div>

          <button
            onClick={() => {
              logout();
              onNavigate('LANDING');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-danger/10 hover:text-danger transition-colors"
          >
            <Icon name="logout" className="text-[22px]" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};