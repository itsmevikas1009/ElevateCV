import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, uploadProfileImageApi } from "../lib/api"; // <- use api.js!
import toast from "react-hot-toast";

const EditProfile = () => {
  const navigate = useNavigate();
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const res = await uploadProfileImageApi(file);
      if (res?.user) {
        // update local form state
        setForm((prev) => ({
          ...prev,
          profileImage: res.user.profileImage || prev.profileImage,
        }));
        localStorage.setItem("user", JSON.stringify(res.user));
        toast.success("Profile picture updated!");
      } else {
        toast.error(res?.message || "Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

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
        role: form.role, // <-- add this
      };

      const data = await updateProfile(payload);
      setSuccessMsg("Profile updated successfully!");
      toast.success("Profile updated successfully!");
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

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
        <h1 className="text-3xl font-semibold mb-6 bg-linear-to-r from-[#7a5cff] to-[#d88aa6] text-transparent bg-clip-text">
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
              Profile Image
            </label>

            {/* URL input */}
            <input
              name="profileImage"
              value={form.profileImage}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none mb-2"
              placeholder="Paste image URL (e.g., LinkedIn photo link)"
            />

            {/* OR line */}
            <div className="flex items-center gap-2 my-2">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">
                or upload from device
              </span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* File upload */}
            <label className="inline-flex items-center gap-2 text-xs text-indigo-600 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFileChange}
              />
              <span className="px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition">
                {uploadingImage ? "Uploading..." : "Choose Image"}
              </span>
            </label>

            {/* Preview */}
            {form.profileImage && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200">
                  <img
                    src={
                      form.profileImage.startsWith("http")
                        ? form.profileImage
                        : `http://localhost:5000${form.profileImage}`
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  Preview of your profile picture
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl text-white font-medium bg-linear-to-r from-[#6B63FF] to-[#7A7CFF] shadow-lg hover:shadow-xl transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
