// ─── MOCK DATA ───────────────────────────────────────
import { MOCK_USERS, CURRENT_USER, MOCK_SESSIONS, MY_SESSIONS } from "../data/mockData";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── STYLES ──────────────────────────────────────────────────
import { T } from "../styles/theme";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import PageHeader from "../components/PageHeader";
import Pill from "../components/Pill";
import TokenBadge from "../components/TokenBadge";

// ─── FEED CARD COMPONENTS ────────────────────────────────────
import SessionCard from "../components/SessionCard";

// ─── PAGES ───────────────────────────────────────────────────
import TopicsPageContent from "../pages/TopicsPage";

export default function FeedPage() {
  const { feedView, setFeedView, activeTopic, sessionTypeFilter, setSessionTypeFilter, mySessions } = useApp();

  const activityRank = { high: 0, medium: 1, low: 2 };

  const joinedIds = new Set(mySessions.map((s) => s.id));
  const feedSessions = MOCK_SESSIONS.filter((s) => s.status === "feed" && !joinedIds.has(s.id));

  const sorted = [...feedSessions]
    .sort(
      (a, b) =>
        (activityRank[a.activityLevel] ?? 2) -
        (activityRank[b.activityLevel] ?? 2)
    )
    .filter((s) => sessionTypeFilter === "all" || s.type === sessionTypeFilter)
    // Expand collab sessions that have proposals into one card per proposal
    .flatMap(s => {
      if (s.type === "collab" && s.proposals?.length > 0) {
        return s.proposals.map(p => ({
          ...s,
          _proposalKey: `${s.id}__feed__${p.id}`,
          _proposal: p,
        }));
      }
      return [s];
    });

  const header = (
    <PageHeader>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div>
          {/* Gradient wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Bond / hexagon glyph */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="url(#kv-grad)" strokeWidth="2" strokeLinejoin="round" fill="none"/>
              <circle cx="12" cy="12" r="2.5" fill="url(#kv-grad)"/>
              <defs>
                <linearGradient id="kv-grad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED"/>
                  <stop offset="1" stopColor="#5B21B6"/>
                </linearGradient>
              </defs>
            </svg>
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                background: T.purpleGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Kovalent
            </span>
          </div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>
            Northwestern's skill-share community
          </div>
        </div>

        <TokenBadge count={CURRENT_USER.tokens} />
      </div>

      {!activeTopic && (
        <div style={{ display: "flex", gap: 6, paddingBottom: feedView === "sessions" ? 8 : 12 }}>
          <Pill active={feedView === "sessions"} onClick={() => setFeedView("sessions")}>
            Sessions
          </Pill>
          <Pill active={feedView === "topics"} onClick={() => setFeedView("topics")}>
            Topics
          </Pill>
        </div>
      )}
      {!activeTopic && feedView === "sessions" && (
        <div style={{ display: "flex", gap: 5, paddingBottom: 10, overflowX: "auto" }}>
          {[
            { id: "all", label: "All" },
            { id: "learn", label: "Learn" },
            { id: "teach", label: "Teach" },
            { id: "collab", label: "Collab" },
          ].map(({ id, label }) => (
            <Pill
              key={id}
              small
              active={sessionTypeFilter === id}
              onClick={() => setSessionTypeFilter(id)}
            >
              {label}
            </Pill>
          ))}
        </div>
      )}
    </PageHeader>
  );

  if (feedView === "topics") {
    return (
      <div>
        {header}
        <TopicsPageContent />
      </div>
    );
  }

  return (
    <div>
      {header}

      <div style={{ padding: 16 }}>
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: T.text,
              }}
            >
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