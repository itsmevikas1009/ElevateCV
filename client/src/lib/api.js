const API_BASE = "http://localhost:5000/api";

export async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  let headers = { ...(options.headers || {}) };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const message = data?.message || data?.error || "Request failed";
    throw new Error(message);
  }
  return data;
}

export async function register({ name, email, password, company, role }) {
  return await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, company, role }),
  });
}

export async function login({ email, password }) {
  return await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getProfile() {
  return await request("/auth/profile", { method: "GET" });
}

export async function updateProfile(payload) {
  return await request("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function uploadResume({ file, companyName, jobTitle, jobDescription }) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("companyName", companyName);
  formData.append("jobTitle", jobTitle);
  formData.append("jobDescription", jobDescription);

  return await request("/resume/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getResumeById(id) {
  return await request(`/resume/${id}`, { method: "GET" });
}

export async function deleteResumeById(id) {
  return await request(`/resume/${id}`, { method: "DELETE" });
}
