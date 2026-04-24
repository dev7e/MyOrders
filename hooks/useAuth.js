import { useEffect, useState } from 'react';
import { authService } from '../services/auth';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
    const unsubscribe = authService.onAuthChange((newSession) => {
      setSession(newSession);
    });
    return unsubscribe;
  }, []);

  return { session, loading };
}
