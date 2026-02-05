# ✅ Vercel Deployment Requirements

Quick reference for deploying to Vercel.

## 📋 Required Items

### 1. **Vercel Account** (Free)
- Sign up at [vercel.com](https://vercel.com)
- Connect GitHub/GitLab account

### 2. **GitHub Repository**
- Code pushed to GitHub (public or private)

### 3. **PostgreSQL Database**
- Already configured (Aiven, Supabase, Railway, etc.)
- Must be accessible from internet

### 4. **Google OAuth Setup**
- Google Cloud Console project
- OAuth 2.0 credentials created
- Redirect URIs configured

### 5. **Environment Variables** (Set in Vercel Dashboard)

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | ✅ Yes | `postgresql://user:pass@host:port/db?sslmode=require` |
| `NEXTAUTH_URL` | ✅ Yes | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | ✅ Yes | Generate: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | ✅ Yes | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | ✅ Yes | `GOCSPX-xxx` |
| `NODE_TLS_REJECT_UNAUTHORIZED` | ⚠️ Optional | `0` (if using self-signed SSL) |

## 🚀 Quick Deploy Steps

1. **Push code to GitHub**
2. **Go to vercel.com** → Add New Project
3. **Import GitHub repository**
4. **Add environment variables** in Vercel dashboard
5. **Click Deploy**
6. **Update Google OAuth** redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/google`
7. **Update `NEXTAUTH_URL`** to your Vercel URL

## ⚙️ Configuration Notes

- ✅ **No Docker needed** - Vercel handles everything
- ✅ **No `next.config.ts` changes needed** - Works as-is
- ✅ **Prisma auto-generates** during build
- ✅ **Automatic SSL** certificates
- ✅ **Free custom domains** (up to 50 per project)

## 📝 Code Changes Needed

**None!** Your code is already Vercel-ready. Just:
- Ensure `.env` is in `.gitignore` ✅ (already done)
- Push to GitHub
- Configure environment variables in Vercel

## 🔗 Important URLs to Update

After deployment, update:
1. **Vercel Environment Variable**: `NEXTAUTH_URL` → Your Vercel URL
2. **Google OAuth**: Add redirect URI → `https://your-app.vercel.app/api/auth/callback/google`

## 📚 Full Guide

See [VERCEL.md](./VERCEL.md) for complete step-by-step instructions.
