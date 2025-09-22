'use client';

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmation = searchParams.get("status");
  const supabase = useMemo(() => supabaseBrowserClient(), []);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  };

  const handleContinue = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      router.push("/");
    } else {
      router.refresh();
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-950 px-6 py-10">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-900 bg-slate-950/70 p-8 shadow-xl shadow-slate-950/40">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-slate-100">Sign in</h1>
          <p className="text-sm text-slate-400">
            Use your email to receive a one-time magic link. No passwords to
            remember.
          </p>
        </div>

        {confirmation === "confirmed" && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Login confirmed. You can return to the app now.
            <button
              type="button"
              onClick={handleContinue}
              className="ml-2 rounded border border-emerald-400/60 px-2 py-1 text-xs font-medium text-emerald-100 transition hover:border-emerald-300 hover:text-white"
            >
              Continue
            </button>
          </div>
        )}

        {status === "sent" && (
          <div className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
            Check your inbox for the magic link. Once opened, you will be signed
            in on this device.
          </div>
        )}

        {status === "error" && error && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-300" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-slate-100 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-500"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex w-full items-center justify-center rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Sending link…" : "Send magic link"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500">
          Problems receiving email?
          <a
            href="mailto:support@example.com"
            className="ml-1 underline decoration-slate-600 underline-offset-4 hover:text-slate-300"
          >
            Contact support
          </a>
          .
        </div>

        <div className="text-center text-xs text-slate-500">
          By continuing you agree to our future terms of service and privacy
          policy (coming soon).
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-slate-400 underline-offset-4 transition hover:text-slate-200"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
