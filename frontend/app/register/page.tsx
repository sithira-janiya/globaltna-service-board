"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const data = await registerUser({ name, email, password });

      localStorage.setItem("service_board_token", data.token);
      localStorage.setItem("service_board_user", JSON.stringify(data.user));

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <Link href="/" className="text-sm font-semibold text-indigo-600">
            ← Back to Service Board
          </Link>

          <h1 className="mt-6 text-3xl font-black text-slate-950">
            Create account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Register to manage service requests.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Name
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Sithira Janiya"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-600">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
