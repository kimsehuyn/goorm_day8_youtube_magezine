import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getRoleFromToken } from '../../server/lib/auth.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const role = getRoleFromToken(req.headers.authorization)
  res.json({ role, authenticated: role !== null })
}
