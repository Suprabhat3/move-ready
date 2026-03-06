import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CompareProvider } from "./components/listings/CompareContext";
import { fetchSession, signOut } from "./lib/api";
import type { SessionUser } from "./types/listings";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Properties from "./pages/Properties";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import Register from "./pages/Register";
import ShortlistPage from "./pages/ShortlistPage";
import ComparePage from "./pages/ComparePage";
import ListingEditorPage from "./pages/ListingEditorPage";
import DashboardListingsPage from "./pages/DashboardListingsPage";

function AppShell({
  user,
  onLogout,
}: {
  user: SessionUser | null;
  onLogout: () => Promise<void>;
}) {
  const location = useLocation();
  const hideChrome =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {hideChrome ? null : <Navbar user={user} onLogout={onLogout} />}
      <main className="flex-1">
        <Outlet />
      </main>
      {hideChrome ? null : <Footer />}
    </div>
  );
}

function RequireAuth({
  user,
  children,
}: {
  user: SessionUser | null;
  children: React.JSX.Element;
}) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function RequireAgentOrAdmin({
  user,
  children,
}: {
  user: SessionUser | null;
  children: React.JSX.Element;
}) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "SITE_AGENT" && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AuthPage({
  type,
  onAuthSuccess,
}: {
  type: "login" | "register";
  onAuthSuccess: () => Promise<void>;
}) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (type === "login") {
    return (
      <Login onNavigate={handleNavigate} onAuthSuccess={onAuthSuccess} />
    );
  }

  return <Register onNavigate={handleNavigate} onAuthSuccess={onAuthSuccess} />;
}

function AppRoutes({
  user,
  reloadSession,
  onLogout,
}: {
  user: SessionUser | null;
  reloadSession: () => Promise<void>;
  onLogout: () => Promise<void>;
}) {
  return (
    <Routes>
      <Route element={<AppShell user={user} onLogout={onLogout} />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={<AuthPage type="login" onAuthSuccess={reloadSession} />}
        />
        <Route
          path="/register"
          element={<AuthPage type="register" onAuthSuccess={reloadSession} />}
        />
        <Route path="/properties" element={<Properties user={user} />} />
        <Route
          path="/properties/:id"
          element={<PropertyDetailPage user={user} />}
        />
        <Route
          path="/shortlist"
          element={
            <RequireAuth user={user}>
              <ShortlistPage user={user} />
            </RequireAuth>
          }
        />
        <Route path="/compare" element={<ComparePage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth user={user}>
              <Dashboard user={user} />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/listings"
          element={
            <RequireAgentOrAdmin user={user}>
              <DashboardListingsPage user={user} />
            </RequireAgentOrAdmin>
          }
        />
        <Route
          path="/dashboard/listings/new"
          element={
            <RequireAgentOrAdmin user={user}>
              <ListingEditorPage user={user} />
            </RequireAgentOrAdmin>
          }
        />
        <Route
          path="/dashboard/listings/:id/edit"
          element={
            <RequireAgentOrAdmin user={user}>
              <ListingEditorPage user={user} />
            </RequireAgentOrAdmin>
          }
        />
        <Route
          path="/dashboard/reviews"
          element={<Navigate to="/dashboard/listings?status=REVIEW" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const loadSession = async () => {
    const nextUser = await fetchSession();
    setUser(nextUser);
    setIsLoadingSession(false);
  };

  useEffect(() => {
    void loadSession();
  }, []);

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen grid place-items-center font-black">
        Loading...
      </div>
    );
  }

  return (
    <CompareProvider>
      <BrowserRouter>
        <AppRoutes
          user={user}
          reloadSession={loadSession}
          onLogout={handleLogout}
        />
      </BrowserRouter>
    </CompareProvider>
  );
}

export default App;
