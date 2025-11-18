import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const menuData = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Resume Upload",
    path: "/resume-upload",
    newTab: false,
  },
  {
    id: 33,
    title: "Blog",
    path: "/blog",
    newTab: false,
  },
  {
    id: 3,
    title: "Support",
    path: "/contact",
    newTab: false,
  },
];

const NavBar = () => {
  // Toggle navbar visibility
  const [navbarOpen, setNavbarOpen] = useState(false);
  // Toggle submenu
  const [openIndex, setOpenIndex] = useState(-1);

  const location = useLocation();
  const currentPath = location.pathname || "/";

  // Toggle navbar visibility
  const navbarToggleHandler = () => setNavbarOpen((prev) => !prev);

  // Toggle submenu
  const handleSubmenu = (index) =>
    setOpenIndex((prev) => (prev === index ? -1 : index));

  return (
    <header className="z-40 flex w-full items-center fixed bg-white bg-opacity-60 shadow-md backdrop-blur-sm transition">
      <div className="container mx-auto px-4">
        <div className="relative -mx-4 flex items-center justify-between">
          {/* Logo */}
          <div className="w-60 max-w-full px-4 xl:mr-12">
            <Link
              to="/"
              className="logo block w-full py-5 lg:py-2.5 text-2xl font-bold leading-none italic text-blue-600"
            >
              ElevateCV
              {/* <img
                src="/images/logo/logo-2.svg"
                alt="logo"
                width={140}
                height={30}
                className="w-full"
              /> */}
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex w-full items-center justify-between px-4">
            <div>
              {/* Mobile menu button */}
              <button
                onClick={navbarToggleHandler}
                aria-label="Mobile Menu"
                className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg p-2 ring-primary focus:ring-2 lg:hidden"
              >
                {navbarOpen ? (
                  <FiX className="w-7 h-7 text-blue-600" />
                ) : (
                  <FiMenu className="w-7 h-7 text-blue-600" />
                )}
              </button>

              {/* Menu */}
              <nav
                className={`absolute right-0 z-30 w-[250px] rounded border border-gray-200 bg-white px-6 py-4 duration-300
                  lg:visible lg:static lg:w-auto lg:border-none lg:bg-transparent lg:p-0 lg:opacity-100
                  ${
                    navbarOpen
                      ? "visible top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
              >
                <ul className="block lg:flex lg:space-x-12">
                  {menuData.map((menuItem, index) => (
                    <li key={menuItem.id} className="group relative">
                      {menuItem.path ? (
                        <Link
                          to={menuItem.path}
                          className={`flex py-2 text-base lg:inline-flex lg:px-0 lg:py-6 ${
                            currentPath === menuItem.path
                              ? "text-primary"
                              : "text-gray-800 hover:text-primary"
                          }`}
                          tabIndex={
                            navbarOpen || window.innerWidth >= 1024 ? 0 : -1
                          }
                        >
                          {menuItem.title}
                        </Link>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSubmenu(index)}
                            aria-haspopup="true"
                            aria-expanded={openIndex === index}
                            className="flex w-full items-center justify-between py-2 text-base text-gray-800 hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
                          >
                            {menuItem.title}
                            <span className="pl-3">
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
                            className={`lg:absolute lg:top-full lg:left-0 lg:w-[250px] lg:rounded-md lg:bg-white lg:shadow-md lg:p-4 ${
                              openIndex === index ? "block" : "hidden"
                            }`}
                          >
                            {menuItem.submenu?.map((submenuItem) => (
                              <Link
                                to={submenuItem.path}
                                key={submenuItem.id}
                                className="block rounded py-2.5 text-sm text-gray-800 hover:text-primary lg:px-3"
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
            <div className="flex items-center justify-end pr-16 lg:pr-0 space-x-4">
              <Link
                to="/signin"
                className="text-blue-600 font-medium text-base hover:opacity-80 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-blue-600 font-medium text-base bg-blue-200 md:px-8 px-4 md:py-3 py-2 rounded-r-full rounded-b-full hover:bg-blue-600 hover:text-white transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
