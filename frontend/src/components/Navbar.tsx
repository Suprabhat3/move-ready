import logo from "../assets/logo.png";

type NavbarUser = {
  name?: string | null;
  email?: string | null;
};

const Navbar = ({
  onNavigate,
  user,
  onLogout,
}: {
  onNavigate?: (page: string) => void;
  user?: NavbarUser | null;
  onLogout?: () => void;
}) => {
  const displayName = user?.name || user?.email || "Account";

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 border-b border-border-light/50 glass">
      <div className="w-full max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <button
          onClick={() => onNavigate && onNavigate("home")}
          className="flex items-center gap-3 bg-transparent border-none p-0 cursor-pointer"
        >
          <img
            src={logo}
            alt="MoveReady Logo"
            className="h-10 w-auto object-contain"
          />
        </button>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-10">
            <li>
              <a
                href="#features"
                className="font-medium text-text-muted text-sm hover:text-primary-blue transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="font-medium text-text-muted text-sm hover:text-primary-blue transition-colors"
              >
                How it Works
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="font-medium text-text-muted text-sm hover:text-primary-blue transition-colors"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="font-medium text-text-muted text-sm hover:text-primary-blue transition-colors"
              >
                About
              </a>
            </li>
          </ul>
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate("dashboard")}
              className="hidden md:flex items-center justify-center font-bold transition-all duration-300 rounded-xl py-2 px-5 text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover-brutal cursor-pointer"
            >
              Dashboard
            </button>
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
            <button
              onClick={() => onNavigate && onNavigate("login")}
              className="hidden md:flex items-center justify-center font-bold transition-all duration-300 rounded-xl py-2 px-5 text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover-brutal cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigate && onNavigate("register")}
              className="flex items-center justify-center font-bold transition-all duration-300 rounded-xl py-2.5 px-7 text-black bg-[#39ff14] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover-brutal cursor-pointer"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
