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

app.use(
  cors({
    origin: [corsOrigin, 'http://localhost:5173', 'http://localhost:5174'],
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