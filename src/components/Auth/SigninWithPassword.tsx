"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import InputGroup from "../FormElements/InputGroup";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/AuthService";
import type { AuthResponse } from "@/lib/types";

export default function LoginForm() {
  const router = useRouter();

  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res: AuthResponse = await login({
        username: data.username,
        password: data.password,
      });

      // simpan token / user info ke localStorage
      localStorage.setItem("user", JSON.stringify(res));

      // redirect ke dashboard
      router.push("/article");
    } catch (err: any) {
      setError("Login gagal, periksa username & password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="text"
        label="Username"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your username"
        name="username"
        handleChange={handleChange}
        value={data.username}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-70"
        >
          {loading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Sign in"
          )}
        </button>
      </div>
    </form>
  );
}
