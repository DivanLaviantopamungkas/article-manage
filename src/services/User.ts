// lib/services/user.ts
import { api } from "@/lib/api";

export type UserData = {
  id: string;
  username: string;
  role: string;
};

export const getCurrentUser = async (): Promise<UserData | null> => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user) as UserData;
  }

  // fallback: ambil dari API kalau token ada
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const res = await api.get<{ data: UserData }>("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      console.error("Gagal ambil user dari API:", err);
      return null;
    }
  }

  return null;
};
