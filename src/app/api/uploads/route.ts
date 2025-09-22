import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdminClient, supabaseRouteClient } from '@/lib/supabase';

const BUCKET_NAME = 'print-uploads';

export async function POST(request: Request) {
  const supabase = supabaseRouteClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: userError?.message ?? 'Unauthorized' },
      { status: 401 },
    );
  }

  const payload = await request.json().catch(() => ({}));
  const fileExtension = typeof payload?.extension === 'string' ? payload.extension : 'jpg';
  const contentType = typeof payload?.contentType === 'string' ? payload.contentType : 'image/jpeg';

  const objectPath = `${user.id}/${Date.now()}-${randomUUID()}.${fileExtension}`;

  const admin = supabaseAdminClient();
  const { data, error } = await admin.storage
    .from(BUCKET_NAME)
    .createSignedUploadUrl(objectPath);

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to create upload URL' },
      { status: 400 },
    );
  }

  return NextResponse.json({
    uploadUrl: data.signedUrl,
    path: data.path,
    contentType,
  });
}
