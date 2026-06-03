import { useState, useContext, createContext, useEffect, useRef } from "react";

// ─── MOCK DATA ───────────────────────────────────────
import { MOCK_USERS, CURRENT_USER, MOCK_SESSIONS, MY_SESSIONS } from "../data/mockData";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
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
  const [confirmed, setConfirmed] = useState(false);
  const endRef = useRef(null);

  function send() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { user: CURRENT_USER, text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#6c4fc2", padding: "16px", flexShrink: 0 }}>
        <button onClick={() => setActiveView("waitingRoom")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "5px 10px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>← Waiting Room</button>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>{session.skill || session.activity}</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Group Chat</div>
      </div>

      {/* Pinned logistics */}
      <div style={{ background: "#fefce8", borderBottom: "1px solid #fde68a", padding: "12px 16px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#92400e" }}>📌 Session Logistics</span>
          {session.myRole === "teacher" && (
            <button onClick={() => setEditMode(!editMode)} style={{ background: "none", border: "none", fontSize: 12, color: "#6c4fc2", cursor: "pointer", fontWeight: 600 }}>
              {editMode ? "Save" : "Edit"}
            </button>
          )}
        </div>
        {editMode ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["time", "location", "materials"].map(k => (
              <input key={k} value={logistics[k]} onChange={e => setLogistics(p => ({ ...p, [k]: e.target.value }))}
                style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #fde68a", background: "#fff" }} />
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: "#713f12", display: "flex", flexDirection: "column", gap: 3 }}>
            <span>🕐 {logistics.time}</span>
            <span>📍 {logistics.location}</span>
            <span>🎒 {logistics.materials}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => {
          const isMe = m.user.id === "me";
          return (
            <div key={i} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 8, alignItems: "flex-end" }}>
              {!isMe && <Avatar user={m.user} size={30} />}
              <div>
                {!isMe && <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 3 }}>{m.user.name}</div>}
                <div style={{
                  background: isMe ? "#6c4fc2" : "#f3f4f6",
                  color: isMe ? "#fff" : "#1a1a2e",
                  borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "8px 12px", fontSize: 14, maxWidth: 240,
                }}>{m.text}</div>
                <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3, textAlign: isMe ? "right" : "left" }}>{m.time}</div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", background: "#fff", borderTop: "1px solid #f3f4f6", display: "flex", gap: 8, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Message the group..." style={{
            flex: 1, borderRadius: 20, border: "1px solid #e5e7eb",
            padding: "10px 16px", fontSize: 14, outline: "none",
          }} />
        <button onClick={send} style={{ background: "#6c4fc2", border: "none", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>→</button>
      </div>
    </div>
  );
}