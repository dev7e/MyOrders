import { useEffect } from 'react';
import { useRoute } from './hooks/useRoute';
import { useAuth } from './hooks/useAuth';
import PublicShop from './pages/PublicShop';
import LoginScreen from './pages/LoginScreen';
import AdminLayout from './pages/admin/AdminLayout';

function AuthGate() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f2eb' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!session) return <LoginScreen />;
  return <AdminLayout session={session} />;
}

export default function App() {
  const route = useRoute();

  // remove initial loader if present
  useEffect(() => {
    const el = document.getElementById('loading');
    if (el) el.remove();
  }, []);

  if (route.startsWith('#admin')) return <AuthGate />;
  return <PublicShop />;
}
