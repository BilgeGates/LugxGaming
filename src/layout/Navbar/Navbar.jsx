import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const PlayGuideLogo = ({ className = "" }) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <div className="relative">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-white/10 rounded-xl "></div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10 text-white"
        >
          <path
            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
            fill="currentColor"
          />
          <circle cx="12" cy="12" r="3" fill="white" opacity="0.8" />
          <path
            d="M9 12L11 14L15 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="text-cyan-300"
          />
        </svg>
      </div>
      <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 blur-md opacity-30 "></div>
    </div>
    <div className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
      Play Guide
    </div>
  </div>
);

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

  const navLinkClass = ({ isActive }) => {
    if (isActive) {
      return {
        className:
          "block px-6 py-2 rounded-full font-light transition-colors duration-300 text-white",
        style: {
          background:
            "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
        },
      };
    } else {
      return {
        className:
          "block px-6 py-2 rounded-full font-light transition-colors duration-300 text-white hover:bg-white/20",
        style: {},
      };
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-br from-purple-800 via-blue-900 to-indigo-900 py-5 shadow-lg rounded-b-3xl backdrop-blur-sm bg-opacity-95"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex-shrink-0 hover:scale-105 transition-transform duration-300"
        >
          <PlayGuideLogo />
        </NavLink>

        <div className="hidden lg:flex items-center space-x-12">
          <NavLink
            to="/"
            {...navLinkClass({ isActive: window.location.pathname === "/" })}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            {...navLinkClass({
              isActive: window.location.pathname === "/products",
            })}
            onClick={() => setMenuOpen(false)}
          >
            Products
          </NavLink>
          <NavLink
            to="/contact"
            {...navLinkClass({
              isActive: window.location.pathname === "/contact",
            })}
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
