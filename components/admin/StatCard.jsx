export default function StatCard({ label, value, suffix, color, Icon }) {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e8e2d4', borderRadius: '14px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', color: '#6b6558', fontWeight: 500 }}>{label}</span>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div className="num font-display" style={{ fontSize: '26px', fontWeight: 600, color: '#1f1b12', lineHeight: 1 }}>
        {value}
        {suffix && <span style={{ fontSize: '13px', color: '#8a7e66', fontWeight: 500, marginRight: '6px' }}>{suffix}</span>}
      </div>
    </div>
  );
}
