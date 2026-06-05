import { T } from "../styles/theme";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import Section from "../components/Section";

export default function CompletedPage({ session }) {
  const { setTab, setViewingUser, setProfile, mySessions, setMySessions, profile, showToast, setActiveSession, setActiveView, setActiveTopic, setFeedView, privacy } = useApp();

  const weParticipated = !!session.myRole;
  const isLearner = session.myRole === "learner";
  const isCollab  = session.type === "collab";
  const label    = session.skill || session.activity;
  const host     = session.teacher || null;
  const participants = session.attended || session.participants || [];

  // Rating — initialised from persisted session data
  const [rating, setRating]           = useState(session.ratingValue    || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingDone, setRatingDone]   = useState(session.ratingSubmitted || false);

  // Tipping — initialised from persisted session data
  const [extraTip, setExtraTip] = useState(session.extraTipAmount || 0);
  const [tipSent, setTipSent]   = useState(session.tipSent        || false);
  const [repeated, setRepeated] = useState(false);
  const [repeatRequested, setRepeatRequested] = useState(false);

  function persistTip(amount) {
    setMySessions(prev => prev.map(s =>
      s.id === session.id ? { ...s, tipSent: true, extraTipAmount: amount } : s
    ));
  }

  function persistRating(value) {
    setMySessions(prev => prev.map(s =>
      s.id === session.id ? { ...s, ratingSubmitted: true, ratingValue: value } : s
    ));
  }

  return (
    <div>
      {/* Header — matches WaitingRoomPage style */}
      <div style={{ background: T.appBg, padding: "22px 18px 24px", position: "relative", overflow: "hidden", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 300, height: 180, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(52,211,153,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <button onClick={() => {
          if (session._parentSession) { setActiveSession(session._parentSession); setActiveView("waitingRoom"); setTab("session"); return; }
          if (session._fromCommunity) { setActiveTopic(session._fromCommunity); setFeedView("topics"); setTab("feed"); return; }
          setTab("mySessions");
        }} style={{
          background: T.surface, border: `1px solid ${T.border}`, color: T.textMid,
          borderRadius: 10, padding: "6px 14px", fontWeight: 600,
          cursor: "pointer", fontSize: 13, marginBottom: 18, letterSpacing: "-0.01em", position: "relative",
        }}>
          ← Back
        </button>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8, fontFamily: T.fontBody, position: "relative" }}>
          {session.type === "collab" ? "Collab Session" : session.myRole === "learner" ? "Learning Session" : "Teaching Session"}
        </div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 900, color: T.text, letterSpacing: "-0.035em", lineHeight: 1.15, marginBottom: session.description ? 12 : 16, position: "relative" }}>{label}</div>
        {session.description && (
          <p style={{ fontSize: 14, color: T.textMid, lineHeight: 1.65, margin: "0 0 16px", letterSpacing: "-0.01em", position: "relative" }}>
            {session.description}
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.successBg, border: `1px solid ${T.successBorder}`, borderRadius: 999, padding: "5px 12px", fontSize: 12, color: T.success, fontWeight: 600 }}>
            ✓ Completed
          </div>
          {session.scheduledTime && (
            <div style={{ display: "inline-flex", alignItems: "center", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: "5px 12px", fontSize: 12, color: T.textMid, fontWeight: 500 }}>
              {session.scheduledTime}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* ── OBSERVER LAYOUT (session we didn't attend) ── */}
        {!weParticipated && (
          <>
            <Button
              disabled={repeatRequested}
              onClick={() => { if (!repeatRequested) setRepeatRequested(true); }}
              style={{ marginBottom: 16, opacity: repeatRequested ? 0.45 : 1, cursor: repeatRequested ? "default" : "pointer", width: "100%" }}
            >
              {repeatRequested ? "Repeat Session Requested" : "Request Repeat Session"}
            </Button>

            <Card style={{ marginBottom: 16 }}>
              <div style={{ padding: 16 }}>
                <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, color: T.text, letterSpacing: "-0.02em", marginBottom: 12 }}>
                  📸 Group Photo
                </div>
                {session.groupPhoto
                  ? <img src={session.groupPhoto} alt="Group photo" style={{ width: "100%", borderRadius: 14, display: "block", objectFit: "cover", height: 160 }} />
                  : <div style={{ background: T.purpleFaint, borderRadius: 14, height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${T.border}` }}>
                      <span style={{ fontSize: 36, marginBottom: 8 }}>🖼️</span>
                      <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>No photo yet</span>
                    </div>
                }
              </div>
            </Card>

            {host && (
              <Section title="Teacher">
                <Card style={{ marginBottom: 0, cursor: "pointer" }} onClick={() => setViewingUser(host)}>
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar user={host} size={48} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15, color: T.text, letterSpacing: "-0.02em" }}>{host.name}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{host.year} · {host.major}</div>
                      {host.taught != null && <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{host.taught} sessions taught</div>}
                    </div>
                    {host.rating != null && !(host.id === profile.id && !privacy.showRating) && <Badge color={T.purple} bg={T.purpleLight}>★ {host.rating}</Badge>}
                  </div>
                </Card>
              </Section>
            )}

            <Section title={`Attendance (${participants.length})`}>
              {participants.map(u => (
                <Card key={u.id} style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => setViewingUser(u)}>
                  <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar user={u} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{u.name}</div>
                      {u.year && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{u.year}{u.major ? ` · ${u.major}` : ""}</div>}
                    </div>
                    <Badge color={T.success} bg={T.successBg}>✓ Attended</Badge>
                  </div>
                </Card>
              ))}
            </Section>
          </>
        )}

        {/* ── LEARNER LAYOUT ─────────────────────────────── */}
        {weParticipated && isLearner && (
          <>
            <Button
              disabled={repeatRequested}
              onClick={() => { if (!repeatRequested) setRepeatRequested(true); }}
              style={{ marginBottom: 16, opacity: repeatRequested ? 0.45 : 1, cursor: repeatRequested ? "default" : "pointer", width: "100%" }}
            >
              {repeatRequested ? "Repeat Session Requested" : "Request Repeat Session"}
            </Button>

            {/* 1. Tipping */}
            <Card style={{ marginBottom: 16 }}>
              <div style={{ padding: 16 }}>
                <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, color: T.text, letterSpacing: "-0.02em", marginBottom: 12 }}>
                  Tip the Teacher
                </div>

                {/* Auto-tip row — updates to total once extra tip is sent */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: T.successBg, borderRadius: 10,
                  padding: "8px 12px", marginBottom: tipSent ? 0 : 16,
                }}>
                  <span style={{ fontSize: 16 }}>✦</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>
                    {tipSent
                      ? `${1 + extraTip} tokens sent to ${host?.name || "teacher"} ✓`
                      : `1 token sent to ${host?.name || "teacher"} upon registration ✓`}
                  </span>
                </div>

                {/* Extra tip — hidden once sent */}
                {!tipSent && (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.textMid, marginBottom: 8, marginTop: 16 }}>
                      Send an extra tip?
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      {[1, 2, 3].map(n => (
                        <button
                          key={n}
                          onClick={() => setExtraTip(extraTip === n ? 0 : n)}
                          style={{
                            padding: "6px 16px", borderRadius: 8,
                            border: `1.5px solid ${extraTip === n ? T.purple : T.border}`,
                            background: extraTip === n ? T.purpleFaint : "transparent",
                            color: extraTip === n ? T.purple : T.textMid,
                            fontWeight: 700, fontSize: 13, cursor: "pointer",
                          }}
                        >
                          +{n} ✦
                        </button>
                      ))}
                    </div>
                    {extraTip > 0 && (
                      <Button small onClick={() => {
                        setTipSent(true);
                        persistTip(extraTip);
                        setProfile(prev => ({ ...prev, tokens: Math.max(0, prev.tokens - extraTip) }));
                      }}>
                        Send ✦{extraTip} more
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* 2. Rating */}
            <Card style={{ marginBottom: 16 }}>
              <div style={{ padding: 16 }}>
                <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, color: T.text, letterSpacing: "-0.02em", marginBottom: 12 }}>
                  Rate this session
                </div>
                {!ratingDone ? (
                  <>
                    <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => setRating(n)}
                          onMouseEnter={() => setHoverRating(n)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{
                            background: "none", border: "none", fontSize: 30,
                            cursor: "pointer",
                            color: n <= (hoverRating || rating) ? "#f59e0b" : T.border,
                          }}
                        >★</button>
                      ))}
                    </div>
                    <Button small onClick={() => { if (rating > 0) { setRatingDone(true); persistRating(rating); } }}>
                      Submit Rating
                    </Button>
                  </>
                ) : (
                  <div style={{ color: T.success, fontWeight: 700, fontSize: 14 }}>
                    ✓ Rating submitted — thanks!
                  </div>
                )}
              </div>
            </Card>

            {/* 3. Group photo */}
            <Card style={{ marginBottom: 16 }}>
              <div style={{ padding: 16 }}>
                <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, color: T.text, letterSpacing: "-0.02em", marginBottom: 12 }}>
                  📸 Group Photo
                </div>
                <div
                  style={{
                    background: T.purpleFaint, borderRadius: 14, height: 140,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", cursor: "pointer",
                    border: `1.5px dashed ${T.border}`,
                  }}
                >
                  <span style={{ fontSize: 36, marginBottom: 8 }}>🖼️</span>
                  <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>Tap to upload group photo</span>
                </div>
              </div>
            </Card>

            {/* 4. Teacher */}
            {host && (
              <Section title="Teacher">
                <Card
                  style={{ marginBottom: 0, cursor: "pointer" }}
                  onClick={() => setViewingUser(host)}
                >
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar user={host} size={48} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15, color: T.text, letterSpacing: "-0.02em" }}>{host.name}</div>
                      <div style={{ fontSize: 13, color: T.muted }}>{host.year} · {host.major}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>
                        {host.taught} sessions taught
                      </div>
                    </div>
                    <Badge color={T.purple} bg={T.purpleLight}>Teacher</Badge>
                  </div>
                </Card>
              </Section>
            )}

            {/* 5. Participants */}
            <Section title={`Participants (${participants.length + 1})`}>
              {[profile, ...participants].map(u => (
                <Card
                  key={u.id}
                  style={{ marginBottom: 8, cursor: u.id !== "me" ? "pointer" : "default" }}
                  onClick={u.id !== "me" ? () => setViewingUser(u) : undefined}
                >
                  <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar user={u} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: T.text, display: "flex", alignItems: "center", gap: 5 }}>
                        {u.name}
                        {u.id === "me" && <Badge color={T.purple} bg={T.purpleLight}>You</Badge>}
                      </div>
                      {u.year && (
                        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                          {u.year}{u.major ? ` · ${u.major}` : ""}
                        </div>
                      )}
                    </div>
                    <Badge color={T.success} bg={T.successBg}>✓ Attended</Badge>
                  </div>
                </Card>
              ))}
            </Section>
          </>
        )}

        {/* ── COLLAB LAYOUT ──────────────────────────────── */}
        {weParticipated && isCollab && (
          <>
            <Button
              onClick={() => {
                if (session._parentSession) { setActiveSession(session._parentSession); setActiveView("waitingRoom"); setTab("session"); return; }
                const source = mySessions.find(s => s.id === session._sourceId || s._baseId === session._sourceId);
                if (source) { setActiveSession(source); setActiveView("waitingRoom"); setTab("session"); }
                else setTab("mySessions");
              }}
              style={{ marginBottom: 16, width: "100%" }}
            >View Parent Session</Button>

            {/* Photo */}
            <Card style={{ marginBottom: 16 }}>
              <div style={{ padding: 16 }}>
                <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, color: T.text, letterSpacing: "-0.02em", marginBottom: 12 }}>
                  📸 Group Photo
                </div>
                {session.groupPhoto ? (
                  <img src={session.groupPhoto} alt="Group photo" style={{ width: "100%", borderRadius: 14, display: "block", objectFit: "cover", height: 160 }} />
                ) : (
                  <div style={{ background: T.purpleFaint, borderRadius: 14, height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `1.5px dashed ${T.border}` }}>
                    <span style={{ fontSize: 36, marginBottom: 8 }}>🖼️</span>
                    <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>Tap to upload group photo</span>
                  </div>
                )}
              </div>
            </Card>

            <Section title="Attendance">
              {(session.attended || participants).map(u => (
                <Card key={u.id} style={{ marginBottom: 8, cursor: u.id !== "me" ? "pointer" : "default" }} onClick={u.id !== "me" ? () => setViewingUser(u) : undefined}>
                  <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar user={u} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: T.text, display: "flex", alignItems: "center", gap: 5 }}>
                        {u.name}{u.id === "me" && <Badge color={T.purple} bg={T.purpleLight}>You</Badge>}
                      </div>
                      {u.year && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{u.year}</div>}
                    </div>
                    <Badge color={T.success} bg={T.successBg}>✓ Attended</Badge>
                  </div>
                </Card>
              ))}
            </Section>
          </>
        )}

        {/* ── TEACHER LAYOUT ─────────────────────────────── */}
        {weParticipated && !isLearner && !isCollab && (
          <>
            <Button
              disabled={repeated}
              onClick={() => {
                if (repeated) return;
                const attended = session.attended || session.participants || [];
                const newSession = {
                  id: `repeat-${session.id}-${Date.now()}`,
                  type: "learn",
                  skill: session.skill,
                  level: session.level,
                  description: session.description,
                  minGroup: session.minGroup,
                  maxGroup: session.maxGroup,
                  tags: session.tags,
                  activityLevel: session.activityLevel ?? "medium",
                  teacher: profile,
                  status: "waiting_room",
                  myRole: "teacher",
                  interested: attended.length,
                  waitingRoom: attended,
                  participants: [],
                  messages: [],
                };
                setMySessions(prev => [...prev, newSession]);
                setRepeated(true);
                showToast("Repeat session generated! Check My Sessions.", "success");
              }}
              style={{ marginBottom: 16, opacity: repeated ? 0.45 : 1, cursor: repeated ? "default" : "pointer", width: "100%" }}
            >{repeated ? "Repeat Session Generated" : "Repeat Session"}</Button>

            {(session.repeatRequests ?? 0) > 0 && (
              <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: 28 }}>
                {session.repeatRequests} {session.repeatRequests === 1 ? "learner has" : "learners have"} requested a repeat session
              </div>
            )}

            <Card style={{ marginBottom: 16, background: "#fffbeb", border: `1px solid #fde68a` }}>
              <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 32 }}>✦</span>
                <div>
                  <div style={{ fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 17, color: T.gold, letterSpacing: "-0.02em" }}>+5 Tokens Earned!</div>
                  <div style={{ fontSize: 13, color: T.gold, marginTop: 2 }}>For teaching this session.</div>
                </div>
              </div>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <div style={{ padding: 16 }}>
                <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, color: T.text, letterSpacing: "-0.02em", marginBottom: 12 }}>
                  📸 Group Photo
                </div>
                <div style={{ background: T.purpleFaint, borderRadius: 14, height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `1.5px dashed ${T.border}` }}>
                  <span style={{ fontSize: 36, marginBottom: 8 }}>🖼️</span>
                  <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>Tap to upload group photo</span>
                </div>
              </div>
            </Card>

            <Section title="Teacher">
              <Card style={{ marginBottom: 0 }}>
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar user={profile} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15, color: T.text, letterSpacing: "-0.02em" }}>{profile.name}</div>
                    <div style={{ fontSize: 13, color: T.muted }}>{profile.year} · {profile.major}</div>
                  </div>
                  <Badge color={T.purple} bg={T.purpleLight}>You</Badge>
                </div>
              </Card>
            </Section>

            <Section title="Attendance">
              {participants.map(u => (
                <Card key={u.id} style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => setViewingUser(u)}>
                  <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar user={u} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{u.name}</div>
                      {u.year && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{u.year}</div>}
                    </div>
                    <Badge color={T.success} bg={T.successBg}>✓ Attended</Badge>
                  </div>
                </Card>
              ))}
            </Section>
          </>
        )}

      </div>
    </div>
  );
}
