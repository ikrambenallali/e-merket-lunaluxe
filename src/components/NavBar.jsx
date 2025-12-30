import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserPlus } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = ["Home", "Nos valeurs", "À propos", "CGV", "FAQ", "Contact"];

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 sm:px-12 py-4 bg-white shadow-sm z-50">
      <h3 className="font-bold text-xl sm:text-2xl tracking-widest uppercase font-playfair text-brandRed">
        LunaLuxe
      </h3>

      {/* Desktop Nav */}
      <nav className="hidden sticky md:flex gap-6 text-base font-medium text-gray-800">
        {navItems.map(item =>
          <a
            key={item}
            href="#"
            className="relative group transition duration-300"
          >
            <span className="group-hover:text-brandBrown transition duration-300">
              {item}
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-brandBrown transition-all duration-300 group-hover:w-full" />
          </a>
        )}
      </nav>

      <div className="flex items-center gap-4">
        
        {/* register icon */}
        <Link
          to="/signup"
          className="hover:text-brandBrown -mr-2 transition-colors duration-300"
          aria-label="Register"
        >
          <UserPlus size={24} className="w-5 h-5" />
        </Link>

        {/* Burger Menu (mobile only) */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen
            ? <X size={24} className="text-brandBrown" />
            : <Menu size={24} className="text-brandBrown" />}
        </button>
      </div>

      {/* Mobile Menu (Slide Down) */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md border-t border-brandBrown/50 transition-all duration-500 ease-in-out md:hidden overflow-hidden ${isMenuOpen
          ? "max-h-[500px] opacity-100"
          : "max-h-0 opacity-0"}`}
      >
        <nav className="flex flex-col items-center py-4 gap-4 text-gray-800 font-medium">
          {navItems.map(item =>
            <a
              key={item}
              href="#"
              onClick={() => setIsMenuOpen(false)} // close on click
              className="hover:text-brandBrown transition-colors duration-300"
            >
              {item}
            </a>
          )}

        </nav>
      </div>
    </header>
  );
}

export default Navbar;