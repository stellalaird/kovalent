export default function Pill({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 16px", borderRadius: 999,
      border: active ? "none" : "1px solid #e5e7eb",
      background: active ? "#6c4fc2" : "#fff",
      color: active ? "#fff" : "#374151",
      fontWeight: 600, fontSize: 13, cursor: "pointer",
      transition: "all 0.15s",
    }}>{children}</button>
  );
}