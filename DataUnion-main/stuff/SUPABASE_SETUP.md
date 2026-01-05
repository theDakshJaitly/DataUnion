# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create an account)
2. Click "New Project"
3. Fill in project details:
   - **Project Name**: `data-union` (or any name you prefer)
   - **Database Password**: Create a strong password (save it somewhere safe)
   - **Region**: Choose closest to your location
4. Click "Create new project" and wait for provisioning (~2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on **Settings** (gear icon) in the left sidebar
2. Navigate to **API** section
3. You'll see two important values:
   - **Project URL**: Looks like `https://xxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`

## Step 3: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Add your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the values with your actual credentials from Step 2

## Step 4: Create Database Tables

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click "New query"
3. Copy and paste the contents of `supabase/schema.sql` into the editor
4. Click **Run** to execute the schema creation
5. You should see success messages for all 7 tables

## Step 5: Seed Mock Data (Optional but Recommended)

1. Still in SQL Editor, create another new query
2. Copy and paste the contents of `supabase/seed.sql`
3. Click **Run** to populate the database with demo data
4. This creates sample contributors, datasets, and companies

## Step 6: Verify Setup

Run this query in SQL Editor to verify everything worked:

```sql
SELECT 'contributors' as table_name, COUNT(*) as count FROM contributors
UNION ALL
SELECT 'datasets', COUNT(*) FROM datasets
UNION ALL
SELECT 'companies', COUNT(*) FROM companies;
```

You should see:
- contributors: 4
- datasets: 5
- companies: 3

## Step 7: Restart Development Server

After adding the `.env.local` file:

```bash
# Stop the current dev server (Ctrl + C)
npm run dev
```

## Troubleshooting

### Can't connect to Supabase
- Check that `.env.local` exists and has the correct values
- Make sure the environment variable names start with `NEXT_PUBLIC_`
- Restart your dev server after creating/editing `.env.local`

### Tables not created
- Make sure you copied the entire `schema.sql` file
- Check the SQL Editor for error messages
- Ensure RLS policies were created successfully

### Seed data not appearing
- Run the schema.sql first before seed.sql
- Check that the INSERT statements completed successfully
- Use the Table Editor in Supabase to view data directly

## Next Steps

Once Supabase is configured, the application will automatically connect and you can:
- Create new contributors through the contributor login
- Browse datasets in the company marketplace
- Simulate licensing events that generate payouts
