# 💕 Valentine Proposal App

A playful and interactive web application for creating personalized Valentine's Day proposals. Create a special link, share it with your loved one, and watch them try to escape the inevitable YES! 🎉

## ✨ Features

### 🎯 Core Features

- **Google OAuth Authentication** - Secure sign-in with Google accounts
- **Personalized Proposal Links** - Create unique, shareable proposal links with custom names and messages
- **Playful NO Button** - Interactive button that escapes when hovered or tapped, making it fun to say "no"
- **Real-time Analytics** - Track how long it takes for someone to say YES and count NO attempts
- **Page View Tracking** - Monitor total views and unique visitors for each proposal
- **Image Uploads** - 
  - **Creator Image**: Upload a photo when creating a proposal (displays on success page)
  - **Responder Image**: Upload a photo after saying YES (displays on success page and dashboard)
- **Success Page** - Beautiful celebration page with confetti, stats, and image sharing
- **Dashboard** - Manage all your proposals, view analytics, edit, delete, and copy links
- **Responsive Design** - Beautiful UI that works on desktop and mobile devices

### 📊 Analytics Features

- **Time to YES** - Track how long (in minutes/seconds) it took to accept
- **NO Attempts Counter** - Count how many times the NO button was clicked
- **View Statistics** - Total views and unique visitor counts per proposal
- **Response History** - View all responses with timestamps and images
- **Formatted Dates** - Display response dates with full date, time, and seconds

### 🎨 UI/UX Features

- **Animated Backgrounds** - Falling hearts animation on proposal pages
- **Confetti Celebration** - Animated confetti on success page
- **Smooth Animations** - Powered by Framer Motion for delightful interactions
- **Glass Morphism Design** - Modern glass-card UI elements
- **Gradient Text** - Beautiful gradient effects for headings
- **Dark Theme** - Elegant dark color scheme perfect for romantic moments

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication with Google OAuth
- **Prisma 7.3.0** - Modern ORM for database management
- **PostgreSQL** - Production database (via Aiven)

### Database Models
- **User** - User accounts (via NextAuth)
- **Account** - OAuth account connections
- **Session** - User sessions
- **Proposal** - Proposal records with creator info and images
- **Response** - Response analytics and responder images
- **View** - Page view tracking with IP hashing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use a cloud provider like Aiven)
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd valentine-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # SSL (for cloud PostgreSQL with self-signed certificates)
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
valentine-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── prisma.config.ts        # Prisma CLI configuration
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts        # NextAuth configuration
│   │   │   ├── proposals/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── route.ts       # GET proposal by slug
│   │   │   │   └── route.ts           # CRUD operations
│   │   │   └── responses/
│   │   │       └── route.ts            # Response management
│   │   ├── dashboard/
│   │   │   ├── create/
│   │   │   │   └── page.tsx            # Create proposal page
│   │   │   └── page.tsx                # Dashboard (list proposals)
│   │   ├── v/
│   │   │   └── [slug]/
│   │   │       ├── success/
│   │   │       │   └── page.tsx        # Success celebration page
│   │   │       └── page.tsx            # Public proposal page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Landing page
│   │   └── globals.css                 # Global styles
│   ├── components/
│   │   └── AuthProvider.tsx            # Auth context provider
│   ├── lib/
│   │   ├── auth.ts                     # NextAuth configuration
│   │   └── prisma.ts                   # Prisma client setup
│   └── types/
│       └── next-auth.d.ts              # NextAuth type definitions
├── .env                                # Environment variables
├── next.config.ts                      # Next.js configuration
├── package.json                        # Dependencies
└── README.md                           # This file
```

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/session` - Get current session
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/callback/google` - Google OAuth callback

### Proposals
- `GET /api/proposals` - Get all proposals for authenticated user
  - Returns: Array of proposals with responses, view counts, and analytics
  
- `POST /api/proposals` - Create a new proposal
  - Body: `{ creatorName, partnerName, message?, image? }`
  - Returns: Created proposal with slug
  
- `PUT /api/proposals` - Update a proposal
  - Body: `{ id, creatorName, partnerName, message? }`
  - Returns: Updated proposal
  
- `DELETE /api/proposals?id={id}` - Delete a proposal
  - Returns: Success status
  
- `GET /api/proposals/[slug]` - Get proposal by slug (public)
  - Returns: Proposal data (also records a view)

### Responses
- `GET /api/responses?id={id}` - Get response by ID
  - Returns: Response with proposal data
  
- `POST /api/responses` - Record a response
  - Body: `{ proposalId, timeToYes, noAttempts }`
  - Returns: Created response with ID
  
- `PUT /api/responses` - Update response with image
  - Body: `{ id, image }` (base64 encoded)
  - Returns: Updated response

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id            String     @id @default(cuid())
  name          String?
  email         String?    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  proposals     Proposal[]
}
```

