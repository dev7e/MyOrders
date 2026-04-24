import { useEffect } from 'react';
import { Printer } from '../icons';
import { PAYMENT_LABELS, SOURCE_LABELS } from '../../config/constants';
import { primaryBtn, secondaryBtn } from '../../styles/tokens';
import { fmt, formatDate, buildAddressString } from '../../lib/helpers';

export default function InvoicePrintView({ order, settings, onClose }) {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 200);
    return () => clearTimeout(t);
  }, []);

  const addressStr = buildAddressString(order.address);

  return (
    <div dir="rtl" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', overflowY: 'auto' }} className="animate-fade-in">
      <div style={{ backgroundColor: '#ffffff', maxWidth: '720px', width: '100%', borderRadius: '14px', overflow: 'hidden' }}>
        <div className="no-print" style={{ padding: '14px 20px', borderBottom: '1px solid #e8e2d4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="font-display" style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>معاينة الفاتورة</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => window.print()} style={primaryBtn}><Printer size={14} /> طباعة</button>
            <button onClick={onClose} style={secondaryBtn}>إغلاق</button>
          </div>
        </div>

        <div className="print-area" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '20px', borderBottom: '2px solid #0f5e52' }}>
            <div>
              <h1 className="font-display" style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#0f5e52' }}>{settings.shopName || 'متجري'}</h1>
              {settings.shopPhone && <div style={{ fontSize: '13px', color: '#6b6558', marginTop: '4px' }}>تلفون: {settings.shopPhone}</div>}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '14px', color: '#8a7e66', marginBottom: '4px' }}>فاتورة</div>
              <div className="num font-display" style={{ fontSize: '22px', fontWeight: 700 }}>#{order.orderNumber}</div>
              <div style={{ fontSize: '12px', color: '#6b6558', marginTop: '4px' }}>{formatDate(order.createdAt)}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#8a7e66', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>الزبون</div>
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>{order.customerName}</div>
              {order.customerPhone && <div className="num" style={{ fontSize: '13px' }}>{order.customerPhone}</div>}
            </div>
            {(addressStr || order.address?.extra) && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#8a7e66', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>العنوان</div>
                {addressStr && <div style={{ fontSize: '13px', lineHeight: 1.6 }}>{addressStr}</div>}
                {order.address?.extra && <div style={{ fontSize: '12px', color: '#6b6558', marginTop: '4px' }}>{order.address.extra}</div>}
              </div>
            )}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#faf7f0' }}>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#6b6558', fontWeight: 600, borderBottom: '1px solid #e8e2d4' }}>المنتج</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '12px', color: '#6b6558', fontWeight: 600, borderBottom: '1px solid #e8e2d4', width: '70px' }}>الكمية</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', color: '#6b6558', fontWeight: 600, borderBottom: '1px solid #e8e2d4', width: '100px' }}>السعر</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', color: '#6b6558', fontWeight: 600, borderBottom: '1px solid #e8e2d4', width: '110px' }}>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0ece2' }}>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{it.name}</td>
                  <td className="num" style={{ padding: '12px', textAlign: 'center', fontSize: '13px' }}>{it.quantity}</td>
                  <td className="num" style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>{fmt(it.price)}</td>
                  <td className="num" style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>{fmt(it.price * it.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ minWidth: '260px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
                <span>المجموع الفرعي</span><span className="num">{fmt(order.subtotal)} د.ك</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
                <span>التوصيل</span><span className="num">{fmt(order.deliveryFee)} د.ك</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 6px', borderTop: '2px solid #0f5e52', marginTop: '6px', fontSize: '16px', color: '#0f5e52', fontWeight: 700 }}>
                <span>الإجمالي</span><span className="num">{fmt(order.total)} د.ك</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '28px', padding: '14px', backgroundColor: '#faf7f0', borderRadius: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div><strong>طريقة الدفع:</strong> {PAYMENT_LABELS[order.paymentMethod] || '-'}</div>
              <div><strong>المصدر:</strong> {SOURCE_LABELS[order.source] || '-'}</div>
            </div>
            {order.notes && <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e8e2d4' }}><strong>ملاحظات:</strong> {order.notes}</div>}
          </div>

          <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px dashed #d5ccb8', textAlign: 'center', fontSize: '12px', color: '#8a7e66' }}>
            شكراً لثقتكم · {settings.shopName || 'متجري'}
          </div>
        </div>
      </div>
    </div>
  );
}
