import { T } from "../styles/theme";

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
        ...extra,
      }}
    >
      {children}
    </div>
  );
}
