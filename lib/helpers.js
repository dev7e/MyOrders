// ==================== FORMATTERS ====================

export const fmt = (n) => Number(n || 0).toFixed(3);

export const formatDate = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

export const formatDateShort = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const isToday = (ts) => {
  if (!ts) return false;
  const d = new Date(ts);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

export const buildAddressString = (address) => {
  if (!address) return '';
  return [
    address.area,
    address.block && `قطعة ${address.block}`,
    address.street && `شارع ${address.street}`,
    address.avenue && `جادة ${address.avenue}`,
    address.house && `بيت ${address.house}`,
  ]
    .filter(Boolean)
    .join('، ');
};

export const uid = () => Math.random().toString(36).slice(2, 10);

// ==================== DB ↔ APP MAPPERS ====================

export const dbOrderToApp = (row) => ({
  id: row.id,
  orderNumber: row.order_number,
  customerName: row.customer_name,
  customerPhone: row.customer_phone || '',
  address: row.address || { area: '', block: '', street: '', avenue: '', house: '', extra: '' },
  items: row.items || [],
  subtotal: Number(row.subtotal) || 0,
  deliveryFee: Number(row.delivery_fee) || 0,
  total: Number(row.total) || 0,
  paymentMethod: row.payment_method || 'cash',
  source: row.source || 'whatsapp',
  status: row.status || 'new',
  notes: row.notes || '',
  createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
  updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
});

export const appOrderToDb = (order) => ({
  customer_name: order.customerName,
  customer_phone: order.customerPhone || null,
  address: order.address || {},
  items: order.items || [],
  subtotal: order.subtotal || 0,
  delivery_fee: order.deliveryFee || 0,
  total: order.total || 0,
  payment_method: order.paymentMethod || 'cash',
  source: order.source || 'whatsapp',
  status: order.status || 'new',
  notes: order.notes || null,
});

export const dbProductToApp = (row) => ({
  id: row.id,
  name: row.name,
  price: Number(row.price) || 0,
  imageUrl: row.image_url || '',
  description: row.description || '',
  isActive: row.is_active !== false,
  createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
});

export const appProductToDb = (product) => ({
  name: product.name,
  price: Number(product.price) || 0,
  image_url: product.imageUrl || null,
  description: product.description || null,
  is_active: product.isActive !== false,
});

export const dbSettingsToApp = (row) => ({
  shopName: row?.shop_name || 'متجري',
  shopPhone: row?.shop_phone || '',
  defaultDeliveryFee: Number(row?.default_delivery_fee) || 1.0,
});

export const appSettingsToDb = (s) => ({
  shop_name: s.shopName,
  shop_phone: s.shopPhone,
  default_delivery_fee: s.defaultDeliveryFee,
});
