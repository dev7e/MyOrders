import { X, Minus, Plus, Package, Trash2 } from '../icons';
import { fmt } from '../../lib/helpers';
import { primaryBtn, qtyBtn } from '../../styles/tokens';

export default function CartDrawer({ cart, subtotal, deliveryFee, total, onUpdate, onRemove, onClose, onCheckout }) {
  return (
    <div
      className="animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(31,27,18,0.45)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-up"
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '540px',
          borderRadius: '20px 20px 0 0',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e8e2d4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 className="font-display" style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>
            السلة ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b6558' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {cart.map((item) => (
            <div
              key={item.productId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                backgroundColor: '#faf7f0',
                borderRadius: '10px',
                border: '1px solid #e8e2d4',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Package size={20} color="#bdb29a" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.name}</div>
                <div className="num" style={{ fontSize: '12px', color: '#0f5e52', fontWeight: 600 }}>
                  {fmt(item.price)} د.ك
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '3px',
                  border: '1px solid #d5ccb8',
                }}
              >
                <button onClick={() => onUpdate(item.productId, item.quantity - 1)} style={{ ...qtyBtn, border: 'none' }}>
                  <Minus size={12} />
                </button>
                <span className="num" style={{ minWidth: '22px', textAlign: 'center', fontWeight: 600, fontSize: '13px' }}>
                  {item.quantity}
                </span>
                <button onClick={() => onUpdate(item.productId, item.quantity + 1)} style={{ ...qtyBtn, border: 'none' }}>
                  <Plus size={12} />
                </button>
              </div>
              <button
                onClick={() => onRemove(item.productId)}
                style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', padding: '4px' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #e8e2d4', backgroundColor: '#faf7f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b6558', marginBottom: '4px' }}>
            <span>المجموع الفرعي</span>
            <span className="num">{fmt(subtotal)} د.ك</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b6558', marginBottom: '10px' }}>
            <span>التوصيل</span>
            <span className="num">{fmt(deliveryFee)} د.ك</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '17px',
              fontWeight: 700,
              color: '#0f5e52',
              marginBottom: '12px',
              paddingTop: '10px',
              borderTop: '1px dashed #d5ccb8',
            }}
          >
            <span>الإجمالي</span>
            <span className="num">{fmt(total)} د.ك</span>
          </div>
          <button
            onClick={onCheckout}
            style={{ ...primaryBtn, width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
          >
            متابعة الطلب
          </button>
        </div>
      </div>
    </div>
  );
}
