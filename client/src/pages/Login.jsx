import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/api";
import ErrorBox from "../components/ErrorBox";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Both fields are required.");
      toast.error("Both fields are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(form);
      if (result?.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user || {}));
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        setError(result?.message || "Login failed.");
        toast.error(result?.message || "Login failed.");
      }
    } catch (err) {
      setError(err.message || "Login failed.");
      toast.error(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-40 md:pt-48 pb-10 px-4 bg-linear-to-br from-[#f5f3ff] via-[#e0f2fe] to-[#fde1ff]">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Title */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-[#4f46e5] via-[#6366f1] to-[#ec4899] bg-clip-text text-transparent drop-shadow-sm">
            Log in to ElevateCV
          </h1>
          <p className="text-slate-600 text-sm md:text-base mt-2">
            Continue your journey toward your dream job ✨
          </p>
        </header>

        {/* Form Container */}
        <div className="relative w-full max-w-lg">
          <div className="rounded-3xl p-0.5 bg-linear-to-r from-[#4f46e5]/50 via-[#6366f1]/50 to-[#ec4899]/50 shadow-[0_10px_40px_rgba(99,102,241,0.3)]">
            <div className="rounded-3xl bg-white/95 p-8 backdrop-blur-xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <ErrorBox message={error} />

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="w-full rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide"
                  >
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="w-full rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-semibold text-white text-sm bg-linear-to-r from-[#4f46e5] via-[#6366f1] to-[#ec4899] shadow-[0_8px_24px_rgba(99,102,241,0.3)]
                  hover:brightness-110 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </form>
            </div>
          </div>

          {/* Signup Redirect */}
          <div className="mt-5 text-center">
            <p className="text-slate-600 text-sm">
              New here?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Create an account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
