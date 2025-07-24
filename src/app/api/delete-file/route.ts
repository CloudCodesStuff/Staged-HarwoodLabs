import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
// import { auth } from '@/server/auth';

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

  const { filePath } = await req.json();

  if (!filePath) {
    return NextResponse.json({ error: 'Missing filePath' }, { status: 400 });
  }

  const { error } = await supabase.storage.from('main').remove([filePath]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
