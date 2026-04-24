import { useState, useMemo } from 'react';
import OrderRow from '../../components/admin/OrderRow';
import EmptyState from '../../components/ui/EmptyState';
import { Search, ShoppingBag } from '../../components/icons';
import { STATUSES } from '../../config/constants';
import { primaryBtn } from '../../styles/tokens';

export default function OrdersView({ orders, userRole, onView, onEdit, onStatusChange, onPrint, onNewOrder }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (statusFilter !== 'all' && o.status !== statusFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            String(o.orderNumber).includes(q) ||
            (o.customerName || '').toLowerCase().includes(q) ||
            (o.customerPhone || '').includes(q)
          );
        }
        return true;
      }),
    [orders, search, statusFilter]
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 className="font-display" style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>
          الطلبات <span style={{ color: '#8a7e66', fontSize: '16px', fontWeight: 500 }}>({orders.length})</span>
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8a7e66' }} />
          <input type="text" placeholder="بحث برقم الطلب / اسم / رقم التلفون" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 40px 10px 14px', border: '1px solid #e8e2d4', borderRadius: '10px', backgroundColor: '#ffffff', fontSize: '14px' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[{ val: 'all', label: 'الكل' }, ...Object.entries(STATUSES).map(([k, v]) => ({ val: k, label: v.label }))].map((f) => {
            const active = statusFilter === f.val;
            return (
              <button key={f.val} onClick={() => setStatusFilter(f.val)}
                style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 500, border: '1px solid ' + (active ? '#0f5e52' : '#e8e2d4'), backgroundColor: active ? '#0f5e52' : '#ffffff', color: active ? '#ffffff' : '#4a4438', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e8e2d4', borderRadius: '14px', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <EmptyState icon={<ShoppingBag size={32} color="#bdb29a" />}
            title={orders.length === 0 ? 'ما فيه طلبات بعد' : 'ما فيه نتائج'}
            description={orders.length === 0 ? 'أضف أول طلب' : 'جرب تغير البحث أو الفلتر'}
            action={orders.length === 0 && <button onClick={onNewOrder} style={primaryBtn}>إضافة طلب</button>} />
        ) : (
          filtered.map((o) => <OrderRow key={o.id} order={o} onClick={() => onView(o)} showActions onEdit={() => onEdit(o)} onPrint={() => onPrint(o)} onStatusChange={(s) => onStatusChange(o.id, s)} />)
        )}
      </div>
    </div>
  );
}
