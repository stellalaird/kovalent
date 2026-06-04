import { MOCK_USERS } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Avatar from "../components/Avatar";
import AvatarRow from "../components/AvatarRow";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import Section from "../components/Section";

export default function WaitingRoomPage({ session }) {
  const { setTab, setActiveView, mySessions, setMySessions, joinSession, setViewingUser, profile, teacherOverrides, setTeacherOverrides, setActiveSession, setActiveProposal, openSession } = useApp();
  const mySession = mySessions.find((s) => s.id === session.id);
  const alreadyJoined = !!mySession;

  // Are we the teacher of this session?
  const weAreTeacher =
    (session.type === "teach" && teacherOverrides[session.id]?.id === profile?.id) ||
    (session.type === "learn" && session.teacher?.id === profile?.id);

  const isTeach = session.type === "learn" || weAreTeacher;
  const isMeetup = session.type === "collab";
  const alreadyRegistered = isTeach && mySession?.status === "scheduled";
  const label = session.skill || session.activity || "Session";
  const host = weAreTeacher ? profile : (session.teacher || null);

  const registeredList = isTeach ? (session.participants || []) : [];
  const registeredIds = new Set(registeredList.map((u) => u.id));
  const knownInterested = [
    ...(alreadyJoined && !weAreTeacher ? [profile] : []),
    ...(session.waitingRoom || []),
    ...(!isTeach ? (session.participants || []) : []),
  ].filter((u, i, arr) => arr.findIndex((x) => x.id === u.id) === i).filter((u) => !registeredIds.has(u.id));

  const targetInterested = isTeach
    ? (session.interested ?? knownInterested.length)
    : (session.participants?.length ?? 0) + (session.interested ?? 0);
  const usedIds = new Set([...knownInterested.map(u => u.id), ...registeredList.map(u => u.id), ...(host ? [host.id] : [])]);
  const extras = MOCK_USERS.filter(u => !usedIds.has(u.id)).slice(0, Math.max(0, targetInterested - knownInterested.length));
  const allParticipants = [...registeredList, ...knownInterested, ...extras];
  const totalCount = allParticipants.length;

  const tc = T.sessionTypes[session.type] ?? T.sessionTypes.learn;
  const sessionKind = isMeetup ? "Group Collab" : session.myRole === "learner" ? "Learning Session" : "Teaching Session";

  return (
    <div>
      {/* Hero — dark with radial glow bloom */}
      <div style={{
        background: T.appBg,
        padding: "22px 18px 24px",
        position: "relative",
        overflow: "hidden",
        borderBottom: `1px solid ${T.border}`,
      }}>
        {/* Radial glow bloom */}
        <div style={{
          position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
          width: 320, height: 200, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${tc.glow}28 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <button
          onClick={() => setTab(alreadyJoined ? "mySessions" : "feed")}
          style={{
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.textMid, borderRadius: 10, padding: "6px 14px",
            fontWeight: 600, cursor: "pointer", fontSize: 13,
            marginBottom: 18, letterSpacing: "-0.01em",
            position: "relative",
          }}
        >
          ← Back
        </button>

        <div style={{
          fontSize: 10, fontWeight: 700, color: T.muted,
          textTransform: "uppercase", letterSpacing: "0.14em",
          marginBottom: 8, fontFamily: T.fontBody, position: "relative",
        }}>
          {sessionKind}
        </div>
        <div style={{
          fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 900,
          color: T.text, letterSpacing: "-0.035em", lineHeight: 1.15,
          marginBottom: 16, position: "relative",
        }}>
          {label}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: T.successBg, border: `1px solid ${T.successBorder}`,
            borderRadius: 999, padding: "5px 12px", fontSize: 12, color: T.success, fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.success, display: "inline-block", boxShadow: `0 0 6px ${T.success}` }} />
            {totalCount} joined
          </div>
          {isTeach && session.minGroup && session.maxGroup && (
            <div style={{ display: "inline-flex", alignItems: "center", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: "5px 12px", fontSize: 12, color: T.textMid, fontWeight: 500 }}>
              capacity: {session.minGroup}–{session.maxGroup}
            </div>
          )}
          {isTeach && registeredList.length > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: "5px 12px", fontSize: 12, color: T.textMid, fontWeight: 500 }}>
              {registeredList.length} registered
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "18px 16px" }}>
        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {!alreadyJoined && !weAreTeacher && <Button onClick={() => joinSession(session)}>✓ Join</Button>}
          {alreadyJoined && weAreTeacher && (
            <Button onClick={() => setActiveView("setMeetingTime")}>
              {session.scheduledTime ? "Edit Meeting Time" : "Set Meeting Time"}
            </Button>
          )}
          {alreadyJoined && isTeach && !weAreTeacher && session.scheduledTime && !alreadyRegistered && (
            session.maxGroup && registeredList.length >= session.maxGroup
              ? <Button variant="secondary" style={{ opacity: 0.5, cursor: "default" }} onClick={() => {}}>Session Full</Button>
              : <Button onClick={() => setMySessions(prev => prev.map(s => s.id === session.id ? { ...s, status: "scheduled" } : s))}>✓ Register</Button>
          )}
          {alreadyRegistered && isTeach && (
            <Button variant="success" style={{ cursor: "default" }} onClick={() => {}}>✓ Registered</Button>
          )}
          {alreadyJoined && isMeetup && (
            <Button onClick={() => setActiveView("proposeMeetup")}>📅 Propose Meetup</Button>
          )}
          {alreadyJoined && (isTeach || isMeetup) && (
            <Button variant="secondary" onClick={() => setActiveView("chatroom")}>Group Chat</Button>
          )}
          {alreadyRegistered && (
            <Button variant="danger" onClick={() => setMySessions(prev => prev.map(s => s.id === session.id ? { ...s, status: "waiting_room" } : s))}>
              Cancel Registration
            </Button>
          )}
          {alreadyJoined && session.type === "teach" && !teacherOverrides[session.id] && (
            <Button variant="primary" onClick={() => {
              setTeacherOverrides(prev => ({ ...prev, [session.id]: profile }));
              setMySessions(prev => prev.map(s => s.id === session.id ? { ...s, myRole: "teacher", scheduledTime: null, location: null } : s));
              setActiveSession(prev => ({ ...prev, scheduledTime: null, location: null }));
            }}>
              🎓 Offer to Teach
            </Button>
          )}
          {alreadyJoined && !alreadyRegistered && (
            <Button variant="danger" small onClick={() => {
              // Remove this session and any registered proposals for it
              setMySessions(prev => prev.filter(s => s.id !== session.id && s._baseId !== session.id));
              // Clear teacher override if we were the teacher
              if (weAreTeacher) setTeacherOverrides(prev => { const n = { ...prev }; delete n[session.id]; return n; });
              setTab("feed");
            }}>
              Leave
            </Button>
          )}
        </div>

        {/* Meeting details */}
        {isTeach && (
          <Section title="Meeting Details">
            <Card style={{ marginBottom: 16 }}>
              <div style={{ padding: 16 }}>
                {!session.scheduledTime && (session.interested ?? 0) < (session.minGroup ?? 0) && (
                  <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", marginBottom: 14, lineHeight: 1.6 }}>
                    Need {(session.minGroup ?? 0) - (session.interested ?? 0)} more interested before the teacher can schedule.
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    ["🕐", "When", session.scheduledTime || "TBD"],
                    ["📍", "Where", session.location || "TBD"],
                    ["🎒", "Materials", session.materials || "TBD"],
                  ].map(([icon, lbl, val]) => (
                    <div key={lbl} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 17, lineHeight: 1, marginTop: 2 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>{lbl}</div>
                        <div style={{ fontSize: 14, fontWeight: val === "TBD" ? 400 : 600, color: val === "TBD" ? T.muted : T.text, letterSpacing: "-0.01em" }}>{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Section>
        )}

        {host && (
          <Section title="Teacher">
            <Card style={{ marginBottom: 0, cursor: "pointer" }} onClick={() => setViewingUser(host)}>
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar user={host} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15, color: T.text, letterSpacing: "-0.02em" }}>{host.name}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{host.year} · {host.major}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{host.taught} sessions taught</div>
                </div>
                {host.rating != null && (
                  <Badge color={T.purple} bg={T.purpleLight}>★ {host.rating}</Badge>
                )}
              </div>
            </Card>
          </Section>
        )}

        {isMeetup && session.proposals?.length > 0 && (
          <Section title={`Proposed Meetups (${session.proposals.length})`}>
            {session.proposals.map(p => {
              const baseId = session._baseId || session.id;
              const propId = `${baseId}__${p.id}`;
              const registeredForThis = mySessions.some(s => s.id === propId);
              return (
                <Card key={p.id} style={{ marginBottom: 10 }}>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{p.time}</div>
                      {p.location && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{p.location}</div>}
                    </div>
                    {p.note && <div style={{ fontSize: 13, color: T.textMid, marginBottom: 12, lineHeight: 1.6 }}>{p.note}</div>}
                    <div style={{ display: "flex", gap: 8 }}>
                      {!alreadyJoined
                        ? <Button variant="secondary" style={{ opacity: 0.5, cursor: "default", flex: 1 }} onClick={() => {}}>Meetup Chat</Button>
                        : <Button variant="secondary" style={{ flex: 1 }} onClick={() => { setActiveProposal(p); setActiveView("proposalChat"); }}>Meetup Chat</Button>
                      }
                      {!alreadyJoined
                        ? <Button variant="secondary" style={{ opacity: 0.5, cursor: "default", flex: 1 }} onClick={() => {}}>Join to Register</Button>
                        : registeredForThis
                          ? <Button variant="success" style={{ cursor: "default", flex: 1 }} onClick={() => {}}>✓ Registered</Button>
                          : <Button style={{ flex: 1 }} onClick={() => setMySessions(prev => {
                              if (prev.some(s => s.id === propId)) return prev;
                              return [...prev, { ...session, id: propId, _baseId: session.id, status: "scheduled", scheduledTime: p.time, location: p.location, myRole: "participant" }];
                            })}>Register</Button>
                      }
                    </div>
                  </div>
                </Card>
              );
            })}
          </Section>
        )}

        {isMeetup && (() => {
          const baseId = session._baseId || session.id;
          const myPastMeetups = mySessions.filter(s => s.status === "completed" && s._sourceId === baseId);
          const sessionPastMeetups = session.pastSessions || [];
          const allPast = myPastMeetups.length > 0 ? myPastMeetups : sessionPastMeetups;
          return allPast.length > 0 ? (
            <Section title={`Past Meetups (${allPast.length})`}>
              {allPast.map(s => (
                <Card key={s.id} style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => {
                  const sessionToOpen = myPastMeetups.length > 0 ? s : {
                    id: s.id,
                    type: "collab",
                    activity: session.activity || session.skill,
                    myRole: "participant",
                    status: "completed",
                    scheduledTime: s.scheduledTime,
                    location: s.location,
                    attended: s.attendees || [],
                    participants: s.attendees || [],
                    groupPhoto: s.groupPhoto,
                    _parentSession: session,
                  };
                  openSession(sessionToOpen, "completed");
                }}>
                  <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{s.scheduledTime}</div>
                      {s.location && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{s.location}</div>}
                    </div>
                    {(() => { const a = s.attendees || s.attended || s.participants; return a?.length > 0 && <AvatarRow users={a} size={24} max={4} />; })()}
                    <span style={{ color: T.muted, opacity: 0.5, fontSize: 16 }}>›</span>
                  </div>
                </Card>
              ))}
            </Section>
          ) : null;
        })()}

        <Section title={`Interested (${totalCount})`}>
          {allParticipants.map((u) => (
            <Card key={u.id} style={{ marginBottom: 8, cursor: u.id !== "me" ? "pointer" : "default" }} onClick={u.id !== "me" ? () => setViewingUser(u) : undefined}>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar user={u} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: T.text, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", letterSpacing: "-0.01em" }}>
                    {u.name}
                    {u.id === "me" && <Badge color={T.purple} bg={T.purpleLight}>You</Badge>}
                  </div>
                  {u.year && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{u.year}{u.major ? ` · ${u.major}` : ""}</div>}
                </div>
                {registeredIds.has(u.id) && <Badge color={T.success} bg={T.successBg}>Registered</Badge>}
              </div>
            </Card>
          ))}
        </Section>
      </div>
    </div>
  );
}
