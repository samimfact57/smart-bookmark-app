# Smart Bookmark App

A simple real-time bookmark manager built using Next.js (App Router), Supabase, and Tailwind CSS.

## 🚀 Live Demo

🔗 Live URL: https://your-vercel-url.vercel.app

---

## 🛠 Tech Stack

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Google OAuth (No email/password login)
- Tailwind CSS
- Vercel (Deployment)

---

## ✅ Features

1. Google Authentication (OAuth only)
2. Add bookmarks (URL + Title)
3. Private bookmarks per user
4. Real-time updates across tabs
5. Delete own bookmarks
6. Deployed on Vercel

---

## 🔐 Authentication

Authentication is handled using Supabase Auth with Google OAuth provider enabled.

Only authenticated users can:
- Add bookmarks
- View their own bookmarks
- Delete their bookmarks

---

## 🗄 Database Schema

Table: `bookmarks`

| Column     | Type      | Description |
|------------|----------|-------------|
| id         | uuid (PK)| Bookmark ID |
| user_id    | uuid     | Linked to authenticated user |
| title      | text     | Bookmark title |
| url        | text     | Bookmark URL |
| created_at | timestamp| Created time |

---

## 🔒 Row Level Security (RLS)

RLS is enabled to ensure:

- Users can only view their own bookmarks
- Users can only insert their own bookmarks
- Users can only delete their own bookmarks

### Example RLS Policy

```sql
CREATE POLICY "Users can view their own bookmarks"
ON bookmarks
FOR SELECT
USING (auth.uid() = user_id);
