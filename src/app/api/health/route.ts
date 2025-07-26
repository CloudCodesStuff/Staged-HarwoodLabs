// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg'; // For PostgreSQL
import Stripe from 'stripe';

const START_TIME = Date.now(); // uptime reference

// PostgreSQL setup (update with your env vars)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Stripe setup (optional)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

export async function GET() {
  const uptime = `${Math.floor((Date.now() - START_TIME) / 1000)}s`;
  const result: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime,
    checks: {
      database: 'pending',
      stripe: 'pending',
      firebase: 'skipped',
    },
  };

  // ✅ Check PostgreSQL
  try {
    const client = await pool.connect();
    await client.query('SELECT 1'); // basic query
    client.release();
    result.checks.database = 'ok';
  } catch (err) {
    result.checks.database = 'fail';
    result.status = 'degraded';
  }

  // ✅ Check Stripe
  try {
    await stripe.balance.retrieve();
    result.checks.stripe = 'ok';
  } catch (err) {
    result.checks.stripe = 'fail';
    result.status = 'degraded';
  }

  // ✅ Optionally: Firebase check
  // Uncomment if using Firebase Admin SDK
  /*
  import { getApps, getApp } from 'firebase-admin/app';
  try {
    const firebaseApp = getApps().length ? getApp() : initializeApp();
    await firebaseApp.auth().getUser('test-user-id');
    result.checks.firebase = 'ok';
  } catch (err) {
    result.checks.firebase = 'fail';
    result.status = 'degraded';
  }
  */

  const statusCode = result.status === 'ok' ? 200 : 503;
  return NextResponse.json(result, { status: statusCode });
}
