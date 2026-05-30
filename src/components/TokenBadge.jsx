import { T } from "../styles/theme";

export default function TokenBadge({ count }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: T.goldBg,
      color: T.gold,
      padding: "4px 11px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.01em",
      border: "1px solid rgba(180,83,9,0.18)",
    }}>
      ✦ {count}
    </span>
  );
}
