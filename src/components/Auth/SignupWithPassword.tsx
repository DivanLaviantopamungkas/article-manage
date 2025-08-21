"use client";

import Link from "next/link";
import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { register } from "@/services/AuthService";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await register(data);

      if (res?.username) {
        // redirect ke login setelah sukses register
        router.push("/sign-in");
      }
    } catch (error: any) {
      // tampilkan error ke UI, misal dengan state
      setError(error.message || "Registrasi gagal, silakan coba lagi.");

      // atau pakai toast library (optional)
      // toast.error(error.message || "Registrasi gagal");
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
            "Sign up"
          )}
        </button>
      </div>
    </form>
  );
}
