"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("sithira@example.com");
  const [password, setPassword] = useState("Sithira123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const data = await loginUser({ email, password });

      localStorage.setItem("service_board_token", data.token);
      localStorage.setItem("service_board_user", JSON.stringify(data.user));

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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

          <h1 className="mt-6 text-3xl font-black text-slate-950">Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Log in to create, update, and delete service requests.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            No account?{" "}
            <Link href="/register" className="font-semibold text-indigo-600">
              Create one
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
