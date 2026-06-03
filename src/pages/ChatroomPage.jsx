import { useState, useEffect, useRef } from "react";
import { CURRENT_USER } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Avatar from "../components/Avatar";

export default function ChatroomPage({ session }) {
  const { setActiveView } = useApp();
  const [messages, setMessages] = useState(session.messages || []);
  const [input, setInput] = useState("");
  const [logistics, setLogistics] = useState({
    time: session.scheduledTime || "TBD — vote below!",
    location: session.location || "TBD",
    materials: session.materials || "None listed yet",
  });
  const [editMode, setEditMode] = useState(false);
  const endRef = useRef(null);

  function send() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { user: CURRENT_USER, text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
          onClick={() => setActiveView("waitingRoom")}
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
          {session.skill || session.activity}
        </div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 2, fontWeight: 500 }}>Group Chat</div>
      </div>

      {/* Pinned logistics */}
      {session.type !== "collab" && (
        <div style={{
          background: T.cardElevated, borderBottom: `1px solid ${T.border}`,
          padding: "12px 16px", flexShrink: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 12, color: T.gold, display: "flex", alignItems: "center", gap: 5 }}>
              📌 Session Logistics
            </span>
            {session.myRole === "teacher" && (
              <button onClick={() => setEditMode(!editMode)} style={{ background: "none", border: "none", fontSize: 12, color: T.purple, cursor: "pointer", fontWeight: 700, padding: 0 }}>
                {editMode ? "Save" : "Edit"}
              </button>
            )}
          </div>
          {editMode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["time", "location", "materials"].map(k => (
                <input key={k} value={logistics[k]} onChange={e => setLogistics(p => ({ ...p, [k]: e.target.value }))}
                  style={{ fontSize: 12, padding: "6px 10px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text, outline: "none" }} />
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: T.textMid, display: "flex", flexDirection: "column", gap: 4, lineHeight: 1.5 }}>
              <span>🕐 {logistics.time}</span>
              <span>📍 {logistics.location}</span>
              <span>🎒 {logistics.materials}</span>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
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
          value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Message the group..."
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
