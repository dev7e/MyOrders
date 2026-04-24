// Shared design tokens used throughout the app

export const colors = {
  primary: '#0f5e52',
  primaryDark: '#0a4640',
  primaryLight: '#c7e5dc',
  primaryBg: '#ecfdf5',
  bg: '#f6f2eb',
  surface: '#ffffff',
  surfaceAlt: '#faf7f0',
  border: '#e8e2d4',
  borderSoft: '#f0ece2',
  text: '#1f1b12',
  textMuted: '#6b6558',
  textSubtle: '#8a7e66',
  textFaint: '#bdb29a',
  danger: '#b91c1c',
  dangerBg: '#fef2f2',
  dangerBorder: '#fecaca',
  warning: '#92400e',
  warningBg: '#fffbeb',
  warningBorder: '#fde68a',
};

export const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  backgroundColor: colors.surface,
  fontSize: '14px',
  color: colors.text,
};

export const primaryBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 16px',
  backgroundColor: colors.primary,
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
};

export const secondaryBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 14px',
  backgroundColor: colors.surface,
  color: '#4a4438',
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
};

export const smallPrimaryBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '7px 12px',
  backgroundColor: colors.primary,
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};

export const smallBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  padding: '7px 10px',
  backgroundColor: colors.surface,
  color: '#4a4438',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
};

export const qtyBtn = {
  width: '26px',
  height: '26px',
  borderRadius: '6px',
  border: '1px solid #d5ccb8',
  backgroundColor: colors.surface,
  color: colors.text,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 600,
  padding: 0,
};

export const menuItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  padding: '8px 14px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '13px',
  color: colors.text,
  textAlign: 'right',
};

export const linkBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  fontSize: '12px',
  fontWeight: 500,
  color: colors.primary,
  backgroundColor: colors.surface,
  border: `1px solid ${colors.primaryLight}`,
  borderRadius: '6px',
  textDecoration: 'none',
};

export const metaBox = {
  padding: '10px 12px',
  backgroundColor: colors.surfaceAlt,
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
};
