import Link from "next/link";
import { supabaseServerClient } from "@/lib/supabase";

export default async function Home() {
  const supabase = supabaseServerClient();

  const [{ count, error }, { data: { user } }] = await Promise.all([
    supabase.from("profiles").select("*", { head: true, count: "exact" }),
    supabase.auth.getUser(),
  ]);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
        <section className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            AI Print Analyzer
          </h1>
          <p className="text-slate-300">
            Live firmware diagnostics for your FDM printer. Upload photos, log
            machine settings, and receive data-backed fixes powered by
            open-source AI models.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="rounded-full bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-white"
            >
              {user ? "Go to dashboard" : "Sign in to start"}
            </Link>
            <Link
              href="https://github.com/myles1663/ai-print-analyzer-web"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:text-white"
            >
              View roadmap
            </Link>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <h2 className="font-medium text-slate-100">Supabase status</h2>
            <p className="mt-1">
              {error ? (
                <span className="text-rose-400">
                  Unable to reach Supabase: {error.message}
                </span>
              ) : (
                <span>
                  Connected. Profiles stored: <strong>{count ?? 0}</strong>
                </span>
              )}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Profiles are now created automatically after you sign in.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-100">
            Next implementation steps
          </h2>
          <ol className="space-y-3 text-slate-300">
            <li className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
              <span className="font-medium text-slate-100">Auth & profiles</span>
              <p className="mt-1 text-sm text-slate-400">
                Connect Supabase Auth so users can sign in and populate the
                <code className="mx-1 rounded bg-slate-800 px-1 py-0.5">profiles</code>
                table.
              </p>
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
              <span className="font-medium text-slate-100">Upload workflow</span>
              <p className="mt-1 text-sm text-slate-400">
                Build the photo upload pipeline and metadata form for printer
                settings.
              </p>
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
              <span className="font-medium text-slate-100">AI recommendations</span>
              <p className="mt-1 text-sm text-slate-400">
                Call the Hugging Face and Cohere/Mistral APIs to translate
                failures into actionable fixes.
              </p>
            </li>
          </ol>
          <div className="text-sm text-slate-400">
            Track work in
            <Link
              className="ml-1 underline decoration-slate-600 underline-offset-4 hover:text-slate-200"
              href="https://github.com/myles1663/ai-print-analyzer-web/blob/main/NOTES.md"
              target="_blank"
              rel="noreferrer"
            >
              NOTES.md
            </Link>
            .
          </div>
        </section>
      </div>
    </main>
  );
}
