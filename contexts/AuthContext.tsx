import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../src/utils/supabase';
import { saveOAuthTokens } from '../src/utils/oauth-tokens';

// Map Supabase User to our App User type if needed, or use Supabase type
interface AppUser {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  connectYouTube: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.name || 'User')}&background=random`
        });
      }
      setIsLoading(false);
    });

    // 2. Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.name || 'User')}&background=random`
        });

        // Save OAuth tokens if user signed in via OAuth (non-blocking)
        if (event === 'SIGNED_IN' && session.provider_token) {
          // Don't await - run in background
          saveOAuthTokens({
            user_id: session.user.id,
            provider: 'google',
            access_token: session.provider_token,
            refresh_token: session.provider_refresh_token || '',
            expires_at: new Date(Date.now() + (session.expires_in || 3600) * 1000).toISOString(),
            scope: session.user.user_metadata?.provider_scopes || ''
          }).then(() => {
            console.log('OAuth tokens saved successfully');
          }).catch(err => {
            console.error('Failed to save OAuth tokens:', err);
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    });

    if (error) throw error;
    // Note: By default Supabase waits for email verification. 
    // If you want auto-login, you need to disable "Confirm email" in Supabase Dashboard -> Auth -> Providers -> Email
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) throw error;
  };

  const connectYouTube = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        scopes: 'https://www.googleapis.com/auth/youtube.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      login,
      signup,
      loginWithGoogle,
      connectYouTube,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};