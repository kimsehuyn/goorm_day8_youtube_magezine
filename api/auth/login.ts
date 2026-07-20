import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  getRoleFromToken,
  isReaderAuthConfigured,
  loginWithSecretKey,
  logoutSession,
} from '../../server/lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      if (!isReaderAuthConfigured()) {
        res.status(503).json({ error: 'Reader authentication is not configured' })
        return
      }
      const secretKey = String(req.body?.secretKey || '')
      const session = loginWithSecretKey(secretKey)
      if (!session) {
        res.status(401).json({ error: 'Invalid access key' })
        return
      }
      res.json(session)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
    return
  }

  if (req.method === 'GET') {
    const role = getRoleFromToken(req.headers.authorization)
    res.json({ role, authenticated: role !== null })
    return
  }

  if (req.method === 'DELETE') {
    logoutSession(req.headers.authorization)
    res.json({ ok: true })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
