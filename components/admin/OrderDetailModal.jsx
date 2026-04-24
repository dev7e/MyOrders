import Modal from '../ui/Modal';
import DetailBlock from '../ui/DetailBlock';
import { PhoneCall, MessageCircle, MapPin, Package, FileText, Printer, Pencil, Trash2, PAYMENT_ICONS, SOURCE_ICONS } from '../icons';
import { STATUSES, PAYMENT_LABELS, SOURCE_LABELS, can } from '../../config/constants';
import { primaryBtn, secondaryBtn, linkBtn, metaBox } from '../../styles/tokens';
import { fmt, formatDate, buildAddressString } from '../../lib/helpers';

export default function OrderDetailModal({ order, userRole, onClose, onEdit, onDelete, onStatusChange, onPrint }) {
  const SourceIcon = SOURCE_ICONS[order.source] || SOURCE_ICONS.other;
  const PaymentIcon = PAYMENT_ICONS[order.paymentMethod] || PAYMENT_ICONS.cash;
  const canDelete = can.deleteOrders(userRole);
  const addressStr = buildAddressString(order.address);

  return (
    <Modal onClose={onClose} title={`طلب #${order.orderNumber}`} size="medium">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {Object.entries(STATUSES).map(([k, v]) => {
            const active = order.status === k;
            return (
              <button key={k} onClick={() => onStatusChange(k)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '999px', border: '1px solid ' + (active ? v.dot : '#e8e2d4'), backgroundColor: active ? v.bg : '#ffffff', color: active ? v.fg : '#6b6558', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: v.dot }} />{v.label}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '12px', color: '#8a7e66' }}>أُنشئ في {formatDate(order.createdAt)}</div>

        <DetailBlock icon={<PhoneCall size={14} />} title="الزبون">
          <div style={{ fontSize: '14px', fontWeight: 500 }}>{order.customerName}</div>
          {order.customerPhone && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
              <a href={`tel:${order.customerPhone}`} style={linkBtn}><PhoneCall size={12} /> {order.customerPhone}</a>
              <a href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ ...linkBtn, color: '#059669', borderColor: '#a7f3d0' }}><MessageCircle size={12} /> واتساب</a>
            </div>
          )}
        </DetailBlock>

        {(addressStr || order.address?.extra) && (
          <DetailBlock icon={<MapPin size={14} />} title="العنوان">
            {addressStr && <div style={{ fontSize: '14px' }}>{addressStr}</div>}
            {order.address?.extra && <div style={{ fontSize: '13px', color: '#6b6558', marginTop: '4px' }}>{order.address.extra}</div>}
          </DetailBlock>
        )}

        <DetailBlock icon={<Package size={14} />} title="المنتجات">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: i < order.items.length - 1 ? '1px solid #f0ece2' : 'none' }}>
                <span><span className="num" style={{ fontWeight: 600, marginLeft: '6px' }}>×{item.quantity}</span>{item.name}</span>
                <span className="num" style={{ fontWeight: 600 }}>{fmt(item.price * item.quantity)} د.ك</span>
              </div>
            ))}
          </div>
        </DetailBlock>

        <div style={{ backgroundColor: '#faf7f0', border: '1px solid #e8e2d4', borderRadius: '10px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b6558', marginBottom: '4px' }}>
            <span>المجموع الفرعي</span><span className="num">{fmt(order.subtotal)} د.ك</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b6558', marginBottom: '8px' }}>
            <span>التوصيل</span><span className="num">{fmt(order.deliveryFee)} د.ك</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: '#0f5e52', borderTop: '1px dashed #d5ccb8', paddingTop: '8px' }}>
            <span>الإجمالي</span><span className="num">{fmt(order.total)} د.ك</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          <div style={metaBox}>
            <div style={{ fontSize: '11px', color: '#8a7e66', marginBottom: '4px' }}>طريقة الدفع</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}><PaymentIcon size={14} color="#6b6558" /> {PAYMENT_LABELS[order.paymentMethod]}</div>
          </div>
          <div style={metaBox}>
            <div style={{ fontSize: '11px', color: '#8a7e66', marginBottom: '4px' }}>المصدر</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}><SourceIcon size={14} color="#6b6558" /> {SOURCE_LABELS[order.source]}</div>
          </div>
        </div>

        {order.notes && (
          <DetailBlock icon={<FileText size={14} />} title="ملاحظات">
            <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>{order.notes}</div>
          </DetailBlock>
        )}

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #e8e2d4' }}>
          <button onClick={onPrint} style={primaryBtn}><Printer size={16} /> طباعة الفاتورة</button>
          <button onClick={onEdit} style={secondaryBtn}><Pencil size={14} /> تعديل</button>
          {canDelete && <button onClick={onDelete} style={{ ...secondaryBtn, color: '#b91c1c', borderColor: '#fecaca', marginRight: 'auto' }}><Trash2 size={14} /> حذف</button>}
        </div>
      </div>
    </Modal>
  );
}
