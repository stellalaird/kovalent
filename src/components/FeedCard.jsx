import { T } from "../styles/theme";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import Avatar from "./Avatar";
import AvatarRow from "./AvatarRow";
import Badge from "./Badge";
import Button from "./Button";

export default function FeedCard({ session }) {
  const { expandedCard, setExpandedCard, openSession, joinSession, mySessions, teacherOverrides, setTeacherOverrides, profile } = useApp();
  const cardId = session._proposalKey || session.id;
  const isExpanded = expandedCard === cardId;
  const joined = mySessions.find((s) => s.id === session.id);

  // Resolve teacher: learn sessions have session.teacher; teach sessions use teacherOverrides
  const assignedTeacher = session.type === "teach" ? teacherOverrides[session.id] : null;
  const teacher = session.type === "learn" ? session.teacher : assignedTeacher ?? null;
  const weAreTeacher = teacher?.id === profile?.id;
  const hasTeacher = !!teacher;

  const tc = T.sessionTypes[session.type] ?? T.sessionTypes.learn;
  const tLearn = T.sessionTypes.learn;
  const tTeach = T.sessionTypes.teach;
  const title = session.skill || session.activity || "Session";
  const pList = session.participants || [];
  const waitingList = session.waitingRoom || [];

  // Collapsed subtitle
  let sub = "";
  if (session._proposal) {
    const p = session._proposal;
    sub = p.time;
  } else if (session.scheduledTime && (session.type !== "teach" || hasTeacher)) {
    sub = session.scheduledTime;
  } else {
    const count = session.type === "collab"
      ? (pList.length + (session.interested ?? 0))
      : (session.interested ?? 0);
    sub = `${count} interested`;
  }

  // Avatar shown in collapsed row
  const teachOverflow = Math.max(0, (session.interested ?? 0) - 1);
  const collabOverflow = Math.max(0, (pList.length + (session.interested ?? 0)) - 1);

  const collapsedAvatar = hasTeacher
    ? <Avatar user={teacher} size={34} />
    : session.type === "teach"
      ? <AvatarRow users={waitingList} size={34} max={1} overflowCount={teachOverflow} />
      : session._proposal
        ? <Avatar user={session._proposal.proposer} size={34} />
        : <AvatarRow users={pList} size={34} max={1} overflowCount={collabOverflow} />;

  return (
    <div
      style={{
        marginBottom: 8,
        borderRadius: T.cardRadius,
        border: `1px solid ${T.cardBorder}`,
        background: session.type === "collab" ? T.cardElevated : T.card,
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
              {session.type === "teach" && !hasTeacher && (
                <>
                  <Badge color={tLearn.badge} bg={tLearn.bg}>Learn</Badge>
                  <Badge color={tTeach.badge} bg={tTeach.bg}>Teach</Badge>
                </>
              )}
              {session.type === "teach" && hasTeacher && weAreTeacher && (
                <Badge color={tTeach.badge} bg={tTeach.bg}>Teach</Badge>
              )}
              {session.type === "teach" && hasTeacher && !weAreTeacher && (
                <Badge color={tLearn.badge} bg={tLearn.bg}>Learn</Badge>
              )}
              {session.type === "learn" && (
                weAreTeacher
                  ? <Badge color={tTeach.badge} bg={tTeach.bg}>Teach</Badge>
                  : <Badge color={tLearn.badge} bg={tLearn.bg}>Learn</Badge>
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
          background: session.type === "collab" ? T.surfaceHover : T.surface,
        }}>
          {/* Show teacher details whenever a teacher exists */}
          {hasTeacher && (
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
            {session.type !== "collab" && (
              <Button small onClick={() => openSession(joined ? { ...session, ...joined } : session, "waitingRoom")}>
                View Waiting Room
              </Button>
            )}
            {session.type === "collab" && (
              <Button small onClick={() => {
                // Strip proposal-specific fields so we always open the base collab waiting room
                const { _proposal, _proposalKey, ...baseSession } = session;
                openSession(joined ? { ...baseSession, ...joined } : baseSession, "waitingRoom");
              }}>
                View Waiting Room
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
