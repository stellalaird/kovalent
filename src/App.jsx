import { T } from "./styles/theme";
import { AppProvider, useApp } from "./context/AppContext";
import Toast from "./components/Toast";
import BottomNav from "./pages/BottomNav";
import UserProfilePage from "./pages/UserProfilePage";
import FeedPage from "./pages/FeedPage";
import MySessionsPage from "./pages/MySessionsPage";
import ProfilePage from "./pages/ProfilePage";
import SessionPage from "./pages/SessionPage";
import SettingsPage from "./pages/SettingsPage";

// ─── ROOT APP ─────────────────────────────────────────────────

function AppInner() {
  const { tab, toast, viewingUser } = useApp();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 430,
        minHeight: "100vh",
        background: T.appBg,
        position: "relative",
        overflowX: "hidden",
        paddingBottom: tab === "session" ? 0 : 76,
        boxShadow: "0 0 0 1px rgba(147,100,246,0.1), 0 0 80px rgba(147,100,246,0.15), 0 0 160px rgba(0,0,0,0.8)",
      }}
    >
      {tab === "feed" && <FeedPage />}
      {tab === "mySessions" && <MySessionsPage />}
      {tab === "session" && <SessionPage />}
      {tab === "profile" && <ProfilePage />}
      {tab === "settings" && <SettingsPage />}

      {tab !== "session" && <BottomNav />}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {viewingUser && <UserProfilePage user={viewingUser} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div
        style={{
          minHeight: "100vh",
          background: T.desktopBg,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AppInner />
      </div>
    </AppProvider>
  );
}