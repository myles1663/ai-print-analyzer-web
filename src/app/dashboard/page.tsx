import { redirect } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase";
import { UploadForm } from "@/components/upload-form";

export default async function DashboardPage() {
  const supabase = supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <section className="space-y-1">
          <h1 className="text-3xl font-semibold">Upload a print</h1>
          <p className="text-sm text-slate-400">
            Start a new analysis by sending a photo of the failed or rough print.
            Metadata capture and AI insights are coming in the next iteration.
          </p>
        </section>

        <UploadForm />

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400">
          <p>
            The upload saves directly into the Supabase `{`print-uploads`}` bucket
            under your user ID. We will soon attach printer settings and kick off
            AI analysis automatically.
          </p>
        </div>
      </div>
    </main>
  );
}
