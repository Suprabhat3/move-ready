import { useState } from "react";
import AddPropertyForm from "../components/dashboards/AddPropertyForm";
import AgentPropertiesGrid from "../components/dashboards/AgentPropertiesGrid";
import AgentTicketsView from "../components/dashboards/AgentTicketsView";

type DashboardUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export default function Dashboard({ user }: { user: DashboardUser | null }) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "add_property" | "my_properties" | "tickets"
  >("profile");

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-36 pb-10">
        <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-brutal">
          <h2 className="text-2xl font-black text-black">Dashboard</h2>
          <p className="mt-2 text-text-muted font-bold">
            No user session found.
          </p>
        </div>
      </div>
    );
  }

  const avatarText = (user.name || user.email || "U").slice(0, 1).toUpperCase();
  const isAgent = user.role === "SITE_AGENT" || user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden pt-36 pb-10 px-6">
      {/* Brutalist geometric background elements */}
      <div className="absolute top-40 right-20 w-40 h-40 border-4 border-black bg-[#ff00ff] shadow-brutal rotate-12 hidden md:block z-0 opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full border-4 border-black bg-[#39ff14] shadow-brutal -rotate-6 hidden md:block z-0 opacity-20"></div>

      <div className="max-w-6xl mx-auto relative z-10 transition-all duration-300 space-y-8">
        {/* Navigation Tabs (Only for Site Agents/Admins, though Tenants might just see profile) */}
        {isAgent && (
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 font-black uppercase tracking-widest border-4 border-black transition-all ${
                activeTab === "profile"
                  ? "bg-black text-[#00e5ff] shadow-[4px_4px_0px_0px_rgba(0,229,255,1)] translate-x-1 translate-y-1"
                  : "bg-white text-black hover:bg-[#39ff14] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("my_properties")}
              className={`px-6 py-3 font-black uppercase tracking-widest border-4 border-black transition-all ${
                activeTab === "my_properties"
                  ? "bg-black text-[#ff00ff] shadow-[4px_4px_0px_0px_rgba(255,0,255,1)] translate-x-1 translate-y-1"
                  : "bg-white text-black hover:bg-[#ff00ff] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              My Properties
            </button>
            <button
              onClick={() => setActiveTab("add_property")}
              className={`px-6 py-3 font-black uppercase tracking-widest border-4 border-black transition-all ${
                activeTab === "add_property"
                  ? "bg-black text-[#39ff14] shadow-[4px_4px_0px_0px_rgba(57,255,20,1)] translate-x-1 translate-y-1"
                  : "bg-white text-black hover:bg-[#00e5ff] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              Add Property
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-6 py-3 font-black uppercase tracking-widest border-4 border-black transition-all ${
                activeTab === "tickets"
                  ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-1 translate-y-1"
                  : "bg-white text-black hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              Messages
            </button>
          </div>
        )}

        {/* --- PROFILE TAB --- */}
        {activeTab === "profile" && (
          <div className="glass-brutal rounded-2xl p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-black pb-8 mb-8">
              <div>
                <h1
                  className="text-4xl md:text-5xl font-black text-black tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  My Profile
                </h1>
                <p className="mt-2 text-text-muted font-bold text-lg">
                  Manage your account and preferences.
                </p>
              </div>
              <div className="shrink-0 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-3 rounded-xl flex items-center justify-center -rotate-2 hover:rotate-0 transition-transform">
                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-[#ff00ff] mb-1">
                    Your Role
                  </p>
                  <p className="font-black text-2xl tracking-wide uppercase text-black">
                    {user.role || "TENANT"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <div className="w-20 h-20 rounded-xl border-4 border-black bg-[#00e5ff] shadow-brutal flex items-center justify-center transform -rotate-3 transition-transform hover:rotate-0">
                <span className="text-3xl font-black text-black">
                  {avatarText}
                </span>
              </div>
              <div>
                <p className="font-black text-3xl text-black truncate">
                  {user.name || "No name set"}
                </p>
                <p className="text-lg font-bold text-text-muted mt-1 bg-black/5 px-3 py-1 rounded-sm border-2 border-black inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                  {user.email || "No email"}
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border-4 border-black p-6 bg-[#39ff14] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                <p className="text-sm font-black text-black uppercase tracking-widest bg-white inline-block px-2 py-1 border-2 border-black mb-3">
                  User ID
                </p>
                <p className="text-lg font-bold text-black break-all">
                  {user.id || "N/A"}
                </p>
              </div>
              <div className="rounded-xl border-4 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                <p className="text-sm font-black text-black uppercase tracking-widest bg-[#00e5ff] inline-block px-2 py-1 border-2 border-black mb-3">
                  Email
                </p>
                <p className="text-lg font-bold text-black break-all">
                  {user.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- MY PROPERTIES TAB --- */}
        {activeTab === "my_properties" && isAgent && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black uppercase mb-8 inline-block shadow-[4px_4px_0px_0px_rgba(0,229,255,1)] bg-white px-4 py-2 border-4 border-black">
              Manage Listings
            </h2>
            <AgentPropertiesGrid />
          </div>
        )}

        {/* --- ADD PROPERTY TAB --- */}
        {activeTab === "add_property" && isAgent && (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <AddPropertyForm onSuccess={() => setActiveTab("my_properties")} />
          </div>
        )}

        {/* --- TICKETS TAB --- */}
        {activeTab === "tickets" && isAgent && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-4xl font-black uppercase mb-8 inline-block shadow-[4px_4px_0px_0px_rgba(57,255,20,1)] bg-white px-4 py-2 border-4 border-black -rotate-1">
              Tenant Hub
            </h2>
            <AgentTicketsView currentUserId={user.id!} />
          </div>
        )}
      </div>
    </div>
  );
}
