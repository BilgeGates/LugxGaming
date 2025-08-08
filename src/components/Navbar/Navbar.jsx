import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { FaRegMoon, FaBars, FaTimes } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import "./navbar.css";

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
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav__container">
        <div className="nav__logo">
          <NavLink to="/">
            <img src={Logo} alt="Logo" />
          </NavLink>
        </div>

        <div className="nav__content">
          <div
            className={`nav__menu${menuOpen ? " open" : ""}`}
            style={{ display: menuOpen ? "flex" : "" }}
          >
            <NavLink
              to="/"
              onClick={toggleMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={toggleMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Products
            </NavLink>
            <NavLink
              to="/contact"
              onClick={toggleMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Contact Us
            </NavLink>
          </div>

          <button
            className="theme__btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {darkTheme ? <FiSun /> : <FaRegMoon />}
          </button>

          {!menuOpen ? (
            <button
              className="nav__menu-open"
              onClick={toggleMenu}
              aria-label="Open menu"
            >
              <FaBars />
            </button>
          ) : (
            <button
              className="nav__menu-close"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
