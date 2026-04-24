import { useState, useEffect } from 'react';
import { Plus, ShoppingCart, LayoutDashboard, ShoppingBag, Package, Users, SettingsIcon, Store } from '../../components/icons';
import UserMenu from '../../components/admin/UserMenu';
import OrderFormModal from '../../components/admin/OrderFormModal';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import ProductFormModal from '../../components/admin/ProductFormModal';
import InvoicePrintView from '../../components/admin/InvoicePrintView';
import Toast from '../../components/ui/Toast';
import DashboardView from './DashboardView';
import OrdersView from './OrdersView';
import ProductsView from './ProductsView';
import UsersView from './UsersView';
import SettingsView from './SettingsView';

import { ordersService } from '../../services/orders';
import { productsService } from '../../services/products';
import { settingsService } from '../../services/settings';
import { usersService } from '../../services/users';

import { can, DEFAULT_SETTINGS } from '../../config/constants';
import { useToast } from '../../hooks/useToast';
import { useRealtime } from '../../hooks/useRealtime';

export default function AdminLayout({ session }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [userRole, setUserRole] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [connError, setConnError] = useState(null);
  const [view, setView] = useState('dashboard');

  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [printOrder, setPrintOrder] = useState(null);

  const { toast, showToast } = useToast();

  const loadData = async () => {
    try {
      const [ordersData, productsData, settingsData, role] = await Promise.all([
        ordersService.list(),
        productsService.list(),
        settingsService.get(),
        usersService.getMyRole(session.user.id),
      ]);
      setOrders(ordersData);
      setProducts(productsData);
      setSettings(settingsData);
      setUserRole(role);
      setConnError(null);
    } catch (err) {
      console.error('Load error:', err);
      setConnError(err.message || 'فشل الاتصال بالسحابة');
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => { loadData(); }, []);

  useRealtime(['orders', 'products', 'settings'], () => { loadData(); });

  // Order handlers
  const saveOrder = async (order) => {
    try {
      if (order.id) {
        await ordersService.update(order.id, order);
        showToast('تم تحديث الطلب');
      } else {
        await ordersService.create(order);
        showToast('تم إضافة الطلب');
      }
      setShowOrderForm(false);
      setEditingOrder(null);
      await loadData();
    } catch (err) {
      showToast('خطأ: ' + err.message, 'error');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('تبي تحذف هالطلب؟')) return;
    try {
      await ordersService.remove(id);
      showToast('تم حذف الطلب');
      setViewingOrder(null);
      await loadData();
    } catch (err) {
      showToast('خطأ: ' + err.message, 'error');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await ordersService.updateStatus(id, status);
      showToast('تم تحديث الحالة');
      await loadData();
    } catch (err) {
      showToast('خطأ: ' + err.message, 'error');
    }
  };

  // Product handlers
  const saveProduct = async (product) => {
    try {
      if (product.id) {
        await productsService.update(product.id, product);
        showToast('تم تحديث المنتج');
      } else {
        await productsService.create(product);
        showToast('تم إضافة المنتج');
      }
      setShowProductForm(false);
      setEditingProduct(null);
      await loadData();
    } catch (err) {
      showToast('خطأ: ' + err.message, 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('تبي تحذف هالمنتج؟')) return;
    try {
      await productsService.remove(id);
      showToast('تم حذف المنتج');
      await loadData();
    } catch (err) {
      showToast('خطأ: ' + err.message, 'error');
    }
  };

  // Settings
  const saveSettings = async (newSettings) => {
    try {
      await settingsService.update(newSettings);
      setSettings(newSettings);
      showToast('تم حفظ الإعدادات');
    } catch (err) {
      showToast('خطأ: ' + err.message, 'error');
    }
  };

  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f2eb' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (connError) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f2eb', padding: '20px' }}>
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h3 style={{ color: '#b91c1c' }}>فشل الاتصال</h3>
          <p style={{ fontSize: '13px', color: '#6b6558' }}>{connError}</p>
          <button onClick={loadData} style={{ padding: '10px 20px', backgroundColor: '#0f5e52', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>إعادة المحاولة</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'لوحة التحكم', Icon: LayoutDashboard, show: true },
    { id: 'orders', label: 'الطلبات', Icon: ShoppingBag, show: true },
    { id: 'products', label: 'المنتجات', Icon: Package, show: true },
    { id: 'users', label: 'المستخدمون', Icon: Users, show: can.manageUsers(userRole) },
    { id: 'settings', label: 'الإعدادات', Icon: SettingsIcon, show: true },
  ].filter((t) => t.show);

  return (
    <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: '#f6f2eb' }}>
      <header className="no-print" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e8e2d4' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#0f5e52', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={18} color="#ffffff" />
            </div>
            <div>
              <div className="font-display" style={{ fontSize: '16px', fontWeight: 700 }}>{settings.shopName}</div>
              <div style={{ fontSize: '11px', color: '#8a7e66' }}>لوحة التحكم</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', backgroundColor: '#ffffff', color: '#0f5e52', border: '1px solid #c7e5dc', borderRadius: '10px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              <ShoppingCart size={14} /> عرض المتجر
            </a>
            <button onClick={() => { setEditingOrder(null); setShowOrderForm(true); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f5e52', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={16} /> طلب جديد
            </button>
            <UserMenu session={session} />
          </div>
        </div>
      </header>

      <nav className="no-print" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e8e2d4', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="hide-scrollbar" style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '4px', padding: '0 16px', overflowX: 'auto' }}>
          {tabs.map((t) => {
            const active = view === t.id;
            return (
              <button key={t.id} onClick={() => setView(t.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid ' + (active ? '#0f5e52' : 'transparent'), color: active ? '#0f5e52' : '#6b6558', fontSize: '13px', fontWeight: active ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <t.Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="no-print" style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
        {view === 'dashboard' && <DashboardView orders={orders} onViewOrder={setViewingOrder} onNewOrder={() => { setEditingOrder(null); setShowOrderForm(true); }} onGoToOrders={() => setView('orders')} />}
        {view === 'orders' && <OrdersView orders={orders} userRole={userRole} onView={setViewingOrder} onEdit={(o) => { setEditingOrder(o); setShowOrderForm(true); }} onStatusChange={updateOrderStatus} onPrint={setPrintOrder} onNewOrder={() => { setEditingOrder(null); setShowOrderForm(true); }} />}
        {view === 'products' && <ProductsView products={products} userRole={userRole} onAdd={() => { setEditingProduct(null); setShowProductForm(true); }} onEdit={(p) => { setEditingProduct(p); setShowProductForm(true); }} onDelete={deleteProduct} />}
        {view === 'users' && can.manageUsers(userRole) && <UsersView currentUserId={session.user.id} showToast={showToast} />}
        {view === 'settings' && <SettingsView settings={settings} userRole={userRole} onSave={saveSettings} />}
      </main>

      {showOrderForm && <OrderFormModal order={editingOrder} products={products} defaultDeliveryFee={settings.defaultDeliveryFee}
        onSave={saveOrder} onClose={() => { setShowOrderForm(false); setEditingOrder(null); }} />}
      {viewingOrder && <OrderDetailModal order={viewingOrder} userRole={userRole}
        onClose={() => setViewingOrder(null)}
        onEdit={() => { setEditingOrder(viewingOrder); setViewingOrder(null); setShowOrderForm(true); }}
        onDelete={() => deleteOrder(viewingOrder.id)}
        onStatusChange={(s) => { updateOrderStatus(viewingOrder.id, s); setViewingOrder({ ...viewingOrder, status: s }); }}
        onPrint={() => { setPrintOrder(viewingOrder); setViewingOrder(null); }} />}
      {showProductForm && <ProductFormModal product={editingProduct} onSave={saveProduct} onClose={() => { setShowProductForm(false); setEditingProduct(null); }} />}
      {printOrder && <InvoicePrintView order={printOrder} settings={settings} onClose={() => setPrintOrder(null)} />}

      <Toast toast={toast} />
    </div>
  );
}
