export default function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 88, left: "50%", transform: "translateX(-50%)",
      background: type === "success" ? "#065f46" : "#991b1b",
      color: "#fff", padding: "10px 20px", borderRadius: 12,
      fontWeight: 600, fontSize: 14, zIndex: 9999,
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      animation: "slideUp 0.2s ease",
    }}>{msg}</div>
  );
}