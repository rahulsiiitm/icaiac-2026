# ICAIAC 2026 Conference Portal

The official conference management and registration portal for the 1st
International Conference on Artificial Intelligence and Advanced
Computing (ICAIAC 2026), hosted by the Indian Institute of Information
Technology (IIIT) Manipur.

This full-stack web application manages public-facing conference
information, user authentication, role-based registration workflows,
payment verification, and automated document generation.

------------------------------------------------------------------------

## Overview

The ICAIAC 2026 Conference Portal streamlines the end-to-end
registration and management workflow for authors and attendees. It
integrates secure authentication, structured access control, payment
validation, automated email communication, and dynamic document
generation into a scalable production-ready platform.

------------------------------------------------------------------------

## Key Features

### Segmented Registration Workflows

-   Authors are automatically redirected to the Microsoft CMT portal for
    peer-review management.
-   Non-Authors (Attendees) are directed to an internal dashboard for
    ICICI bank transfer receipt uploads.

### Dual Authentication System

-   Google OAuth login
-   Email and password authentication (hashed using bcryptjs)
-   Authentication managed via NextAuth.js

### Role-Based Access Control (RBAC)

-   Middleware-protected routes
-   Users access only personal dashboards
-   Authorized staff access the Admin Management Console

### Admin Management Console

-   Review uploaded payment receipts
-   Verify transactions
-   Monitor real-time revenue statistics
-   Export attendee lists as CSV

### Automated Email Notifications

-   Registration confirmation emails
-   Payment verification receipts
-   Powered by Resend

### Dynamic PDF Generation

-   Personalized Official Invitation Letters generated upon payment
    verification

### High-Performance UI/UX

-   Tailwind CSS styling
-   GSAP ScrollTrigger animations
-   Optimized performance and memory-safe animations

### Web Analytics

-   Privacy-friendly analytics via Vercel Analytics

------------------------------------------------------------------------

## Technology Stack

Framework: Next.js 14+ (App Router)\
Language: TypeScript\
Styling: Tailwind CSS\
Animations: GSAP\
Database: PostgreSQL (Neon)\
ORM: Prisma\
Authentication: NextAuth.js (v4)\
File Storage: UploadThing\
Email Service: Resend\
Deployment: Vercel

------------------------------------------------------------------------

## Prerequisites

-   Node.js v18 or higher
-   npm or yarn
-   PostgreSQL database (Neon recommended)
-   Google Cloud Console account
-   UploadThing account
-   Resend account

------------------------------------------------------------------------

## Environment Variables

Create a `.env` file in the root directory:

DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

NEXTAUTH_SECRET="your_generated_random_secret_string"
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"

RESEND_API_KEY="your_resend_api_key"

------------------------------------------------------------------------

## Local Development Setup

1.  Clone the repository\
    git clone https://github.com/yourusername/icaiac-2026.git\
    cd icaiac-2026

2.  Install dependencies\
    npm install

3.  Generate Prisma Client and push schema\
    npx prisma generate\
    npx prisma db push

4.  Start development server\
    npm run dev

5.  Open in browser\
    http://localhost:3000

------------------------------------------------------------------------

## Admin Access Configuration

All new users are assigned the USER role by default.

To enable admin access:

1.  Sign in to create your user record.
2.  Open Neon SQL Editor or run `npx prisma studio`.
3.  Locate your record in the User table.
4.  Change role from USER to ADMIN.
5.  Refresh the application.

------------------------------------------------------------------------

## Deployment

1.  Push code to GitHub.
2.  Import the project into Vercel.
3.  Ensure `postinstall` script includes `prisma generate`.
4.  Add all environment variables in Vercel dashboard.
5.  Deploy.

After deployment: - Update NEXTAUTH_URL to production domain. - Update
Google OAuth Authorized Redirect URIs.

------------------------------------------------------------------------

## License

Designed and developed for the Department of Computer Science &
Engineering, IIIT Manipur.

All rights reserved for ICAIAC 2026.
