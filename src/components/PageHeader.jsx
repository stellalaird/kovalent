import { T } from "../styles/theme";
import { useApp } from "../context/AppContext";

export default function PageHeader({ children }) {
  return (
    <div
      style={{
        padding: "16px 18px 0",
        background: "rgba(251,245,230,0.94)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
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
