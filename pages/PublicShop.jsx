import { useState, useEffect } from 'react';
import ProductCard from '../components/shop/ProductCard';
import CartDrawer from '../components/shop/CartDrawer';
import CheckoutModal from '../components/shop/CheckoutModal';
import OrderSuccess from '../components/shop/OrderSuccess';
import { Store, Package, ShoppingCart } from '../components/icons';
import { productsService } from '../services/products';
import { settingsService } from '../services/settings';
import { fmt } from '../lib/helpers';
import { DEFAULT_SETTINGS } from '../config/constants';

export default function PublicShop() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, s] = await Promise.all([
          productsService.listActive(),
          settingsService.get(),
        ]);
        setProducts(p);
        setSettings(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addToCart = (product) => {
    setCart((c) => {
      const existing = c.find((i) => i.productId === product.id);
      if (existing) {
        return c.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...c,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
        },
      ];
    });
    setCartOpen(true);
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      setCart((c) => c.filter((i) => i.productId !== productId));
    } else {
      setCart((c) =>
        c.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
      );
    }
  };

  const removeFromCart = (productId) =>
    setCart((c) => c.filter((i) => i.productId !== productId));

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = settings.defaultDeliveryFee;
  const total = subtotal + deliveryFee;

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f6f2eb',
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  if (successOrder) {
    return (
      <OrderSuccess
        order={successOrder}
        settings={settings}
        onBack={() => {
          setSuccessOrder(null);
          setCart([]);
        }}
      />
    );
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f6f2eb',
        paddingBottom: cart.length > 0 ? '80px' : '20px',
      }}
    >
      {/* Hero */}
      <header
        style={{
          backgroundColor: '#0f5e52',
          color: '#ffffff',
          padding: '40px 20px 32px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <Store size={28} color="#ffffff" strokeWidth={2} />
          </div>
          <h1 className="font-display" style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>
            {settings.shopName}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '14px', opacity: 0.85 }}>
            توصيل للكويت · دفع عند الاستلام
          </p>
        </div>
      </header>

      {/* Products */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
        <h2
          className="font-display"
          style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600, color: '#1f1b12' }}
        >
          المنتجات{' '}
          {products.length > 0 && (
            <span style={{ color: '#8a7e66', fontSize: '14px', fontWeight: 500 }}>
              ({products.length})
            </span>
          )}
        </h2>

        {products.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid #e8e2d4',
            }}
          >
            <Package size={40} color="#bdb29a" />
            <div className="font-display" style={{ fontSize: '16px', fontWeight: 600, marginTop: '12px' }}>
              لا توجد منتجات حالياً
            </div>
            <div style={{ fontSize: '13px', color: '#8a7e66', marginTop: '4px' }}>تحقق لاحقاً</div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={addToCart}
                cartQty={cart.find((i) => i.productId === p.id)?.quantity || 0}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating cart button */}
      {cart.length > 0 && !cartOpen && !checkoutOpen && (
        <button
          onClick={() => setCartOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '50%',
            transform: 'translateX(50%)',
            backgroundColor: '#0f5e52',
            color: '#ffffff',
            border: 'none',
            padding: '14px 22px',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 24px rgba(15,94,82,0.3)',
            zIndex: 30,
          }}
        >
          <ShoppingCart size={18} />
          <span>{cart.reduce((s, i) => s + i.quantity, 0)} منتج</span>
          <span style={{ opacity: 0.8 }}>·</span>
          <span className="num">{fmt(total)} د.ك</span>
        </button>
      )}

      {cartOpen && (
        <CartDrawer
          cart={cart}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          onUpdate={updateQty}
          onRemove={removeFromCart}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            setCheckoutOpen(true);
          }}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={(order) => {
            setCheckoutOpen(false);
            setSuccessOrder(order);
          }}
        />
      )}

      <footer style={{ textAlign: 'center', padding: '20px', fontSize: '11px', color: '#bdb29a' }}>
        © {new Date().getFullYear()} {settings.shopName}
      </footer>
    </div>
  );
}
