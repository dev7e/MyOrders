import { useState } from 'react';
import Modal from '../ui/Modal';
import { Search, Package, Plus } from '../icons';
import { fmt } from '../../lib/helpers';
import { inputStyle } from '../../styles/tokens';

export default function ProductPickerModal({ products, onPick, onClose }) {
  const [q, setQ] = useState('');
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Modal onClose={onClose} title="اختيار منتج" size="small">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8a7e66' }} />
          <input type="text" autoFocus placeholder="ابحث عن منتج..." value={q} onChange={(e) => setQ(e.target.value)}
            style={{ ...inputStyle, paddingRight: '40px' }} />
        </div>
        <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {products.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#8a7e66', fontSize: '13px' }}>ما فيه منتجات. ضيف منتجات من تبويب "المنتجات" أول</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#8a7e66', fontSize: '13px' }}>ما فيه نتائج</div>
          ) : filtered.map((p) => (
            <button key={p.id} onClick={() => onPick(p)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: '1px solid #e8e2d4', borderRadius: '10px', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'right', width: '100%' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f6f2eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={16} color="#6b6558" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>{p.name}</div>
                <div className="num" style={{ fontSize: '12px', color: '#0f5e52', fontWeight: 600 }}>{fmt(p.price)} د.ك</div>
              </div>
              <Plus size={16} color="#0f5e52" />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
