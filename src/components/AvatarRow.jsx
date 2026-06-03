import { T } from "../styles/theme";
import Avatar from "./Avatar";

export default function AvatarRow({ users, max = 4, size = 28 }) {
  const shown = users.slice(0, max);
  const extra = users.length - max;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((u, i) => (
        <div key={u.id} style={{ marginLeft: i === 0 ? 0 : -Math.round(size * 0.28), zIndex: max - i }}>
          <Avatar user={u} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          width: size, height: size, borderRadius: "50%",
          background: T.surface,
          border: `1px solid ${T.cardBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size < 24 ? 9 : 11, fontWeight: 700, color: T.textMid,
          marginLeft: -Math.round(size * 0.28), zIndex: 0,
          flexShrink: 0,
        }}>+{extra}</div>
      )}
    </div>
  );
}
