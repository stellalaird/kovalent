import { T } from "../styles/theme";

export default function Button({ children, onClick, variant = "primary", small, style: extraStyle }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    transition: "opacity 0.15s, transform 0.1s",
    fontSize: small ? 13 : 14,
    padding: small ? "6px 14px" : "10px 20px",
    letterSpacing: "0.01em",
  };

  const variants = {
    primary: {
      background: T.purpleGradient,
      color: "#fff",
      boxShadow: T.btnPrimaryShadow,
    },
    secondary: {
      background: T.purpleFaint,
      color: T.textMid,
      border: `1px solid ${T.border}`,
    },
    ghost: {
      background: "transparent",
      color: T.purple,
      border: `1.5px solid ${T.purple}`,
    },
    danger: {
      background: T.dangerBg,
      color: T.danger,
    },
    success: {
      background: T.successBg,
      color: T.success,
    },
  };

  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...extraStyle }}>
      {children}
    </button>
  );
}
