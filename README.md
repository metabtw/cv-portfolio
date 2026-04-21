# Developer Portfolio & CV Builder

A modern developer portfolio and CV builder built with Next.js 14 App Router, Tailwind CSS, Prisma, and Supabase.

## 🚀 Features

- **Modern UI**: Built with Tailwind CSS, shadcn/ui, and Framer Motion.
- **GitHub Sync**: Automatically fetches your GitHub repositories and keeps them updated.
- **CV Builder**: Drag and drop your featured projects to build a custom PDF CV.
- **PDF Generation**: Uses `@react-pdf/renderer` for robust, ATS-friendly PDF generation.
- **Admin Panel**: Secure admin panel powered by NextAuth to manage your projects, custom descriptions, and skills.
- **Database**: PostgreSQL database powered by Supabase, managed via Prisma ORM.

## 📋 Prerequisites

- Node.js 18.x or later
- A Supabase account (or any PostgreSQL database)
- A GitHub account and Personal Access Token (for syncing repos)

## 🛠️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Copy the `.env.example` file to `.env` and fill in your values.
   ```bash
   cp .env.example .env
   ```
   *Make sure you generate a secure `NEXTAUTH_SECRET` (e.g., using `openssl rand -base64 32`).*

4. **Database Setup:**
   Run Prisma db push to sync your database schema:
   ```bash
   npx prisma db push
   ```
   *(Optional) You can also seed your database or generate the client if needed:*
   ```bash
   npx prisma generate
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🔒 Security Notes

- **Never commit your `.env` file.** It is included in `.gitignore` by default.
- The `/admin` routes are protected by NextAuth middleware. Only the user with credentials matching `ADMIN_EMAIL` and `ADMIN_PASSWORD` can log in.

## 📚 Technologies Used

- [Next.js 14](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [@react-pdf/renderer](https://react-pdf.org/)
