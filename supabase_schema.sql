-- Create the bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;

-- Create Policy: Users can only select their own bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

-- Create Policy: Users can only insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- Create Policy: Users can only update their own bookmarks
create policy "Users can update their own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

-- Create Policy: Users can only delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Enable Realtime for the bookmarks table
alter publication supabase_realtime add table public.bookmarks;
