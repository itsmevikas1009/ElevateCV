import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/elevatecv-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-xl mt-0">
      <div className="max-w-7xl mx-auto px-6 py-4 grid gap-4 md:grid-cols-4">
        {/* Logo + Tagline */}
        <div className="flex flex-col gap-3">
          <img
            src={logo}
            alt="ElevateCV Logo"
            className="h-12 w-auto object-contain"
          />
          <p className="text-slate-600 text-sm leading-relaxed">
            Craft. Analyze. Elevate — Your resume deserves to shine ✨
          </p>
          <p className="text-xs text-slate-500 font-medium pt-2">
            Made with ❤️ in India
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3">
            Product
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/resume-upload" className="hover:text-blue-600">
                Resume Analyzer
              </Link>
            </li>
            <li>
              <Link to="/build-resume" className="hover:text-blue-600">
                Build Resume
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-blue-600">
                How It Works
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Resources */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3">
            Resources
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/blog" className="hover:text-blue-600">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-blue-600">
                Support
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-600">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3">
            Contact
          </h3>
          <div className="text-sm text-slate-600 space-y-1">
            <p>Noida / Delhi NCR, India</p>
            <p>Email: support@elevatecv.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 mt-5">
            <a
              href="#"
              className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-pink-600 transition"
            >
              {/* Instagram */}
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="#"
              className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 transition"
            >
              {/* LinkedIn */}
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              href="#"
              className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-black transition"
            >
              {/* GitHub */}
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200"></div>

      <div className="text-center py-2 px-4 text-xs md:text-sm text-slate-600 space-y-1">
        <p>© {new Date().getFullYear()} ElevateCV — All Rights Reserved.</p>
        <p className="font-medium">
          Authors: Ramdeep Kesharwani • Vikas Chaurasia • Vivek Ranjan
        </p>
      </div>
    </footer>
  );
};

export default Footer;
