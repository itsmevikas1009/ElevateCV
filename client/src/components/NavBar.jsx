import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { logout } from "../lib/api"; // or wherever your logout utility is

// Single source of truth for menu
const menuData = [
  { id: 1, title: "Home", path: "/" },
  { id: 2, title: "Dashboard", path: "/dashboard" },
  {
    id: 3,
    title: "Resources",
    submenu: [
      { id: "blog", title: "Blog", path: "/blog" },
      { id: "support", title: "Support", path: "/support" },
      { id: "how", title: "How it works", path: "/how-it-works" },
    ],
  },
];

const NavBar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);

  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const location = useLocation();
  const currentPath = location.pathname || "/";
  const navigate = useNavigate();

  const navbarToggleHandler = () => setNavbarOpen((prev) => !prev);

  const handleSubmenu = (index) =>
    setOpenIndex((prev) => (prev === index ? -1 : index));

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  // ✅ Close mobile menu & submenu whenever route changes
  useEffect(() => {
    setNavbarOpen(false);
    setOpenIndex(-1);
  }, [location.pathname]);

  // ✅ Close menu when any nav link is clicked
  const handleNavItemClick = () => {
    setNavbarOpen(false);
    setOpenIndex(-1);
  };

  return (
    <header className="z-40 fixed top-0 left-0 right-0 flex w-full items-center bg-white border-b border-slate-200/70 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all">
      <div className="container mx-auto px-4">
        <div className="relative -mx-4 flex items-center justify-between">
          {/* Logo */}
          <div className="w-60 max-w-full px-4 xl:mr-12">
            <Link
              to="/"
              className="logo block w-full py-5 lg:py-3 text-2xl font-extrabold leading-none italic"
              onClick={handleNavItemClick}
            >
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(59,130,246,0.35)]">
                ElevateCV
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex w-full items-center justify-between px-4">
            <div>
              {/* Mobile menu button */}
              <button
                onClick={navbarToggleHandler}
                aria-label="Mobile Menu"
                type="button"
                className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-full border border-slate-200 bg-white/80 p-2 shadow-sm ring-primary focus:ring-2 lg:hidden"
              >
                {navbarOpen ? (
                  <FiX className="w-7 h-7 text-blue-600" />
                ) : (
                  <FiMenu className="w-7 h-7 text-blue-600" />
                )}
              </button>

              {/* Menu */}
              <nav
                className={`absolute right-0 z-30 w-[260px] rounded-2xl border border-slate-200 bg-white/95 px-6 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.15)] duration-300
               lg:visible lg:static lg:w-auto lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none lg:opacity-100
               ${
                 navbarOpen
                   ? "visible top-full opacity-100"
                   : "invisible top-[120%] opacity-0"
               }`}
              >
                <ul className="block lg:flex lg:items-center lg:space-x-10">
                  {menuData.map((menuItem, index) => (
                    <li key={menuItem.id} className="group relative">
                      {menuItem.path ? (
                        <Link
                          to={menuItem.path}
                          onClick={handleNavItemClick}
                          className={`relative flex py-2 text-base lg:inline-flex lg:px-0 lg:py-6 font-medium transition-colors
                          ${
                            currentPath === menuItem.path
                              ? "text-blue-600"
                              : "text-slate-700 hover:text-blue-600"
                          }`}
                          tabIndex={
                            navbarOpen || window.innerWidth >= 1024 ? 0 : -1
                          }
                        >
                          <span className="relative">
                            {menuItem.title}
                            {/* underline shimmer */}
                            <span
                              className={`absolute left-0 -bottom-1 h-0.5 w-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-pink-500 transform origin-left transition-transform duration-300
                              ${
                                currentPath === menuItem.path
                                  ? "scale-x-100"
                                  : "scale-x-0 group-hover:scale-x-100"
                              }`}
                            />
                          </span>
                        </Link>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSubmenu(index)}
                            aria-haspopup="true"
                            aria-expanded={openIndex === index}
                            className="flex w-full items-center justify-between py-2 text-base font-medium text-slate-700 hover:text-blue-600 lg:inline-flex lg:px-0 lg:py-6"
                          >
                            <span className="relative">
                              {menuItem.title}
                              <span className="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-full origin-left scale-x-0 rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-pink-500 transition-transform duration-300 group-hover:scale-x-100" />
                            </span>
                            <span className="pl-3 text-slate-500 group-hover:text-blue-600">
                              <svg width="25" height="24" viewBox="0 0 25 24">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                          </button>
                          {/* Submenu */}
                          <div
                            className={`lg:absolute lg:top-full lg:left-0 lg:w-[260px] lg:rounded-2xl lg:bg-white lg:shadow-[0_16px_40px_rgba(15,23,42,0.12)] lg:p-4 lg:border lg:border-slate-200/80 ${
                              openIndex === index ? "block" : "hidden"
                            }`}
                          >
                            {menuItem.submenu?.map((submenuItem) => (
                              <Link
                                to={submenuItem.path}
                                key={submenuItem.id}
                                onClick={handleNavItemClick}
                                className="block rounded-lg py-2.5 text-sm text-slate-700 hover:text-blue-600 lg:px-3 transition-colors"
                              >
                                {submenuItem.title}
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center justify-end pr-16 lg:pr-0 space-x-3 lg:space-x-4">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/signin"
                    onClick={handleNavItemClick}
                    className="hidden sm:inline-flex text-blue-600 font-medium text-base hover:text-blue-700 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={handleNavItemClick}
                    className="inline-flex items-center justify-center text-sm md:text-base font-semibold text-white bg-linear-to-r from-blue-500 via-indigo-500 to-pink-500 md:px-8 px-5 md:py-2.5 py-2 rounded-full shadow-[0_10px_30px_rgba(79,70,229,0.45)] hover:shadow-[0_12px_36px_rgba(79,70,229,0.55)] hover:brightness-110 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={handleNavItemClick}
                    className="hidden sm:inline-flex text-blue-600 font-medium text-base hover:text-blue-700 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="inline-flex items-center justify-center text-sm md:text-base font-semibold text-red-600 bg-red-50 md:px-5 px-4 md:py-2.5 py-2 rounded-full border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all"
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
