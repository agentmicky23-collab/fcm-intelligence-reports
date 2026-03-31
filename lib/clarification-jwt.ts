import jwt from 'jsonwebtoken';

const SECRET = process.env.FCM_PIPELINE_SECRET || process.env.NEXTAUTH_SECRET;

if (!SECRET) {
  console.warn('Warning: No JWT secret configured (FCM_PIPELINE_SECRET or NEXTAUTH_SECRET)');
}

export interface ClarificationTokenPayload {
  orderId: string;
  email: string;
}

export function signClarificationToken(payload: ClarificationTokenPayload): string {
  if (!SECRET) throw new Error('JWT secret not configured');
  return jwt.sign(payload, SECRET, { expiresIn: '48h' });
}

export function verifyClarificationToken(token: string): ClarificationTokenPayload {
  if (!SECRET) throw new Error('JWT secret not configured');
  const decoded = jwt.verify(token, SECRET) as ClarificationTokenPayload & { exp: number };
  return { orderId: decoded.orderId, email: decoded.email };
}
