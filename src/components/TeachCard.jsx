// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Avatar from "./Avatar";
import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";

// ─── FEED CARD COMPONENTS ────────────────────────────────────
import ActivityBadge from "./ActivityBadge";

export default function TeachCard({ session }) {
  const { expandedCard, setExpandedCard, joinSession, openSession, mySessions } = useApp();
  const isExpanded = expandedCard === session.id;
  const joined = mySessions.find(s => s.id === session.id);

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>{session.skill}</span>
              <ActivityBadge level={session.activityLevel} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar user={session.teacher} size={24} />
              <span style={{ fontSize: 13, color: "#6b7280" }}>{session.teacher.name}</span>
              <Badge color="#6c4fc2" bg="#ede9ff">{session.level}</Badge>
            </div>
          </div>
          <button onClick={() => setExpandedCard(isExpanded ? null : session.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#6b7280", fontSize: 20, padding: 4,
          }}>
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "#6b7280" }}>
          <span>👥 {session.interested} interested</span>
          <span>📚 {session.taught} sessions</span>
          <span>🎯 {session.minGroup}–{session.maxGroup} students</span>
        </div>
      </div>

      {isExpanded && (
        <div style={{ borderTop: "1px solid #f3f4f6", padding: "14px 16px", background: "#fafaf9" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <Avatar user={session.teacher} size={48} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{session.teacher.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{session.teacher.year} · {session.teacher.major}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{session.teacher.gender}</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 14px" }}>{session.description}</p>
          <div style={{ display: "flex", gap: 8 }}>
            {joined ? (
              <Button variant="ghost" small onClick={() => openSession({ ...session, ...joined }, "waitingRoom")}>
                → Go to Waiting Room
              </Button>
            ) : (
              <Button small onClick={() => joinSession(session)}>
                ✓ Interested
              </Button>
            )}
            <Button variant="secondary" small onClick={() => {}}>View Profile</Button>
          </div>
        </div>
      )}
    </Card>
  );
}