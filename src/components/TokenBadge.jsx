import { T } from "../styles/theme";

export default function TokenBadge({ count, showLabel }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: T.goldBg,
      color: T.gold,
      padding: "5px 12px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "-0.01em",
      border: `1px solid ${T.goldBorder}`,
      boxShadow: "0 0 12px rgba(245,158,11,0.2)",
    }}>
      ✦ {count}{showLabel ? " tokens" : ""}
    </span>
  );
}
