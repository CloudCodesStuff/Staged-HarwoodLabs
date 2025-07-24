import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { authConfig } from '@/server/auth/config';
import { db } from '@/server/db';

// Helper to get user and plan
async function getUserAndPlan() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  const userId = session.user.id;
  const isPro = session.user.stripeSubscriptionStatus === 'active';
  return { userId, isPro };
}

// GET: List file links for a project
export async function GET(req: NextRequest) {
  try {
    const { userId } = await getUserAndPlan();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    if (!projectId)
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    // Only show user's own project links
    const docs = await db.document.findMany({
      where: { projectId, userId, type: 'file-link' },
      orderBy: { createdAt: 'asc' },
      include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    const links = docs.map((doc) => ({
      id: doc.id,
      name: doc.title,
      url: doc.versions[0]?.fileUrl || '',
      createdAt: doc.createdAt,
    }));
    return NextResponse.json(links);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

// POST: Add a new file link
export async function POST(req: NextRequest) {
  try {
    const { userId, isPro } = await getUserAndPlan();
    const { projectId, name, url } = await req.json();
    if (!(projectId && name && url))
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    // Enforce cap for non-pro
    if (!isPro) {
      const count = await db.document.count({
        where: { projectId, userId, type: 'file-link' },
      });
      if (count >= 4)
        return NextResponse.json(
          { error: 'File link limit reached' },
          { status: 403 }
        );
    }
    // Create Document and DocumentVersion
    const doc = await db.document.create({
      data: {
        userId,
        projectId,
        type: 'file-link',
        title: name,
        status: 'active',
        versions: {
          create: [{ fileUrl: url, uploadedBy: userId }],
        },
      },
      include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    return NextResponse.json({
      id: doc.id,
      name: doc.title,
      url: doc.versions[0]?.fileUrl || '',
      createdAt: doc.createdAt,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

// DELETE: Remove a file link by id
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await getUserAndPlan();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    // Only allow deleting user's own file link
    const doc = await db.document.findUnique({ where: { id } });
    if (!doc || doc.userId !== userId || doc.type !== 'file-link') {
      return NextResponse.json(
        { error: 'Not found or unauthorized' },
        { status: 404 }
      );
    }
    await db.documentVersion.deleteMany({ where: { documentId: id } });
    await db.document.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
