# 🚀 Vercel Deployment Guide

Complete guide for deploying the Valentine App to Vercel.

## ✅ Requirements

### 1. **Vercel Account**
- Sign up at [vercel.com](https://vercel.com) (free)
- Connect your GitHub/GitLab/Bitbucket account

### 2. **GitHub Repository**
- Push your code to GitHub (required for automatic deployments)
- Repository can be public or private

### 3. **PostgreSQL Database**
- Already have a PostgreSQL database (Aiven, Supabase, Railway, etc.)
- Database must be accessible from the internet (not localhost)

### 4. **Google OAuth Credentials**
- Google Cloud Console project
- OAuth 2.0 Client ID and Secret
- Authorized redirect URIs configured

### 5. **Environment Variables**
You'll need to configure these in Vercel dashboard:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes | `postgresql://user:pass@host:port/db?sslmode=require` |
| `NEXTAUTH_URL` | Your Vercel deployment URL | ✅ Yes | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | ✅ Yes | Generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ Yes | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ Yes | `GOCSPX-xxx` |
| `NODE_TLS_REJECT_UNAUTHORIZED` | SSL certificate handling | ⚠️ Optional | `0` (for self-signed certs) |

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Update `next.config.ts`** (remove standalone output for Vercel):
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     // Remove output: "standalone" - not needed for Vercel
   };

   export default nextConfig;
   ```

2. **Ensure `.env` is in `.gitignore`** (already done)

3. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in

2. **Click "Add New Project"**

3. **Import your GitHub repository**:
   - Select your repository
   - Vercel will auto-detect Next.js

4. **Configure Project Settings**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   DATABASE_URL=your-postgresql-connection-string
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-generated-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```
   
   **Important**: 
   - Set `NEXTAUTH_URL` to your Vercel URL (you'll get it after first deploy)
   - For production, add these to "Production" environment
   - For preview deployments, add to "Preview" environment

6. **Click "Deploy"**

7. **Wait for deployment** (usually 2-5 minutes)

#### Option B: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? No
   - Project name? valentine-app
   - Directory? ./
   - Override settings? No

4. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   vercel env add NODE_TLS_REJECT_UNAUTHORIZED
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Step 3: Configure Google OAuth

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Navigate to**: APIs & Services → Credentials

3. **Edit your OAuth 2.0 Client**:
   - Add **Authorized JavaScript origins**:
     - `https://your-app.vercel.app`
   - Add **Authorized redirect URIs**:
     - `https://your-app.vercel.app/api/auth/callback/google`

4. **Save changes**

### Step 4: Update NEXTAUTH_URL

After first deployment, update `NEXTAUTH_URL` in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Edit `NEXTAUTH_URL`:
   - Change from `http://localhost:3000` to `https://your-app.vercel.app`
3. Redeploy (or it will auto-update on next push)

### Step 5: Set Up Database

1. **Run Prisma migrations** (if needed):
   ```bash
   # Locally, connect to your production database
   npx prisma db push
   # or
   npx prisma migrate deploy
   ```

2. **Verify database connection**:
   - Check Vercel build logs for Prisma errors
   - Ensure database allows connections from Vercel IPs

## 🔧 Configuration Files

### vercel.json (Optional)

Create `vercel.json` for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Prisma Configuration

Vercel automatically runs `prisma generate` during build. No extra configuration needed!

## 🌐 Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to Project → Settings → Domains
2. Add your domain: `valentine.yourdomain.com`
3. Follow DNS instructions:
   - Add CNAME record: `valentine` → `cname.vercel-dns.com`
   - Or add A record (for root domain)

### Step 2: Update Environment Variables

1. Update `NEXTAUTH_URL` to your custom domain:
   ```
   NEXTAUTH_URL=https://valentine.yourdomain.com
   ```

2. Update Google OAuth redirect URIs:
   - `https://valentine.yourdomain.com/api/auth/callback/google`

### Step 3: SSL Certificate

- Vercel automatically provisions SSL certificates
- Wait 1-24 hours for DNS propagation
- SSL will be active automatically

## 🔄 Automatic Deployments

Vercel automatically deploys on every push to:
- **Production**: `main` branch → Production URL
- **Preview**: Other branches → Preview URL

### Disable Auto-Deploy (Optional)

1. Go to Project → Settings → Git
2. Uncheck "Automatically deploy"

## 📊 Monitoring & Logs

### View Logs

1. **In Vercel Dashboard**:
   - Go to Project → Deployments
   - Click on a deployment
   - View "Build Logs" and "Function Logs"

2. **Using CLI**:
   ```bash
   vercel logs
   ```

### Analytics

- Vercel Analytics (free tier available)
- View in Dashboard → Analytics

## 🐛 Troubleshooting

### Build Fails: Prisma Client Not Found

**Solution**: Vercel automatically runs `prisma generate`. If it fails:
1. Check `prisma/schema.prisma` is correct
2. Ensure `DATABASE_URL` is set (even if not used during build)
3. Check build logs for specific errors

### Database Connection Errors

**Symptoms**: API routes return 500 errors

**Solutions**:
1. Verify `DATABASE_URL` is correct in Vercel dashboard
2. Check database allows connections from Vercel IPs
3. Ensure SSL mode is correct (`sslmode=require`)
4. Check `NODE_TLS_REJECT_UNAUTHORIZED=0` if using self-signed certs

### NextAuth Errors

**Symptoms**: Authentication redirects fail

**Solutions**:
1. Verify `NEXTAUTH_URL` matches your Vercel domain exactly
2. Check Google OAuth redirect URIs are correct
3. Ensure `NEXTAUTH_SECRET` is set
4. Check Vercel function logs for specific errors

### Environment Variables Not Working

**Solutions**:
1. Ensure variables are set for correct environment (Production/Preview)
2. Redeploy after adding new variables
3. Check variable names match exactly (case-sensitive)
4. Verify no extra spaces in values

### Build Timeout

**Solutions**:
1. Optimize build (remove unused dependencies)
2. Use Vercel Pro plan (longer build times)
3. Check for infinite loops in build scripts

## 💰 Pricing & Limits

### Free Tier (Hobby Plan)

✅ **Included**:
- Unlimited personal projects
- 100GB bandwidth/month
- Automatic SSL certificates
- Custom domains (up to 50 per project)
- Preview deployments
- Basic analytics

⚠️ **Limits**:
- 100GB bandwidth/month
- Build time: 45 minutes max
- Function execution: 10 seconds (Hobby), 60 seconds (Pro)

### Pro Plan ($20/month)

- Everything in Hobby
- Unlimited bandwidth
- Longer build times
- Team collaboration
- Advanced analytics

## 📝 Checklist Before Deploying

- [ ] Code pushed to GitHub
- [ ] `.env` file is in `.gitignore`
- [ ] `next.config.ts` doesn't have `output: "standalone"`
- [ ] PostgreSQL database is accessible from internet
- [ ] Google OAuth credentials ready
- [ ] Environment variables prepared
- [ ] `NEXTAUTH_SECRET` generated (`openssl rand -base64 32`)
- [ ] Database schema pushed/migrated
- [ ] Google OAuth redirect URIs configured

## 🚀 Quick Deploy Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (first time)
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List projects
vercel ls
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth.js Deployment](https://next-auth.js.org/configuration/options#nextauth_url)

## 🎉 Success!

Once deployed, your app will be available at:
- **Production**: `https://your-app.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

Every push to `main` branch will automatically deploy! 🚀
