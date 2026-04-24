import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, uploadProfileImageApi } from "../lib/api"; // <- use api.js!
import toast from "react-hot-toast";

const EditProfile = () => {
  const navigate = useNavigate();
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", role: "", company: "", contactNumber: "", profileImage: "",
    bio: "", location: "", website: "", linkedin: "", github: "", skills: "",
    university: "", degree: "", graduationYear: "", experience: "", jobTitle: ""
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
          name: user.name || "", email: user.email || "", role: user.role || "",
          company: user.company || "", contactNumber: user.contactNumber || "", profileImage: user.profileImage || "",
          bio: user.bio || "", location: user.location || "", website: user.website || "",
          linkedin: user.linkedin || "", github: user.github || "", skills: user.skills ? user.skills.join(", ") : "",
          university: user.university || "", degree: user.degree || "", graduationYear: user.graduationYear || "",
          experience: user.experience || "", jobTitle: user.jobTitle || ""
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
        name: form.name, company: form.company, contactNumber: form.contactNumber, profileImage: form.profileImage, role: form.role,
        bio: form.bio, location: form.location, website: form.website, linkedin: form.linkedin, github: form.github,
        skills: form.skills ? form.skills.split(",").map(s => s.trim()) : [],
        university: form.university, degree: form.degree, graduationYear: form.graduationYear, experience: form.experience, jobTitle: form.jobTitle
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
    <div className="min-h-screen bg-slate-950 text-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
              Profile Settings
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage your personal and professional identity</p>
          </div>
          <button onClick={() => navigate("/dashboard")} className="px-4 py-2 rounded-full text-sm border border-slate-700 text-slate-400 hover:bg-slate-800 transition cursor-pointer">
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
            <span className="text-xl">⚠️</span> {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-3">
            <span className="text-xl">✅</span> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Info */}
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <span className="text-indigo-400">01.</span> Basic Information
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
              {/* Avatar Uploader */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-slate-800 border-2 border-indigo-500/30 overflow-hidden mb-4 relative group flex items-center justify-center text-4xl text-slate-600 shadow-xl">
                  {form.profileImage ? (
                    <img
                      src={form.profileImage.startsWith("http") ? form.profileImage : `http://localhost:5000${form.profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : "👤"}
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-xs font-medium text-white px-3 py-1 bg-indigo-600 rounded-full">
                      {uploadingImage ? "Uploading..." : "Change Photo"}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                  </label>
                </div>
                <div className="text-xs text-slate-500 text-center max-w-[120px]">
                  Click to upload a new profile picture
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grow grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                  <input name="email" value={form.email} readOnly type="email" className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-slate-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Role</label>
                  <input name="role" value={form.role} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder="e.g. Student, Developer" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input name="contactNumber" value={form.contactNumber} onChange={handleChange} type="tel" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder="+1 (234) 567-890" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">About Me / Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none" placeholder="Write a short, engaging bio..." />
              </div>
            </div>
          </div>

          {/* Section: Professional Details */}
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <span className="text-cyan-400">02.</span> Professional Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Job Title</label>
                <input name="jobTitle" value={form.jobTitle} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" placeholder="e.g. Frontend Engineer" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Company</label>
                <input name="company" value={form.company} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" placeholder="e.g. Google" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                <input name="location" value={form.location} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" placeholder="e.g. San Francisco, CA" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Years of Experience</label>
                <input name="experience" value={form.experience} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" placeholder="e.g. 5+ Years" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Top Skills (Comma Separated)</label>
                <input name="skills" value={form.skills} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" placeholder="e.g. React, Node.js, TypeScript" />
              </div>
            </div>
          </div>

          {/* Section: Education & Socials */}
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <span className="text-pink-400">03.</span> Education & Links
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">University / College</label>
                <input name="university" value={form.university} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors" placeholder="e.g. Stanford University" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Degree</label>
                <input name="degree" value={form.degree} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors" placeholder="e.g. B.S. Computer Science" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Graduation Year</label>
                <input name="graduationYear" value={form.graduationYear} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors" placeholder="e.g. 2024" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-slate-800/60">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">LinkedIn URL</label>
                <input name="linkedin" value={form.linkedin} onChange={handleChange} type="url" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors" placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">GitHub URL</label>
                <input name="github" value={form.github} onChange={handleChange} type="url" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors" placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Personal Website</label>
                <input name="website" value={form.website} onChange={handleChange} type="url" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors" placeholder="https://..." />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="group relative px-8 py-4 rounded-xl text-sm font-bold text-white shadow-xl overflow-hidden cursor-pointer hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 transition-transform duration-500 group-hover:scale-105" />
              <span className="relative flex items-center gap-2">
                {saving ? "Saving Changes..." : "Save All Changes"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
