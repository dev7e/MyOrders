import { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import EmptyState from '../../components/ui/EmptyState';
import { Plus, Pencil, Trash2, Check, ArrowLeft, Users, ROLE_ICONS } from '../../components/icons';
import { ROLES, ROLE_KEYS, ROLE_DESCRIPTIONS } from '../../config/constants';
import { inputStyle, primaryBtn, secondaryBtn, smallBtn } from '../../styles/tokens';
import { usersService } from '../../services/users';

export default function UsersView({ currentUserId, showToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.list();
      setUsers(data);
    } catch (err) {
      showToast('خطأ: ' + err.message, 'error');
    }
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const removeUser = async (user) => {
    if (user.user_id === currentUserId) { alert('ما تقدر تحذف حسابك بنفسك'); return; }
    if (user.role === 'owner') {
      const owners = users.filter((u) => u.role === 'owner');
      if (owners.length <= 1) { alert('لازم يبقى مالك واحد على الأقل'); return; }
    }
    if (!window.confirm(`تبي تحذف صلاحية ${user.email}؟`)) return;
    try {
      await usersService.remove(user.user_id);
      showToast('تم حذف المستخدم');
      await loadUsers();
    } catch (err) {
      showToast('خطأ: ' + err.message, 'error');
    }
  };

  const saveEdit = async (changes) => {
    try {
      await usersService.updateProfile(editingUser.user_id, {
        role: changes.role !== editingUser.role ? changes.role : undefined,
        fullName: changes.full_name !== editingUser.full_name ? changes.full_name : undefined,
      });
      showToast('تم التحديث');
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      showToast('خطأ: ' + err.message, 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 className="font-display" style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>
          المستخدمون <span style={{ color: '#8a7e66', fontSize: '16px', fontWeight: 500 }}>({users.length})</span>
        </h2>
        <button onClick={() => setShowInvite(true)} style={primaryBtn}><Plus size={16} /> إضافة مستخدم</button>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e8e2d4', borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8a7e66', fontSize: '13px' }}>جاري التحميل...</div>
        ) : users.length === 0 ? (
          <EmptyState icon={<Users size={32} color="#bdb29a" />} title="ما فيه مستخدمين" description="ضيف أول مستخدم" />
        ) : (
          users.map((u) => {
            const roleInfo = ROLES[u.role] || ROLES.staff;
            const RoleIcon = ROLE_ICONS[u.role] || ROLE_ICONS.staff;
            const isMe = u.user_id === currentUserId;
            return (
              <div key={u.user_id} style={{ borderBottom: '1px solid #f0ece2', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: roleInfo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: roleInfo.color, fontSize: '16px', fontWeight: 600, flexShrink: 0 }}>
                  {(u.full_name || u.email)[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{u.full_name || u.email.split('@')[0]}</span>
                    {isMe && <span style={{ fontSize: '10px', backgroundColor: '#f0ece2', color: '#6b6558', padding: '2px 7px', borderRadius: '999px', fontWeight: 500 }}>أنت</span>}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '999px', backgroundColor: roleInfo.bg, color: roleInfo.color, border: '1px solid ' + roleInfo.border }}>
                      <RoleIcon size={10} /> {roleInfo.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#8a7e66' }}>{u.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setEditingUser(u)} style={smallBtn}><Pencil size={13} /> تعديل</button>
                  {!isMe && <button onClick={() => removeUser(u)} style={{ ...smallBtn, color: '#b91c1c', borderColor: '#fecaca' }}><Trash2 size={13} /></button>}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showInvite && <InviteUserModal existingEmails={users.map((u) => u.email)} onClose={() => setShowInvite(false)} onDone={() => { setShowInvite(false); loadUsers(); }} showToast={showToast} />}
      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={saveEdit} isCurrentUser={editingUser.user_id === currentUserId} />}
    </div>
  );
}

function InviteUserModal({ existingEmails, onClose, onDone, showToast }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', full_name: '', role: 'staff' });

  const handleNext = () => {
    if (!form.email.trim() || !form.email.includes('@')) { alert('أدخل إيميل صحيح'); return; }
    if (existingEmails.includes(form.email.trim().toLowerCase())) { alert('هذا الإيميل مضاف من قبل'); return; }
    setStep(2);
  };

  return (
    <Modal onClose={onClose} title="إضافة مستخدم جديد" size="small">
      {step === 1 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Field label="الإيميل *">
            <input type="email" autoFocus value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="employee@example.com" />
          </Field>
          <Field label="الاسم (اختياري)">
            <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} style={inputStyle} placeholder="مثلاً: أحمد محمد" />
          </Field>
          <Field label="الدور *">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {ROLE_KEYS.map((k) => {
                const v = ROLES[k];
                const Icon = ROLE_ICONS[k];
                const active = form.role === k;
                return (
                  <button key={k} type="button" onClick={() => setForm({ ...form, role: k })}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', border: '2px solid ' + (active ? v.color : '#e8e2d4'), backgroundColor: active ? v.bg : '#ffffff', cursor: 'pointer', textAlign: 'right' }}>
                    <Icon size={18} color={v.color} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: active ? v.color : '#1f1b12' }}>{v.label}</div>
                      <div style={{ fontSize: '11px', color: '#8a7e66', marginTop: '2px' }}>{ROLE_DESCRIPTIONS[k]}</div>
                    </div>
                    {active && <Check size={16} color={v.color} />}
                  </button>
                );
              })}
            </div>
          </Field>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <button onClick={onClose} style={secondaryBtn}>إلغاء</button>
            <button onClick={handleNext} style={primaryBtn}>التالي</button>
          </div>
        </div>
      ) : (
        <InviteStep2 form={form} onBack={() => setStep(1)} onDone={onDone} showToast={showToast} />
      )}
    </Modal>
  );
}

