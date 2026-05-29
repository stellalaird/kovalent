// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Avatar from "./Avatar";
import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";

// ─── FEED CARD COMPONENTS ────────────────────────────────────
import ActivityBadge from "./ActivityBadge";

export default function LearnCard({ session }) {
  const { expandedCard, setExpandedCard, showToast } = useApp();
  const isExpanded = expandedCard === session.id;

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>Wanted: {session.skill}</span>
              <ActivityBadge level={session.activityLevel} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar user={session.requester} size={24} />
              <span style={{ fontSize: 13, color: "#6b7280" }}>{session.requester.name}</span>
              <Badge color="#0369a1" bg="#e0f2fe">{session.level}</Badge>
            </div>
          </div>
          <button onClick={() => setExpandedCard(isExpanded ? null : session.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#6b7280", fontSize: 20, padding: 4,
          }}>
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
          <span>🙋 {session.interested} learners waiting</span>
        </div>
      </div>

      {isExpanded && (
        <div style={{ borderTop: "1px solid #f3f4f6", padding: "14px 16px", background: "#fafaf9" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <Avatar user={session.requester} size={48} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{session.requester.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{session.requester.year} · {session.requester.major}</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 14px" }}>{session.description}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button small onClick={() => showToast("Teaching offer sent! ✓")}>
              🎓 Offer to Teach
            </Button>
            <Button variant="secondary" small onClick={() => showToast("Added to waiting list!")}>
              Join Waitlist
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}