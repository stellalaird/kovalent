export default function ActivityDot({ level }) {
  const colors = { high: "#10b981", medium: "#f59e0b", low: "#9ca3af" };
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: colors[level] || "#9ca3af",
    }} />
  );
}