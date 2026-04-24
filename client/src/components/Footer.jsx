import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/elevatecv-logo.png";
import { FiInstagram, FiLinkedin, FiGithub, FiTwitter, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-16 pb-8 overflow-hidden border-t border-slate-800">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid gap-12 md:gap-8 lg:grid-cols-12 mb-12">
          {/* Brand & Vision */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="ElevateCV Logo"
                className="h-10 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your career journey starts with the perfect resume. We blend cutting-edge AI analysis with premium design tools to elevate your professional narrative and land your dream job.
            </p>
            <div className="flex gap-4 items-center">
              {[
                { icon: <FiTwitter />, link: "#", color: "hover:text-sky-400 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]" },
                { icon: <FiLinkedin />, link: "#", color: "hover:text-blue-500 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]" },
                { icon: <FiGithub />, link: "#", color: "hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]" },
                { icon: <FiInstagram />, link: "#", color: "hover:text-pink-500 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  className={`h-10 w-10 rounded-full border border-slate-700 bg-slate-900/50 flex items-center justify-center text-slate-400 transition-all duration-300 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Product */}
            <div>
              <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Product
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/resume-upload" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">AI Analyzer</Link></li>
                <li><Link to="/build-resume" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Resume Builder</Link></li>
                <li><Link to="/how-it-works" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">How It Works</Link></li>
                <li><Link to="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Pricing</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Resources
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/blog" className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">Career Blog</Link></li>
                <li><Link to="#" className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">Interview Prep</Link></li>
                <li><Link to="/support" className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">Help Center</Link></li>
                <li><Link to="#" className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">ATS Guide</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span> Legal
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="#" className="hover:text-pink-400 hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-pink-400 hover:translate-x-1 transition-all inline-block">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-pink-400 hover:translate-x-1 transition-all inline-block">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Connect
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <FiMail className="mt-1 flex-shrink-0 text-emerald-500" />
                  <a href="mailto:hello@elevatecv.com" className="hover:text-emerald-400 transition-colors">hello@elevatecv.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 text-emerald-500">📍</span>
                  <span>Noida / Delhi NCR<br/>India</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} <span className="text-slate-300 font-medium">ElevateCV</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <span>Crafted with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>by</span>
            <span className="text-slate-300 font-medium">Ramdeep</span>, 
            <span className="text-slate-300 font-medium">Vikas</span> & 
            <span className="text-slate-300 font-medium">Vivek</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
