import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdminClient, supabaseRouteClient } from '@/lib/supabase';

const BUCKET_NAME = 'print-uploads';

async function ensureBucket() {
  const admin = supabaseAdminClient();
  const { data: bucket } = await admin.storage.getBucket(BUCKET_NAME);

  if (bucket) return admin;

  const { error } = await admin.storage.createBucket(BUCKET_NAME, {
    public: false,
    fileSizeLimit: 50 * 1024 * 1024, // 50 MB per upload
  });

  if (error && !error.message.includes('already exists')) {
    throw error;
  }

  return admin;
}

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

  try {
    const admin = await ensureBucket();
    const objectPath = `${user.id}/${Date.now()}-${randomUUID()}.${fileExtension}`;

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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Storage error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
