import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Store, AlertTriangle, Check, ArrowLeft } from '../components/icons';
import { inputStyle, primaryBtn } from '../styles/tokens';
import { authService } from '../services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('login'); // 'login' or 'forgot'
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.signIn(email, password);
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'إيميل أو كلمة مرور خاطئة' : err.message);
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f2eb', padding: '20px' }}>
      <div className="animate-slide-up" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#0f5e52', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Store size={28} color="#ffffff" strokeWidth={2} />
          </div>
          <h1 className="font-display" style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>لوحة التحكم</h1>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#8a7e66' }}>سجّل دخول للوصول لنظام إدارة الطلبات</p>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e8e2d4' }}>
          {resetSent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Check size={28} color="#059669" />
              </div>
              <h3 className="font-display" style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600 }}>تم إرسال رابط إعادة التعيين</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b6558', lineHeight: 1.6 }}>
                تحقق من بريدك <strong>{email}</strong> وافتح الرابط لإعادة تعيين كلمة المرور.
              </p>
              <button onClick={() => { setResetSent(false); setMode('login'); }} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#0f5e52', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ArrowLeft size={14} /> رجوع لتسجيل الدخول
              </button>
            </div>
          ) : (
            <form onSubmit={mode === 'login' ? handleLogin : handleForgot} method="post" action="#" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {error && (
                <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#b91c1c', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              <div>
                <label htmlFor="login-email" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#6b6558', marginBottom: '6px' }}>الإيميل</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8a7e66' }} />
                  <input id="login-email" name="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" style={{ ...inputStyle, paddingRight: '40px' }} />
                </div>
              </div>

              {mode === 'login' && (
                <div>
                  <label htmlFor="login-password" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#6b6558', marginBottom: '6px' }}>كلمة المرور</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8a7e66' }} />
                    <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" style={{ ...inputStyle, paddingRight: '40px', paddingLeft: '40px' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#8a7e66' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} style={{ ...primaryBtn, width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'جاري...' : (mode === 'login' ? 'تسجيل الدخول' : 'إرسال رابط الاستعادة')}
              </button>

              <button type="button" onClick={() => { setMode(mode === 'login' ? 'forgot' : 'login'); setError(null); }}
                style={{ background: 'none', border: 'none', color: '#0f5e52', fontSize: '12px', fontWeight: 500, cursor: 'pointer', textAlign: 'center' }}>
                {mode === 'login' ? 'نسيت كلمة المرور؟' : '← رجوع لتسجيل الدخول'}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}
            style={{ fontSize: '12px', color: '#8a7e66', textDecoration: 'none' }}>
            ← رجوع للمتجر
          </a>
        </div>
      </div>
    </div>
  );
}
