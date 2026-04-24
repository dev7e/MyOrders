import { useState } from 'react';
import { ChevronDown, Pencil, Printer, Check, SOURCE_ICONS } from '../icons';
import StatusBadge from '../ui/StatusBadge';
import { STATUSES } from '../../config/constants';
import { fmt, formatDateShort } from '../../lib/helpers';
import { menuItem } from '../../styles/tokens';

export default function OrderRow({ order, onClick, showActions, onEdit, onPrint, onStatusChange }) {
  const SourceIcon = SOURCE_ICONS[order.source] || SOURCE_ICONS.other;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid #f0ece2', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.15s' }}
      onClick={onClick}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#faf7f0')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#f6f2eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <SourceIcon size={18} color="#6b6558" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span className="num font-display" style={{ fontWeight: 600, fontSize: '15px' }}>#{order.orderNumber}</span>
          <span style={{ fontSize: '14px' }}>{order.customerName}</span>
          <StatusBadge status={order.status} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#8a7e66', flexWrap: 'wrap' }}>
          <span>{formatDateShort(order.createdAt)}</span>
          {order.customerPhone && <span>{order.customerPhone}</span>}
          <span className="num" style={{ color: '#0f5e52', fontWeight: 600 }}>{fmt(order.total)} د.ك</span>
        </div>
      </div>
      {showActions && (
        <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ padding: '8px', border: '1px solid #e8e2d4', borderRadius: '8px', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronDown size={14} />
          </button>
          {menuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setMenuOpen(false)} />
              <div className="animate-slide-up" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, backgroundColor: '#ffffff', border: '1px solid #e8e2d4', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', minWidth: '180px', zIndex: 30, overflow: 'hidden' }}>
                <div style={{ padding: '8px 0', borderBottom: '1px solid #f0ece2' }}>
                  {Object.entries(STATUSES).map(([k, v]) => (
                    <button key={k} onClick={() => { onStatusChange(k); setMenuOpen(false); }} style={menuItem}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: v.dot }} />
                      {v.label}
                      {order.status === k && <Check size={14} color="#0f5e52" style={{ marginRight: 'auto' }} />}
                    </button>
                  ))}
                </div>
                <button onClick={() => { onEdit(); setMenuOpen(false); }} style={menuItem}><Pencil size={14} color="#6b6558" /> تعديل</button>
                <button onClick={() => { onPrint(); setMenuOpen(false); }} style={menuItem}><Printer size={14} color="#6b6558" /> طباعة الفاتورة</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
