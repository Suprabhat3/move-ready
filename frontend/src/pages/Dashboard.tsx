import { Link } from "react-router";
import TicketSystem from "../components/dashboards/TicketSystem";
import type { SessionUser } from "../types/listings";

export default function Dashboard({ user }: { user: SessionUser | null }) {
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-36 pb-10">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#1a1a1a]">Dashboard</h2>
          <p className="mt-2 text-gray-500 font-medium">
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
      {/* Soft gradient background elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400/10 blur-[80px] rounded-full hidden md:block z-0 pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-green-400/10 blur-[80px] rounded-full hidden md:block z-0 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 transition-all duration-300 space-y-8">
        {isAgent ? (
          <div className="flex flex-wrap gap-4">
            <Link
              to="/dashboard/listings"
              className="px-6 py-3 rounded-xl font-bold border border-gray-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-[#1a1a1a]"
            >
              Manage Listings
            </Link>
            <Link
              to="/dashboard/listings/new"
              className="px-6 py-3 rounded-xl font-bold bg-[#28a745] text-white shadow-sm hover:bg-[#218838] hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              New Listing
            </Link>
            {user.role === "ADMIN" ? (
              <Link
                to="/dashboard/reviews"
                className="px-6 py-3 rounded-xl font-bold bg-[#0a5ea8] text-white shadow-sm hover:bg-[#084d8a] hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                Review Queue
              </Link>
            ) : null}
          </div>
        ) : null}

        <div className="glass rounded-[2rem] p-6 md:p-10 shadow-premium">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">
                My Profile
              </h1>
              <p className="mt-2 text-gray-500 font-medium text-lg">
                Manage your account and preferences.
              </p>
            </div>
            <div className="shrink-0 bg-blue-50/50 border border-blue-100 px-6 py-4 rounded-2xl flex items-center justify-center">
              <div>
                <p className="text-xs font-bold tracking-widest text-[#0a5ea8] mb-1">
                  YOUR ROLE
                </p>
                <p className="font-black text-2xl tracking-wide text-[#1a1a1a]">
                  {user.role || "TENANT"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="w-20 h-20 rounded-2xl bg-[#0a5ea8] text-white flex items-center justify-center shadow-md">
              <span className="text-3xl font-black">{avatarText}</span>
            </div>
            <div>
              <p className="font-black text-3xl text-[#1a1a1a] truncate">
                {user.name || "No name set"}
              </p>
              <p className="text-sm font-medium text-gray-500 mt-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 inline-block shadow-sm">
                {user.email || "No email"}
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md hover:border-[#28a745]/50 transition-all">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                User ID
              </p>
              <p className="text-lg font-bold text-[#1a1a1a] break-all">
                {user.id || "N/A"}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md hover:border-[#0a5ea8]/50 transition-all">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Email
              </p>
              <p className="text-lg font-bold text-[#1a1a1a] break-all">
                {user.email || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-right-8 duration-500 mt-12 bg-white/50 backdrop-blur-xl border border-gray-100 rounded-[2rem] shadow-sm p-6 md:p-10">
          <h2 className="text-3xl font-black mb-8 text-[#1a1a1a]">
            {isAgent ? "Tenant Hub" : "Help Desk"}
          </h2>
          <TicketSystem user={user} />
        </div>
      </div>
    </div>
  );
}
