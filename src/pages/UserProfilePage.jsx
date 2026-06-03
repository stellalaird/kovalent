import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Avatar from "../components/Avatar";
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
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: T.appBg,
        zIndex: 50,
        overflowY: "auto",
      }}
    >
      {/* Back bar */}
      <div
        style={{
          padding: "14px 16px",
          background: "rgba(246,244,253,0.95)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid ${T.border}`,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setViewingUser(null)}
          style={{
            background: "none",
            border: "none",
            color: T.purple,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 16px 24px" }}>
        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div
            style={{
              width: 72, height: 72, borderRadius: "50%",
              background: user.color || T.purple,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 24,
              boxShadow: `0 0 0 3px ${T.purpleLight}, 0 0 0 5px ${T.purple}`,
              flexShrink: 0,
            }}
          >
            {user.avatar}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: T.text, letterSpacing: "-0.02em" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 13, color: T.textMid, marginTop: 3 }}>
              {user.year} · {user.major}
            </div>
          </div>
        </div>

        {/* Token + gender */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {user.tokens != null && <TokenBadge count={user.tokens} />}
          {user.gender && <Badge color={T.textMid} bg={T.purpleLight}>{user.gender}</Badge>}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {stats.map(({ icon, label, value }) => (
            <Card key={label} style={{ borderTop: `3px solid ${T.purple}` }}>
              <div style={{ padding: "12px 12px 10px" }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
                <div
                  style={{
                    fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em",
                    background: T.purpleGradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {value}
                </div>
                <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>
                  {label}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* About card */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 14 }}>
              About
            </div>
            {[
              ["Year",    user.year],
              ["Major",   user.major],
              ["Bio",     user.bio],
              ["Contact", user.contact],
            ]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div key={label} style={{ marginBottom: 13 }}>
                  <div
                    style={{
                      fontSize: 11, fontWeight: 700, color: T.muted,
                      textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3,
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 14, color: T.text, lineHeight: 1.5 }}>{value}</div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
