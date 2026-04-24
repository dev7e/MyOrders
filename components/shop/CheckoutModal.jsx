import { useState } from 'react';
import Modal from '../ui/Modal';
import Section from '../ui/Section';
import Field from '../ui/Field';
import { AlertTriangle, PAYMENT_ICONS } from '../icons';
import { KW_AREAS_BY_GOV, KW_GOVS, PAYMENT_KEYS, PAYMENT_LABELS } from '../../config/constants';
import { inputStyle, primaryBtn, secondaryBtn } from '../../styles/tokens';
import { fmt, dbOrderToApp } from '../../lib/helpers';
import { ordersService } from '../../services/orders';

export default function CheckoutModal({ cart, subtotal, deliveryFee, total, onClose, onSuccess }) {
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    area: '',
    block: '',
    street: '',
    avenue: '',
    house: '',
    extra: '',
    paymentMethod: 'cash',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.customerName.trim()) {
      setError('أدخل اسمك');
      return;
    }
    if (!form.customerPhone.trim() || form.customerPhone.length < 8) {
      setError('أدخل رقم تلفون صحيح');
      return;
    }
    if (!form.area) {
      setError('اختر المنطقة');
      return;
    }
    if (!form.block.trim() || !form.street.trim() || !form.house.trim()) {
      setError('أكمل بيانات العنوان');
      return;
    }

    setSubmitting(true);
    try {
      const order = {
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        address: {
          area: form.area,
          block: form.block.trim(),
          street: form.street.trim(),
          avenue: form.avenue.trim(),
          house: form.house.trim(),
          extra: form.extra.trim(),
        },
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod: form.paymentMethod,
        source: 'website',
        status: 'new',
        notes: form.notes.trim() || null,
      };
      const created = await ordersService.create(order);
      onSuccess(created);
    } catch (err) {
      setError('فشل إرسال الطلب: ' + err.message);
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} title="إتمام الطلب" size="medium">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#b91c1c',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <Section title="بياناتك">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <Field label="الاسم *">
              <input
                type="text"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                style={inputStyle}
                placeholder="اسمك الكريم"
              />
            </Field>
            <Field label="رقم التلفون *">
              <input
                type="tel"
                required
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                style={inputStyle}
                placeholder="999xxxxx"
              />
            </Field>
          </div>
        </Section>

        <Section title="عنوان التوصيل">
          <Field label="المنطقة *">
            <select
              required
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              style={inputStyle}
            >
              <option value="">اختر المنطقة</option>
              {KW_GOVS.map((gov) => (
                <optgroup key={gov} label={`محافظة ${gov}`}>
                  {KW_AREAS_BY_GOV[gov].map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '12px',
              marginTop: '12px',
            }}
          >
            <Field label="قطعة *">
              <input
                type="text"
                required
                value={form.block}
                onChange={(e) => setForm({ ...form, block: e.target.value })}
                style={inputStyle}
              />
            </Field>
            <Field label="شارع *">
              <input
                type="text"
                required
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                style={inputStyle}
              />
            </Field>
            <Field label="جادة">
              <input
                type="text"
                value={form.avenue}
                onChange={(e) => setForm({ ...form, avenue: e.target.value })}
                style={inputStyle}
              />
            </Field>
            <Field label="بيت *">
              <input
                type="text"
                required
                value={form.house}
                onChange={(e) => setForm({ ...form, house: e.target.value })}
                style={inputStyle}
              />
            </Field>
          </div>
          <div style={{ marginTop: '12px' }}>
            <Field label="تفاصيل إضافية">
              <textarea
                value={form.extra}
                onChange={(e) => setForm({ ...form, extra: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
                placeholder="علامة مميزة / طابق / شقة..."
              />
            </Field>
          </div>
        </Section>

        <Section title="طريقة الدفع">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {PAYMENT_KEYS.map((k) => {
              const Icon = PAYMENT_ICONS[k];
              const active = form.paymentMethod === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: k })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '2px solid ' + (active ? '#0f5e52' : '#e8e2d4'),
                    backgroundColor: active ? '#ecfdf5' : '#ffffff',
                    color: active ? '#0f5e52' : '#4a4438',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={14} /> {PAYMENT_LABELS[k]}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="ملاحظات (اختياري)">
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
            placeholder="أي ملاحظة للبائع..."
          />
        </Section>

        <div
          style={{
            padding: '14px',
            backgroundColor: '#faf7f0',
            border: '1px solid #e8e2d4',
            borderRadius: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#6b6558',
              marginBottom: '4px',
            }}
          >
            <span>المجموع الفرعي</span>
            <span className="num">{fmt(subtotal)} د.ك</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#6b6558',
              marginBottom: '8px',
            }}
          >
            <span>التوصيل</span>
            <span className="num">{fmt(deliveryFee)} د.ك</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '16px',
              fontWeight: 700,
              color: '#0f5e52',
              borderTop: '1px dashed #d5ccb8',
              paddingTop: '8px',
            }}
          >
            <span>الإجمالي</span>
            <span className="num">{fmt(total)} د.ك</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', paddingTop: '8px', borderTop: '1px solid #e8e2d4' }}>
          <button type="button" onClick={onClose} disabled={submitting} style={secondaryBtn}>
            إلغاء
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{ ...primaryBtn, flex: 1, justifyContent: 'center', opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
