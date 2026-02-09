export type ScreenType =
  | 'LANDING'
  | 'LOGIN'
  | 'SIGNUP'
  | 'ONBOARDING'
  | 'ADD_PLAYLIST'
  | 'DASHBOARD'
  | 'PLAYLIST_DETAIL'
  | 'REMINDERS'
  | 'SETTINGS'
  | 'VIDEO_SUMMARY'
  | 'ADMIN_DASHBOARD'
  | 'ADMIN_QUEUES'
  | 'ADMIN_COST';


export interface NavItem {
  id: ScreenType;
  label: string;
  icon: string;
  isAdmin?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Playlist {
  id: string;
  title: string;
  channel: string;
  videoCount: number;
  status: 'ACTIVE' | 'IDLE' | 'PAUSED';
  thumbnail: string;
  lastUpdated: string;
}

export interface Video {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  status: 'NEW' | 'WATCHED' | 'WATCHING';
  hasAiSummary: boolean;
}