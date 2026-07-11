# Pocketwise — Personal Expense Tracker

A clean, fast expense tracker built with React, Vite, Tailwind CSS, and Supabase. Sign up, log expenses as you spend, filter by category, and watch your monthly total update instantly.

![Tech](https://img.shields.io/badge/React-18-149ECA) ![Tech](https://img.shields.io/badge/Vite-5-646CFF) ![Tech](https://img.shields.io/badge/Tailwind-3-38BDF8) ![Tech](https://img.shields.io/badge/Supabase-2-3ECF8E)

## Features

- Email/password sign up and login via Supabase Auth, with persistent sessions (refresh the page, stay logged in)
- Protected dashboard — signed-out visitors are redirected straight to `/login`
- Create, edit, and delete expenses, with a confirmation step before anything is deleted
- Instant category filtering (Food, Travel, Shopping, Bills, Entertainment, Health, Education, Other)
- A monthly spending summary that recalculates the moment you add, edit, or delete an expense, shown in ₹ (INR), with a category breakdown bar
- Client-side form validation with inline, human-readable error messages
- Loading states on every async action; buttons disable themselves while a request is in flight
- Toast notifications for success and failure (auth errors, database errors, network issues)
- Responsive layout, from a small phone up to a wide desktop monitor
- Accessible by default: keyboard-trapped modals, Escape-to-close, visible focus rings, `aria-invalid`/`aria-describedby` wired to every validation message, and body text colors that meet WCAG AA contrast
- Row Level Security in Postgres — the database itself refuses to return or modify another user's rows, regardless of what the client sends

## Tech stack

| Layer      | Choice                                              |
|------------|------------------------------------------------------|
| Frontend   | React 18, Vite, JavaScript                          |
| Styling    | Tailwind CSS                                        |
| Routing    | React Router DOM                                    |
| Icons      | Lucide React                                        |
| Toasts     | React Hot Toast                                     |
| Backend    | Supabase (Postgres + Auth)                          |
| Deployment | Vercel or Netlify                                   |

## Project structure

```
expense-tracker/
├─ supabase/
│  └─ schema.sql              # table, RLS, and policies — run this in Supabase first
├─ src/
│  ├─ components/
│  │  ├─ AuthLayout.jsx       # shared shell/header/field used by Login & Signup
│  │  ├─ CategoryFilter.jsx
│  │  ├─ ConfirmDialog.jsx    # generic confirm modal (used for delete)
│  │  ├─ ExpenseCard.jsx
│  │  ├─ ExpenseForm.jsx      # add/edit modal with validation
│  │  ├─ ExpenseList.jsx      # list + loading skeleton + empty states
│  │  ├─ LoadingSpinner.jsx
│  │  ├─ MonthlySummary.jsx   # hero card: total + category breakdown
│  │  ├─ Navbar.jsx
│  │  └─ ProtectedRoute.jsx    # also exports GuestRoute (keeps signed-in users off /login, /signup)
│  ├─ context/
│  │  └─ AuthContext.jsx      # session state, signUp/signIn/signOut
│  ├─ hooks/
│  │  ├─ useExpenses.js       # all CRUD calls to Supabase
│  │  └─ useModalEffects.js   # shared modal a11y: scroll lock, Escape, focus trap
│  ├─ pages/
│  │  ├─ Login.jsx
│  │  ├─ Signup.jsx
│  │  └─ Dashboard.jsx
│  ├─ services/
│  │  └─ supabase.js          # Supabase client instance
│  ├─ utils/
│  │  ├─ authErrors.js        # maps raw Supabase errors to friendly copy
│  │  ├─ categories.js        # category list + colors (single source of truth)
│  │  ├─ formatters.js        # currency/date formatting, month helpers
│  │  └─ validation.js        # form validation rules
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ .env.example
├─ index.html
├─ tailwind.config.js
├─ vite.config.js
├─ vercel.json           # SPA rewrite rule for Vercel
├─ netlify.toml          # build settings + SPA redirect rule for Netlify
└─ package.json
```

---

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in your project, paste the contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates the `expenses` table, enables Row Level Security, and adds policies so each user can only ever see or modify their own rows.
3. (Optional but recommended for local testing) Go to **Authentication → Providers → Email** and turn **off** "Confirm email" so you can sign up and land straight in the dashboard without checking an inbox. Leave it on for a real deployment.
4. Go to **Settings → API** and copy your **Project URL** and **anon public** key — you'll need them next.

### The schema, for reference

```sql
create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null,
  amount      numeric(12, 2) not null check (amount > 0),
  category    text not null check (
    category in ('Food','Travel','Shopping','Bills','Entertainment','Health','Education','Other')
  ),
  date        date not null,
  created_at  timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "Users can view their own expenses"   on public.expenses for select using (auth.uid() = user_id);
create policy "Users can insert their own expenses"  on public.expenses for insert with check (auth.uid() = user_id);
create policy "Users can update their own expenses"  on public.expenses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own expenses"  on public.expenses for delete using (auth.uid() = user_id);
```

## 2. Environment variables

Copy the example file and fill in your project's credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Local setup

**Prerequisite:** Node.js 20 or later (the Supabase JS client's current release line requires it; Vite 5 itself works from Node 18, but installing fresh dependencies pulls in the newer Supabase client).

```bash
# install dependencies
npm install

# start the dev server
npm run dev
```

The app runs at `http://localhost:5173`. Sign up with any email/password (see step 3 in Supabase setup if you don't want to confirm emails while testing locally), and you'll land on the dashboard.

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

## 4. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Pocketwise expense tracker"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`.env` is already listed in `.gitignore`, so your Supabase keys won't be committed. Double-check `git status` before your first push if you're ever unsure.

## 5. Deploy to Vercel

1. Push the repo to GitHub (above).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Vite — leave the build command as `npm run build` and the output directory as `dist`.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. Every future push to `main` redeploys automatically.

`vercel.json` (included) rewrites every path to `index.html`, so refreshing on a client-side route like `/dashboard` won't 404.

## 6. Deploy to Netlify

1. Push the repo to GitHub (above).
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
3. Select the repo. Netlify reads `netlify.toml` (included) and picks up the build command and publish directory automatically — `npm run build` and `dist`.
4. Under **Site settings → Environment variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Deploy. `netlify.toml` already redirects all paths to `index.html` with a 200 status, so routes like `/dashboard` work on a direct refresh — no extra `_redirects` file needed.

## Notes on the design

The UI leans on a white/slate canvas with blue for primary actions and emerald for money-positive moments (the monthly total, the "Add expense" button), per a typical modern finance-dashboard palette. The monthly summary card's category-distribution bar is generated from real data — it's not decorative, it visually encodes what you're actually spending on that month.

## License

This project was generated as a learning/assignment exercise. Use it however is useful to you.
