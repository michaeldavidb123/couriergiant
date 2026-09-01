# VeloRoute — Courier Logistics

Next.js marketing site for courier & last-mile logistics, built to match the **Creliora** editorial marketing design system.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript
- Lucide icons

## Run locally

```bash
cd courier-logistics
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

The marketing site reads parcel tracking from the Creliora API. Run the API on port 5001, then copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Demo tracking codes: `EG123456789IN`, `VR-482910`.

## Admin

Parcel admin lives on this site (not Creliora):

- Sign in: [http://localhost:3001/admin/login](http://localhost:3001/admin/login)
- Desk: [http://localhost:3001/admin](http://localhost:3001/admin)

Create / reset the admin user in Supabase from the API repo (set a strong `COURIER_ADMIN_PASSWORD` in `api/.env` first):

```bash
cd api
COURIER_ADMIN_EMAIL=you@company.com COURIER_ADMIN_PASSWORD='your-strong-password' npm run seed:courier-admin
```

The account is stored in the `user_databank` table (`user_role = admin`).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, services, process, stats |
| `/services` | Service offerings |
| `/tracking` | Shipment tracking (demo timeline) |
| `/pricing` | Pricing plans |
| `/about` | Company overview |
| `/contact` | Contact form |
| `/faq` | FAQ |
| `/admin/login` | Parcel admin sign in |
| `/admin` | Parcel admin desk |

## Design system

Uses the same `mk-*` marketing tokens as Creliora:

- Neutral palette (`#f7f7f5` background, `#111` text)
- Plus Jakarta Sans + Inter + JetBrains Mono
- Rounded cards, pill buttons, editorial typography
- Hero banner with typewriter + mesh/grid background
- Scroll-to-top control

## Brand

Default brand name: **VeloRoute**. Edit `SITE_NAME`, `SITE_DOMAIN`, `SITE_PHONE`, and `SITE_MAILBOXES` at the top of `lib/site-config.ts` to rebrand or update contact details.

## Env

```bash
NEXT_PUBLIC_SITE_URL=https://veloroute.com
```
