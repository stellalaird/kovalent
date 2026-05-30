// ─── APP STATE CONTEXT ───────────────────────────────────────
import { useApp } from "../context/AppContext";

// ─── STYLES ──────────────────────────────────────────────────
import { T } from "../styles/theme";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Avatar from "./Avatar";
import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";

export default function LearnCard({ session }) {
  const { expandedCard, setExpandedCard, showToast } = useApp();
  const isExpanded = expandedCard === session.id;

  return (
    <Card style={{ marginBottom: 8 }}>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Line 1: title · badge · interested */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{
                fontWeight: 700, fontSize: 14, color: T.text,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0,
              }}>{session.skill}</span>
              <Badge color="#0369a1" bg="#dbeafe">Learn</Badge>
              <span style={{ fontSize: 12, color: T.muted, flexShrink: 0, whiteSpace: "nowrap" }}>
                {session.interested} interested
              </span>
            </div>
            {/* Line 2: avatar · name · year · level */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Avatar user={session.requester} size={20} />
              <span style={{
                fontSize: 12, color: T.textMid, fontWeight: 600,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{session.requester.name}</span>
              {session.requester.year && (
                <span style={{ fontSize: 12, color: T.muted, whiteSpace: "nowrap" }}>· {session.requester.year}</span>
              )}
              {session.level && (
                <span style={{ fontSize: 12, color: T.muted, whiteSpace: "nowrap" }}>· {session.level}</span>
              )}
            </div>
          </div>
          <button onClick={() => setExpandedCard(isExpanded ? null : session.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: T.muted, fontSize: 16, padding: "2px 4px", flexShrink: 0,
          }}>
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "14px 16px", background: T.purpleFaint }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <Avatar user={session.requester} size={48} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{session.requester.name}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{session.requester.year} · {session.requester.major}</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: T.textMid, lineHeight: 1.6, margin: "0 0 14px" }}>{session.description}</p>
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
