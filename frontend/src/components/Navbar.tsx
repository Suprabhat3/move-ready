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
              className="hidden md:flex items-center justify-center font-semibold transition-all duration-300 rounded-full py-2 px-5 text-text-main border border-border-dark hover:bg-bg-alt hover:border-text-main hover:-translate-y-0.5 shadow-sm cursor-pointer"
            >
              Dashboard
            </button>
            <span className="hidden md:block text-sm text-text-muted max-w-44 truncate">
              {displayName}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center justify-center font-semibold transition-all duration-300 rounded-full py-2.5 px-7 text-white bg-gradient-to-br from-primary-blue to-primary-blue-dark hover:-translate-y-0.5 hover:shadow-lg shadow-md cursor-pointer"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate && onNavigate("login")}
              className="hidden md:flex items-center justify-center font-semibold transition-all duration-300 rounded-full py-2 px-5 text-text-main border border-border-dark hover:bg-bg-alt hover:border-text-main hover:-translate-y-0.5 shadow-sm cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigate && onNavigate("register")}
              className="flex items-center justify-center font-semibold transition-all duration-300 rounded-full py-2.5 px-7 text-white bg-gradient-to-br from-primary-green to-[#14b8a6] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-green/40 shadow-md shadow-primary-green/30 cursor-pointer"
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
