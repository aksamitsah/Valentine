# 💕 Valentine Proposal App

A beautiful and interactive web application for creating personalized Valentine's Day proposals. Create a special link, share it with your loved one, and watch them try to escape the inevitable YES! 🎉

![Valentine App Screenshot](screenshot.png)

## ✨ Features

### 🎯 Core Features

- **Google OAuth Authentication** - Secure sign-in with Google accounts
- **Personalized Proposal Links** - Create unique, shareable proposal links with custom names and messages
- **Playful NO Button** - Interactive button that escapes when hovered or tapped, making it impossible to say "no"
- **Real-time Analytics** - Track how long it takes for someone to say YES and count NO attempts
- **Image Uploads** - 
  - **Creator Image**: Upload a photo when creating a proposal (displays on success page)
  - **Responder Image**: Upload a photo after saying YES (displays on success page and dashboard)
- **Success Page** - Beautiful celebration page with confetti, stats, and image sharing
- **Dashboard** - Manage all your proposals, view analytics, edit, delete, and copy links
- **Responsive Design** - Beautiful UI optimized for desktop and mobile devices
- **iOS Safari Optimized** - Full support for iOS safe-area insets, theme-color, and PWA features

### 📊 Analytics Features

- **Time to YES** - Track how long (in minutes/seconds) it took to accept
- **NO Attempts Counter** - Count how many times the NO button was clicked
- **Response History** - View all responses with timestamps and images
- **Formatted Dates** - Display response dates with full date, time, and seconds

### 🎨 UI/UX Features

- **Romantic Typography** - Beautiful cursive fonts including:
  - **Great Vibes** - Elegant cursive heading for "Will you be my Valentine?"
  - **Dancing Script** - Script style for accents
  - **Poppins** - Modern body text
