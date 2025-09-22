import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const supabase = supabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: userError?.message ?? 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const displayName = typeof body?.displayName === 'string' ? body.displayName : null;

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      display_name: displayName ?? user.email,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
