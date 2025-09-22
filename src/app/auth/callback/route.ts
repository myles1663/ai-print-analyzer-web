import { NextResponse } from 'next/server';
import { supabaseRouteClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = supabaseRouteClient();
    await supabase.auth.exchangeCodeForSession(code);

    await fetch(new URL('/api/auth/profile', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({}),
    });
  }

  const redirectUrl = new URL('/login?status=confirmed', request.url);
  return NextResponse.redirect(redirectUrl);
}
