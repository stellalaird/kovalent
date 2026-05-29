export default function TokenBadge({ count }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: "#fef3c7", color: "#92400e",
      padding: "4px 10px", borderRadius: 999, fontSize: 13, fontWeight: 700,
    }}>
      ✦ {count}
    </span>
  );
}