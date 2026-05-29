export default function ActivityBadge({ level }) {
  const map = { high: ["🔥 Active", "#fef3c7", "#92400e"], medium: ["● Growing", "#e0f2fe", "#0369a1"], low: ["○ New", "#f3f4f6", "#374151"] };
  const [label, bg, color] = map[level] || map.low;
  return <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: bg, color }}>{label}</span>;
}