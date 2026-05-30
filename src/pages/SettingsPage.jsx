import { useState } from "react";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { useApp } from "../context/AppContext";

// ─── STYLES ──────────────────────────────────────────────────
import { T } from "../styles/theme";

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
        background: on ? T.purpleGradient : T.border,
        position: "relative", cursor: "pointer", transition: "background 0.2s",
        flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 3, left: on ? 23 : 3,
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s",
          boxShadow: on ? "0 1px 4px rgba(109,40,217,0.30)" : "0 1px 4px rgba(0,0,0,0.15)",
        }} />
      </div>
    );
  }

  function SettingRow({ label, sub, right }) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 0", borderBottom: `1px solid ${T.border}`,
        gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{label}</div>
          {sub && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{sub}</div>}
        </div>
        {right}
      </div>
    );
  }

  return (
    <div>
      {/* Header — matches other page headers */}
      <div style={{
        padding: "14px 16px 14px",
        background: "rgba(246,244,253,0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${T.border}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: "-0.03em" }}>
          Settings
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <Section title="Notifications">
          <Card style={{ padding: "0 16px" }}>
            <SettingRow label="New Messages" sub="Get notified of group chat messages"
              right={<Toggle on={notifs.messages} onChange={v => setNotifs(p => ({ ...p, messages: v }))} />} />
            <SettingRow label="Session Updates" sub="Scheduling confirmations, changes"
              right={<Toggle on={notifs.sessions} onChange={v => setNotifs(p => ({ ...p, sessions: v }))} />} />
            <SettingRow label="Weekly Reminders" sub="Upcoming session reminders"
              right={<Toggle on={notifs.reminders} onChange={v => setNotifs(p => ({ ...p, reminders: v }))} />} />
          </Card>
        </Section>

        <Section title="Privacy">
          <Card style={{ padding: "0 16px" }}>
            <SettingRow label="Show Ratings" sub="Display your rating on your profile"
              right={<Toggle on={privacy.showRating} onChange={v => setPrivacy(p => ({ ...p, showRating: v }))} />} />
            <SettingRow label="Contact Visibility" sub="Who can see your contact info"
              right={
                <select
                  value={privacy.showContact}
                  onChange={e => setPrivacy(p => ({ ...p, showContact: e.target.value }))}
                  style={{
                    border: `1.5px solid ${T.border}`, borderRadius: 8,
                    padding: "5px 8px", fontSize: 13, color: T.textMid,
                    background: T.purpleFaint, outline: "none",
                  }}
                >
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
            <SettingRow label="Dark Mode" sub="Easier on the eyes at night"
              right={<Toggle on={darkMode} onChange={setDarkMode} />} />
          </Card>
        </Section>

        <Section title="Account">
          <Card style={{ padding: "0 16px" }}>
            <SettingRow
              label="Northwestern Email"
              sub="Verified: alexchen@northwestern.edu"
              right={<Badge color={T.success} bg={T.successBg}>✓ Verified</Badge>}
            />
            <SettingRow label="Version" sub="Kovalent v1.0.0" right={null} />
            <div style={{ padding: "14px 0" }}>
              <button
                onClick={() => showToast("Feedback sent! Thank you.")}
                style={{
                  background: "none", border: "none",
                  color: T.purple, fontWeight: 700,
                  cursor: "pointer", fontSize: 14,
                  padding: 0,
                }}
              >
                Send Feedback →
              </button>
            </div>
          </Card>
        </Section>
      </div>
    </div>
  );
}
