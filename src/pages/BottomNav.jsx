import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";

// ── Inline SVG icons ─────────────────────────────────────────
const icons = {
  feed: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"
        fill={active ? T.purple : "none"}
        stroke={active ? T.purple : T.muted}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 21V12h6v9"
        stroke={active ? "#fff" : T.muted}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  mySessions: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3" y="4" width="18" height="17" rx="3"
        fill={active ? T.purple : "none"}
        stroke={active ? T.purple : T.muted}
        strokeWidth="1.8"
      />
      <path
        d="M3 9h18"
        stroke={active ? "#fff" : T.muted}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 2v4M16 2v4"
        stroke={active ? T.purple : T.muted}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 14h4M7 17.5h6"
        stroke={active ? "#fff" : T.muted}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  profile: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="12" cy="8" r="4"
        fill={active ? T.purple : "none"}
        stroke={active ? T.purple : T.muted}
        strokeWidth="1.8"
      />
      <path
        d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
        fill={active ? T.purple : "none"}
        stroke={active ? T.purple : T.muted}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  settings: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="12" cy="12" r="3"
        fill={active ? T.purple : "none"}
        stroke={active ? "#fff" : T.muted}
        strokeWidth="1.8"
      />
      <path
        d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke={active ? T.purple : T.muted}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export default function BottomNav() {
  const { tab, setTab, mySessions } = useApp();
  const waitingCount = mySessions.filter((s) => s.status === "waiting_room").length;

  const tabs = [
    { id: "feed", label: "Feed" },
    { id: "mySessions", label: "Sessions", badge: waitingCount },
    { id: "profile", label: "Profile" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: `1px solid ${T.border}`,
        display: "flex",
        zIndex: 100,
        boxShadow: "0 -1px 20px rgba(109,40,217,0.07)",
      }}
    >
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "10px 0 14px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              position: "relative",
            }}
          >
            {/* SVG icon */}
            {icons[t.id]?.(active)}

            {/* Label */}
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                color: active ? T.purple : T.muted,
                letterSpacing: "0.02em",
              }}
            >
              {t.label}
            </span>

            {/* Notification badge */}
            {t.badge > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: "calc(50% - 18px)",
                  background: T.danger,
                  color: "#fff",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px solid #fff",
                }}
              >
                {t.badge}
              </div>
            )}

            {/* Active pill indicator */}
            {active && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "30%",
                  right: "30%",
                  height: 3,
                  background: T.purpleGradient,
                  borderRadius: "0 0 3px 3px",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
