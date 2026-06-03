import { ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Avatar from "./Avatar";
import AvatarRow from "./AvatarRow";
import Badge from "./Badge";
import Button from "./Button";

export default function FeedCard({ session }) {
  const { expandedCard, setExpandedCard, openSession, mySessions } = useApp();
  const cardId = session._proposalKey || session.id;
  const isExpanded = expandedCard === cardId;
  const joined = mySessions.find((s) => s.id === session.id);

  const tc = T.sessionTypes[session.type] ?? T.sessionTypes.learn;
  const tLearn = T.sessionTypes.learn;
  const tTeach = T.sessionTypes.teach;
  const title = session.skill || session.activity || "Session";
  const teacher = session.type === "learn" ? session.teacher : null;
  const pList = session.participants || [];
  const waitingList = session.waitingRoom || [];

  // Collapsed subtitle
  let sub = "";
  if (session._proposal) {
    const p = session._proposal;
    sub = p.time + (p.location ? ` · ${p.location}` : "");
  } else if (session.type === "learn" && session.scheduledTime) {
    sub = session.scheduledTime;
  } else {
    const count = session.type === "collab"
      ? (pList.length + (session.interested ?? 0))
      : (session.interested ?? 0);
    sub = `${count} interested`;
  }

  // Avatar shown in collapsed row
  const collapsedAvatar = session.type === "learn"
    ? <Avatar user={teacher} size={34} />
    : <AvatarRow users={session.type === "teach" ? waitingList : pList} size={34} max={1} />;

  return (
    <div
      style={{
        marginBottom: 8,
        borderRadius: T.cardRadius,
        border: `1px solid ${T.cardBorder}`,
        background: session.type === "collab" ? "#F2E8CE" : "#FFFFFF",
        boxShadow: T.cardShadow,
        overflow: "hidden",
      }}
    >
      <div
        style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        onClick={() => setExpandedCard(isExpanded ? null : cardId)}
      >
        {collapsedAvatar}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: sub ? 2 : 0, flexWrap: "nowrap" }}>
            <span style={{
              fontSize: 14, fontWeight: 600, color: T.text,
              letterSpacing: "-0.01em",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              flex: 1, minWidth: 0,
            }}>
              {title}
            </span>
            <div style={{ display: "flex", flexDirection: "row", gap: 4, flexShrink: 0 }}>
              {session.type === "teach" && (
                <>
                  <Badge color={tLearn.badge} bg={tLearn.bg}>Learn</Badge>
                  <Badge color={tTeach.badge} bg={tTeach.bg}>Teach</Badge>
                </>
              )}
              {session.type === "learn" && (
                <Badge color={tLearn.badge} bg={tLearn.bg}>Learn</Badge>
              )}
            </div>
          </div>
          {sub && (
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.4 }}>{sub}</div>
          )}
        </div>

        <div style={{ color: T.muted, flexShrink: 0, marginLeft: 4 }}>
          {isExpanded ? <ChevronUp size={15} strokeWidth={2} /> : <ChevronDown size={15} strokeWidth={2} />}
        </div>
      </div>

      {isExpanded && (
        <div style={{
          borderTop: `1px solid ${T.border}`,
          padding: "14px 16px 16px",
          background: session.type === "collab" ? T.surfaceHover : "#FAFAFA",
        }}>
          {/* Learn: show teacher details */}
          {session.type === "learn" && teacher && (
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <Avatar user={teacher} size={40} ring />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, letterSpacing: "-0.01em" }}>{teacher.name}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{teacher.year} · {teacher.major}</div>
              </div>
            </div>
          )}

          {/* Teach/Collab: participant avatars */}
          {session.type === "collab" && pList.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <AvatarRow users={pList} size={28} />
            </div>
          )}

          {session.description && (
            <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65, margin: "0 0 12px" }}>
              {session.description}
            </p>
          )}

          {session.tags && session.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
              {session.tags.map((tag) => (
                <Badge key={tag} color={T.purple} bg={T.purpleLight}>#{tag}</Badge>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {session.type === "learn" && (
              <Button small onClick={() => openSession(joined ? { ...session, ...joined } : session, "waitingRoom")}>
                View Waiting Room
              </Button>
            )}
            {session.type === "teach" && (
              <>
                <Button small onClick={() => {}}>🎓 Offer to Teach</Button>
                <Button variant="secondary" small onClick={() => openSession(session, "waitingRoom")}>
                  View Waiting Room
                </Button>
              </>
            )}
            {session.type === "collab" && (
              <Button small onClick={() => openSession(joined ? { ...session, ...joined } : session, "waitingRoom")}>
                View Waiting Room
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
