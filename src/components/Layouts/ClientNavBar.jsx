import { Link } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";

function ClientNavBar() {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 sm:px-12 py-4 bg-white shadow-sm z-50">
      {/* Logo */}
      <Link to="/">
        <h3 className="font-bold text-xl sm:text-2xl tracking-widest uppercase font-playfair text-brandRed">
          LunaLuxe
        </h3>
      </Link>

      {/* Icons Container */}
      <div className="flex items-center gap-4">
        {/* Search Icon */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
          aria-label="Search"
        >
          <Search size={24} className="w-5 h-5 text-gray-800 hover:text-brandBrown transition-colors" />
        </button>

        {/* Cart Icon */}
        <Link
          to="/cart"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 relative"
          aria-label="Shopping Cart"
        >
          <ShoppingCart size={24} className="w-5 h-5 text-gray-800 hover:text-brandBrown transition-colors" />
        
          <span className="absolute top-0 -right-3 bg-brandRed text-brandWhite text-xs rounded-full w-5 h-5 flex items-center font-montserrat justify-center">
            0
          </span>
        </Link>

        {/* Profile Icon */}
        <Link
          to="/profile"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
          aria-label="Profile"
        >
          <User size={24} className="w-5 h-5 text-gray-800 hover:text-brandBrown transition-colors" />
        </Link>
      </div>
    </header>
  );
}

export default ClientNavBar;

