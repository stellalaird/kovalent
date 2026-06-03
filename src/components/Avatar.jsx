import { T } from "../styles/theme";

export default function Avatar({ user, size = 36, ring = false }) {
  const showRing = ring || size >= 48;
  const ringStyle = showRing
    ? `0 0 0 2px ${T.card}, 0 0 0 3.5px rgba(180,140,40,0.65), 0 0 12px rgba(180,140,40,0.3)`
    : `0 2px 8px rgba(0,0,0,0.4)`;

  const base = {
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    boxShadow: ringStyle,
  };

  if (user?.photo) {
    return (
      <img
        src={user.photo}
        alt={user.name || ""}
        style={{
          ...base,
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }

  return (
    <div
      style={{
        ...base,
        background: user?.color || T.purple,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 800,
        fontFamily: T.fontDisplay,
        fontSize: size < 32 ? 11 : size < 44 ? 13 : 18,
        letterSpacing: "0.01em",
      }}
    >
      {user?.avatar || "?"}
    </div>
  );
}
