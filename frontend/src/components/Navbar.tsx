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
    `font-bold text-sm tracking-tight transition-all px-2 py-1 ${
      isActive
        ? "text-black border-b-2 border-[#0a5ea8]"
        : "text-gray-500 hover:text-black"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full h-24 z-50 flex items-center justify-center px-6 pointer-events-none">
      <div className="w-full max-w-[1400px] h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 shadow-sm pointer-events-auto rounded-2xl">
        <Link
          to="/"
          className="flex items-center gap-3 hover:scale-105 transition-transform"
        >
          <img
            src={logo}
            alt="MoveReady Logo"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-6">
            <li>
              <NavLink to="/properties" className={navClassName}>
                Browse
              </NavLink>
            </li>
            <li>
              <NavLink to="/features" className={navClassName}>
                Features
              </NavLink>
            </li>
            <li>
              <NavLink to="/landlords" className={navClassName}>
                Landlords
              </NavLink>
            </li>
            <li>
              <NavLink to="/blog" className={navClassName}>
                Blog
              </NavLink>
            </li>
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
            <li>
              <NavLink to="/support" className={navClassName}>
                Support
              </NavLink>
            </li>
          </ul>
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden lg:block text-sm font-bold text-gray-400 lowercase">
              {displayName}
            </span>
            <Link
              to={isAgent ? "/dashboard/listings" : "/dashboard"}
              className="px-6 py-2.5 rounded-lg font-bold text-sm bg-gray-100 text-gray-900 border border-transparent hover:bg-gray-200 transition-all"
            >
              Dashboard
            </Link>
            <button
              onClick={onLogout}
              className="px-6 py-2.5 rounded-lg font-bold text-sm bg-black text-white hover:bg-gray-800 transition-all"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-gray-600 font-bold hover:text-black transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-8 py-2.5 bg-[#28a745] text-white font-bold rounded-lg hover:bg-[#218838] transition-all shadow-md"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
