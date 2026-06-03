import { T } from "../styles/theme";

export default function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {title && (
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: T.muted,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: 10,
          fontFamily: T.fontBody,
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
