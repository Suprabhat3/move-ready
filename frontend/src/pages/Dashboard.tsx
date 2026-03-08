import { Link } from "react-router";
import TicketSystem from "../components/dashboards/TicketSystem";
import type { SessionUser } from "../types/listings";
import {
  Mail,
  Calendar,
  ShieldCheck,
  User as UserIcon,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function Dashboard({ user }: { user: SessionUser | null }) {
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-36 pb-10">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserIcon size={32} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-black text-[#1a1a1a]">
            Dashboard Access
          </h2>
          <p className="mt-2 text-gray-500 font-medium">
            Please sign in to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const avatarText = (user.name || user.email || "U").slice(0, 1).toUpperCase();
  const isAgent = user.role === "SITE_AGENT" || user.role === "ADMIN";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "Recent";

  const lastUpdated = user.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden pt-36 pb-20 px-6">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-50/50 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        {/* Quick Actions for Admins/Agents */}
        {isAgent && (
          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <Link
              to="/dashboard/listings"
              className="group flex items-center gap-2 px-6 py-4 rounded-2xl font-black bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-[#1a1a1a]"
            >
              Manage Listings
              <ChevronRight
                size={18}
                className="text-gray-400 group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              to="/dashboard/listings/new"
              className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black bg-[#28a745] text-white shadow-lg shadow-green-500/20 hover:bg-[#218838] hover:-translate-y-1 transition-all"
            >
              New Listing
            </Link>
            {user.role === "ADMIN" && (
              <Link
                to="/dashboard/reviews"
                className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black bg-[#0a5ea8] text-white shadow-lg shadow-blue-500/20 hover:bg-[#084d8a] hover:-translate-y-1 transition-all"
              >
                Review Queue
              </Link>
            )}
          </div>
        )}

        {/* Profile Card */}
        <div className="glass-morphism rounded-[3rem] p-8 md:p-12 border border-white/50 shadow-2xl overflow-hidden relative group">
          {/* Subtle overlay */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
            <UserIcon size={240} className="text-[#1a1a1a]" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-[#1a1a1a] flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <span className="text-4xl md:text-5xl font-black text-white">
                      {avatarText}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0a5ea8]/40 to-transparent"></div>
                  </div>
                  {user.emailVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-[#28a745] text-white p-2 rounded-xl shadow-lg border-4 border-white">
                      <ShieldCheck size={20} />
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-[#1a1a1a] tracking-tight mb-3">
                    {user.name || "Set your name"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-4 py-1.5 bg-[#0a5ea8]/10 text-[#0a5ea8] rounded-full text-xs font-black uppercase tracking-widest">
                      {user.role}
                    </span>
                    <span className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                      <Calendar size={14} /> Member since {memberSince}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Information */}
              <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 hover:border-[#0a5ea8]/30 transition-all group/info">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0a5ea8] transition-colors group-hover/info:bg-[#0a5ea8] group-hover/info:text-white">
                    <Mail size={20} />
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Email Address
                  </p>
                </div>
                <p className="text-xl font-bold text-[#1a1a1a] truncate">
                  {user.email}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${user.emailVerified ? "bg-green-500" : "bg-amber-500"}`}
                  ></div>
                  <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
                    {user.emailVerified
                      ? "Trust Verified"
                      : "Pending Verification"}
                  </p>
                </div>
              </div>

              {/* Status Information */}
              <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 hover:border-[#28a745]/30 transition-all group/info">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#28a745] transition-colors group-hover/info:bg-[#28a745] group-hover/info:text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Profile Status
                  </p>
                </div>
                <p className="text-xl font-bold text-[#1a1a1a]">Active</p>
                <p className="mt-3 text-[10px] font-black uppercase tracking-tighter text-gray-400 flex items-center gap-1">
                  Last updated {lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support System */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white border border-gray-50 rounded-[3rem] shadow-premium p-8 md:p-12">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1a1a1a]">
              <Clock size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-[#1a1a1a]">
                {isAgent ? "Agent Command Center" : "Rental Support Desk"}
              </h2>
              <p className="text-gray-400 font-medium">
                Your active tickets and support history.
              </p>
            </div>
          </div>
          <TicketSystem user={user} />
        </div>
      </div>
    </div>
  );
}
