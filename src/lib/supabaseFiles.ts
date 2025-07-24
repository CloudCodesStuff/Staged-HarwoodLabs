import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_BUCKET = 'main';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type SupabaseFile = {
  name: string;
  path: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: any;
};

// Upload a file to a client/project folder, optionally public
export async function uploadFile(
  clientId: string,
  file: File,
  isPublic = false
): Promise<{ path: string }> {
  // Enforce 1MB per file
  if (file.size > 1024 * 1024) {
    throw new Error('File size must be less than 1MB');
  }
  // Enforce max 3 files per project
  const existing = await listFiles(clientId);
  if (existing.length >= 3) {
    throw new Error('Maximum 3 files allowed per project');
  }
  const filePath = `${clientId}/${file.name}`;
  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, file, {
      upsert: true,
    });
  if (error) throw error;
  // No-op for isPublic: Supabase Storage manages public/private via bucket policy, not per-file ACL
  return { path: filePath };
}

// List all files for a client/project
export async function listFiles(clientId: string): Promise<SupabaseFile[]> {
  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .list(clientId, { limit: 100, offset: 0 });
  if (error) throw error;
  // Map FileObject[] to SupabaseFile[] with path
  return (data || []).map((f) => ({ ...f, path: `${clientId}/${f.name}` }));
}

// Get a signed URL for preview/download (expires in 1 hour)
export async function getSignedUrl(
  path: string,
  isPublic = false
): Promise<string> {
  if (isPublic) {
    // Public files can be accessed directly
    return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`;
  }
  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .createSignedUrl(path, 60 * 60); // 1 hour
  if (error) throw error;
  return data?.signedUrl || '';
}

// Delete a file by path
export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([path]);
  if (error) throw error;
}
