import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { FaBars, FaTimes } from "react-icons/fa";

import PlayGuideLogo from "../index";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[99999] transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-br from-purple-800 via-blue-900 to-indigo-900 py-5 shadow-lg rounded-b-3xl backdrop-blur-sm bg-opacity-95"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex-shrink-0"
        >
          <PlayGuideLogo />
        </NavLink>

        <div className="hidden lg:flex items-center space-x-12">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-6 py-2 rounded-full font-light transition-colors duration-300 text-white ${
                isActive ? "font-bold" : "hover:bg-white/20"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background:
                      "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
                  }
                : {}
            }
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block px-6 py-2 rounded-full font-light transition-colors duration-300 text-white ${
                isActive ? "font-bold" : "hover:bg-white/20"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background:
                      "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
                  }
                : {}
            }
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block px-6 py-2 rounded-full font-light transition-colors duration-300 text-white ${
                isActive ? "font-bold" : "hover:bg-white/20"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background:
                      "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
                  }
                : {}
            }
            onClick={() => setMenuOpen(false)}
          >
            Products
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `block px-6 py-2 rounded-full font-light transition-colors duration-300 text-white ${
                isActive ? "font-bold" : "hover:bg-white/20"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background:
                      "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
                  }
                : {}
            }
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </NavLink>
        </div>

        <div className="lg:hidden flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="text-white text-3xl focus:outline-none hover:scale-110 transition-transform duration-200"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden fixed top-20 right-4 w-56 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden animate-slide-down z-40 border border-white/20">
          <nav className="flex flex-col">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-100 to-cyan-100 font-semibold text-purple-700"
                    : ""
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-100 to-cyan-100 font-semibold text-purple-700"
                    : ""
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-100 to-cyan-100 font-semibold text-purple-700"
                    : ""
                }`
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-100 to-cyan-100 font-semibold text-purple-700"
                    : ""
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
