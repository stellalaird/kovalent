import { T } from "../styles/theme";
import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import Avatar from "../components/Avatar";

export default function ProposalChatroomPage({ session }) {
  const { setActiveView, setActiveSession, setMySessions, activeProposal, setActiveProposal, profile } = useApp();
  const [messages, setMessages] = useState(activeProposal?.messages || []);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send() {
    if (!input.trim()) return;
    const msg = { user: profile, text: input.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    const updated = [...messages, msg];
    setMessages(updated);
    setInput("");

    // Persist messages back into the proposal within session
    const updateProposals = s => ({
      ...s,
      proposals: (s.proposals || []).map(p =>
        p.id === activeProposal.id ? { ...p, messages: updated } : p
      ),
    });
    setActiveSession(prev => updateProposals(prev));
    setMySessions(prev => prev.map(s =>
      (s.id === session.id || s._baseId === session.id) ? updateProposals(s) : s
    ));
  }

  const p = activeProposal;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: T.appBg }}>
      {/* Header */}
      <div style={{
        background: "rgba(251,245,230,0.96)", backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        padding: "14px 18px", flexShrink: 0,
        borderBottom: `1px solid ${T.border}`,
      }}>
        <button
          onClick={() => { setActiveProposal(null); setActiveView("waitingRoom"); }}
          style={{
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.textMid, borderRadius: 8, padding: "5px 12px",
            fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 10,
            letterSpacing: "-0.01em",
          }}
        >
          ← Waiting Room
        </button>
        <div style={{ fontFamily: T.fontDisplay, color: T.text, fontWeight: 900, fontSize: 17, letterSpacing: "-0.03em" }}>
          {session.activity}
        </div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 2, fontWeight: 500 }}>Meetup Chat</div>
      </div>

      {/* Pinned proposal details */}
      <div style={{
        background: T.cardElevated, borderBottom: `1px solid ${T.border}`,
        padding: "12px 16px", flexShrink: 0,
      }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: T.gold, marginBottom: 6 }}>📌 Proposed Meetup</div>
        <div style={{ fontSize: 13, color: T.textMid, display: "flex", flexDirection: "column", gap: 3, lineHeight: 1.5 }}>
          <span>🕐 {p?.time || "TBD"}</span>
          <span>📍 {p?.location || "TBD"}</span>
          {p?.note && <span style={{ color: T.muted, fontStyle: "italic" }}>{p.note}</span>}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: T.muted, fontSize: 13, marginTop: 40 }}>
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((m, i) => {
          const isMe = m.user.id === "me";
          return (
            <div key={i} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 8, alignItems: "flex-end" }}>
              {!isMe && <Avatar user={m.user} size={28} />}
              <div style={{ maxWidth: 240 }}>
                {!isMe && <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>{m.user.name}</div>}
                <div style={{
                  background: isMe ? T.purpleGradient : T.card,
                  color: isMe ? "#fff" : T.text,
                  borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "10px 14px", fontSize: 14, lineHeight: 1.5,
                  boxShadow: isMe ? T.purpleGlowSm : T.cardShadow,
                  border: isMe ? "none" : `1px solid ${T.border}`,
                }}>
                  {m.text}
                </div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 4, textAlign: isMe ? "right" : "left", fontWeight: 500 }}>
                  {m.time}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 14px 16px", background: T.cardElevated,
        borderTop: `1px solid ${T.border}`,
        display: "flex", gap: 10, flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Message this meetup group..."
          style={{
            flex: 1, borderRadius: 999, border: `1px solid ${T.border}`,
            padding: "10px 16px", fontSize: 14, outline: "none",
            color: T.text, background: T.surface,
            transition: "border-color 0.15s",
          }}
          onFocus={e => e.target.style.borderColor = T.cardBorderBright}
          onBlur={e => e.target.style.borderColor = T.border}
        />
        <button onClick={send} style={{
          background: T.purpleGradient, border: "none", borderRadius: "50%",
          width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 17, flexShrink: 0, boxShadow: T.btnPrimaryShadow,
        }}>→</button>
      </div>
    </div>
  );
}
