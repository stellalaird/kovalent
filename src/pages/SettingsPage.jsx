import { T } from "../styles/theme";
import { useApp } from "../context/AppContext";
import Badge from "../components/Badge";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import Section from "../components/Section";

export default function SettingsPage() {
  const { darkMode, setDarkMode, notifs, setNotifs, privacy, setPrivacy, profile } = useApp();

  function Toggle({ on, onChange }) {
    return (
      <div onClick={() => onChange(!on)} style={{
        width: 46, height: 26, borderRadius: 13,
        background: on ? T.purpleGradient : T.surface,
        border: `1px solid ${on ? "rgba(180,140,40,0.5)" : T.border}`,
        position: "relative", cursor: "pointer", transition: "all 0.2s",
        flexShrink: 0,
        boxShadow: on ? T.purpleGlowSm : "none",
      }}>
        <div style={{
          position: "absolute", top: 3, left: on ? 22 : 3,
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s",
          boxShadow: on ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </div>
    );
  }

  function SettingRow({ label, sub, right }) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 0", borderBottom: `1px solid ${T.border}`, gap: 14,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, letterSpacing: "-0.01em" }}>{label}</div>
          {sub && <div style={{ fontSize: 12, color: T.muted, marginTop: 3, lineHeight: 1.5 }}>{sub}</div>}
        </div>
        {right}
      </div>
    );
  }

  return (
    <div>
      <PageHeader>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 900, color: T.text, letterSpacing: "-0.04em", paddingBottom: 16 }}>
          Settings
        </div>
      </PageHeader>

      <div style={{ padding: "18px 16px" }}>
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
                <select value={privacy.showContact} onChange={e => setPrivacy(p => ({ ...p, showContact: e.target.value }))}
                  style={{
                    border: `1px solid ${T.border}`, borderRadius: 10,
                    padding: "6px 10px", fontSize: 13, color: T.textMid,
                    background: T.surface, outline: "none", cursor: "pointer",
                    letterSpacing: "-0.01em",
                  }}>
                  <option value="everyone">Everyone</option>
                  <option value="community">Community Members</option>
                  <option value="none">No One</option>
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
            <SettingRow label="Northwestern Email" sub={`Verified: ${profile.contact}`}
              right={<Badge color={T.success} bg={T.successBg}>✓ Verified</Badge>} />
            <SettingRow label="Version" sub="Kovalent v1.0.0" right={null} />
            <div style={{ padding: "16px 0" }}>
              <button onClick={() => {}} style={{
                background: "none", border: "none", color: T.purple,
                fontWeight: 700, cursor: "pointer", fontSize: 14,
                padding: 0, letterSpacing: "-0.01em",
              }}>
                Send Feedback →
              </button>
            </div>
          </Card>
        </Section>
      </div>
    </div>
  );
}
