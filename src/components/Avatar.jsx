export default function Avatar({ user, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: user?.color || "#6c4fc2",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700,
      fontSize: size < 32 ? 11 : size < 44 ? 13 : 16,
      flexShrink: 0, letterSpacing: "0.03em",
    }}>
      {user?.avatar || "?"}
    </div>
  );
}