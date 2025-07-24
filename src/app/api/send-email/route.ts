import InviteToProjectEmail from '@/emails/invite';
import { env } from '@/env';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const { to, projectName, portalId } = await req.json();
  if (!to || !projectName || !portalId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Staged <hi@mail.arclabsllc.com>',
      to,
      subject: "You're invited to a portal on Staged!",
      react: InviteToProjectEmail({ inviteeEmail: to, projectName, portalId }),
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send email' }, { status: 500 });
  }
} 