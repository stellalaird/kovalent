export default function Badge({ children, color = "#A78BFA", bg = "rgba(167,139,250,0.12)" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 7px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.03em",
        background: bg,
        color,
        border: `1px solid ${color}40`,
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}
