export default function Badge({ children, color = "#6c4fc2", bg = "#ede9ff" }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: 999,
      fontSize: 11, fontWeight: 600,
      background: bg, color,
    }}>{children}</span>
  );
}