This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# My Expiry - Smart Grocery Management

A Next.js application for tracking grocery items and reducing food waste.

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Neon PostgreSQL with Prisma ORM
- **Deployment**: Vercel

## Features
- Google OAuth authentication
- User management dashboard
- Grocery tracking (schema ready)

## Development Log

### 2025-01-09: Admin Dashboard Implementation
**User Request**: "Can we now make a dashboard where we can view/delete users"

**Implementation Steps**:
1. Created `/admin` page with user management interface
2. Built API routes for user CRUD operations
3. Added user list with profile pictures, creation dates, grocery counts
4. Implemented delete functionality with confirmation and self-protection

**Files Created**:
- `app/admin/page.js` - Admin dashboard UI
- `app/api/admin/users/route.js` - GET all users
- `app/api/admin/users/[id]/route.js` - DELETE specific user

**Outcome**: ✅ Fully functional admin panel with secure user management

---

## Template for Future Entries

### YYYY-MM-DD: [Feature Name]
**User Request**: "[Original request]"

**Implementation Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Files Created/Modified**:
- `path/to/file.js` - Description

**Outcome**: ✅/❌ [Brief result description]

---
