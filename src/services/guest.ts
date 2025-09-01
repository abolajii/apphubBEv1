import { serverConfig } from '../config/index';

interface GuestUser {
  id: string;
  sessionId: string;
  role: 'guest';
  permissions: string[];
  createdAt: Date;
  expiresAt: Date;
}

const guestSessions: Map<string, GuestUser> = new Map();
const GUEST_SESSION_DURATION = 24 * 60 * 60 * 1000;

const generateSessionId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createGuestSession = (): GuestUser => {
  const sessionId = generateSessionId();
  const guestUser: GuestUser = {
    id: `guest_${sessionId}`,
    sessionId,
    role: 'guest',
    permissions: ['read:public', 'create:guest_content', 'read:guest_content'],
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + GUEST_SESSION_DURATION)
  };

  guestSessions.set(sessionId, guestUser);
  return guestUser;
};

export const getGuestUser = (sessionId: string): GuestUser | null => {
  const guestUser = guestSessions.get(sessionId);
  
  if (!guestUser || new Date() > guestUser.expiresAt) {
    if (guestUser) guestSessions.delete(sessionId);
    return null;
  }

  return guestUser;
};
