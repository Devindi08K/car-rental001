# Royal Route vehicle rental website

Stack: Next.js, Prisma, Neon Postgres, Cloudinary, Auth.js.

Setup
1. Copy .env.example to .env.local and fill in every value.
2. npm install
3. npm run db:migrate   (local)  or  npm run db:deploy  (production)
4. npm run db:seed      (creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD and default settings)
5. npm run dev

Environment variables
DATABASE_URL, DIRECT_URL: Neon pooled and direct connection strings
AUTH_SECRET: generate with `npx auth secret`
NEXT_PUBLIC_SITE_URL: the live .lk domain
CLOUDINARY_*: image uploads
NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY: enquiry form spam protection (required in production)
RESEND_API_KEY, NOTIFY_EMAIL, NOTIFY_FROM: optional email alert on new enquiries

Admin panel: /admin
Vehicles (add, edit, photos, price, rented/available), Enquiries, Gallery, Page Content, Settings (contact details, social links, map, page images).

Handover notes
- Domain and hosting fees are paid by the client.
- Neon and Cloudinary use free tiers; fees apply if limits are exceeded.