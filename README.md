# 🏪 Classified Advertisements Platform

> A scalable, full-stack marketplace MVP built with **Next.js 15**, **Prisma 7**, and **AWS SES**
>
> Junior Fullstack Developer Take-Home Assignment • Inspired by regional marketplaces like ikman.lk

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![NextAuth](https://img.shields.io/badge/NextAuth-v4-purple?style=flat-square)](https://next-auth.js.org/)
[![AWS SES](https://img.shields.io/badge/AWS-SES-FF9900?style=flat-square&logo=amazon-aws)](https://aws.amazon.com/ses/)

---

## 📖 Overview

A professional-grade classified advertisements platform featuring role-based access control, ad moderation workflows, hierarchical category management, optimized search, and transactional email notifications. Built as a portfolio project demonstrating full-stack architecture, database optimization, authentication, and deployment best practices.

---

## 🎨 Screenshots & Demo

Screenshots to be added. For now, you can:
- Run the dev server locally (see [Getting Started](#-getting-started))
- Test the live demo on Vercel (URL to be added)

---

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ **Google OAuth** via NextAuth.js v4 with secure callback handling
- ✅ **Role-Based Access Control** (Guest, USER, MODERATOR)
- ✅ **Protected Routes** with Next.js middleware
- ✅ **Session Persistence** across page reloads

### 📝 Ad Management
- ✅ **Create Listings** with image uploads (local storage)
- ✅ **Image Optimization** with Next.js Image component
- ✅ **Edit & Delete** with ownership verification
- ✅ **Status Workflow** (PENDING → ACTIVE/REJECTED)
- ✅ **Rich Validation** using React Hook Form + Zod
- ✅ **Category Hierarchy** (two-tier: parent/child categories)

### 🔍 Search & Discovery
- ✅ **Full-Text Search** (title + description)
- ✅ **Multi-Filter Search** (category, location, price range)
- ✅ **Hierarchical Categories** with ad count aggregation
- ✅ **Optimized Queries** using Prisma `relationLoadStrategy`
- ✅ **Real-Time Category Counts** (ACTIVE ads only)

### 👮 Admin Moderation
- ✅ **Secure Admin Dashboard** (`/admin/moderation`)
- ✅ **Pending Ads Queue** with pagination
- ✅ **Bulk Approve/Reject** with feedback
- ✅ **Rejection Reasons** stored for transparency
- ✅ **Email Notifications** sent to ad creators

### 📧 Email Notifications
- ✅ **AWS SES Integration** with Nodemailer
- ✅ **HTML Email Templates**
- ✅ **Approval Confirmation** emails
- ✅ **Rejection Feedback** emails
- ✅ **Sandbox Mode Support** for testing

### 👥 Guest Experience
- ✅ **Browse Listings** without authentication
- ✅ **Search & Filter** publicly
- ✅ **Hidden Seller Contact** info (gates behind login)
- ✅ **Sign-In CTA** with callback to original listing
- ✅ **Seamless Auth Flow** after sign-in redirect

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | Next.js 15, React 19, TypeScript 5.3 |
| **UI/Styling** | TailwindCSS 4, Shadcn UI, React Icons |
| **Forms** | React Hook Form, Zod validation |
| **Backend** | Next.js App Router, Server Actions |
| **Database** | PostgreSQL (Neon), Prisma 7 |
| **Authentication** | NextAuth.js v4, Google OAuth |
| **Email** | AWS SES, Nodemailer, HTML templates |
| **Storage** | Local file uploads (`/public/uploads`) |
| **Build Tool** | Turbopack (Next.js 15) |
| **Deployment** | Vercel |

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 18+ (with npm or yarn)
- **PostgreSQL** database (local or [Neon](https://neon.tech/) cloud)
- **Google OAuth** credentials ([Google Cloud Console](https://console.cloud.google.com/))
- **AWS SES** credentials with verified sender email

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ribnuu/classified-ads-platform.git
cd classified-ads-platform
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@locahost:5432/classified_ads?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# AWS SES
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="ap-southeast-1"
AWS_SES_FROM_EMAIL="your-verified-email@gmail.com"
```

#### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (includes SSL) | `postgresql://user:pass@localhost/db?sslmode=require` |
| `NEXTAUTH_SECRET` | Secret for encrypting tokens | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Application URL for OAuth callbacks | `http://localhost:3000` or `https://yourdomain.com` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-xxx` |
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key ID | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Access Key | (Keep secure in env vars) |
| `AWS_REGION` | AWS Region for SES | `ap-southeast-1` or `us-east-1` |
| `AWS_SES_FROM_EMAIL` | Verified sender email in AWS SES | `noreply@yourdomain.com` |

### 4️⃣ Set Up Database

```bash
# Create tables and run migrations
npx prisma db push

# Seed with sample data (categories, locations)
npx prisma db seed
```

### 5️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6️⃣ Promote Your Account to Moderator (Optional)

After signing in with Google:

```bash
# Open Prisma Studio
npx prisma studio
```

- Find your user in the `User` table
- Change `role` from `USER` to `MODERATOR`
- Access `/admin/moderation` to review pending ads

---

## 📊 Database Schema

The application uses a **normalized relational schema** following **3NF** principles:

### Core Models

| Model | Purpose |
|-------|---------|
| **User** | Stores user info, role, authentication tokens |
| **Account** | NextAuth OAuth account linking |
| **Session** | NextAuth session management |
| **Category** | Parent/child category hierarchy (self-referential) |
| **Location** | Geographic locations for listings |
| **Advertisement** | Core ad entity with status workflow |
| **AdImage** | Images associated with ads (1-to-many) |

### Key Relationships

```
User (1) ────→ (many) Advertisement
User (1) ────→ (many) Account

Category (1) ─→ (many) Category (self-referential for children)
Category (1) ─→ (many) Advertisement

Location (1) ──→ (many) Advertisement

Advertisement (1) ────→ (many) AdImage
```

### Category Hierarchy Example

```
Electronics (Parent)
├── Mobile Phones (Child)
├── Laptops (Child)
└── Accessories (Child)

Property (Parent)
├── Houses for Sale (Child)
├── Apartments for Rent (Child)
└── Commercial Space (Child)
```

---

## 🎯 Key Features Explained

### 🔑 Role-Based Access Control (RBAC)

Three roles control data visibility:

| Role | Can View Ads | Can Post Ads | Can Moderate | Guest Access |
|------|---|---|---|---|
| **GUEST** | ✅ Limited (no seller info) | ❌ | ❌ | Full browsing |
| **USER** | ✅ Full | ✅ Own only | ❌ | N/A |
| **MODERATOR** | ✅ Full | ✅ Own | ✅ All pending | Dashboard only |

### 📋 Advertisement Lifecycle

```
┌─────────────────────────────────────┐
│ 1. User Posts Ad (Status: PENDING)  │
└──────────────┬──────────────────────┘
               │
        ┌──────▼─────────┐
        │ Moderator      │
        │ Reviews Ad     │
        └──────┬────────┬┘
               │        │
    ┌──────────▼──┐  ┌──▼──────────────┐
    │ APPROVED    │  │ REJECTED        │
    │ Ad ACTIVE   │  │ Reason sent     │
    │ Posted live │  │ to user         │
    └─────────────┘  └─────────────────┘

Email Notifications: ✉️ Sent after each state transition
```

### 🏗️ Hierarchical Categories (Two-Tier)

- **Parent Categories**: "Electronics", "Property", "Vehicles"
- **Child Categories**: "Mobile Phones", "Laptops" (under Electronics)
- **Benefits**: 
  - Better UX with drill-down navigation
  - Organized search results
  - Real-time ad count aggregation per category

### ⚡ Optimized Search

```typescript
// Prisma relationLoadStrategy for efficient queries
where: {
  categoryId: categoryId, // Exact match
  status: "ACTIVE",       // Only live ads
  deletedAt: null         // Exclude soft-deleted
},
include: {
  images: true,
  category: true,
  user: { select: { name, email, createdAt } }
},
relationLoadStrategy: "join" // Fetch in single DB query
```

### 📧 AWS SES Email Notifications

Transactional emails sent on:
- ✉️ **Ad Approved** → User notified, ad goes live
- ✉️ **Ad Rejected** → User sees rejection reason
- ✉️ **Contact Inquiry** (future feature) → Seller notified

**Note:** Currently in AWS SES **Sandbox Mode**. Recipient emails must be verified in the AWS SES console before testing.

---

## 🧪 Testing the Application

### 👤 User Flow (Posting an Ad)

1. Visit [http://localhost:3000](http://localhost:3000)
2. Click **"Sign In"** or "Post Ad" button
3. Authenticate with Google
4. Redirected back to page after login
5. Go to **Dashboard** → **Post New Ad**
6. Fill form: title (10-100 chars), description (30-2000 chars), price, category, location, images
7. Submit → Ad status: **PENDING**
8. Your ads visible at **My Ads** dashboard

### 👮 Moderator Flow (Approving Ads)

1. Ensure account has `MODERATOR` role (update in Prisma Studio)
2. Go to **/admin/moderation** dashboard
3. Review pending ads
4. Click **Approve** or **Reject**
5. If rejected, add feedback reason
6. User receives email notification
7. Approved ads appear in search/browsing

### 🧑‍🍳 Guest Flow (Browsing)

1. Visit [http://localhost:3000](http://localhost:3000) without logging in
2. Browse categories, search, filter ads
3. Click on ad → See full details (title, price, images, description)
4. Seller email/contact **hidden** (login required to see)
5. Click **"Sign In"** button in seller section
6. After login → Redirected back to same ad
7. Now seller contact **visible**

### 📧 Email Testing Notes

**AWS SES Sandbox Mode Limitations:**
- Both sender and recipient emails must be verified
- Test emails sent to console logs show: `✅ Email sent: <messageId>`
- To verify emails in AWS SES console:
  1. Go to **SES** → **Email Addresses**
  2. Click **Verify a New Email**
  3. Check inbox for verification link

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [https://vercel.com/new](https://vercel.com/new)
   - Import GitHub repository
   - Select `classified-ads-platform`

3. **Add Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.local` (see [Environment Variables Reference](#environment-variables-reference))

4. **Configure Database**
   - Use Neon for PostgreSQL (free tier available)
   - Replace `DATABASE_URL` with Neon connection string
   - Run migrations on Neon instance:
     ```bash
     DATABASE_URL="neon-url" npx prisma db push
     npx prisma db seed
     ```

5. **Deploy**
   - Click **Deploy** button
   - Vercel builds and deploys automatically
   - Production URL shown on success

### Database Connection Best Practices

- **Development**: Local PostgreSQL or Neon cloud
- **Production**: Neon with SSL enabled
- **Built-in SSL**: Neon connection strings include `?sslmode=require`
- **Prisma SSL Warning**: "SSL connection error" warnings can be ignored; functionality not affected

---

## ⚠️ Known Limitations & Notes

### 🔧 AWS SES Sandbox Mode
- **Current**: Sandbox mode (for testing)
- **Action**: Apply for production access in AWS console
- **Impact**: Unrestricted email sending to any address in production

### 🛡️ PostgreSQL SSL Warning
```
SSL connection error (certificate verification failed)
```
- **Warning**: Safe to ignore; connection still succeeds
- **Recommendation**: Use Neon's production SSL certificates in prod

### 🔄 Next.js 15 Async Route Params
- **Pattern**: `params: Promise<{ slug: string }>` 
- **Requirement**: Must `await params` before accessing
- **Why**: Ensures params are available before rendering

### 📦 Image Storage
- **Current**: Local file uploads to `/public/uploads`
- **Production**: Scale to S3/Cloudinary for production use
- **File Size**: No limit enforced; add validation for production

### 🔌 NextAuth Session Strategy
- **Strategy**: Database sessions via Prisma adapter
- **Expiry**: Tokens refresh on each API call
- **HTTPS**: Required in production (Vercel provides free SSL)

---

## 📁 Project Structure

```
classified-ads-platform/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Authentication routes
│   │   └── login/page.tsx         # Login with Google OAuth
│   ├── (dashboard)/               # Protected user routes
│   │   ├── dashboard/page.tsx     # Dashboard home
│   │   ├── ads/
│   │   │   ├── new/page.tsx       # Create new ad
│   │   │   ├── [id]/edit/page.tsx # Edit ad (ownership check)
│   │   │   └── my-ads/page.tsx    # User's ad list
│   │   └── admin/
│   │       └── moderation/page.tsx # Moderator queue
│   ├── (public)/                  # Public routes
│   │   ├── page.tsx               # Homepage with categories
│   │   ├── ads/
│   │   │   ├── [id]/page.tsx      # Ad detail (guest-restricted seller info)
│   │   │   └── search/page.tsx    # Search & filter ads
│   │   └── categories/
│   │       ├── page.tsx           # Browse all categories
│   │       └── [slug]/page.tsx    # Category detail view
│   ├── api/                       # API routes
│   │   ├── auth/[...nextauth]/    # NextAuth dynamic route
│   │   └── upload/                # Image upload endpoint
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Homepage
│   └── globals.css                # Global styles
├── actions/                       # Server Actions
│   ├── ad.actions.ts              # CRUD operations for ads
│   ├── search.actions.ts          # Search and category queries
│   └── email.actions.ts           # Email sending logic
├── components/                    # React components
│   ├── ads/                       # Ad-related components
│   │   ├── AdCard.tsx             # Listing card
│   │   ├── AdForm.tsx             # Create ad form
│   │   ├── EditAdForm.tsx         # Edit ad form
│   │   └── AdGrid.tsx             # Responsive grid
│   ├── auth/                      # Auth components
│   │   └── AuthProvider.tsx       # NextAuth provider
│   ├── layout/                    # Layout components
│   │   ├── Navbar.tsx             # Navigation bar
│   │   ├── Footer.tsx             # Footer
│   │   └── Sidebar.tsx            # Dashboard sidebar
│   ├── moderation/                # Admin moderation UI
│   │   └── ModerationQueue.tsx    # Pending ads table
│   ├── ui/                        # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   └── ... (other shadcn components)
├── lib/                           # Utilities & helpers
│   ├── auth.ts                    # NextAuth configuration
│   ├── prisma.ts                  # Prisma client singleton
│   ├── utils.ts                   # Helper functions
│   ├── email/
│   │   └── templates/             # HTML email templates
│   └── validations/
│       ├── ad.ts                  # Zod schemas
│       └── auth.ts                # Auth validation
├── prisma/                        # Database layer
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Seed script
├── public/
│   └── uploads/                   # User-uploaded images
├── types/                         # TypeScript types
│   └── next-auth.d.ts             # NextAuth type augmentation
├── .env.local                     # Environment variables (gitignored)
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript config
├── next.config.ts                 # Next.js config
├── tailwind.config.ts             # Tailwind CSS config
└── README.md                      # This file
```

---

## 🎓 Learning & Best Practices Demonstrated

### Architecture
- ✅ Server Components by default, Client only when needed
- ✅ Server Actions for mutations (no separate API layer)
- ✅ Middleware for route protection and auth checks
- ✅ Separation of concerns: actions, components, lib

### Database
- ✅ Prisma ORM for type-safe migrations
- ✅ Efficient queries with `relationLoadStrategy: 'join'`
- ✅ Soft deletes pattern (deletedAt field) for data retention
- ✅ Normalized schema following 3NF

### Authentication
- ✅ OAuth via NextAuth.js (no password storage)
- ✅ Role-based access control with middleware checks
- ✅ Secure session management in database
- ✅ Callback URL preservation for UX

### Validation
- ✅ Zod schemas for runtime validation
- ✅ React Hook Form for form state & errors
- ✅ Client + server-side validation
- ✅ Clear user feedback on validation failures

### Performance
- ✅ Image optimization with Next.js `<Image>`
- ✅ Database query optimization (joins, selective fields)
- ✅ Caching strategies for category data
- ✅ Turbopack for faster builds

---

## 🙏 Acknowledgments

This project is a take-home assignment for a **Junior Fullstack Developer position**, inspired by regional classified marketplaces like [ikman.lk](https://ikman.lk/).

**Technologies & Resources:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)

---

## 📄 License

This project is licensed under the **MIT License** – feel free to use it as a portfolio project or reference.

```
MIT License - See LICENSE file for details
```

---

## 📞 Contact & Support

For questions or feedback on this project:
- 📧 Email: [Your email]
- 🐙 GitHub: [@ribnuu](https://github.com/ribnuu)
- 💼 LinkedIn: [Your LinkedIn]

---

## 🔗 Quick Links

- 🚀 [Deploy on Vercel](#-deployment)
- 📖 [Installation Guide](#-installation--setup)
- 🧪 [Testing Guide](#-testing-the-application)
- 🛠️ [Tech Stack](#-tech-stack)
- 📊 [Database Schema](#-database-schema)

---

**Last Updated:** April 2026 | Built with ❤️ by Ribnuu
