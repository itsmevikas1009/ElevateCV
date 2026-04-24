const API_BASE = "http://localhost:5000/api";

function clearAuthAndRedirect() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  if (window.location.pathname !== "/signin") {
    window.location.href = "/signin";
  }
}

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
  const data = contentType.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) {
    const message = data?.message || data?.error || "Request failed";

    if (res.status === 401) {
      clearAuthAndRedirect();
      throw new Error("Session expired. Please sign in again.");
    }

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
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  clearAuthAndRedirect();
}

export async function uploadResume({
  file,
  companyName,
  jobTitle,
  jobDescription,
}) {
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

export async function deleteUserById(id) {
  return await request(`/admin/users/${id}`, { method: "DELETE" });
}

export async function uploadProfileImageApi(file) {
  const formData = new FormData();
  formData.append("image", file);

  return await request("/auth/profile/image", {
    method: "POST",
    body: formData,
  });
}


// 🆕 Download report PDF
export async function downloadReportPdf(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/resume/${id}/report/pdf`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthAndRedirect();
      throw new Error("Session expired. Please sign in again.");
    }

    const text = await res.text();
    throw new Error(text || "Failed to download report PDF.");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `elevatecv-report-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
