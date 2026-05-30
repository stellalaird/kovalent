import { T } from "../styles/theme";

export default function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {title && (
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: T.muted,
          textTransform: "uppercase",
          letterSpacing: "0.09em",
          marginBottom: 10,
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
