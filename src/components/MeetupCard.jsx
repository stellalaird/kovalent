// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import AvatarRow from "./AvatarRow";
import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";

// ─── FEED CARD COMPONENTS ────────────────────────────────────
import ActivityBadge from "./ActivityBadge";

export default function MeetupCard({ session }) {
  const { expandedCard, setExpandedCard, joinSession, mySessions, openSession } = useApp();
  const isExpanded = expandedCard === session.id;
  const joined = mySessions.find(s => s.id === session.id);
  const pList = session.participants || [];

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>{session.activity}</span>
              <ActivityBadge level={session.activityLevel} />
            </div>
            <AvatarRow users={pList} size={26} />
          </div>
          <button onClick={() => setExpandedCard(isExpanded ? null : session.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#6b7280", fontSize: 20, padding: 4,
          }}>
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
          <span>👥 {pList.length + session.interested} interested · max {session.maxGroup}</span>
        </div>
      </div>

      {isExpanded && (
        <div style={{ borderTop: "1px solid #f3f4f6", padding: "14px 16px", background: "#fafaf9" }}>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 14px" }}>{session.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {(session.tags || []).map(t => <Badge key={t} color="#374151" bg="#f3f4f6">#{t}</Badge>)}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {joined ? (
              <Button variant="ghost" small onClick={() => openSession({ ...session, ...joined }, "waitingRoom")}>
                → Go to Meetup Room
              </Button>
            ) : (
              <Button small onClick={() => joinSession(session)}>Join Meetup</Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}