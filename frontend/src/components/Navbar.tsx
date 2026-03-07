import { Link, NavLink } from "react-router";
import logo from "../assets/logo.png";

type NavbarUser = {
  role?: string | null;
  name?: string | null;
  email?: string | null;
};

const Navbar = ({
  user,
  onLogout,
}: {
  user?: NavbarUser | null;
  onLogout?: () => void;
}) => {
  const displayName = user?.name || user?.email || "Account";
  const isAgent = user?.role === "SITE_AGENT" || user?.role === "ADMIN";

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `font-black text-xs uppercase tracking-widest transition-all px-4 py-2 border-2 border-transparent rounded-xl ${
      isActive
        ? "text-black bg-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        : "text-black/60 hover:text-black hover:bg-white/40"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full h-24 z-50 flex items-center justify-center px-6 pointer-events-none">
      <div className="w-full max-w-[1400px] h-16 bg-white/60 backdrop-blur-xl border-2 border-black/10 rounded-2xl flex items-center justify-between px-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] pointer-events-auto">
        <Link
          to="/"
          className="flex items-center gap-3 bg-transparent hover:scale-105 transition-transform"
        >
          <img
            src={logo}
            alt="MoveReady Logo"
            className="h-8 md:h-9 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <ul className="flex items-center gap-4">
            <li>
              <NavLink to="/properties" className={navClassName}>
                Rentals
              </NavLink>
            </li>
            <li>
              <NavLink to="/shortlist" className={navClassName}>
                Saved
              </NavLink>
            </li>
            <li>
              <NavLink to="/compare" className={navClassName}>
                Compare
              </NavLink>
            </li>
            {isAgent ? (
              <li>
                <NavLink to="/dashboard/listings" className={navClassName}>
                  Manager
                </NavLink>
              </li>
            ) : null}
            <li>
              <NavLink to="/visits" className={navClassName}>
                Visits
              </NavLink>
            </li>
            {!isAgent && user && (
              <li>
                <NavLink to="/move-in" className={navClassName}>
                  Move-In
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <span
              className="hidden lg:block font-black text-[10px] uppercase tracking-tighter text-black/40 px-3 truncate"
              title={displayName}
            >
              {displayName}
            </span>
            <Link
              to={isAgent ? "/dashboard/listings" : "/dashboard"}
              className="flex items-center justify-center font-black text-xs uppercase tracking-wider transition-all duration-300 rounded-xl h-10 px-6 text-black bg-[#00e5ff] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Dash
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center justify-center font-black text-xs uppercase tracking-wider transition-all duration-300 rounded-xl h-10 px-6 text-white bg-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden md:flex items-center justify-center font-black text-xs uppercase tracking-wider transition-all duration-300 rounded-xl h-10 px-6 text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center font-black text-xs uppercase tracking-wider transition-all duration-300 rounded-xl h-10 px-8 text-black bg-[#39ff14] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Join
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
