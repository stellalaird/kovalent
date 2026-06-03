import { useState } from "react";
import { CURRENT_USER } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import Section from "../components/Section";

export default function CompletedPage({ session }) {
  const { setTab, setViewingUser, setProfile, mySessions, setMySessions } = useApp();

  const isLearner = session.myRole === "learner";
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
        <button onClick={() => setTab("mySessions")} style={{
          background: T.surface, border: `1px solid ${T.border}`, color: T.textMid,
          borderRadius: 10, padding: "6px 14px", fontWeight: 600,
          cursor: "pointer", fontSize: 13, marginBottom: 18, letterSpacing: "-0.01em", position: "relative",
        }}>
          ← Back
        </button>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8, fontFamily: T.fontBody, position: "relative" }}>
          {session.type === "collab" ? "Group Collab" : session.myRole === "learner" ? "Learning Session" : "Teaching Session"}
        </div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 900, color: T.text, letterSpacing: "-0.035em", lineHeight: 1.15, marginBottom: 16, position: "relative" }}>{label}</div>
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

        {/* ── LEARNER LAYOUT ─────────────────────────────── */}
        {isLearner && (
          <>
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
                      : `1 token sent to ${host?.name || "teacher"} ✓`}
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
              {[CURRENT_USER, ...participants].map(u => (
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

        {/* ── TEACHER LAYOUT ─────────────────────────────── */}
        {!isLearner && (
          <>
            {/* Photo */}
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

            {/* Attendance */}
            <Section title="Attendance">
              {[CURRENT_USER, ...participants].map(u => (
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
                          {u.year}
                        </div>
                      )}
                    </div>
                    <Badge color={T.success} bg={T.successBg}>✓ Attended</Badge>
                  </div>
                </Card>
              ))}
            </Section>

            {/* Rating */}
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

            {/* Tokens earned */}
            <Card style={{ marginBottom: 16, background: "#fffbeb", border: `1px solid #fde68a` }}>
              <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 32 }}>✦</span>
                <div>
                  <div style={{ fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 17, color: T.gold, letterSpacing: "-0.02em" }}>+5 Tokens Earned!</div>
                  <div style={{ fontSize: 13, color: T.gold, marginTop: 2 }}>For teaching this session.</div>
                </div>
              </div>
            </Card>

            <Button onClick={() => {}}>🔁 Repeat Session</Button>
          </>
        )}

      </div>
    </div>
  );
}
