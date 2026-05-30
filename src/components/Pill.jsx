import { T } from "../styles/theme";

export default function Pill({ children, active, onClick, small }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? "4px 12px" : "6px 18px",
        borderRadius: 999,
        border: "none",
        background: active ? T.purpleGradient : T.purpleLight,
        color: active ? "#fff" : T.purpleMid,
        fontWeight: 600,
        fontSize: small ? 12 : 13,
        cursor: "pointer",
        letterSpacing: "0.01em",
        boxShadow: active ? T.btnPrimaryShadow : "none",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
