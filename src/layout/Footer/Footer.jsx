import React from "react";

import {
  Users,
  Mail,
  MapPin,
  Gamepad2,
  Rocket,
  Star,
  Trophy,
  Zap,
  Sword,
  Brain,
  Car,
  Puzzle,
  Facebook,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";

import PlayGuideLogo from "../index";

const Footer = () => {
  const handleGameCategoryClick = (filter) => {
    window.location.href = `/products?filter=${filter}`;
  };

  return (
    <footer className="relative text-white py-16 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-cyan-900/30"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
            <Users className="mx-auto text-3xl text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              0
            </div>
            <div className="text-sm text-gray-300">Gamers</div>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
            <Gamepad2 className="mx-auto text-3xl text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              0
            </div>
            <div className="text-sm text-gray-300">Games Reviewed</div>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
            <Trophy className="mx-auto text-3xl text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              0
            </div>
            <div className="text-sm text-gray-300">Awards Won</div>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
            <Star className="mx-auto text-3xl text-pink-400 mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
              0/5
            </div>
            <div className="text-sm text-gray-300">User Rating</div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <PlayGuideLogo />
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              Delivering real, up-to-date gaming news, reviews, and insights.
              Trusted by thousands of gamers worldwide. Join our community and
              discover the hottest games, latest trends, and exclusive content.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all group">
                <Mail className="text-cyan-400 text-xl group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-sm text-gray-400">Email us</div>
                  <a
                    href="mailto:darkdeveloperassistant@gmail.com"
                    className="text-white hover:text-cyan-400 transition font-medium"
                  >
                    darkdeveloperassistant@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all group">
                <MapPin className="text-purple-400 text-xl group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-sm text-gray-400">Location</div>
                  <address className="text-white not-italic">
                    Azerbaijan, Baku. 28 May
                  </address>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
                Contact With Us
              </h4>
              <div className="flex space-x-4">
                {[
                  {
                    icon: Facebook,
                    href: "https://www.facebook.com/profile.php?id=100091496015332",
                    color: "hover:text-blue-400 hover:shadow-blue-400/25",
                  },
                  {
                    icon: Twitter,
                    href: "https://x.com/DeveloperKhatai",
                    color: "hover:text-cyan-400 hover:shadow-cyan-400/25",
                  },
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/khatai-huseynzade-464730289/",
                    color: "hover:text-blue-500 hover:shadow-blue-500/25",
                  },
                  {
                    icon: Github,
                    href: "https://github.com/bilgegates",
                    color: "hover:text-gray-300 hover:shadow-gray-300/25",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:border-white/40 hover:shadow-lg`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
              <Rocket />
              Quick Links
            </h4>
            <div className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About", href: "/about" },
                { name: "Products", href: "/products" },
                { name: "Contact Us", href: "/contact" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/5 hover:border-l-2 hover:border-cyan-400"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Gaming Hub */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
              <Gamepad2 />
              Gaming Hub
            </h4>
            <div className="space-y-3">
              {[
                {
                  name: "Action Games",
                  icon: Zap,
                  color: "text-orange-400",
                  filter: "action",
                },
                {
                  name: "RPG Games",
                  icon: Sword,
                  color: "text-red-400",
                  filter: "role-playing-games-rpg",
                },
                {
                  name: "Sports Games",
                  icon: Trophy,
                  color: "text-yellow-400",
                  filter: "sports",
                },
                {
                  name: "Strategy Games",
                  icon: Brain,
                  color: "text-green-400",
                  filter: "strategy",
                },
                {
                  name: "Racing Games",
                  icon: Car,
                  color: "text-blue-400",
                  filter: "racing",
                },
                {
                  name: "Puzzle Games",
                  icon: Puzzle,
                  color: "text-purple-400",
                  filter: "puzzle",
                },
              ].map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleGameCategoryClick(category.filter)}
                  className="w-full text-left flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/5 cursor-pointer group hover:border-l-2 hover:border-purple-400"
                >
                  <category.icon
                    size={20}
                    className={`${category.color} group-hover:scale-110 transition-transform`}
                  />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="text-gray-400 text-sm select-none text-center">
            © 2025 Play Guide Company. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
