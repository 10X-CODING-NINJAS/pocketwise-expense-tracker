# Pocketwise – Personal Expense Tracker

A personal expense tracker built using React, Vite, Tailwind CSS, and Supabase. It allows users to securely manage their daily expenses with authentication, category-based filtering, and monthly spending summaries.

## Live Demo

Deployment Link - https://pocketwise-expense-tracker-vert.vercel.app/

## GitHub Repository

https://github.com/connectadityamalik/pocketwise-expense-tracker

---

## Features

- User authentication using Supabase
- Secure Sign Up and Login
- Add new expenses
- Edit existing expenses
- Delete expenses
- View all expenses
- Filter expenses by category
- View total monthly spending
- Responsive design for desktop and mobile
- Form validation
- Loading states
- Error handling
- Protected routes
- Row Level Security (RLS) using Supabase

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, JavaScript |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| Backend | Supabase |
| Authentication | Supabase Auth |
| Database | PostgreSQL (Supabase) |
| Notifications | React Hot Toast |
| Icons | Lucide React |

---

## Project Structure

```
expense-tracker/
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   └── schema.sql
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json
├── netlify.toml
└── README.md
```

---

## Supabase Setup

1. Create a new project on Supabase.
2. Open the SQL Editor.
3. Run the SQL file located at:

```
supabase/schema.sql
```

4. Copy your Project URL and Publishable (Anon) Key from:

```
Settings → API
```

---

## Environment Variables

Create a `.env` file and add:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

## Local Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## Available Scripts

```bash
npm run dev
```

Runs the development server.

```bash
npm run build
```

Builds the project for production.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint.

---

## License

This project was developed for educational purposes.
