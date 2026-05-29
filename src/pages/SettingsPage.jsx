import { useState, useContext, createContext, useEffect, useRef } from "react";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Badge from "../components/Badge";
import Card from "../components/Card";
import Section from "../components/Section";

export default function SettingsPage() {
  const { darkMode, setDarkMode, showToast } = useApp();
  const [notifs, setNotifs] = useState({ messages: true, sessions: true, reminders: false });
  const [privacy, setPrivacy] = useState({ showContact: "connections", showRating: true });

  function Toggle({ on, onChange }) {
    return (
      <div onClick={() => onChange(!on)} style={{
        width: 46, height: 26, borderRadius: 13,
        background: on ? "#6c4fc2" : "#e5e7eb",
        position: "relative", cursor: "pointer", transition: "background 0.2s",
      }}>
        <div style={{
          position: "absolute", top: 3, left: on ? 23 : 3,
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </div>
    );
  }

  function SettingRow({ label, sub, right }) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f3f4f6" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e" }}>{label}</div>
          {sub && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{sub}</div>}
        </div>
        {right}
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Settings</div>

      <Section title="Notifications">
        <Card style={{ padding: "0 16px" }}>
          <SettingRow label="New Messages" sub="Get notified of group chat messages" right={<Toggle on={notifs.messages} onChange={v => setNotifs(p => ({ ...p, messages: v }))} />} />
          <SettingRow label="Session Updates" sub="Scheduling confirmations, changes" right={<Toggle on={notifs.sessions} onChange={v => setNotifs(p => ({ ...p, sessions: v }))} />} />
          <SettingRow label="Weekly Reminders" sub="Upcoming session reminders" right={<Toggle on={notifs.reminders} onChange={v => setNotifs(p => ({ ...p, reminders: v }))} />} />
        </Card>
      </Section>

      <Section title="Privacy">
        <Card style={{ padding: "0 16px" }}>
          <SettingRow label="Show Ratings" sub="Display your rating on your profile" right={<Toggle on={privacy.showRating} onChange={v => setPrivacy(p => ({ ...p, showRating: v }))} />} />
          <SettingRow label="Contact Visibility" sub="Who can see your contact info"
            right={
              <select value={privacy.showContact} onChange={e => setPrivacy(p => ({ ...p, showContact: e.target.value }))}
                style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "4px 8px", fontSize: 13, color: "#374151" }}>
                <option value="everyone">Everyone</option>
                <option value="connections">Connections</option>
                <option value="none">No one</option>
              </select>
            }
          />
        </Card>
      </Section>

      <Section title="Appearance">
        <Card style={{ padding: "0 16px" }}>
          <SettingRow label="Dark Mode" sub="Easier on the eyes at night" right={<Toggle on={darkMode} onChange={setDarkMode} />} />
        </Card>
      </Section>

      <Section title="Account">
        <Card style={{ padding: "0 16px" }}>
          <SettingRow label="Northwestern Email" sub="Verified: alexchen@northwestern.edu" right={<Badge color="#065f46" bg="#d1fae5">✓ Verified</Badge>} />
          <SettingRow label="Version" sub="Kovalent v1.0.0 (Prototype)" right={null} />
          <div style={{ padding: "14px 0" }}>
            <button onClick={() => showToast("Feedback sent! Thank you.")} style={{ background: "none", border: "none", color: "#6c4fc2", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              Send Feedback
            </button>
          </div>
        </Card>
      </Section>
    </div>
  );
}