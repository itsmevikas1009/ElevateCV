import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../lib/api"; // <- use api.js!
import toast from "react-hot-toast";

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

    if (!form.name || !form.email) {
      setError("Name and email are required.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        company: form.company,
        contactNumber: form.contactNumber,
        profileImage: form.profileImage,
      };

      const data = await updateProfile(payload);
      setSuccessMsg("Profile updated successfully!");
      toast.success("Profile updated successfully!");
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect after a short delay so the user sees the message
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.message || "Update failed");
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-6 px-6">
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
