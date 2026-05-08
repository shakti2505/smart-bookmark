# Marked. - Real-Time Bookmarking App

Marked is a premium, full-stack bookmarking application built with Next.js and Supabase. It allows users to securely save, manage, and sync their favorite links in real-time across multiple devices.

## Features

* **Google Authentication:** Secure login using Supabase OAuth.
* **Real-Time Sync:** WebSockets keep bookmarks instantly synced across multiple tabs or devices.
* **Auto-Title Fetching (Bonus Feature):** Paste a URL, and the app automatically scrapes the website's title via a custom serverless API route.
* **Optimistic UI:** Instantaneous UI updates when adding or deleting bookmarks, providing a snappy, lag-free user experience.
* **Premium UI/UX:** Built with Tailwind CSS, featuring a split-pane layout, glassmorphism, ambient background glows, and fully responsive design.
* **Enterprise-Grade Security:** Row Level Security (RLS) ensures users can only access and modify their own data.

## Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Lucide Icons, React Hot Toast
* **Backend & Auth:** Supabase (PostgreSQL, Google OAuth, Realtime)
* **Language:** TypeScript

---

## Local Setup Instructions

### 1. Clone & Install
```bash
git clone <https://github.com/shakti2505/smart-bookmarkl>
cd marked-app
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Supabase Database Setup
Go to your Supabase SQL Editor and run the following script to create the table and apply security policies:

```sql
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  title text not null
);

-- Enable RLS
alter table public.bookmarks enable row level security;

-- Setup Policies
create policy "Users can view own bookmarks" on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert own bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can delete own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);

-- Fix delete broadcasting for Realtime
alter table public.bookmarks replica identity full;
```

### 4. Enable Realtime
In the Supabase Dashboard, go to **Database > Tables**, edit the `bookmarks` table, and check the **Enable Realtime** box.

### 5. Google Auth Setup
In Supabase, go to **Authentication > Providers**, enable Google, and input your Google Cloud Client ID and Secret.

### 6. Run the App
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

---

## Architecture & Decisions Taken

1. **Optimistic UI Updates:** Relying purely on WebSocket events for the user who initiated an action creates a sluggish UX. I decided to implement Optimistic UI: when a user adds or deletes a bookmark, the local React state updates *instantly*, while the database syncs in the background. The Realtime listener is then configured to ignore duplicate events and only update *other* active sessions.
2. **Server-Side Scraping Route:** To implement the auto-title fetching feature, doing a direct `fetch()` from the browser to the target website would result in strict CORS errors. I solved this by creating a Next.js API Route (`/api/scrape`). The frontend passes the URL to our backend, the backend safely fetches the HTML, parses the `<title>`, and returns it to the client.
3. **Server Components + Client Components:** I utilized the Next.js App Router paradigm by fetching the user session and initial bookmark data securely on the server (`page.tsx`), and passing it down to a rich, interactive Client Component (`BookmarkManager.tsx`) to handle the Realtime subscriptions.
4. **Premium UI/UX as a Core Feature:** To elevate the app from a basic CRUD tool to a SaaS-tier product, I focused heavily on the landing page experience. By implementing a split-pane design, ambient lighting, and an interactive testimonial slider with `framer-motion`, I aimed to demonstrate strong frontend product sense, user psychology (trust signals), and attention to detail.

---

## Problems Faced & How I Solved Them

* **Problem 1: Supabase PGRST205 Schema Cache Error**
  * *Issue:* Initallly supbase google oauth was returing error that no API Key was passed in request header.
  * *Issue:* After one debugging finally found the culprit, it was the supabase URL from .env, it was "https://projectID.supabase.co/auth/v1" copied from the supabse dashboard but it must be only "https://jyidkzufmmtrgmsvxbax.supabase.co".
  * *Issue:* After initially setting up the database, API requests returned a schema cache error because PostgREST didn't recognize the new table.
  * *Solution:* I resolved this by running the SQL command `NOTIFY pgrst, 'reload schema'` to force the database engine to refresh its cache.
* **Problem 2: Realtime Deletes Not Broadcasting Old Data**
  * *Issue:* Realtime was syncing insertions perfectly, but deletions weren't removing the item from secondary tabs because Postgres wasn't broadcasting the `old` payload by default.
  * *Solution:* I altered the table's replica identity using `alter table public.bookmarks replica identity full;` to ensure the full deleted record was sent to the WebSocket.
* **Problem 3: Typescript 'Any' Type Errors in Components**
  * *Issue:* After refactoring to separate the UI and business logic, Next.js threw errors because props lacked type definitions in `.tsx` files.
  * *Solution:* I exported a strict `Bookmark` TypeScript interface from the custom hook and applied it directly to the component props to satisfy the compiler and ensure data safety.

---

## Future Improvements

**Browser Extension Integration:**
Currently, modern web browsers enforce strict security sandboxes preventing web apps from reading a user's open tabs. To implement a "Save All Tabs" feature, the next architectural step is to build a companion Google Chrome Extension using the `chrome.tabs` API. This extension would gather the open URLs and securely post them to our Next.js API endpoints.