function InviteStep2({ form, onBack, onDone, showToast }) {
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    setChecking(true);
    try {
      const existing = await usersService.findByEmail(form.email);
      if (existing) {
        await usersService.updateProfile(existing.user_id, { role: form.role, fullName: form.full_name || null });
        showToast('تم إضافة المستخدم');
        onDone();
      } else {
        alert('ما حصّلنا المستخدم. تأكد إنك أنشأت الحساب في Supabase بنفس الإيميل، ثم اضغط مرة ثانية.');
      }
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '14px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', fontSize: '13px', color: '#92400e', lineHeight: 1.7 }}>
        <strong>⚠️ إضافة المستخدم تحتاج خطوتين:</strong>
        <ol style={{ margin: '8px 0 0', paddingRight: '20px' }}>
          <li>أنشئ الحساب في Supabase</li>
          <li>ارجع هني واضغط الزر تحت</li>
        </ol>
      </div>
      <div>
        <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 600 }}>الخطوة 1: أنشئ الحساب في Supabase</h4>
        <ol style={{ margin: 0, paddingRight: '20px', fontSize: '13px', color: '#4a4438', lineHeight: 2 }}>
          <li>افتح <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ color: '#0f5e52', fontWeight: 600 }}>لوحة Supabase</a> → <strong>Authentication</strong> → <strong>Users</strong></li>
          <li>اضغط <strong>Add user → Create new user</strong></li>
          <li>الصق الإيميل:
            <div style={{ display: 'flex', gap: '6px', margin: '4px 0' }}>
              <code style={{ flex: 1, padding: '6px 10px', backgroundColor: '#f6f2eb', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}>{form.email}</code>
              <button onClick={() => copy(form.email)} style={{ ...smallBtn, minWidth: '70px' }}>{copied ? '✓ تم' : 'نسخ'}</button>
            </div>
          </li>
          <li>أنشئ كلمة مرور مؤقتة وأرسلها للموظف</li>
          <li>فعّل <strong>Auto Confirm User</strong> ثم اضغط <strong>Create user</strong></li>
        </ol>
      </div>
      <div>
        <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 600 }}>الخطوة 2: ثبّت دوره</h4>
        <button onClick={handleConfirm} disabled={checking}
          style={{ ...primaryBtn, width: '100%', justifyContent: 'center', opacity: checking ? 0.6 : 1 }}>
          {checking ? 'جاري التحقق...' : 'أنشأت الحساب، ثبّت الدور الآن'}
        </button>
      </div>
      <div style={{ display: 'flex', gap: '10px', paddingTop: '8px', borderTop: '1px solid #e8e2d4' }}>
        <button onClick={onBack} style={secondaryBtn}><ArrowLeft size={14} /> رجوع</button>
      </div>
    </div>
  );
}

function EditUserModal({ user, onClose, onSave, isCurrentUser }) {
  const [form, setForm] = useState({ full_name: user.full_name || '', role: user.role });
  return (
    <Modal onClose={onClose} title={`تعديل ${user.email}`} size="small">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Field label="الاسم">
          <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} style={inputStyle} placeholder="الاسم الكامل" />
        </Field>
        <Field label="الدور">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {ROLE_KEYS.map((k) => {
              const v = ROLES[k];
              const Icon = ROLE_ICONS[k];
              const active = form.role === k;
              const disabled = isCurrentUser && k !== 'owner' && user.role === 'owner';
              return (
                <button key={k} type="button" disabled={disabled} onClick={() => !disabled && setForm({ ...form, role: k })}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: '2px solid ' + (active ? v.color : '#e8e2d4'), backgroundColor: active ? v.bg : '#ffffff', cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'right', opacity: disabled ? 0.5 : 1 }}>
                  <Icon size={16} color={v.color} />
                  <span style={{ flex: 1, fontSize: '14px', fontWeight: active ? 600 : 500 }}>{v.label}</span>
                  {active && <Check size={14} color={v.color} />}
                </button>
              );
            })}
          </div>
          {isCurrentUser && user.role === 'owner' && (
            <div style={{ fontSize: '11px', color: '#92400e', marginTop: '6px' }}>⚠️ ما تقدر تنزّل دورك من مالك.</div>
          )}
        </Field>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
          <button onClick={onClose} style={secondaryBtn}>إلغاء</button>
          <button onClick={() => onSave(form)} style={primaryBtn}><Check size={16} /> حفظ</button>
        </div>
      </div>
    </Modal>
  );
}
