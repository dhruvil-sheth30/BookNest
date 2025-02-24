# 📚 BookNest - Library Management System

BookNest is a modern, full-stack library management system that helps librarians manage books, members, and book issuances efficiently. Built with React, Node.js, and Supabase, it provides a clean and intuitive interface for library operations.

## 🚀 Features

- 📖 Book Management
  - Add, edit, and remove books
  - Categorize books by genre and collection
  - Track book availability

- 👥 Member Management
  - Manage library members
  - Track membership status
  - Member history and borrowed books

- 📅 Issuance System
  - Issue books to members
  - Track return dates
  - Handle book returns
  - Overdue notifications

- 📊 Dashboard
  - Overview of library statistics
  - Outstanding books tracking
  - Active memberships
  - Recent activities

## 🛠 Tech Stack

- **Frontend**
  - React.js
  - TypeScript
  - Tailwind CSS
  - React Icons
  - date-fns

- **Backend**
  - Node.js
  - Express.js
  - TypeScript
  - Supabase (PostgreSQL)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Git
- Supabase account

## 🔧 Installation

1. **Clone the repository**


2. **Set up environment variables**

Create `.env` files in both frontend and backend directories:

Frontend (.env):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Backend (.env):
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
API_KEY=your_api_key
PORT=your_port
```

3. **Install dependencies**

Install frontend dependencies
cd booknest
npm install

Install backend dependencies
cd booknest-api
npm install

4. **Set up the database**

Run the migrations and seed data:

bash
cd booknest-api
npm run db:migrate
npm run db:seed

5. **Start the development servers**

Start the frontend server
cd booknest
npm run dev

Start the backend server
cd booknest-api
npm run dev

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3002

## 📁 Project Structure
```
booknest/              # Frontend Application
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── lib/           # Utilities and helpers
├── public/            # Static assets (images, icons, etc.)
└── package.json       # Project dependencies and scripts

booknest-api/          # Backend API
├── src/
│   ├── routes/        # API routes for handling requests
│   ├── middleware/    # Express middleware (authentication, logging, etc.)
│   ├── lib/           # Utilities and database setup
│   └── index.ts       # Entry point of the API
├── supabase/
│   ├── migrations/    # Database schema and migrations
│   └── seed.sql       # Initial seed data for the database
└── package.json       # Backend dependencies and scripts

```

## 🔐 Authentication

BookNest uses Supabase Authentication for secure user management. To set up authentication:

1. Create a Supabase project
2. Enable Email/Password authentication
3. Set up your environment variables
4. Use the provided auth hooks in the frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
