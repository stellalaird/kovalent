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
import CreateSessionPage from "./pages/CreateSessionPage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import WelcomeScreen from "./pages/WelcomeScreen";

// ─── ROOT APP ─────────────────────────────────────────────────

function AppInner() {
  const { tab, toast, viewingUser, darkMode, loggedIn } = useApp();
  // Reading darkMode here means AppInner re-renders when dark mode changes,
  // which causes all children to re-render and pick up new T values via the Proxy.
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 430,
        height: "100%",
        background: T.appBg,
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        boxShadow: "0 0 0 1px rgba(180,140,40,0.1), 0 0 80px rgba(180,140,40,0.1), 0 0 160px rgba(0,0,0,0.3)",
        colorScheme: darkMode ? "dark" : "light",
      }}
    >
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflowX: "hidden", overflowY: "auto" }}>
        {!loggedIn ? <WelcomeScreen /> : (
          <>
            {tab === "feed" && <FeedPage />}
            {tab === "mySessions" && <MySessionsPage />}
            {tab === "session" && <SessionPage />}
            {tab === "communities" && <CommunitiesPage />}
            {tab === "profile" && <ProfilePage />}
            {tab === "settings" && <SettingsPage />}
            {tab === "createSession" && <CreateSessionPage />}
            {tab === "createCommunity" && <CreateCommunityPage />}
          </>
        )}
      </div>

      {loggedIn && tab !== "session" && tab !== "createSession" && tab !== "createCommunity" && <BottomNav />}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {viewingUser && <UserProfilePage user={viewingUser} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div style={{ position: "fixed", inset: 0, background: T.desktopBg, display: "flex", justifyContent: "center", overflow: "hidden" }}>
        <AppInner />
      </div>
    </AppProvider>
  );
}
