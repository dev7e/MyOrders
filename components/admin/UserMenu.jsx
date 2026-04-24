import { useState } from 'react';
import { LogOut } from '../icons';
import { authService } from '../../services/auth';

export default function UserMenu({ session }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const email = session?.user?.email || '';
  const initial = (email[0] || '?').toUpperCase();

  const handleLogout = async () => {
    if (!window.confirm('تبي تسجل خروج؟')) return;
    setLoggingOut(true);
    await authService.signOut();
    setLoggingOut(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #e8e2d4', backgroundColor: '#faf7f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, color: '#0f5e52' }}>
        {initial}
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setOpen(false)} />
          <div className="animate-slide-up" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, backgroundColor: '#ffffff', border: '1px solid #e8e2d4', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', minWidth: '240px', zIndex: 30, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0ece2' }}>
              <div style={{ fontSize: '12px', color: '#8a7e66', marginBottom: '2px' }}>مسجّل دخول كـ</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f1b12', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</div>
            </div>
            <button onClick={handleLogout} disabled={loggingOut}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#b91c1c', textAlign: 'right', fontWeight: 500 }}>
              <LogOut size={16} /> {loggingOut ? 'جاري الخروج...' : 'تسجيل خروج'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
