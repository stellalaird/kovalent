import { T } from "../styles/theme";
import { useState } from "react";
import { MOCK_USERS } from "../data/mockData";
import { useApp } from "../context/AppContext";
import Avatar from "../components/Avatar";
import AvatarRow from "../components/AvatarRow";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import Section from "../components/Section";

export default function WaitingRoomPage({ session }) {
  const { setTab, setActiveView, mySessions, setMySessions, joinSession, setViewingUser, profile, setProfile, teacherOverrides, setTeacherOverrides, setActiveSession, setActiveProposal, openSession, setActiveTopic, setFeedView, privacy, setOfferToTeachSession } = useApp();
  const [pendingRegister, setPendingRegister] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const mySession = mySessions.find((s) => s.id === session.id);
  const alreadyJoined = !!mySession;

  // Are we the teacher of this session?
  const weAreTeacher =
    (session.type === "teach" && teacherOverrides[session.id]?.id === profile?.id) ||
    (session.type === "learn" && session.teacher?.id === profile?.id);

  const isTeach = session.type === "learn" || weAreTeacher;
  const isCollab = session.type === "collab";
  const alreadyRegistered = isTeach && mySession?.status === "scheduled";
  const label = session.skill || session.activity || "Session";
  const host = weAreTeacher ? profile : (session.teacher || null);

  const baseParticipants = isTeach ? (session.participants || []) : [];
  const registeredList = alreadyRegistered && !weAreTeacher && !baseParticipants.some(u => u.id === profile.id)
    ? [...baseParticipants, profile]
    : baseParticipants;
  const registeredIds = new Set(registeredList.map((u) => u.id));
  const teacherId = host?.id ?? null;
  const knownInterested = [
    ...(alreadyJoined && !weAreTeacher ? [profile] : []),
    ...(session.waitingRoom || []).filter(u => u.id !== teacherId),
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
  const bothBadges = session.type === "teach" && !teacherOverrides[session.id];
  const sessionKind = isCollab
    ? "Collab Session"
    : bothBadges
      ? null
      : weAreTeacher ? "Teaching Session" : "Learning Session";

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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, position: "relative" }}>
          <button
            onClick={() => {
              if (session._fromCommunity) { setActiveTopic(session._fromCommunity); setFeedView("topics"); setTab("feed"); return; }
              setTab(alreadyJoined ? "mySessions" : "feed");
            }}
            style={{
              background: T.surface, border: `1px solid ${T.border}`,
              color: T.textMid, borderRadius: 10, padding: "6px 14px",
              fontWeight: 600, cursor: "pointer", fontSize: 13,
              letterSpacing: "-0.01em",
            }}
          >
            ← Back
          </button>
          {alreadyJoined && (isTeach || isCollab) && (
            <button
              onClick={() => setActiveView("chatroom")}
              style={{
                background: T.purpleGradient, border: "none",
                color: "#fff", borderRadius: 10, padding: "6px 14px",
                fontWeight: 700, cursor: "pointer", fontSize: 13,
                letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 5,
                boxShadow: T.btnPrimaryShadow,
              }}
            >
              Group Chat 💬
            </button>
          )}
        </div>

        {sessionKind && <div style={{
          fontSize: 10, fontWeight: 700, color: T.muted,
          textTransform: "uppercase", letterSpacing: "0.14em",
          marginBottom: 8, fontFamily: T.fontBody, position: "relative",
        }}>
          {sessionKind}
        </div>}
        <div style={{
          fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 900,
          color: T.text, letterSpacing: "-0.035em", lineHeight: 1.15,
          marginBottom: 16, position: "relative",
        }}>
          {label}
        </div>

        {session.description && (
          <p style={{
            fontSize: 14, color: T.textMid, lineHeight: 1.65,
            margin: "0 0 16px", letterSpacing: "-0.01em", position: "relative",
          }}>
            {session.description}
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, position: "relative" }}>
          {isTeach && session.level && (
            <div style={{ display: "inline-flex", alignItems: "center", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: "5px 12px", fontSize: 12, color: T.textMid, fontWeight: 500, textTransform: "lowercase" }}>
              {session.level}
            </div>
          )}
          {isTeach && session.minGroup && (
            <div style={{ display: "inline-flex", alignItems: "center", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: "5px 12px", fontSize: 12, color: T.textMid, fontWeight: 500 }}>
              capacity: {session.minGroup}{session.maxGroup ? `–${session.maxGroup}` : "+"}
            </div>
          )}
          {isTeach && (
            <div style={{ display: "inline-flex", alignItems: "center", background: T.successBg, border: `1px solid ${T.successBorder}`, borderRadius: 999, padding: "5px 12px", fontSize: 12, color: T.success, fontWeight: 600 }}>
              {registeredList.length} registered
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "18px 16px" }}>
        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {!alreadyJoined && !weAreTeacher && <Button onClick={() => joinSession(session)}>✓ Join</Button>}
          {alreadyJoined && weAreTeacher && (() => {
            const need = session.minGroup ? Math.max(0, session.minGroup - totalCount) : 0;
            const notEnough = need > 0;
            return notEnough ? (
              <Button variant="secondary" style={{ opacity: 0.5, cursor: "default" }} onClick={() => {}}>
                Need {need} more interested users to schedule
              </Button>
            ) : (
              <Button onClick={() => setActiveView("setMeetingTime")}>
                {session.scheduledTime ? "Edit Meeting Time" : "Set Meeting Time"}
              </Button>
            );
          })()}
          {alreadyJoined && isTeach && !weAreTeacher && session.scheduledTime && !alreadyRegistered && (
            session.maxGroup && registeredList.length >= session.maxGroup
              ? <Button variant="secondary" style={{ opacity: 0.5, cursor: "default" }} onClick={() => {}}>Session Full</Button>
              : <Button onClick={() => setPendingRegister(() => () => setMySessions(prev => prev.map(s => s.id === session.id ? { ...s, status: "scheduled" } : s)))}>✓ Register</Button>
          )}
          {alreadyRegistered && isTeach && !weAreTeacher && (
            <Button variant="success" style={{ cursor: "default" }} onClick={() => {}}>✓ Registered</Button>
          )}
          {alreadyJoined && isCollab && (
            <Button onClick={() => setActiveView("proposeCollab")}>📅 Propose Collab</Button>
          )}
          {alreadyRegistered && !weAreTeacher && (
            <Button variant="danger" onClick={() => setShowCancelConfirm(true)}>
              Cancel Registration
            </Button>
          )}
          {alreadyJoined && session.type === "teach" && !teacherOverrides[session.id] && (
            <Button variant="primary" onClick={() => {
              setOfferToTeachSession(session);
              setTab("createSession");
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
              {weAreTeacher ? "Cancel Session" : "Leave"}
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
                    ["📍", "Where", session.scheduledTime ? (session.location || "TBD") : "TBD"],
                    ["🎒", "Materials", session.scheduledTime ? (session.materials || "TBD") : "TBD"],
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
                {host.rating != null && !(host.id === profile.id && !privacy.showRating) && (
                  <Badge color={T.purple} bg={T.purpleLight}>★ {host.rating}</Badge>
                )}
              </div>
            </Card>
          </Section>
        )}

        {isCollab && session.proposals?.length > 0 && (
          <Section title={`Proposed Collabs (${session.proposals.length})`}>
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
                        ? <Button variant="secondary" style={{ opacity: 0.5, cursor: "default", flex: 1 }} onClick={() => {}}>Collab Chat</Button>
                        : <Button variant="secondary" style={{ flex: 1 }} onClick={() => { setActiveProposal(p); setActiveView("proposalChat"); }}>Collab Chat</Button>
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

        {isCollab && (() => {
          const baseId = session._baseId || session.id;
          const myPastCollabs = mySessions.filter(s => s.status === "completed" && s._sourceId === baseId);
          const sessionPastCollabs = session.pastSessions || [];
          const allPast = myPastCollabs.length > 0 ? myPastCollabs : sessionPastCollabs;
          return allPast.length > 0 ? (
            <Section title={`Past Collabs (${allPast.length})`}>
              {allPast.map(s => (
                <Card key={s.id} style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => {
                  const sessionToOpen = myPastCollabs.length > 0 ? s : {
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

      {/* Cancel registration confirmation modal */}
      {showCancelConfirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 24px",
        }}
          onClick={() => setShowCancelConfirm(false)}
        >
          <div
            style={{
              background: T.card, borderRadius: 20, padding: "28px 24px 24px",
              width: "100%", maxWidth: 340,
              border: `1px solid ${T.cardBorder}`,
              boxShadow: T.cardShadow,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 12 }}>⚠️</div>
            <div style={{
              fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 20,
              color: T.text, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 8,
            }}>
              Cancel Registration?
            </div>
            <p style={{
              fontSize: 14, color: T.textMid, textAlign: "center",
              lineHeight: 1.6, margin: "0 0 24px", letterSpacing: "-0.01em",
            }}>
              Are you sure? Your <strong style={{ color: T.text }}>1 token</strong> will <strong style={{ color: T.danger }}>not be refunded</strong>.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowCancelConfirm(false)}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 12,
                  border: `1px solid ${T.border}`, background: T.surface,
                  color: T.textMid, fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: T.fontBody, letterSpacing: "-0.01em",
                }}
              >
                Keep It
              </button>
              <button
                onClick={() => {
                  setMySessions(prev => prev.map(s => s.id === session.id ? { ...s, status: "waiting_room" } : s));
                  setShowCancelConfirm(false);
                }}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 12,
                  border: "none", background: T.danger,
                  color: "#fff", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: T.fontBody,
                  letterSpacing: "-0.01em",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Token confirmation modal */}
      {pendingRegister && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 24px",
        }}
          onClick={() => setPendingRegister(null)}
        >
          <div
            style={{
              background: T.card, borderRadius: 20, padding: "28px 24px 24px",
              width: "100%", maxWidth: 340,
              border: `1px solid ${T.cardBorder}`,
              boxShadow: T.cardShadow,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 12 }}>🪙</div>
            <div style={{
              fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 20,
              color: T.text, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 8,
            }}>
              Use 1 Token?
            </div>
            <p style={{
              fontSize: 14, color: T.textMid, textAlign: "center",
              lineHeight: 1.6, margin: "0 0 24px", letterSpacing: "-0.01em",
            }}>
              Registering for this session will spend <strong style={{ color: T.text }}>1 token</strong> from your balance.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setPendingRegister(null)}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 12,
                  border: `1px solid ${T.border}`, background: T.surface,
                  color: T.textMid, fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: T.fontBody, letterSpacing: "-0.01em",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  pendingRegister();
                  setProfile(p => ({ ...p, tokens: Math.max(0, (p.tokens ?? 0) - 1) }));
                  setPendingRegister(null);
                }}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 12,
                  border: "none", background: T.purpleGradient,
                  color: "#fff", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: T.fontBody,
                  letterSpacing: "-0.01em", boxShadow: T.btnPrimaryShadow,
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
