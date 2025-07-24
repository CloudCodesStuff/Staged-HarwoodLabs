import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!(session && session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const clientId = formData.get('clientId') as string;

  if (!(file && clientId)) {
    return NextResponse.json(
      { error: 'Missing file or clientId' },
      { status: 400 }
    );
  }

  const isSubscribed = session.user.stripeSubscriptionStatus === 'active';
  const fileSizeLimit = isSubscribed ? 20 * 1024 * 1024 : 1 * 1024 * 1024; // 20MB for subscribed, 1MB for free
  const fileSizeLimitText = isSubscribed ? '20MB' : '1MB';

  if (file.size > fileSizeLimit) {
    return NextResponse.json(
      { error: `File size must be less than ${fileSizeLimitText}` },
      { status: 400 }
    );
  }

  const { data: existing, error: listError } = await supabase.storage
    .from('main')
    .list(clientId);

  if (listError) {
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
  if ((existing?.length || 0) >= 3) {
    return NextResponse.json(
      { error: 'Maximum 3 files allowed per project' },
      { status: 400 }
    );
  }

  const filePath = `${clientId}/${file.name}`;
  const { error } = await supabase.storage
    .from('main')
    .upload(filePath, file, { upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, path: filePath });
}
