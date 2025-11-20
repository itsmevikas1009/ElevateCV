import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../lib/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.password) {
      setError("Please fill name, email and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // backend should return token
      if (result?.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user || {}));
      }

      // success: redirect or show message
      navigate("/dashboard"); // change to where you want
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-6 px-6">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <header className="text-center mb-8">
          <h1 className="md:text-5xl text-4xl font-bold mb-2 leading-tight tracking-tight bg-gradient-to-r from-[#7a5cff] via-[#8b84ff] to-[#d88aa6] bg-clip-text text-transparent">
            Create your Account
          </h1>
          <p className="text-gray-600 text-lg">
            It’s totally free and super easy
          </p>
        </header>

        <div className="relative w-full max-w-lg">
          <div className="rounded-[34px] p-5 bg-white/60 backdrop-blur-sm shadow-outer ring ring-white/40">
            <div className="bg-white rounded-2xl p-6 shadow-inner-card">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter your name"
                    className="w-full rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 border border-transparent focus:outline-none focus:ring-0 focus:shadow-focus-inset"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 border border-transparent focus:outline-none focus:ring-0 focus:shadow-focus-inset"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Password *
                  </label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 border border-transparent focus:outline-none focus:ring-0 focus:shadow-focus-inset"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-2 rounded-full text-white font-medium bg-gradient-to-r from-[#6B63FF] to-[#7A7CFF] shadow-[0_8px_20px_rgba(123,123,255,0.25)] hover:shadow-[0_10px_24px_rgba(123,123,255,0.35)] transition-all duration-200 disabled:opacity-60"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-[#6f66ff] font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
