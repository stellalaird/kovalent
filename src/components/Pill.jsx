import { T } from "../styles/theme";

export default function Pill({ children, active, onClick, small }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? "5px 14px" : "7px 18px",
        borderRadius: 999,
        border: active ? "1px solid rgba(167,139,250,0.5)" : `1px solid ${T.border}`,
        background: active ? T.purpleLight : "transparent",
        color: active ? T.purpleVibrant : T.muted,
        fontWeight: 600,
        fontFamily: T.fontBody,
        fontSize: small ? 12 : 13,
        cursor: "pointer",
        letterSpacing: "-0.01em",
        boxShadow: active ? T.purpleGlowSm : "none",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
