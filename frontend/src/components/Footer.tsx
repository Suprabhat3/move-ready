import { Link } from "react-router";
import logo from "../assets/logo.png";
import { Twitter, Github, Linkedin} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-bg-alt border-t border-border-light pt-20 pb-8">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="flex flex-col lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src={logo} alt="MoveReady" className="h-10 w-auto" />
            </div>
            <p className="text-text-muted leading-relaxed mb-8 max-w-[300px] md:max-w-full lg:max-w-[300px]">
              Simplifying the rental process for tenants and property managers.
              Discover, verify, and move in effortlessly.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/suprabhat_3"
                target="_blank"
                aria-label="Twitter"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-base text-text-muted border border-border-light transition-all duration-300 hover:bg-primary-green hover:text-white hover:border-primary-green hover:-translate-y-0.5"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://github.com/suprabhat3"
                target="_blank"
                aria-label="Github"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-base text-text-muted border border-border-light transition-all duration-300 hover:bg-primary-green hover:text-white hover:border-primary-green hover:-translate-y-0.5"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/suprabhatt"
                target="_blank"
                aria-label="LinkedIn"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-base text-text-muted border border-border-light transition-all duration-300 hover:bg-primary-green hover:text-white hover:border-primary-green hover:-translate-y-0.5"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-base font-bold text-text-main mb-6">
              Platform
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  to="/properties"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link
                  to="/#how-it-works"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  For Owners
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="text-base font-bold text-text-main mb-6">Company</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="#"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  Careers
                </a>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="text-base font-bold text-text-main mb-6">Support</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  to="/help-center"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/tenant-rights"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  Tenant Rights
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-text-muted font-medium hover:text-primary-blue transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border-light text-text-light text-sm gap-4">
          <p>
            &copy; {new Date().getFullYear()} MoveReady Inc. All rights
            reserved.
          </p>
          {/* <div className="flex items-center gap-2 font-medium">
            <Mail size={16} /> <span>support@moveready.com</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
