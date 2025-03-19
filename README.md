# ACMS - Academic Conference Management System

This project is an Academic Conference Management System built with Next.js, providing tools for conference paper submissions, reviews, and management.

## Project Overview

ACMS streamlines the process of academic conference management with features including:
- User authentication and role-based access control
- Paper submission and management
- Review process workflow
- Conference scheduling and management

## Project Structure

```
acms/
├── app/               # Next.js App Router files
│   ├── api/           # API routes
│   │   └── upload/    # File upload API
│   ├── components/    # Shared UI components
│   ├── (auth)/        # Authentication routes
│   ├── (dashboard)/   # User dashboard routes
│   └── globals.css    # Global styles
├── lib/               # Utility functions and shared logic
├── public/            # Static assets
│   └── uploads/       # Uploaded files storage
└── prisma/            # Database schema and migrations (if using Prisma)
```

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd acms
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```
cp .env.example .env.local
```
Edit `.env.local` with your configuration values

4. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Key Features

### Authentication
We use Clerk for authentication. User management and login flows are handled through their API.

### Paper Submissions
Users can submit academic papers through the platform with the following constraints:
- Only PDF files are accepted
- Maximum file size: 10MB

### Review System
(Add details about the review system)

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow the Next.js App Router patterns
- Use component-based architecture with React

### API Routes
- API routes are located in `/app/api/`
- Follow RESTful principles
- Handle proper error responses

### Styling
- We use CSS variables for theming (light/dark mode)
- Global styles are in `/app/globals.css`

## Contributing
1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Authentication](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs) (if using Tailwind)

## Deployment

The application can be deployed on [Vercel](https://vercel.com/new) for optimal Next.js performance.
