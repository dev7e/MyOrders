export default function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: '#faf7f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
        }}
      >
        {icon}
      </div>
      <div className="font-display" style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '13px', color: '#8a7e66', marginBottom: action ? '16px' : 0 }}>{description}</div>
      {action}
    </div>
  );
}
