import type { Request, Response } from 'express'
import type { AuthRequest } from '../middleware/auth.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { UserService } from '../services/user.service.js'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' })
      }

      const existingUser = await UserService.findByEmail(email)
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' })
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newUser = await UserService.createUser({
        userId: uuidv4(),
        name,
        email: email.toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString(),
      })

      const token = jwt.sign(
        { userId: newUser.userId, email: newUser.email, name: newUser.name },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '7d' }
      )

      res.cookie('token', token, COOKIE_OPTIONS)

      return res.status(201).json({
        user: {
          userId: newUser.userId,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
        token,
      })
    } catch (error) {
      console.error('Registration error:', error)
      return res.status(500).json({ message: 'Server error during registration' })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
      }

      const user = await UserService.findByEmail(email)
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { userId: user.userId, email: user.email, name: user.name },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '7d' }
      )

      res.cookie('token', token, COOKIE_OPTIONS)

      return res.json({
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      })
    } catch (error) {
      console.error('Login error:', error)
      return res.status(500).json({ message: 'Server error during login' })
    }
  }

  static async logout(_req: Request, res: Response) {
    res.clearCookie('token', COOKIE_OPTIONS)
    return res.json({ message: 'Logged out successfully' })
  }

  static async me(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' })
    }
    const user = await UserService.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({
      userId: user.userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    })
  }
}
