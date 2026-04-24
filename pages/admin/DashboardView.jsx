import { useMemo } from 'react';
import StatCard from '../../components/admin/StatCard';
import OrderRow from '../../components/admin/OrderRow';
import EmptyState from '../../components/ui/EmptyState';
import { Clock, Package, CheckCircle2, Receipt, ShoppingBag } from '../../components/icons';
import { fmt, isToday } from '../../lib/helpers';
import { primaryBtn } from '../../styles/tokens';

export default function DashboardView({ orders, onViewOrder, onNewOrder, onGoToOrders }) {
  const stats = useMemo(() => {
    const newOrders = orders.filter((o) => o.status === 'new').length;
    const preparing = orders.filter((o) => o.status === 'preparing').length;
    const deliveredToday = orders.filter((o) => o.status === 'delivered' && isToday(o.updatedAt)).length;
    const revenueToday = orders
      .filter((o) => o.status === 'delivered' && isToday(o.updatedAt))
      .reduce((s, o) => s + (o.total || 0), 0);
    return { newOrders, preparing, deliveredToday, revenueToday };
  }, [orders]);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="animate-fade-in">
      <h2 className="font-display" style={{ margin: '0 0 20px', fontSize: '22px', fontWeight: 600 }}>لوحة التحكم</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        <StatCard label="طلبات جديدة" value={stats.newOrders} color="#3b82f6" Icon={Clock} />
        <StatCard label="قيد التجهيز" value={stats.preparing} color="#f59e0b" Icon={Package} />
        <StatCard label="تم التوصيل اليوم" value={stats.deliveredToday} color="#10b981" Icon={CheckCircle2} />
        <StatCard label="إيرادات اليوم" value={fmt(stats.revenueToday)} suffix="د.ك" color="#0f5e52" Icon={Receipt} />
      </div>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e8e2d4', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e2d4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 className="font-display" style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>آخر الطلبات</h3>
          {orders.length > 5 && <button onClick={onGoToOrders} style={{ background: 'none', border: 'none', color: '#0f5e52', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>عرض الكل</button>}
        </div>
        {recentOrders.length === 0 ? (
          <EmptyState icon={<ShoppingBag size={32} color="#bdb29a" />} title="ما فيه طلبات بعد" description="أضف أول طلب ويرا بياناتك هني"
            action={<button onClick={onNewOrder} style={primaryBtn}>إضافة طلب</button>} />
        ) : (
          <div>{recentOrders.map((o) => <OrderRow key={o.id} order={o} onClick={() => onViewOrder(o)} />)}</div>
        )}
      </div>
    </div>
  );
}
