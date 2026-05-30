import { T } from "../styles/theme";

export default function Avatar({ user, size = 36, ring = false }) {
  const showRing = ring || size >= 48;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: user?.color || T.purple,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size < 32 ? 11 : size < 44 ? 13 : 17,
        flexShrink: 0,
        letterSpacing: "0.03em",
        boxShadow: showRing
          ? `0 0 0 2.5px #fff, 0 0 0 4.5px ${T.purple}`
          : "none",
      }}
    >
      {user?.avatar || "?"}
    </div>
  );
}
