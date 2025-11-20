import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../lib/auth";

const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    contactNumber: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const user = res.user || {};
        setForm({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "",
          company: user.company || "",
          contactNumber: user.contactNumber || "",
          profileImage: user.profileImage || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Save updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg("");

    // basic validation
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      setSaving(false);
      return;
    }

    try {
      // Build payload matching backend fields
      const payload = {
        name: form.name,
        company: form.company,
        contactNumber: form.contactNumber,
        profileImage: form.profileImage,
      };

      const data = await updateProfile(payload); // uses request helper to call PATCH /api/auth/profile

      setSuccessMsg("Profile updated successfully!");
      // Update cached user info
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect after a short delay so the user sees the message
      setTimeout(() => navigate("/dashboard"), 1100);
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-[#7a5cff] to-[#d88aa6] text-transparent bg-clip-text">
          Edit Profile
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
            {successMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none"
              placeholder="Enter your name"
            />
          </div>

          {/* Email (read-only by default) */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed outline-none"
              placeholder="Enter your email"
              readOnly
            />
            <p className="text-xs text-gray-400 mt-1">
              To change email, please contact support or update it from account
              settings.
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none"
              placeholder="e.g., Student, Developer, Mentor"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Company</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none"
              placeholder="Company Name"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Contact Number
            </label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              type="tel"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none"
              placeholder="Phone number"
            />
          </div>

          {/* Profile Image URL (optional) */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Profile Image URL
            </label>
            <input
              name="profileImage"
              value={form.profileImage}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none"
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-xs text-gray-400 mt-1">
              Or leave blank to keep current avatar.
            </p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#6B63FF] to-[#7A7CFF] shadow-lg hover:shadow-xl transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
