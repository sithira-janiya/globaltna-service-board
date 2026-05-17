"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-950">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.35em] text-indigo-600">
          Service Board
        </p>

        <h1 className="text-3xl font-black">Login</h1>

        <p className="mt-2 text-slate-600">
          Login as a homeowner or tradesperson to manage service requests.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-bold text-slate-700">Email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/register")}
          className="mt-5 w-full rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
        >
          Create an account
        </button>
      </div>
    </main>
  );
}
