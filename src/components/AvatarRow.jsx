// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Avatar from "./Avatar";

export default function AvatarRow({ users, max = 4, size = 28 }) {
  const shown = users.slice(0, max);
  const extra = users.length - max;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((u, i) => (
        <div key={u.id} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: max - i }}>
          <Avatar user={u} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          width: size, height: size, borderRadius: "50%",
          background: "#e5e7eb", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#6b7280",
          marginLeft: -8, zIndex: 0
        }}>+{extra}</div>
      )}
    </div>
  );
}