export default function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontSize: '12px', fontWeight: 500, color: '#6b6558' }}>{label}</span>
      {children}
    </label>
  );
}
