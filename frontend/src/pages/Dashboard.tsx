type DashboardUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export default function Dashboard({ user }: { user: DashboardUser | null }) {
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-36 pb-10">
        <div className="bg-white border border-border-light rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-text-main">Dashboard</h2>
          <p className="mt-2 text-text-muted">No user session found.</p>
        </div>
      </div>
    );
  }

  const avatarText = (user.name || user.email || "U").slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden pt-36 pb-10 px-6">
      {/* Brutalist geometric background elements */}
      <div className="absolute top-40 right-20 w-40 h-40 border-4 border-black bg-[#ff00ff] shadow-brutal rotate-12 hidden md:block z-0 opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full border-4 border-black bg-[#39ff14] shadow-brutal -rotate-6 hidden md:block z-0 opacity-20"></div>

      <div className="max-w-4xl mx-auto glass-brutal rounded-2xl p-6 md:p-10 relative z-10 transition-all duration-300">
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
          <div className="shrink-0 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-3 rounded-xl flex items-center justify-center -rotate-2">
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
            <span className="text-3xl font-black text-black">{avatarText}</span>
          </div>
          <div>
            <p className="font-black text-3xl text-black truncate">
              {user.name || "No name set"}
            </p>
            <p className="text-lg font-bold text-text-muted mt-1 bg-black/5 px-3 py-1 rounded border-2 border-black inline-block">
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
    </div>
  );
}
