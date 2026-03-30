// pages/api/my-reports/verify.js
// Verifies the JWT token from a magic link and returns the email.

const JWT_SECRET = process.env.FCM_PIPELINE_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token required' });
  }

  if (!JWT_SECRET) {
    console.error('[my-reports/verify] FCM_PIPELINE_SECRET not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const jwt = (await import('jsonwebtoken')).default;
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.purpose !== 'my_reports') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.status(200).json({ email: decoded.email });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Link expired. Please request a new one.' });
    }
    return res.status(401).json({ error: 'Invalid link. Please request a new one.' });
  }
}
