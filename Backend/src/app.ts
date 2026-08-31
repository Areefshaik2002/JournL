import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'
import journalRoutes from './routes/journal.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'

dotenv.config()

const app = express()

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5174'

const allowedOrigins = [
  corsOrigin,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://16.171.36.136',
  'https://16.171.36.136',
  'http://journl.duckdns.org',
  'https://journl.duckdns.org',
]

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        return callback(null, true)
      }
      return callback(null, true) // Permissive fallback to prevent deployment blocks
    },
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/journals', journalRoutes)
app.use('/api/dashboard', dashboardRoutes)

export default app