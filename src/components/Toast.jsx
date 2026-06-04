import { T } from "../styles/theme";
import { useApp } from "../context/AppContext";

export default function Toast({ msg, type }) {
  if (!msg) return null;
  const isSuccess = type === "success";
  return (
    <div style={{
      position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)",
      background: T.card,
      color: isSuccess ? T.success : T.danger,
      padding: "11px 22px", borderRadius: 12,
      fontWeight: 600, fontSize: 14, zIndex: 9999,
      border: `1px solid ${isSuccess ? T.successBorder : T.dangerBorder}`,
      boxShadow: `0 0 20px ${isSuccess ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}, 0 8px 32px rgba(0,0,0,0.5)`,
      animation: "slideUp 0.2s ease",
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",
    }}>{msg}</div>
  );
}
