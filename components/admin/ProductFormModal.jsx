import { useState, useRef } from 'react';
import Modal from '../ui/Modal';
import Field from '../ui/Field';
import { ImageIcon, Upload, Trash2, Check } from '../icons';
import { inputStyle, primaryBtn, secondaryBtn, smallBtn } from '../../styles/tokens';
import { storageService } from '../../services/storage';

export default function ProductFormModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || { name: '', price: 0, imageUrl: '', description: '', isActive: true });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await storageService.uploadProductImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      alert('فشل رفع الصورة: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { alert('اكتب اسم المنتج'); return; }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <Modal onClose={onClose} title={product ? 'تعديل منتج' : 'منتج جديد'} size="small">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Field label="صورة المنتج">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '10px', backgroundColor: '#faf7f0', border: '1px solid #e8e2d4', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {form.imageUrl ? <img src={form.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={24} color="#bdb29a" />}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleUpload(e.target.files[0])} />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ ...smallBtn, justifyContent: 'center' }}>
                <Upload size={13} /> {uploading ? 'جاري الرفع...' : (form.imageUrl ? 'تغيير الصورة' : 'رفع صورة')}
              </button>
              {form.imageUrl && (
                <button type="button" onClick={() => setForm({ ...form, imageUrl: '' })} style={{ ...smallBtn, color: '#b91c1c', borderColor: '#fecaca', justifyContent: 'center' }}>
                  <Trash2 size={13} /> إزالة
                </button>
              )}
            </div>
          </div>
        </Field>
        <Field label="اسم المنتج *"><input type="text" autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="مثلاً: قلادة فضة" /></Field>
        <Field label="السعر (د.ك) *"><input type="number" step="0.001" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} /></Field>
        <Field label="الوصف (اختياري)"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }} placeholder="وصف قصير للمنتج..." /></Field>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: '#faf7f0', borderRadius: '10px', cursor: 'pointer', border: '1px solid #e8e2d4' }}>
          <input type="checkbox" checked={form.isActive !== false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            style={{ width: '18px', height: '18px', accentColor: '#0f5e52' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{form.isActive !== false ? 'ظاهر في المتجر' : 'مخفي من المتجر'}</div>
            <div style={{ fontSize: '11px', color: '#8a7e66' }}>{form.isActive !== false ? 'الزباين يشوفونه ويقدرون يطلبونه' : 'المنتج موجود بس ما يظهر للزباين'}</div>
          </div>
        </label>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
          <button onClick={onClose} disabled={saving} style={secondaryBtn}>إلغاء</button>
          <button onClick={handleSave} disabled={saving || uploading} style={{ ...primaryBtn, opacity: (saving || uploading) ? 0.6 : 1 }}><Check size={16} /> {saving ? 'جاري الحفظ...' : 'حفظ'}</button>
        </div>
      </div>
    </Modal>
  );
}
