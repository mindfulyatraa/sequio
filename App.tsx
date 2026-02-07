import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ScreenType } from './types';
import { Dashboard, PlaylistDetail, Settings, Reminders, VideoSummary } from './screens/UserScreens';
import { AdminDashboard, AdminQueues, CostAnalysis } from './screens/AdminScreens';
import { Landing, Login, Signup } from './screens/PublicScreens';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('LANDING');
  const { isAuthenticated, isLoading } = useAuth();

  // Guard protected routes
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        if (['LANDING', 'LOGIN', 'SIGNUP'].includes(currentScreen)) {
          setCurrentScreen('DASHBOARD');
        }
      } else {
        if (!['LANDING', 'LOGIN', 'SIGNUP'].includes(currentScreen)) {
          setCurrentScreen('LOGIN');
        }
      }
    }
  }, [isAuthenticated, currentScreen, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LANDING':
        return <Landing onNavigate={setCurrentScreen} />;
      case 'LOGIN':
        return <Login onNavigate={setCurrentScreen} />;
      case 'SIGNUP':
        return <Signup onNavigate={setCurrentScreen} />;
      case 'DASHBOARD':
        return <Dashboard />;
      case 'PLAYLIST_DETAIL':
        return <PlaylistDetail />;
      case 'SETTINGS':
        return <Settings />;
      case 'REMINDERS':
        return <Reminders />;
      case 'VIDEO_SUMMARY':
        return <VideoSummary />;
      case 'ADMIN_DASHBOARD':
        return <AdminDashboard />;
      case 'ADMIN_QUEUES':
        return <AdminQueues />;
      case 'ADMIN_COST':
        return <CostAnalysis />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentScreen={currentScreen} onNavigate={setCurrentScreen}>
      {renderScreen()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;