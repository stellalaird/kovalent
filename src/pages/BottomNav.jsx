// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

export default function BottomNav() {
  const { tab, setTab, mySessions } = useApp();
  const waitingCount = mySessions.filter(s => s.status === "waiting_room").length;

  const tabs = [
  { id: "feed", icon: "🏠", label: "Feed" },
  { id: "mySessions", icon: "📋", label: "Sessions", badge: waitingCount },
  { id: "profile", icon: "👤", label: "Profile" },
  { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#fff", borderTop: "1px solid #f3f4f6",
      display: "flex", zIndex: 100,
      boxShadow: "0 -2px 16px rgba(0,0,0,0.06)",
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          flex: 1, background: "none", border: "none", cursor: "pointer",
          padding: "10px 0 14px", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 4, position: "relative",
        }}>
          <span style={{ fontSize: 22 }}>{t.icon}</span>
          <span style={{ fontSize: 11, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? "#6c4fc2" : "#6b7280" }}>
            {t.label}
          </span>
          {t.badge > 0 && (
            <div style={{
              position: "absolute", top: 6, right: "calc(50% - 16px)",
              background: "#ef4444", color: "#fff", borderRadius: "50%",
              width: 16, height: 16, fontSize: 10, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{t.badge}</div>
          )}
          {tab === t.id && (
            <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 2, background: "#6c4fc2", borderRadius: "0 0 2px 2px" }} />
          )}
        </button>
      ))}
    </div>
  );
}