import { MOCK_SESSIONS, CURRENT_USER } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import PageHeader from "../components/PageHeader";
import Pill from "../components/Pill";
import TokenBadge from "../components/TokenBadge";
import SessionCard from "../components/SessionCard";
import TopicsPageContent from "../pages/TopicsPage";

export default function FeedPage() {
  const { feedView, setFeedView, activeTopic, sessionTypeFilter, setSessionTypeFilter, mySessions } = useApp();

  const activityRank = { high: 0, medium: 1, low: 2 };
  const joinedIds = new Set(mySessions.map((s) => s.id));
  const feedSessions = MOCK_SESSIONS.filter((s) => s.status === "feed" && !joinedIds.has(s.id));

  const sorted = [...feedSessions]
    .sort((a, b) => (activityRank[a.activityLevel] ?? 2) - (activityRank[b.activityLevel] ?? 2))
    .filter((s) => sessionTypeFilter === "all" || s.type === sessionTypeFilter)
    .flatMap(s => {
      if (s.type === "collab" && s.proposals?.length > 0) {
        return s.proposals.map(p => ({ ...s, _proposalKey: `${s.id}__feed__${p.id}`, _proposal: p }));
      }
      return [s];
    });

  const header = (
    <PageHeader>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="url(#kv-g)" strokeWidth="2" strokeLinejoin="round" fill="none"/>
              <circle cx="12" cy="12" r="2.5" fill="url(#kv-g)"/>
              <defs>
                <linearGradient id="kv-g" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F0C040"/>
                  <stop offset="1" stopColor="#B8860B"/>
                </linearGradient>
              </defs>
            </svg>
            <span style={{
              fontSize: 24, fontWeight: 900, letterSpacing: "-0.04em",
              background: T.purpleGradient,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              fontFamily: T.fontDisplay,
            }}>
              kovalent
            </span>
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2, fontWeight: 500, letterSpacing: "0.01em" }}>
            Northwestern's skill-share community
          </div>
        </div>
        <TokenBadge count={CURRENT_USER.tokens} />
      </div>

      {!activeTopic && (
        <div style={{ display: "flex", gap: 0, background: "rgba(180,140,40,0.1)", borderRadius: 12, padding: 4, marginBottom: feedView === "sessions" ? 10 : 14 }}>
          {[
            { id: "sessions", label: "Sessions" },
            { id: "topics", label: "Topics" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFeedView(id)}
              style={{
                flex: 1,
                padding: "7px 0",
                borderRadius: 9,
                border: "none",
                background: feedView === id ? T.surface : "transparent",
                color: feedView === id ? T.text : T.muted,
                fontWeight: feedView === id ? 700 : 500,
                fontFamily: T.fontBody,
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: feedView === id ? "0 1px 4px rgba(100,70,0,0.15)" : "none",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {!activeTopic && feedView === "sessions" && (
        <div style={{ display: "flex", gap: 6, paddingBottom: 12, overflowX: "auto" }}>
          {[
            { id: "all",    label: "All",    color: T.muted,                          activeBg: T.surface,                activeColor: T.text },
            { id: "learn",  label: "Learn",  color: T.sessionTypes.learn.badge,       activeBg: T.sessionTypes.learn.bg,  activeColor: T.sessionTypes.learn.badge },
            { id: "teach",  label: "Teach",  color: T.sessionTypes.teach.badge,       activeBg: T.sessionTypes.teach.bg,  activeColor: T.sessionTypes.teach.badge },
            { id: "collab", label: "Collab", color: T.sessionTypes.collab.badge,      activeBg: T.sessionTypes.collab.bg, activeColor: T.sessionTypes.collab.badge },
          ].map(({ id, label, color, activeBg, activeColor }) => {
            const isActive = sessionTypeFilter === id;
            return (
              <button
                key={id}
                onClick={() => setSessionTypeFilter(id)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: isActive ? `1px solid ${color}55` : `1px solid ${T.border}`,
                  background: isActive ? activeBg : "transparent",
                  color: isActive ? activeColor : T.muted,
                  fontWeight: isActive ? 600 : 500,
                  fontFamily: T.fontBody,
                  fontSize: 12,
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </PageHeader>
  );

  if (feedView === "topics") {
    return <div>{header}<TopicsPageContent /></div>;
  }

  return (
    <div>
      {header}
      <div style={{ padding: "16px 16px", background: T.appBg, minHeight: "100vh" }}>
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 18, color: T.text, letterSpacing: "-0.02em" }}>
              Nothing here yet
            </div>
          </div>
        )}
        {sorted.map((session) => (
          <SessionCard key={session._proposalKey || session.id} session={session} />
        ))}
      </div>
    </div>
  );
}
