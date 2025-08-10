import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-purple-900 via-blue-900 to-indigo-900 text-white py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-0">
          {/* Company Info */}
          <div className="max-w-sm space-y-4">
            <h3 className="text-2xl font-extrabold">LUGX Gaming</h3>
            <p className="text-gray-300">
              Delivering real, up-to-date gaming news, reviews, and insights.
              Trusted by thousands of gamers worldwide.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-center gap-3">
                <FaEnvelope />
                <a
                  href="mailto:darkdeveloperassistant@gmail.com"
                  className="hover:text-cyan-400 transition"
                >
                  darkdeveloperassistant@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt />
                <address>Azerbaijan, Baku. 28 May</address>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-6 mt-6">
              <a
                href="https://www.facebook.com/profile.php?id=100091496015332"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-cyan-400 transition"
              >
                <FaFacebookF size={24} />
              </a>
              <a
                href="https://x.com/DeveloperKhatai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-cyan-400 transition"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/khatai-huseynzade-464730289/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-cyan-400 transition"
              >
                <FaLinkedinIn size={24} />
              </a>
              <a
                href="https://github.com/bilgegates"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-cyan-400 transition"
              >
                <FaGithub size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-xl font-semibold text-cyan-400">Quick Links</h4>
            <a href="/about" className="hover:text-cyan-400 transition">
              About Us
            </a>
            <a href="/contact" className="hover:text-cyan-400 transition">
              Contact
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 border-t border-white/20 pt-6 text-center text-gray-400 text-sm select-none">
          © 2025 LUGX Gaming Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
