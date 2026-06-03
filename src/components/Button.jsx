import { T } from "../styles/theme";

export default function Button({ children, onClick, variant = "primary", small, style: extraStyle }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    fontWeight: 700,
    fontFamily: T.fontBody,
    cursor: "pointer",
    transition: "opacity 0.15s, transform 0.1s, box-shadow 0.15s",
    fontSize: small ? 13 : 14,
    padding: small ? "7px 16px" : "12px 22px",
    letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
    border: "none",
  };

  const variants = {
    primary: {
      background: T.purpleGradient,
      color: "#fff",
      boxShadow: T.btnPrimaryShadow,
    },
    secondary: {
      background: T.surface,
      color: T.textMid,
      border: `1px solid ${T.border}`,
      boxShadow: "none",
    },
    ghost: {
      background: "transparent",
      color: T.purple,
      border: `1.5px solid ${T.cardBorderBright}`,
      boxShadow: T.purpleGlowSm,
    },
    danger: {
      background: T.dangerBg,
      color: T.danger,
      border: `1px solid ${T.dangerBorder}`,
    },
    success: {
      background: T.successBg,
      color: T.success,
      border: `1px solid ${T.successBorder}`,
    },
  };

  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...extraStyle }}>
      {children}
    </button>
  );
}
