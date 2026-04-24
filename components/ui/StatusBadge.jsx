import { STATUSES } from '../../config/constants';

export default function StatusBadge({ status }) {
  const s = STATUSES[status] || STATUSES.new;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '11px',
        fontWeight: 600,
        padding: '3px 9px',
        borderRadius: '999px',
        backgroundColor: s.bg,
        color: s.fg,
        border: `1px solid ${s.border}`,
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: s.dot,
        }}
      />
      {s.label}
    </span>
  );
}
