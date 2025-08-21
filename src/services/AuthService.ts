"use client";

import { api } from "@/lib/api";
import type { AuthResponse, RegisterResponse } from "@/lib/types";

export type RegistrasiRequest = {
  username: string;
  password: string;
};

export async function login(data: { username: string; password: string }) {
  const res = await api.post<AuthResponse>("/auth/login", data);
  if (typeof window !== "undefined") {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res.data;
}

export async function register(payload: RegistrasiRequest) {
  try {
    const res = await api.post<RegisterResponse>("/auth/register", payload);

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(res.data));
    }

    return res.data;
  } catch (err: any) {
    // lempar error agar bisa ditangkap di frontend
    throw new Error(
      err.response?.data?.message || "Registrasi gagal. Silakan coba lagi.",
    );
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/sign-in";
  }
}
