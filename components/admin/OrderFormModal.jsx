import { useState, useMemo } from 'react';
import Modal from '../ui/Modal';
import Section from '../ui/Section';
import Field from '../ui/Field';
import ProductPickerModal from './ProductPickerModal';
import { Plus, Trash2, Check, PAYMENT_ICONS, SOURCE_ICONS } from '../icons';
import { PAYMENT_KEYS, PAYMENT_LABELS, SOURCE_KEYS, SOURCE_LABELS } from '../../config/constants';
import { inputStyle, primaryBtn, secondaryBtn, smallPrimaryBtn, qtyBtn } from '../../styles/tokens';
import { fmt } from '../../lib/helpers';

export default function OrderFormModal({ order, products, defaultDeliveryFee, onSave, onClose }) {
  const [form, setForm] = useState(order || {
    customerName: '', customerPhone: '',
    address: { area: '', block: '', street: '', avenue: '', house: '', extra: '' },
    items: [], deliveryFee: defaultDeliveryFee || 0,
    paymentMethod: 'cash', source: 'whatsapp', notes: '', status: 'new',
  });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const subtotal = useMemo(() => form.items.reduce((s, i) => s + i.price * i.quantity, 0), [form.items]);
  const total = subtotal + (parseFloat(form.deliveryFee) || 0);

  const addItem = (product) => {
    setForm((f) => {
      const existing = f.items.find((i) => i.productId === product.id);
      if (existing) return { ...f, items: f.items.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i) };
      return { ...f, items: [...f.items, { productId: product.id, name: product.name, price: product.price, quantity: 1 }] };
    });
    setPickerOpen(false);
  };
  const updateItemQty = (idx, qty) => {
    if (qty <= 0) setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
    else setForm((f) => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, quantity: qty } : it) }));
  };
  const removeItem = (idx) => setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    if (!form.customerName.trim()) { alert('الرجاء إدخال اسم الزبون'); return; }
    if (form.items.length === 0) { alert('الرجاء إضافة منتج واحد على الأقل'); return; }
    setSaving(true);
    await onSave({ ...form, subtotal, total });
    setSaving(false);
  };

  return (
    <Modal onClose={onClose} title={order ? `تعديل طلب #${order.orderNumber}` : 'طلب جديد'} size="large">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Section title="معلومات الزبون">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <Field label="الاسم *"><input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} style={inputStyle} placeholder="اسم الزبون" /></Field>
            <Field label="رقم التلفون"><input type="tel" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} style={inputStyle} placeholder="999xxxxx" /></Field>
          </div>
        </Section>

        <Section title="العنوان">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            <Field label="المنطقة"><input type="text" value={form.address.area} onChange={(e) => setForm({ ...form, address: { ...form.address, area: e.target.value } })} style={inputStyle} /></Field>
            <Field label="قطعة"><input type="text" value={form.address.block} onChange={(e) => setForm({ ...form, address: { ...form.address, block: e.target.value } })} style={inputStyle} /></Field>
            <Field label="شارع"><input type="text" value={form.address.street} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} style={inputStyle} /></Field>
            <Field label="جادة"><input type="text" value={form.address.avenue} onChange={(e) => setForm({ ...form, address: { ...form.address, avenue: e.target.value } })} style={inputStyle} /></Field>
            <Field label="بيت"><input type="text" value={form.address.house} onChange={(e) => setForm({ ...form, address: { ...form.address, house: e.target.value } })} style={inputStyle} /></Field>
          </div>
          <div style={{ marginTop: '12px' }}>
            <Field label="تفاصيل إضافية"><textarea value={form.address.extra} onChange={(e) => setForm({ ...form, address: { ...form.address, extra: e.target.value } })} style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} /></Field>
          </div>
        </Section>

        <Section title="المنتجات" action={<button onClick={() => setPickerOpen(true)} style={smallPrimaryBtn}><Plus size={14} /> إضافة منتج</button>}>
          {form.items.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#8a7e66', fontSize: '13px', backgroundColor: '#faf7f0', borderRadius: '10px', border: '1px dashed #e8e2d4' }}>ما فيه منتجات بالطلب</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {form.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: '#faf7f0', borderRadius: '10px', border: '1px solid #e8e2d4' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.name}</div>
                    <div className="num" style={{ fontSize: '12px', color: '#8a7e66' }}>{fmt(item.price)} د.ك</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => updateItemQty(idx, item.quantity - 1)} style={qtyBtn}>−</button>
                    <span className="num" style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                    <button onClick={() => updateItemQty(idx, item.quantity + 1)} style={qtyBtn}>+</button>
                  </div>
                  <div className="num" style={{ minWidth: '70px', textAlign: 'left', fontWeight: 600, color: '#0f5e52' }}>{fmt(item.price * item.quantity)}</div>
                  <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', padding: '4px' }}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="الدفع والمصدر">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Field label="طريقة الدفع">
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {PAYMENT_KEYS.map((k) => {
                  const Icon = PAYMENT_ICONS[k];
                  const active = form.paymentMethod === k;
                  return (
                    <button key={k} onClick={() => setForm({ ...form, paymentMethod: k })}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', border: '1px solid ' + (active ? '#0f5e52' : '#e8e2d4'), backgroundColor: active ? '#0f5e52' : '#ffffff', color: active ? '#ffffff' : '#4a4438', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                      <Icon size={14} /> {PAYMENT_LABELS[k]}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="مصدر الطلب">
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {SOURCE_KEYS.map((k) => {
                  const Icon = SOURCE_ICONS[k];
                  const active = form.source === k;
                  return (
                    <button key={k} onClick={() => setForm({ ...form, source: k })}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', border: '1px solid ' + (active ? '#0f5e52' : '#e8e2d4'), backgroundColor: active ? '#0f5e52' : '#ffffff', color: active ? '#ffffff' : '#4a4438', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                      <Icon size={14} /> {SOURCE_LABELS[k]}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        </Section>

        <Section title="ملاحظات">
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} />
        </Section>

        <Section title="الحساب">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>المجموع الفرعي</span><span className="num" style={{ fontWeight: 600 }}>{fmt(subtotal)} د.ك</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '14px' }}>
              <span>التوصيل</span>
              <input type="number" step="0.001" value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: parseFloat(e.target.value) || 0 })} className="num" style={{ ...inputStyle, width: '120px', textAlign: 'left' }} />
            </div>
            <div style={{ borderTop: '1px solid #e8e2d4', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700 }}>
              <span>الإجمالي</span><span className="num" style={{ color: '#0f5e52' }}>{fmt(total)} د.ك</span>
            </div>
          </div>
        </Section>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #e8e2d4' }}>
          <button onClick={onClose} disabled={saving} style={secondaryBtn}>إلغاء</button>
          <button onClick={handleSave} disabled={saving} style={{ ...primaryBtn, opacity: saving ? 0.6 : 1 }}><Check size={16} /> {saving ? 'جاري الحفظ...' : (order ? 'حفظ التعديلات' : 'حفظ الطلب')}</button>
        </div>
      </div>
      {pickerOpen && <ProductPickerModal products={products} onPick={addItem} onClose={() => setPickerOpen(false)} />}
    </Modal>
  );
}
