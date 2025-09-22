'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase';

export function SiteHeader() {
  const [status, setStatus] = useState<'loading' | 'signed-in' | 'signed-out'>('loading');
  const [email, setEmail] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = supabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setStatus('signed-in');
        setEmail(data.user.email ?? null);
      } else {
        setStatus('signed-out');
        setEmail(null);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setStatus('signed-in');
        setEmail(session.user.email ?? null);
      } else {
        setStatus('signed-out');
        setEmail(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await supabaseBrowserClient().auth.signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="border-b border-slate-900/60 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-100">
          AI Print Analyzer
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link
            href="https://github.com/myles1663/ai-print-analyzer-web"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-slate-100"
          >
            GitHub
          </Link>

          {status === 'loading' && <span className="text-slate-500">Checking session…</span>}

          {status === 'signed-out' && (
            <Link
              href="/login"
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 font-medium text-slate-100 transition hover:border-slate-500 hover:text-white"
            >
              Sign in
            </Link>
          )}

          {status === 'signed-in' && (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-slate-400 sm:inline">
                {email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 font-medium text-slate-100 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
