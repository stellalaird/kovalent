import { T } from "../styles/theme";

export default function Pill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 18px",
        borderRadius: 999,
        border: "none",
        background: active ? T.purpleGradient : T.purpleLight,
        color: active ? "#fff" : T.purpleMid,
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
        letterSpacing: "0.01em",
        boxShadow: active ? T.btnPrimaryShadow : "none",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}
