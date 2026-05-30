// ─── APP STATE CONTEXT ───────────────────────────────────────
import { useApp } from "../context/AppContext";

// ─── STYLES ──────────────────────────────────────────────────
import { T } from "../styles/theme";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import AvatarRow from "./AvatarRow";
import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";

export default function MeetupCard({ session }) {
  const { expandedCard, setExpandedCard, joinSession, mySessions, openSession } = useApp();
  const isExpanded = expandedCard === session.id;
  const joined = mySessions.find(s => s.id === session.id);
  const pList = session.participants || [];

  const host = pList[0];

  return (
    <Card style={{ marginBottom: 8 }}>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Line 1: activity · badge · interested · group size */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{
                fontWeight: 700, fontSize: 14, color: T.text,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0,
              }}>{session.activity}</span>
              <Badge color={T.success} bg={T.successBg}>Meet Up</Badge>
              <span style={{ fontSize: 12, color: T.muted, flexShrink: 0, whiteSpace: "nowrap" }}>
                {pList.length + session.interested} interested{session.maxGroup ? ` · max ${session.maxGroup}` : ""}
              </span>
            </div>
            {/* Line 2: avatar(s) · "Catalyzed by [name]" */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <AvatarRow users={pList.slice(0, 3)} size={20} />
              {host && (
                <span style={{
                  fontSize: 12, color: T.muted,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  Catalyzed by <span style={{ color: T.textMid, fontWeight: 600 }}>{host.name}</span>
                </span>
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
          <p style={{ fontSize: 14, color: T.textMid, lineHeight: 1.6, margin: "0 0 14px" }}>{session.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {(session.tags || []).map(t => (
              <Badge key={t} color={T.textMid} bg={T.purpleLight}>#{t}</Badge>
            ))}
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
