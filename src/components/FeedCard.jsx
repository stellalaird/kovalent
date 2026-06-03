import { ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Avatar from "./Avatar";
import AvatarRow from "./AvatarRow";
import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";

function TypeBadges({ type }) {
  if (type === "learn") {
    return <Badge color={T.purple} bg={T.purpleLight}>Learn</Badge>;
  }
  if (type === "teach") {
    return (
      <>
        <Badge color="#1D4ED8" bg="#DBEAFE">Teach</Badge>
        <Badge color={T.purple} bg={T.purpleLight}>Learn</Badge>
      </>
    );
  }
  return <Badge color={T.success} bg={T.successBg}>Collab</Badge>;
}

export default function FeedCard({ session }) {
  const { expandedCard, setExpandedCard, joinSession, openSession, mySessions, showToast } =
    useApp();
  const isExpanded = expandedCard === session.id;
  const joined = mySessions.find((s) => s.id === session.id);

  const tc = T.sessionTypes[session.type] ?? T.sessionTypes.meetup;
  const title = session.skill || session.activity || "Session";
  const person =
    session.type === "learn"
      ? session.teacher
      : session.type === "teach"
      ? session.requester
      : null;
  const pList = session.participants || [];

  // Compact count string for collapsed row
  let countStr = "";
  if (session.type === "learn") {
    const parts = [`${session.interested} interested`];
    const enoughInterest = session.interested >= (session.minGroup ?? 0);
    if (session.scheduledTime && enoughInterest) {
      const regCount = session.participants?.length ?? 0;
      if (regCount > 0) parts.push(`${regCount} registered`);
    }
    if (session.minGroup && session.maxGroup) {
      parts.push(`capacity: ${session.minGroup}–${session.maxGroup}`);
    }
    countStr = parts.join(" · ");
  } else {
    countStr = `${session.interested} interested`;
  }

  return (
    <Card style={{ marginBottom: 10 }}>
      {/* Collapsed — matches My Sessions card rhythm */}
      <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        {/* Type icon */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: tc.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 19,
            flexShrink: 0,
          }}
        >
          {tc.icon}
        </div>

        {/* Two-line text block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Line 1: title + type badge(s) */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: T.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                minWidth: 0,
              }}
            >
              {title}
            </span>
            <TypeBadges type={session.type} />
          </div>
          {/* Line 2: count info only */}
          <span style={{ fontSize: 12, color: T.muted }}>{countStr}</span>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpandedCard(isExpanded ? null : session.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: T.muted,
            padding: 0,
            flexShrink: 0,
            lineHeight: 1,
            display: "flex",
          }}
        >
          {isExpanded ? (
            <ChevronUp size={18} strokeWidth={2} />
          ) : (
            <ChevronDown size={18} strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Expanded detail panel */}
      {isExpanded && (
        <div
          style={{
            borderTop: `1px solid ${T.border}`,
            padding: "14px 16px 16px",
            background: T.purpleFaint,
          }}
        >
          {/* Person profile row */}
          {person && (
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <Avatar user={person} size={46} ring />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{person.name}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                  {person.year} · {person.major}
                </div>
                {person.gender && (
                  <div style={{ fontSize: 12, color: T.muted }}>{person.gender}</div>
                )}
              </div>
            </div>
          )}

          {/* Meetup participants row */}
          {session.type === "collab" && pList.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <AvatarRow users={pList} size={32} />
            </div>
          )}

          <p style={{ fontSize: 13.5, color: T.textMid, lineHeight: 1.65, margin: "0 0 12px" }}>
            {session.description}
          </p>

          {session.tags && session.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
              {session.tags.map((tag) => (
                <Badge key={tag} color={T.textMid} bg={T.purpleLight}>
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {session.type === "learn" && (
              <Button
                small
                onClick={() => openSession(joined ? { ...session, ...joined } : session, "waitingRoom")}
              >
                View Waiting Room
              </Button>
            )}

            {session.type === "teach" && (
              <>
                <Button small onClick={() => {}}>
                  🎓 Offer to Teach
                </Button>
                <Button
                  variant="secondary"
                  small
                  onClick={() => openSession(session, "waitingRoom")}
                >
                  View Waiting Room
                </Button>
              </>
            )}

            {session.type === "collab" && (
              <Button
                small
                onClick={() => openSession(joined ? { ...session, ...joined } : session, "waitingRoom")}
              >
                View Waiting Room
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
