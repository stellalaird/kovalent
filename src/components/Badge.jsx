export default function Badge({ children, color = "#7C3AED", bg = "#EDE8FF" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.02em",
        background: bg,
        color,
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}
