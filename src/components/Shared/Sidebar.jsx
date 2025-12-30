import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

export default function Sidebar({ navLinks = [], activeSection, onSelect }) {
  const navigate = useNavigate();
  const { sellerId } = useParams();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleSelect = (link) => {
    onSelect?.(link.id);
    if (link.path) {
      navigate(link.path);
      return;
    }
    if (sellerId && link.id) {
      navigate(`/seller/${sellerId}?section=${link.id}`);
    }
  };

  return (
    <aside className="relative w-full bg-white shadow-sm lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:w-72 lg:overflow-y-auto">
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-br from-brandRed via-[#c35a4c] to-[#f0d6d1] opacity-90" aria-hidden="true" />
      <div className="relative px-6 pt-10 text-white">
        <p className="text-xl font-montserrat text-center uppercase tracking-[0.3em] text-white/80">LunaLuxe</p>
      </div>

      <nav className="relative border-t border-white/10 px-3 py-6 lg:mt-10">
        <ul className="space-y-2">
          {navLinks.map((link) => {
            if (onSelect) {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(link)}
                    className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium font-montserrat transition ${
                      isActive ? 'bg-brandRed text-white shadow-md' : 'text-gray-700 hover:bg-brandRed/10 hover:text-brandRed'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-brandRed/10 text-brandRed'}`}>
                        {link.icon}
                      </span>
                      {link.label}
                    </span>
                    <span aria-hidden="true" className={`text-sm transition ${isActive ? 'translate-x-1 opacity-100' : 'opacity-60 group-hover:translate-x-1 group-hover:opacity-100'}`}>→</span>
                  </button>
                </li>
              );
            }

            return (
              <li key={link.id || link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/admin'}
                  className={({ isActive }) =>
                    `group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium font-montserrat transition ${
                      isActive ? 'bg-brandRed text-white shadow-md' : 'text-gray-700 hover:bg-brandRed/10 hover:text-brandRed'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-brandRed/10 text-brandRed'}`}>{link.icon}</span>
                        {link.label}
                      </span>
                      <span aria-hidden="true" className={`text-sm transition ${isActive ? 'translate-x-1 opacity-100' : 'opacity-60 group-hover:translate-x-1 group-hover:opacity-100'}`}>→</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative hidden border-t border-white/10 mt-5 px-6 py-6 lg:block">
        <button onClick={handleLogout} className="mt-4 w-full cursor-pointer rounded-lg bg-brandRed px-4 py-2 text-sm font-semibold font-montserrat text-white transition hover:bg-hoverBrandRed">Logout</button>
      </div>
    </aside>
  );
}
