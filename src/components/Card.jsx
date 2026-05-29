export default function Card({ children, style: extra, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      overflow: "hidden", ...extra,
    }}>{children}</div>
  );
}