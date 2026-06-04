import { T } from "../styles/theme";
import { useApp } from "../context/AppContext";

export default function Card({ children, style: extra, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: T.card,
        borderRadius: T.cardRadius,
        border: `1px solid ${T.cardBorder}`,
        boxShadow: T.cardShadow,
        overflow: "hidden",
        transition: "box-shadow 0.2s, border-color 0.2s",
        ...extra,
      }}
    >
      {children}
    </div>
  );
}
