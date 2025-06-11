// Simple in-memory session store (consider using Redis or a database in production)
const sessions = new Map<string, { createdAt: number; expiresAt: number }>();

export function cleanupSessions() {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token);
    }
  }
}

export function createSession(token: string, durationMs: number) {
  const now = Date.now();
  sessions.set(token, {
    createdAt: now,
    expiresAt: now + durationMs
  });
}

export function getSession(token: string) {
  return sessions.get(token);
}

export function deleteSession(token: string) {
  sessions.delete(token);
}

export function isSessionValid(token: string): boolean {
  const session = sessions.get(token);
  return session ? Date.now() < session.expiresAt : false;
}