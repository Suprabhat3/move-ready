import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  if (currentPage === "login") {
    return <Login onNavigate={setCurrentPage} />;
  }

  if (currentPage === "register") {
    return <Register onNavigate={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar onNavigate={setCurrentPage} />
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
