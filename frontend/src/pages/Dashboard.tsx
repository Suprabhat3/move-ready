type DashboardUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function Dashboard({
  user,
}: {
  user: DashboardUser | null;
}) {
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
    <div className="max-w-4xl mx-auto px-6 pt-36 pb-10">
      <div className="bg-white border border-border-light rounded-2xl p-6 md:p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-text-main">My Profile</h1>
        <p className="mt-2 text-text-muted">
          Basic account info from your active session.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-green/15 text-primary-green font-bold flex items-center justify-center text-xl">
            {avatarText}
          </div>
          <div>
            <p className="font-semibold text-text-main">{user.name || "No name set"}</p>
            <p className="text-sm text-text-muted">{user.email || "No email"}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border-light p-4 bg-bg-alt">
            <p className="text-xs text-text-light uppercase tracking-wide">User ID</p>
            <p className="mt-1 text-sm font-medium text-text-main break-all">
              {user.id || "N/A"}
            </p>
          </div>
          <div className="rounded-xl border border-border-light p-4 bg-bg-alt">
            <p className="text-xs text-text-light uppercase tracking-wide">Email</p>
            <p className="mt-1 text-sm font-medium text-text-main">{user.email || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
