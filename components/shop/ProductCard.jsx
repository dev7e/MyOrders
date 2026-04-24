import { Package, Plus } from '../icons';
import { fmt } from '../../lib/helpers';

export default function ProductCard({ product, onAdd, cartQty }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '1px solid #e8e2d4',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          aspectRatio: '1',
          backgroundColor: '#faf7f0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Package size={40} color="#d5ccb8" />
          </div>
        )}
        {cartQty > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: '#0f5e52',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '999px',
            }}
          >
            ×{cartQty}
          </div>
        )}
      </div>
      <div
        style={{
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1f1b12', lineHeight: 1.3 }}>
          {product.name}
        </div>
        {product.description && (
          <div
            style={{
              fontSize: '12px',
              color: '#8a7e66',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '6px',
          }}
        >
          <span className="num" style={{ fontSize: '15px', fontWeight: 700, color: '#0f5e52' }}>
            {fmt(product.price)} د.ك
          </span>
          <button
            onClick={() => onAdd(product)}
            style={{
              backgroundColor: '#0f5e52',
              color: '#ffffff',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
