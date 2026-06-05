import { T } from "../styles/theme";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/PageHeader";
import TokenBadge from "../components/TokenBadge";
import TopicsPageContent from "./TopicsPage";

const filterBtnStyle = (active, color) => ({
  padding: "4px 12px",
  borderRadius: 6,
  border: active ? `1px solid ${color}55` : `1px solid ${T.border}`,
  background: active ? `${color}18` : "transparent",
  color: active ? color : T.muted,
  fontWeight: active ? 600 : 500,
  fontFamily: T.fontBody,
  fontSize: 12,
  cursor: "pointer",
  letterSpacing: "0.01em",
  transition: "all 0.15s",
  whiteSpace: "nowrap",
  flexShrink: 0,
});

export default function CommunitiesPage() {
  const { profile, activeTopic, setTab, communityFilter, setCommunityFilter, communitySort, setCommunitySort } = useApp();

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <PageHeader>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: activeTopic ? 14 : 12 }}>
          <div style={{
            fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 900,
            color: T.text, letterSpacing: "-0.04em",
          }}>
            Communities
          </div>
          <TokenBadge count={profile.tokens} />
        </div>
        {!activeTopic && (
          <div style={{ display: "flex", gap: 6, paddingBottom: 12, alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", gap: 6 }}>
            {[
              { id: "all",    label: "All" },
              { id: "joined", label: "Joined" },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setCommunityFilter(id)} style={filterBtnStyle(communityFilter === id, T.purple)}>
                {label}
              </button>
            ))}
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button onClick={() => setCommunitySort("alpha")} style={filterBtnStyle(communitySort === "alpha", T.purple)}>
                A↑
              </button>
              <button onClick={() => setCommunitySort("most_upcoming")} style={{ ...filterBtnStyle(communitySort === "most_upcoming", T.purple), display: "flex", alignItems: "center", gap: 3 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="17" rx="3"
                    fill={communitySort === "most_upcoming" ? T.purpleVibrant : "none"}
                    stroke={communitySort === "most_upcoming" ? T.purpleVibrant : T.muted}
                    strokeWidth="1.8" />
                  <path d="M3 9h18" stroke={communitySort === "most_upcoming" ? T.appBg : T.muted} strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M8 2v4M16 2v4" stroke={communitySort === "most_upcoming" ? T.purpleVibrant : T.muted} strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M7 14h4M7 17.5h6" stroke={communitySort === "most_upcoming" ? T.appBg : T.muted} strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                ↑
              </button>
              <button onClick={() => setCommunitySort("most_people")} style={{ ...filterBtnStyle(communitySort === "most_people", T.purple), display: "flex", alignItems: "center", gap: 3 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4"
                    fill={communitySort === "most_people" ? T.purpleVibrant : "none"}
                    stroke={communitySort === "most_people" ? T.purpleVibrant : T.muted}
                    strokeWidth="1.8" />
                  <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
                    fill={communitySort === "most_people" ? T.purpleVibrant : "none"}
                    stroke={communitySort === "most_people" ? T.purpleVibrant : T.muted}
                    strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                ↑
              </button>
            </div>
          </div>
        )}
      </PageHeader>

      <div style={{ flex: 1, overflowY: "auto", background: T.appBg }}>
        <TopicsPageContent />
      </div>

      {!activeTopic && (
        <button
          onClick={() => setTab("createCommunity")}
          style={{
            position: "absolute",
            bottom: 90,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: T.purpleGradient,
            border: "none",
            color: "#fff",
            fontSize: 28,
            fontWeight: 300,
            lineHeight: 1,
            cursor: "pointer",
            boxShadow: T.btnPrimaryShadow,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          +
        </button>
      )}
    </div>
  );
}
