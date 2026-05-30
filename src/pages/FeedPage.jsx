// ─── MOCK DATA ───────────────────────────────────────
import { MOCK_USERS, CURRENT_USER, MOCK_SESSIONS, MY_SESSIONS } from "../data/mockData";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Pill from "../components/Pill";
import TokenBadge from "../components/TokenBadge";

// ─── FEED CARD COMPONENTS ────────────────────────────────────
import SessionCard from "../components/SessionCard";

// ─── PAGES ───────────────────────────────────────────────────
import TopicsPageContent from "../pages/TopicsPage";

export default function FeedPage() {
  const { feedView, setFeedView, activeTopic } = useApp();

  const activityRank = { high: 0, medium: 1, low: 2 };

  const feedSessions = MOCK_SESSIONS.filter((s) => s.status === "feed");

  const sorted = [...feedSessions].sort(
    (a, b) =>
      (activityRank[a.activityLevel] ?? 2) -
      (activityRank[b.activityLevel] ?? 2)
  );

  const header = (
    <div
      style={{
        padding: "16px 16px 0",
        background: "#fff",
        borderBottom: "1px solid #f3f4f6",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1a1a2e",
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "#6c4fc2" }}>Kovalent</span>
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            Northwestern's skill-share community
          </div>
        </div>

        <TokenBadge count={CURRENT_USER.tokens} />
      </div>

      {!activeTopic && (
        <div style={{ display: "flex", gap: 6, paddingBottom: 12 }}>
          <Pill
            active={feedView === "sessions"}
            onClick={() => setFeedView("sessions")}
          >
            Sessions
          </Pill>

          <Pill
            active={feedView === "topics"}
            onClick={() => setFeedView("topics")}
          >
            🏷️ Topics
          </Pill>
        </div>
      )}
    </div>
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
                color: "#374151",
              }}
            >
              Nothing here yet
            </div>
          </div>
        )}

        {sorted.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}