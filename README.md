# KIYARAA – Flower Boutique (Next.js + Supabase)

## 1. Run locally
1. Install Node 18+. In this folder: `npm install`
2. Create a free project at supabase.com.
3. Copy `.env.example` to `.env.local` and paste your Project URL and anon key (Supabase → Project Settings → API).
4. `npm run dev` → http://localhost:3000 (admin at /admin)

## 2. Set up the database
Supabase → SQL Editor → paste all of `supabase/schema.sql` → Run. This creates tables, security rules, the image bucket, and demo data (sample prices/stock are editable).

## 3. Create the first admin
1. Supabase → Authentication → Users → Add user (email + password, tick "Auto confirm").
2. SQL Editor: `insert into admin_users(user_id,email) select id,email from auth.users where email='YOU@EXAMPLE.COM';`
3. Sign in at /admin. Authorization is enforced by database Row Level Security, so only listed admins can change data.
Also turn off public sign-ups: Authentication → Providers → Email → disable "Allow new users to sign up".

## 4. Change the WhatsApp number / add products
/admin → Settings → WhatsApp number (digits only, e.g. 94771234567). /admin → Products → Add product (upload images, set variations like `Small:4500, Large:7500`). Delete demo products when ready.

## 5. Deploy and custom domain
Push to GitHub → vercel.com → Import → add the two env vars → Deploy. Vercel → Settings → Domains → add your domain and set the DNS records it shows. Add the Vercel URL under Supabase → Authentication → URL Configuration.

## Needs your accounts / not built yet
Supabase and Vercel accounts, domain purchase, real photos and contact details. Not included: online card payments (by design), email notifications, newsletter storage (form is a placeholder), Excel export (CSV opens in Excel), separate weekly/product report pages (dashboard covers daily/weekly/monthly sales; orders export to CSV), category/promo banner editing beyond the hero image, an Instagram feed (link only), per-page SEO metadata for product pages beyond the title.
