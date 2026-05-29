export default function Section({ title, children, padded = true }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {title && <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, paddingLeft: padded ? 0 : 0 }}>{title}</div>}
      {children}
    </div>
  );
}