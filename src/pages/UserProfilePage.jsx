import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Avatar from "../components/Avatar";
import Card from "../components/Card";

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
          <Avatar user={user} size={76} ring />
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 22, color: T.text, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {user.name}
              </span>
              {user.gender && <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>{user.gender}</span>}
            </div>
            <div style={{ fontSize: 13, color: T.textMid, marginTop: 4, fontWeight: 500 }}>
              {user.year} · {user.major}
            </div>
          </div>
        </div>

        {user.rating != null && (
          <div style={{ marginBottom: 22 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: T.goldBg, color: T.gold,
              padding: "5px 12px", borderRadius: 999,
              fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em",
              border: `1px solid ${T.goldBorder}`,
              boxShadow: "0 0 12px rgba(245,158,11,0.2)",
            }}>★ {user.rating} teach rating</span>
          </div>
        )}

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
