export default function Section({ title, children, action }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <h4
          className="font-display"
          style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 600,
            color: '#6b6558',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </h4>
        {action}
      </div>
      {children}
    </div>
  );
}
