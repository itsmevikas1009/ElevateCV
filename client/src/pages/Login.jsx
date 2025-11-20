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
      setError("Please enter email and password.");
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(form);
      if (result?.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user || {}));
        toast.success("Login successful!");
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
    <div className="min-h-screen flex items-center justify-center pt-16 pb-6 px-6">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 leading-tight tracking-tight bg-linear-to-r from-[#7a5cff] via-[#8b84ff] to-[#d88aa6] bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Log In to Continue Your Job Journey
          </p>
        </header>

        <div className="relative w-full max-w-lg">
          <div className="rounded-[34px] p-5 bg-white/60 backdrop-blur-sm shadow-outer ring ring-white/40">
            <div className="bg-white rounded-2xl p-6 shadow-inner-card">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <ErrorBox message={error} />
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-600 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0 focus:shadow-focus-inset"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm text-gray-600 mb-2"
                  >
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 border border-transparent focus:outline-none focus:ring-0 focus:shadow-focus-inset"
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-2 rounded-full text-white font-medium bg-linear-to-r from-[#6B63FF] to-[#7A7CFF] shadow-[0_8px_20px_rgba(123,123,255,0.25)] hover:shadow-[0_10px_24px_rgba(123,123,255,0.35)] transition-all duration-200 disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-[#6f66ff] font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
