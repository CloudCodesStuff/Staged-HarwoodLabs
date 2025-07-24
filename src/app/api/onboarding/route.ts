import { NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { db } from '@/server/db';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Save onboarding info
    await db.userOnboarding.create({
      data: {
        userId: session.user.id,
        role: data.role,
        company: data.company,
        teamSize: data.teamSize,
        workflowStyle: data.workflowStyle,
        primaryGoal: data.primaryGoal,
        completedAt: new Date(),
      },
    });

    // Update user profile to reflect onboarding is complete
    await db.user.update({
      where: { id: session.user.id },
      data: {
        onboarded: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding API Error:', error);
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
}
