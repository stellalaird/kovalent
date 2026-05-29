export default function Button({ children, onClick, variant = "primary", small, style: extraStyle }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, borderRadius: 10, fontWeight: 600, cursor: "pointer",
    border: "none", transition: "all 0.15s", fontSize: small ? 13 : 14,
    padding: small ? "6px 14px" : "10px 20px",
  };
  const variants = {
    primary: { background: "#6c4fc2", color: "#fff" },
    secondary: { background: "#f3f4f6", color: "#374151" },
    ghost: { background: "transparent", color: "#6c4fc2", border: "1.5px solid #6c4fc2" },
    danger: { background: "#fef2f2", color: "#dc2626" },
    success: { background: "#d1fae5", color: "#065f46" },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...extraStyle }}>
      {children}
    </button>
  );
}