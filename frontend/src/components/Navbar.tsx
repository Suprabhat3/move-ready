import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import {
  Menu,
  X,
  ChevronRight,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const displayName = user?.name || user?.email || "Account";
  const isAgent = user?.role === "SITE_AGENT" || user?.role === "ADMIN";

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `font-bold text-sm tracking-tight transition-all relative py-1 ${
      isActive
        ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0a5ea8] after:rounded-full"
        : "text-gray-500 hover:text-black"
    }`;

  const mobileNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between p-6 rounded-2xl font-black text-xl transition-all ${
      isActive ? "bg-blue-50 text-[#0a5ea8]" : "text-[#1a1a1a] hover:bg-gray-50"
    }`;

  const menuItems = [
    { name: "Browse", path: "/properties" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Features", path: "/features" },
    { name: "Visits", path: "/visits" },
    ...(!isAgent && user ? [{ name: "Move-In", path: "/move-in" }] : []),
    { name: "Support", path: "/support" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-24 z-[100] flex items-center justify-center px-4 md:px-6 pointer-events-none">
      <div className="w-full max-w-[1400px] h-16 md:h-18 bg-white/80 backdrop-blur-2xl border border-white/50 flex items-center justify-between px-6 md:px-8 shadow-[0_8px_32px_rgba(0,0,0,0.05)] pointer-events-auto rounded-[1.5rem] md:rounded-2xl">
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

        {/* Desktop Nav */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} className={navClassName}>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {displayName}
              </span>
              <Link
                to={isAgent ? "/dashboard/listings" : "/dashboard"}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100 transition-all hover:shadow-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={onLogout}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-[#1a1a1a] text-white hover:bg-black transition-all shadow-lg shadow-black/10"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 font-bold hover:text-black transition-colors px-4"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 bg-[#28a745] text-white font-bold rounded-xl hover:bg-[#218838] transition-all shadow-lg shadow-green-100 hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-3 bg-gray-50 rounded-xl text-[#1a1a1a] hover:bg-gray-100 transition-all active:scale-90 shadow-sm border border-gray-100"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[-1] transition-all duration-500 flex pointer-events-auto ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="w-full bg-white pt-32 pb-12 px-6 flex flex-col shadow-2xl overflow-y-auto">
          {/* User Profile Hook (Mobile) */}
          {user && (
            <div className="mb-8 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#0a5ea8] rounded-2xl flex items-center justify-center text-white">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                    Welcome back
                  </p>
                  <p className="text-xl font-black text-[#1a1a1a] truncate">
                    {displayName}
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={mobileNavClassName}
              >
                {item.name}
                <ChevronRight className="w-5 h-5 opacity-20" />
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
            {user ? (
              <>
                <Link
                  to={isAgent ? "/dashboard/listings" : "/dashboard"}
                  className="flex items-center justify-center gap-3 w-full p-6 bg-gray-50 text-[#1a1a1a] rounded-[1.5rem] font-black text-lg border border-gray-100"
                >
                  <LayoutDashboard className="w-6 h-6" /> Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center gap-3 w-full p-6 bg-[#1a1a1a] text-white rounded-[1.5rem] font-black text-lg shadow-xl"
                >
                  <LogOut className="w-6 h-6" /> Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/login"
                  className="flex items-center justify-center p-6 bg-gray-50 text-[#1a1a1a] rounded-[1.5rem] font-black text-lg border border-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center p-6 bg-[#28a745] text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-green-100"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
