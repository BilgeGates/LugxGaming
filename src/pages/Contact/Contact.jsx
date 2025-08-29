import React, { useState } from "react";

import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

import Navbar from "../../layout/Navbar/Navbar";
import Footer from "../../layout/Footer/Footer";

import { useDocumentTitle } from "../../hooks";

const Contact = () => {
  useDocumentTitle("Contact Us | PlayGuide");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 pt-32 pb-10 sm:px-6 lg:px-8 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Contact{" "}
              <span className="text-blue-600 dark:text-blue-400">Us</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have any questions? Want to discuss a project? Our team is ready
              to assist you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                    Phone
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Call us</p>
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  +994 55 555 55 55
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Monday - Friday, 09:00-18:00
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                    Email
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Write to us
                </p>
                <a
                  className="text-lg font-medium text-green-600 dark:text-green-400"
                  href="mailto:darkdeveloperassistant@gmail.com"
                >
                  darkdeveloperassistant@gmail.com
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  We reply within 24 hours
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                    Address
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Visit us
                </p>
                <p className="text-lg font-medium text-purple-600 dark:text-purple-400">
                  Azerbaijan, Baku
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  28 May
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 lg:p-12 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center mb-8">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white ml-4">
                    Send a Message
                  </h2>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full inline-block mb-4">
                      <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                      Thank you!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your message has been successfully sent. We will get back
                      to you shortly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <User className="inline h-4 w-4 mr-1" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Mail className="inline h-4 w-4 mr-1" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Message subject"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <MessageSquare className="inline h-4 w-4 mr-1" />
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-none"
                        placeholder="Write your message here..."
                      ></textarea>
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
                    >
                      <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                      <span>Send Message</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
