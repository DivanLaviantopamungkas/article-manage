// src/utils/authCookies.ts
import { setCookie, deleteCookie, getCookie } from "cookies-next";

type SetAuthCookiesParams = {
  token: string;
  role: string;
  // opsional: masa berlaku (detik) apabila ingin seragam dgn exp JWT
  // kalau tidak ada, pakai maxAge default (misal 7 hari)
  maxAgeSeconds?: number;
};

/**
 * Menulis cookie "token" dan "role" persis dari response API.
 * Selalu overwrite nilai lama agar sama dengan Postman (satu sumber kebenaran).
 */
export function setAuthCookies({
  token,
  role,
  maxAgeSeconds,
}: SetAuthCookiesParams) {
  const baseOptions = {
    path: "/",
    // NOTE: HttpOnly TIDAK bisa diset dari client JS.
    // Jika butuh HttpOnly, lakukan di server (Set-Cookie dari API).
    // Di sini tujuan kita: samakan nilai cookie dengan Postman.
    sameSite: "lax" as const,
    // secure: process.env.NODE_ENV === "production",
    maxAge: maxAgeSeconds ?? 60 * 60 * 24 * 7, // default 7 hari
  };

  // Overwrite selalu (sinkron dengan response terbaru)
  setCookie("token", token, baseOptions);
  setCookie("role", role, baseOptions);
}

/** Hapus cookie saat logout */
export function clearAuthCookies() {
  deleteCookie("token", { path: "/" });
  deleteCookie("role", { path: "/" });
}

/** Helper opsional untuk baca cepat */
export function readAuthCookies() {
  return {
    token: (getCookie("token") ?? "") as string,
    role: (getCookie("role") ?? "") as string,
  };
}
