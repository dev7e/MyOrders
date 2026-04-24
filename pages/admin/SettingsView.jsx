import { useState } from 'react';
import Field from '../../components/ui/Field';
import { Cloud } from '../../components/icons';
import { can } from '../../config/constants';
import { inputStyle, primaryBtn } from '../../styles/tokens';

export default function SettingsView({ settings, userRole, onSave }) {
  const [form, setForm] = useState(settings);
  const canEdit = can.manageSettings(userRole);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '640px' }}>
      <h2 className="font-display" style={{ margin: '0 0 20px', fontSize: '22px', fontWeight: 600 }}>الإعدادات</h2>
      {!canEdit && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', color: '#92400e' }}>
          🔒 العرض فقط — تعديل الإعدادات محصور بالمدير والمالك
        </div>
      )}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e8e2d4', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
        <Field label="اسم المحل / البراند">
          <input type="text" disabled={!canEdit} value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} style={inputStyle} placeholder="اسم المحل" />
        </Field>
        <Field label="رقم التلفون">
          <input type="tel" disabled={!canEdit} value={form.shopPhone} onChange={(e) => setForm({ ...form, shopPhone: e.target.value })} style={inputStyle} placeholder="مثال: 99999999" />
        </Field>
        <Field label="سعر التوصيل الافتراضي (د.ك)">
          <input type="number" disabled={!canEdit} step="0.001" value={form.defaultDeliveryFee} onChange={(e) => setForm({ ...form, defaultDeliveryFee: parseFloat(e.target.value) || 0 })} style={inputStyle} />
        </Field>
        {canEdit && <button onClick={() => onSave(form)} style={{ ...primaryBtn, alignSelf: 'flex-start' }}>حفظ الإعدادات</button>}
      </div>

      <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <Cloud size={18} color="#047857" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#047857', marginBottom: '4px' }}>البيانات محفوظة بالسحابة</div>
            <div style={{ fontSize: '12px', color: '#065f46', lineHeight: 1.6 }}>
              كل طلباتك ومنتجاتك محفوظة على Supabase. تقدر تفتح النظام من أي جهاز وتلقى نفس البيانات.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
