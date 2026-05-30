import { T } from "../styles/theme";

export default function PageHeader({ children }) {
  return (
    <div
      style={{
        padding: "14px 16px 0",
        background: "rgba(246,244,253,0.95)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${T.border}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
}
