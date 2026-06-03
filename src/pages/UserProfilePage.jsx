import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Badge from "../components/Badge";
import Card from "../components/Card";
import TokenBadge from "../components/TokenBadge";

export default function UserProfilePage({ user }) {
  const { setViewingUser } = useApp();

  const stats = [
    { icon: "🎓", label: "Taught",  value: user.taught  ?? 0 },
    { icon: "📖", label: "Learned", value: user.learned ?? 0 },
    { icon: "🤝", label: "Meetups", value: user.meetups ?? 0 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, background: T.appBg, zIndex: 50, overflowY: "auto", animation: "fadeIn 0.15s ease" }}>
      {/* Back bar */}
      <div style={{
        padding: "14px 18px", background: "rgba(251,245,230,0.96)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={() => setViewingUser(null)} style={{
          background: "none", border: "none", color: T.purple,
          fontWeight: 700, fontSize: 14, cursor: "pointer", padding: 0,
          display: "flex", alignItems: "center", gap: 5, letterSpacing: "-0.01em",
        }}>
          ← Back
        </button>
      </div>

      <div style={{ padding: "22px 16px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 76, height: 76, borderRadius: "50%",
            background: user.color || T.purple,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 900, fontSize: 26, fontFamily: T.fontDisplay,
            boxShadow: `0 0 0 2px ${T.card}, 0 0 0 4px rgba(180,140,40,0.6), 0 0 24px rgba(180,140,40,0.3)`,
            flexShrink: 0,
          }}>
            {user.avatar}
          </div>
          <div>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 22, color: T.text, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              {user.name}
            </div>
            <div style={{ fontSize: 13, color: T.textMid, marginTop: 4, fontWeight: 500 }}>
              {user.year} · {user.major}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
          {user.tokens != null && <TokenBadge count={user.tokens} />}
          {user.gender && <Badge color={T.textMid} bg={T.surface}>{user.gender}</Badge>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 22 }}>
          {stats.map(({ icon, label, value }) => (
            <Card key={label} style={{ borderTop: `2px solid ${T.purple}` }}>
              <div style={{ padding: "14px 12px 12px" }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                <div style={{
                  fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 22,
                  letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4,
                  background: T.purpleGradient,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {value}
                </div>
                <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <div style={{ padding: 18 }}>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, color: T.text, letterSpacing: "-0.02em", marginBottom: 18 }}>
              About
            </div>
            {[["Year", user.year], ["Major", user.major], ["Bio", user.bio], ["Contact", user.contact]]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div key={label} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{label}</div>
                  <div style={{ fontSize: 14, color: T.text, lineHeight: 1.6, letterSpacing: "-0.01em" }}>{value}</div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
