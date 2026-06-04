import { T } from "../styles/theme";
import { useApp } from "../context/AppContext";

const icons = {
  feed: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"
        fill={active ? T.purpleVibrant : "none"}
        stroke={active ? T.purpleVibrant : T.muted}
        strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 21V12h6v9"
        stroke={active ? T.appBg : T.muted}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mySessions: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="3"
        fill={active ? T.purpleVibrant : "none"}
        stroke={active ? T.purpleVibrant : T.muted}
        strokeWidth="1.8" />
      <path d="M3 9h18" stroke={active ? T.appBg : T.muted} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 2v4M16 2v4" stroke={active ? T.purpleVibrant : T.muted} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 14h4M7 17.5h6" stroke={active ? T.appBg : T.muted} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  profile: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4"
        fill={active ? T.purpleVibrant : "none"}
        stroke={active ? T.purpleVibrant : T.muted}
        strokeWidth="1.8" />
      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
        fill={active ? T.purpleVibrant : "none"}
        stroke={active ? T.purpleVibrant : T.muted}
        strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  settings: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3"
        fill={active ? T.purpleVibrant : "none"}
        stroke={active ? T.purpleVibrant : T.muted}
        strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke={active ? T.purpleVibrant : T.muted}
        strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

export default function BottomNav() {
  const { tab, setTab, mySessions } = useApp();
  const waitingCount = mySessions.filter((s) => s.status === "waiting_room").length;

  const tabs = [
    { id: "feed", label: "Feed" },
    { id: "mySessions", label: "Sessions" },
    { id: "profile", label: "Profile" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div style={{
      flexShrink: 0,
      background: T.appBg + "f5",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderTop: `1px solid ${T.border}`,
      display: "flex",
      zIndex: 100,
      paddingBottom: 10,
      boxShadow: "0 -1px 0 rgba(180,140,40,0.15)",
    }}>
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, background: "none", border: "none",
              cursor: "pointer", padding: "10px 0 6px",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 5,
              position: "relative",
            }}
          >
            {/* Icon container */}
            <div style={{
              width: 44, height: 30, borderRadius: 999,
              background: active ? T.purpleLight : "transparent",
              border: active ? `1px solid rgba(180,140,40,0.4)` : "1px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              boxShadow: active ? T.purpleGlowSm : "none",
              position: "relative",
            }}>
              {icons[t.id]?.(active)}
              {t.badge > 0 && (
                <div style={{
                  position: "absolute", top: -3, right: -2,
                  background: T.danger, color: "#fff",
                  borderRadius: "50%", width: 15, height: 15,
                  fontSize: 9, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `2px solid ${T.appBg}`,
                  boxShadow: "0 0 8px rgba(248,113,113,0.5)",
                }}>
                  {t.badge}
                </div>
              )}
            </div>

            <span style={{
              fontSize: 10, fontWeight: active ? 700 : 500,
              color: active ? T.purpleVibrant : T.muted,
              letterSpacing: "0.02em",
              fontFamily: T.fontBody,
            }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
