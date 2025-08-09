import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { FaRegMoon, FaBars, FaTimes } from "react-icons/fa";
import { FiSun } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTheme = () => setDarkTheme(!darkTheme);

  // Dark theme effect
  useEffect(() => {
    document.body.classList.toggle("dark", darkTheme);
  }, [darkTheme]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menü link üçün class merge helper
  const navLinkClass = ({ isActive }) =>
    `block px-6 py-2 rounded-full font-light transition-colors duration-300 ${
      isActive
        ? "bg-gradient-to-r from-cyan-400 to-purple-600 text-white"
        : "text-white hover:bg-white/20"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-br from-purple-800 via-blue-900 to-indigo-900 py-3 shadow-lg rounded-b-3xl"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex-shrink-0"
        >
          <img src={Logo} alt="Logo" className="w-36 md:w-40" />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-12">
          <NavLink
            to="/"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Products
          </NavLink>
          <NavLink
            to="/contact"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </NavLink>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-6 text-white text-xl hover:text-cyan-400 transition-colors"
          >
            {darkTheme ? <FiSun /> : <FaRegMoon />}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-white text-2xl hover:text-cyan-400 transition-colors"
          >
            {darkTheme ? <FiSun /> : <FaRegMoon />}
          </button>

          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="text-white text-3xl focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed top-20 right-4 w-56 bg-white rounded-3xl shadow-lg overflow-hidden animate-slide-down z-40">
          <nav className="flex flex-col">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-4 text-gray-700 hover:bg-purple-50 transition-colors duration-300 ${
                  isActive ? "bg-purple-100 font-semibold text-purple-700" : ""
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-4 text-gray-700 hover:bg-purple-50 transition-colors duration-300 ${
                  isActive ? "bg-purple-100 font-semibold text-purple-700" : ""
                }`
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-4 text-gray-700 hover:bg-purple-50 transition-colors duration-300 ${
                  isActive ? "bg-purple-100 font-semibold text-purple-700" : ""
                }`
              }
            >
              Contact Us
            </NavLink>
          </nav>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
