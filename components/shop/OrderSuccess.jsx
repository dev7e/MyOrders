import { CheckCircle, MessageCircle } from '../icons';
import { fmt } from '../../lib/helpers';
import { PAYMENT_LABELS } from '../../config/constants';
import { secondaryBtn } from '../../styles/tokens';

export default function OrderSuccess({ order, settings, onBack }) {
  const waLink = settings.shopPhone
    ? `https://wa.me/${settings.shopPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        'مرحباً، بخصوص طلب رقم #' + order.orderNumber
      )}`
    : null;

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f6f2eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(31,27,18,0.08)',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <CheckCircle size={36} color="#059669" />
        </div>
        <h2 className="font-display" style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1f1b12' }}>
          تم استلام طلبك! 🎉
        </h2>
        <p style={{ margin: '8px 0 20px', fontSize: '14px', color: '#6b6558', lineHeight: 1.6 }}>
          رقم طلبك:{' '}
          <span className="num font-display" style={{ fontWeight: 700, color: '#0f5e52' }}>
            #{order.orderNumber}
          </span>
          <br />
          بنتواصل معاك قريباً لتأكيد الطلب والتوصيل.
        </p>
        <div
          style={{
            padding: '14px',
            backgroundColor: '#faf7f0',
            borderRadius: '10px',
            marginBottom: '16px',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#6b6558' }}>
            <span>الإجمالي</span>
            <span className="num" style={{ fontWeight: 700, color: '#0f5e52' }}>
              {fmt(order.total)} د.ك
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6558' }}>
            <span>طريقة الدفع</span>
            <span style={{ fontWeight: 600 }}>{PAYMENT_LABELS[order.paymentMethod]}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: '#059669',
                color: '#ffffff',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              <MessageCircle size={16} /> تواصل معنا على واتساب
            </a>
          )}
          <button onClick={onBack} style={{ ...secondaryBtn, justifyContent: 'center', padding: '12px' }}>
            متابعة التسوق
          </button>
        </div>
      </div>
    </div>
  );
}
