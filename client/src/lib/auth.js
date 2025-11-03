// src/lib/auth.js
import { create } from "zustand"; // <-- use named import

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  init: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const resp = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        set({ user: data.user, token });
      } else {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      }
    } catch (err) {
      console.error("auth init error", err);
    }
  },
  setUser: (user, token) => {
    if (token) localStorage.setItem("token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
