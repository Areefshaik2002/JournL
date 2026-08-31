import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    name: string
  }
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.split(' ')[1])

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key'
    const decoded = jwt.verify(token, secret) as {
      userId: string
      email: string
      name: string
    }
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
