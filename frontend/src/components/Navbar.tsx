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
    `font-medium text-sm transition-colors ${
      isActive ? "text-black" : "text-text-muted hover:text-primary-blue"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 border-b border-border-light/50 glass">
      <div className="w-full max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 bg-transparent">
          <img
            src={logo}
            alt="MoveReady Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-10">
            <li>
              <NavLink to="/properties" className={navClassName}>
                Properties
              </NavLink>
            </li>
            <li>
              <NavLink to="/shortlist" className={navClassName}>
                Shortlist
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
                  Manage Listings
                </NavLink>
              </li>
            ) : null}
          </ul>
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to={isAgent ? "/dashboard/listings" : "/dashboard"}
              className="hidden md:flex items-center justify-center font-bold transition-all duration-300 rounded-xl py-2 px-5 text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover-brutal cursor-pointer"
            >
              Dashboard
            </Link>
            <span
              className="hidden md:block font-bold text-sm text-black max-w-44 truncate px-4 py-1.5 border-2 border-black rounded-lg bg-black/5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {displayName}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center justify-center font-bold transition-all duration-300 rounded-xl py-2.5 px-7 text-black bg-[#ff00ff] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover-brutal cursor-pointer"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden md:flex items-center justify-center font-bold transition-all duration-300 rounded-xl py-2 px-5 text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover-brutal cursor-pointer"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center font-bold transition-all duration-300 rounded-xl py-2.5 px-7 text-black bg-[#39ff14] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover-brutal cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