- **Animated Backgrounds** - Floating hearts animation on proposal pages
- **Confetti Celebration** - Animated confetti explosion on success page
- **Smooth Animations** - Powered by Framer Motion for delightful interactions
- **Glass Morphism Design** - Modern glass-card UI elements with soft blur effects
- **Gradient Text** - Beautiful pink gradient effects for headings
- **Dark Theme** - Elegant dark color scheme (#0a0a0a) perfect for romantic moments
- **Mobile Optimizations**:
  - iOS Safari address bar/bottom bar color matching
  - Safe area insets for iPhone notch/home indicator
  - Responsive NO button movement (stays visible on mobile)

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12** - Animation library
- **Google Fonts** - Great Vibes, Dancing Script, Poppins

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js 4** - Authentication with Google OAuth
- **Prisma 7.3.0** - Modern ORM for database management
- **PostgreSQL** - Production database (via Aiven, Supabase, etc.)

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
│   └── schema.prisma              # Database schema
├── public/                         # Static assets
│   └── icon.svg                    # App icon/favicon
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts   # NextAuth configuration
│   │   │   ├── proposals/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── route.ts   # GET proposal by slug
│   │   │   │   └── route.ts       # CRUD operations
│   │   │   └── responses/
│   │   │       └── route.ts       # Response management
│   │   ├── dashboard/
│   │   │   ├── create/
│   │   │   │   └── page.tsx       # Create proposal page
│   │   │   └── page.tsx           # Dashboard (list proposals)
│   │   ├── v/
│   │   │   └── [slug]/
│   │   │       ├── success/
│   │   │       │   └── page.tsx   # Success celebration page
│   │   │       └── page.tsx       # Public proposal page
│   │   ├── layout.tsx             # Root layout with fonts & meta
│   │   ├── page.tsx               # Landing page
│   │   └── globals.css            # Global styles & animations
│   ├── components/
│   │   └── AuthProvider.tsx       # Auth context provider
│   ├── lib/
│   │   ├── auth.ts                # NextAuth configuration
│   │   └── prisma.ts              # Prisma client setup
│   └── types/
│       └── next-auth.d.ts         # NextAuth type definitions
├── doc/
│   ├── DOCKER.md                  # Docker deployment guide
│   ├── VERCEL.md                  # Vercel deployment guide
│   └── VERCEL_REQUIREMENTS.md     # Vercel requirements checklist
├── .env                           # Environment variables
├── Dockerfile                     # Docker configuration
├── docker-compose.yml             # Docker Compose configuration
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🎨 Design System

### Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--background` | `#0a0a0a` | Dark background |
| `--foreground` | `#ededed` | Light text |
| `--primary` | `#ff2d55` | Primary pink |
| `--primary-light` | `#ff6b8a` | Light pink |
| `--secondary` | `#ff85a2` | Secondary pink |
| `--accent` | `#ff1744` | Accent red |
| `--card-bg` | `rgba(255, 45, 85, 0.1)` | Card backgrounds |
| `--glass` | `rgba(255, 255, 255, 0.05)` | Glass effect |

### Typography

| Font | Usage | Weight |
|------|-------|--------|
| **Great Vibes** | Romantic headings ("Will you be my Valentine?") | 400 |
| **Dancing Script** | Script accents | 400-700 |
| **Poppins** | Body text | 300-700 |
| **Inter** | UI elements | 400-600 |

### Key CSS Classes

```css
.gradient-text       /* Pink gradient text effect */
.glass-card          /* Frosted glass card style */
.btn-primary         /* Primary action button (pink) */
.btn-secondary       /* Secondary action button */
.btn-yes             /* Green YES button */
.btn-no              /* Red NO button */
.heartbeat           /* Pulsing heart animation */
.animate-pulse-slow  /* Slow pulse animation */
.hearts-bg           /* Floating hearts background */
```

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/session` - Get current session
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/callback/google` - Google OAuth callback

### Proposals
- `GET /api/proposals` - Get all proposals for authenticated user
- `POST /api/proposals` - Create a new proposal
  - Body: `{ creatorName, partnerName, message?, image? }`
- `PUT /api/proposals` - Update a proposal
  - Body: `{ id, creatorName, partnerName, message? }`
- `DELETE /api/proposals?id={id}` - Delete a proposal
- `GET /api/proposals/[slug]` - Get proposal by slug (public)

### Responses
- `GET /api/responses?id={id}` - Get response by ID
- `POST /api/responses` - Record a response
  - Body: `{ proposalId, timeToYes, noAttempts }`
- `PUT /api/responses` - Update response with image
  - Body: `{ id, image }` (base64 encoded)

## 🗄️ Database Schema

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

### How the Proposal Page Works

1. Partner opens your shared link
2. They see a personalized greeting with your name
3. The playful "NO" button escapes when hovered/touched
4. After clicking "YES", confetti celebrates!
5. Optional: They can upload a photo response
6. You can view their response in your dashboard

## 🚢 Deployment

### Deploy with Docker

```bash
# Build the Docker image
docker build -t valentine-app .

# Run with environment file
docker run -d -p 3000:3000 --env-file .env --name valentine-app valentine-app
```

See [doc/DOCKER.md](doc/DOCKER.md) for detailed Docker deployment instructions.

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

See [doc/VERCEL.md](doc/VERCEL.md) for detailed Vercel deployment instructions.

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

### Fonts Not Loading

Ensure the layout.tsx has all font variables applied to the body:
```tsx
<body className={`${inter.variable} ${greatVibes.variable} ${dancingScript.variable} ${poppins.variable} antialiased`}>
```

## 📱 Mobile Optimizations

The app is fully optimized for mobile devices:

- **iOS Safari**:
  - Address bar color matches dark theme
  - Bottom navigation bar color matches background
  - Safe area insets for notch/home indicator
  - PWA "Add to Home Screen" support
  
- **Responsive Design**:
  - Touch-friendly buttons (min 44px touch targets)
  - NO button stays within viewport on mobile
  - Readable fonts on all screen sizes

## 📄 License

This project is open source and available for personal use.

## 💝 Made with Love

Built for Valentine's Day 2026 with Next.js, React, Tailwind CSS, and lots of 💕

---

**Note**: This app is designed for fun and entertainment. Use responsibly and with consent! 😊
