/**
 * FCM Intelligence — Pro Session Management
 * 
 * Stripe-gated auth: subscriber enters email → we verify against
 * insider_subscribers (tier='pro', status='active') → set httpOnly cookie.
 * 
 * No passwords, no OAuth. The Stripe subscription IS the auth.
 * 
 * Usage:
 *   Server-side: import { verifyProSession, createProSession } from '@/lib/pro-session'
 */

import { createClient } from '@supabase/supabase-js';
import { serialize, parse } from 'cookie';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const COOKIE_NAME = 'fcm_pro_session';
const SESSION_TTL_HOURS = 72; // 3 days before re-verification

/**
 * Create a session token for a verified Pro subscriber.
 * Token = HMAC(subscriber_id + timestamp, secret)
 */
function generateToken(subscriberId) {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY; // reuse as HMAC secret
  const timestamp = Date.now().toString();
  const payload = `${subscriberId}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

/**
 * Parse and validate a session token.
 * Returns { subscriberId, timestamp } or null.
 */
function parseToken(token) {
  try {
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [subscriberId, timestamp, hmac] = decoded.split(':');
    
    // Verify HMAC
    const expectedHmac = crypto.createHmac('sha256', secret)
      .update(`${subscriberId}:${timestamp}`)
      .digest('hex');
    
    if (hmac !== expectedHmac) return null;
    
    // Check expiry
    const age = Date.now() - parseInt(timestamp);
    if (age > SESSION_TTL_HOURS * 60 * 60 * 1000) return null;
    
    return { subscriberId, timestamp: parseInt(timestamp) };
  } catch {
    return null;
  }
}

/**
 * Verify email is an active Pro subscriber.
 * Returns subscriber row or null.
 */
export async function verifyProEmail(email) {
  if (!email) return null;
  
  const { data, error } = await supabase
    .from('insider_subscribers')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .eq('tier', 'pro')
    .eq('status', 'active')
    .single();
  
  if (error || !data) return null;
  return data;
}

/**
 * Create a Pro session. Returns the Set-Cookie header value.
 */
export function createProSession(subscriberId) {
  const token = generateToken(subscriberId);
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_HOURS * 60 * 60,
  });
}

/**
 * Verify an existing Pro session from request cookies.
 * Returns the subscriber row or null.
 */
export async function verifyProSession(req) {
  // Parse cookies from request
  const cookies = typeof req.cookies === 'object' 
    ? req.cookies 
    : parse(req.headers?.cookie || '');
  
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  
  const parsed = parseToken(token);
  if (!parsed) return null;
  
  // Fetch subscriber and verify still active Pro
  const { data, error } = await supabase
    .from('insider_subscribers')
    .select('*')
    .eq('id', parsed.subscriberId)
    .eq('tier', 'pro')
    .eq('status', 'active')
    .single();
  
  if (error || !data) return null;
  return data;
}

/**
 * Clear the Pro session. Returns the Set-Cookie header value.
 */
export function clearProSession() {
  return serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Get subscriber from Next.js App Router cookies.
 * For use in server components / route handlers.
 */
export async function getProSubscriberFromCookies(cookieStore) {
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie?.value) return null;
  
  const parsed = parseToken(sessionCookie.value);
  if (!parsed) return null;
  
  const { data } = await supabase
    .from('insider_subscribers')
    .select('*')
    .eq('id', parsed.subscriberId)
    .eq('tier', 'pro')
    .eq('status', 'active')
    .single();
  
  return data || null;
}
