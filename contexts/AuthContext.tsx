import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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

// Mock user database
const MOCK_USER: User = {
  id: 'u_123',
  name: 'Alex Rivers',
  email: 'alex@flow.io',
  avatar: 'https://picsum.photos/40/40?random=1'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for persisted session
    const storedUser = localStorage.getItem('yt_monitor_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple mock validation
        if (password.length < 6) {
          reject(new Error('Password must be at least 6 characters'));
          return;
        }
        // In a real app, we'd validate against a backend. 
        // Here we just simulate a successful login for any valid-looking input
        // or strictly check against our mock user for demo purposes.
        const loggedInUser = { ...MOCK_USER, email: email };
        setUser(loggedInUser);
        localStorage.setItem('yt_monitor_user', JSON.stringify(loggedInUser));
        resolve();
      }, 800); // Simulate network delay
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!email.includes('@')) {
           reject(new Error('Invalid email address'));
           return;
        }
        const newUser: User = {
          id: `u_${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff`
        };
        setUser(newUser);
        localStorage.setItem('yt_monitor_user', JSON.stringify(newUser));
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yt_monitor_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};