### Proposal Model
```prisma
model Proposal {
  id          String     @id @default(cuid())
  slug        String     @unique
  creatorName String
  partnerName String
  message     String?
  image       String?    @db.Text  // Creator's photo (base64)
  userId      String
  user        User       @relation(...)
  responses   Response[]
  views       View[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

### Response Model
```prisma
model Response {
  id          String    @id @default(cuid())
  proposalId  String
  proposal    Proposal  @relation(...)
  answered    Boolean   @default(false)
  timeToYes   Int?      // Milliseconds
  noAttempts  Int       @default(0)
  image       String?   @db.Text  // Responder's photo (base64)
  respondedAt DateTime?
  createdAt   DateTime  @default(now())
}
```

### View Model
```prisma
model View {
  id         String   @id @default(cuid())
  proposalId String
  proposal   Proposal @relation(...)
  ipHash     String?  // Hashed IP for privacy
  userAgent  String?
  viewedAt   DateTime @default(now())
}
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Base URL of your application | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth (generate with `openssl rand -base64 32`) | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` for self-signed SSL certificates | Optional |

## 📝 Usage Guide

### Creating a Proposal

1. Sign in with Google on the landing page
2. Click "Create New" in the dashboard
3. Fill in:
   - Your name
   - Partner's name
   - Optional custom message
   - Optional photo upload (max 5MB)
4. Click "Create Proposal Link"
5. Copy and share the generated link

### Viewing Analytics

1. Go to your dashboard
2. View statistics for each proposal:
   - Total views and unique visitors
   - Response analytics (time to YES, NO attempts)
   - Response timestamps with full date/time
   - Uploaded images from responders

### Editing/Deleting Proposals

- Click "Edit" to modify proposal details
- Click "Delete" to remove a proposal (with confirmation)
- Click "Copy Link" to quickly share the proposal URL

## 🎨 Features in Detail

### Image Uploads

**Creator Image:**
- Uploaded during proposal creation
- Stored as base64 in PostgreSQL
- Displayed in a round frame at the top of the success page
- Maximum size: 5MB

**Responder Image:**
- Uploaded after saying YES on the success page
- Stored as base64 in PostgreSQL
- Displayed on success page and dashboard analytics
- Maximum size: 5MB

### Page View Tracking

- Automatically tracks views when proposal link is opened
- Uses IP hashing for privacy (SHA-256 hash)
- Tracks user agent for analytics
- Calculates unique visitors based on hashed IPs

### Time Formatting

- **Duration**: Short format (e.g., "1m 49s", "3s")
- **Date/Time**: Full format with seconds (e.g., "5/2/2026 10:30:45 AM")

### Session Persistence

- Uses localStorage to persist NO attempts and start time
- Survives page refreshes
- Cleared after successful YES response

## 🚢 Deployment

### Prerequisites for Production

1. Set up a PostgreSQL database (recommended: Aiven, Supabase, or Railway)
2. Configure Google OAuth credentials for production domain
3. Set all environment variables in your hosting platform

### Deploy with Docker

The easiest way to deploy this application is using Docker. The Dockerfile is configured to build a production-ready Next.js standalone application.

#### Build Docker Image

```bash
# Build the Docker image
docker build -t valentine-app .

# Or using npm script
npm run docker:build
```

#### Run Docker Container

```bash
# Run the container (port 3000)
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your-secret-key" \
  -e GOOGLE_CLIENT_ID="your-google-client-id" \
  -e GOOGLE_CLIENT_SECRET="your-google-client-secret" \
  valentine-app

# Or using npm script
npm run docker:run
```

#### Run with Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - NODE_TLS_REJECT_UNAUTHORIZED=${NODE_TLS_REJECT_UNAUTHORIZED:-0}
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

#### Deploy to Linux Server

1. **Copy files to your Linux server**:
   ```bash
   scp -r . user@your-server:/path/to/app
   ```

2. **SSH into your server**:
   ```bash
   ssh user@your-server
   ```

3. **Build and run**:
   ```bash
   cd /path/to/app
   docker build -t valentine-app .
   docker run -d -p 3000:3000 \
     --env-file .env \
     --name valentine-app \
     valentine-app
   ```

4. **Use a reverse proxy** (nginx/traefik) to handle SSL and domain routing

### Alternative: Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate dev
```

## 🐛 Troubleshooting

### SSL Certificate Errors

If you see `self-signed certificate in certificate chain` errors:
- Ensure `NODE_TLS_REJECT_UNAUTHORIZED=0` is set in `.env`
- Check that `src/lib/prisma.ts` has SSL configuration

### Prisma Client Errors

If Prisma client is out of sync:
```bash
npx prisma generate
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
```

## 📄 License

This project is open source and available for personal use.

## 💝 Made with Love

Built for Valentine's Day 2026 with Next.js, React, and lots of 💕

---

**Note**: This app is designed for fun and entertainment. Use responsibly and with consent! 😊
