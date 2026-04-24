import EmptyState from '../../components/ui/EmptyState';
import { Plus, Package, Pencil, Trash2 } from '../../components/icons';
import { can } from '../../config/constants';
import { fmt } from '../../lib/helpers';
import { primaryBtn, smallBtn } from '../../styles/tokens';

export default function ProductsView({ products, userRole, onAdd, onEdit, onDelete }) {
  const canEdit = can.manageProducts(userRole);
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 className="font-display" style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>
          المنتجات <span style={{ color: '#8a7e66', fontSize: '16px', fontWeight: 500 }}>({products.length})</span>
        </h2>
        {canEdit && <button onClick={onAdd} style={primaryBtn}><Plus size={16} /> إضافة منتج</button>}
      </div>
      {products.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e8e2d4', borderRadius: '14px' }}>
          <EmptyState icon={<Package size={32} color="#bdb29a" />} title="ما فيه منتجات بعد"
            description={canEdit ? 'ضيف منتجاتك عشان تظهر في المتجر' : 'لا توجد منتجات.'}
            action={canEdit && <button onClick={onAdd} style={primaryBtn}><Plus size={16} /> إضافة منتج</button>} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
          {products.map((p) => (
            <div key={p.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e8e2d4', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', opacity: p.isActive === false ? 0.6 : 1 }}>
              {p.isActive === false && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '999px', border: '1px solid #fecaca' }}>مخفي</div>
              )}
              <div style={{ aspectRatio: '1', backgroundColor: '#faf7f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={32} color="#d5ccb8" />}
              </div>
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div className="num" style={{ fontSize: '14px', color: '#0f5e52', fontWeight: 600 }}>{fmt(p.price)} د.ك</div>
                </div>
                {canEdit && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                    <button onClick={() => onEdit(p)} style={{ ...smallBtn, flex: 1 }}><Pencil size={13} /> تعديل</button>
                    <button onClick={() => onDelete(p.id)} style={{ ...smallBtn, flex: 1, color: '#b91c1c', borderColor: '#fecaca' }}><Trash2 size={13} /> حذف</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
