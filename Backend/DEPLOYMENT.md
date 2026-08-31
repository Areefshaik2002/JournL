# JournL Production Build & Deployment Guide

## 1. Environment Configurations

### Backend (`Backend/.env`)
```env
PORT=3001
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_this_for_production
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# AWS DynamoDB
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
USERS_TABLE_NAME=JournL-Users
JOURNALS_TABLE_NAME=JournL-Journals
```

### Frontend (`Frontend/.env.production`)
```env
VITE_API_URL=https://your-backend-api-domain.com/api
```

---

## 2. Deploying Backend (AWS App Runner / Render / Elastic Beanstalk)

1. Set Environment Variables on host service (`NODE_ENV`, `JWT_SECRET`, `CORS_ORIGIN`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
2. Build Command: `npm run build`
3. Start Command: `npm start` (runs `node dist/server.js`)

---

## 3. Deploying Frontend (Vercel)

1. Connect Git repository to **Vercel**.
2. Select Framework Preset: **Vite**.
3. Set Root Directory: `Frontend`.
4. Set Environment Variable: `VITE_API_URL` = `https://your-backend-api-domain.com/api`.
5. Vercel will automatically use `vercel.json` to handle client-side routing.
