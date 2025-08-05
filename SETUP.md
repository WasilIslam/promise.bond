# Promise.Bond Setup Guide 🚀

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# App Configuration
ALLOW_CROSS_ORIGIN_CRUSH=false
APP_NAME="Promise.Bond"
APP_URL=http://localhost:3000
```

### 3. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL from `supabase-seed.sql` in your Supabase SQL editor
3. Update your `.env.local` with your Supabase credentials

### 4. Email Setup (Gmail Example)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account → Security → 2-Step Verification → App passwords
3. Use your Gmail address and the app password in the SMTP configuration

### 5. Run Development Server

```bash
npm run dev
```

## What You Need to Install

### Required Services:

- **Supabase Account** (free tier available)
- **Gmail Account** (for SMTP emails)
- **Google Cloud Project** (optional, for Google OAuth)

### Environment Variables You Must Set:

- Supabase URL and keys
- A secure JWT_SECRET (generate with: `openssl rand -base64 32`)
- SMTP email credentials

## Features Included ✨

- 🔐 **Secure Authentication** (Email/Password + Email Verification)
- 🏢 **Organization-based Matching** (Domain extraction from emails)
- 💕 **Crush System** (Up to 4 crushes per user)
- 🎯 **Mutual Matching** (Automatic match detection)
- 📧 **Email Notifications** (Beautiful HTML emails for matches)
- 🔒 **Security Features** (JWT auth, rate limiting, audit logs)
- 📱 **Responsive Design** (Works on all devices)
- 🎨 **Modern UI** (DaisyUI + Tailwind CSS + Framer Motion)

## Security Features 🛡️

- Row Level Security (RLS) policies in Supabase
- JWT token authentication with secure cookies
- Email verification required
- Audit logging for all user actions
- Organization-based isolation
- Password strength validation
- CSRF protection via same-site cookies

## App Structure

```
app/
├── api/auth/           # Authentication endpoints
├── dashboard/          # Main discovery page
├── matches/           # View mutual matches
├── profile/           # User profile management
├── verify-email/      # Email verification page
components/            # Reusable UI components
lib/                   # Utility functions and services
```

## Testing the App

1. Register with a university email (e.g., `student@lhr.nu.edu.pk`)
2. Check your email for verification
3. Log in and explore the dashboard
4. Add crushes and wait for matches!

## Need Help?

Check that all environment variables are set correctly and your Supabase database is running the seed SQL.

Happy matching! 💕
