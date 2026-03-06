import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState<SessionUser | null>(null);

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data?.user || null);
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setCurrentPage("home");
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  if (currentPage === "login") {
    return <Login onNavigate={setCurrentPage} onAuthSuccess={loadSession} />;
  }

  if (currentPage === "register") {
    return <Register onNavigate={setCurrentPage} onAuthSuccess={loadSession} />;
  }

  if (currentPage === "dashboard") {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar
          onNavigate={setCurrentPage}
          user={user}
          onLogout={handleLogout}
        />
        <main className="flex-1">
          <Dashboard user={user} />
        </main>
      </div>
    );
  }

  if (currentPage === "properties") {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar
          onNavigate={setCurrentPage}
          user={user}
          onLogout={handleLogout}
        />
        <main className="flex-1">
          <Properties user={user} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar onNavigate={setCurrentPage} user={user} onLogout={handleLogout} />
      <main className="flex-1">
        <Hero />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export default App;
