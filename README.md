# Allesley Parish Council Website

Modern website for Allesley Parish Council, Coventry — built with Next.js 15 and Payload CMS v3.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| CMS | Payload CMS v3 (embedded in Next.js) |
| Database | PostgreSQL |
| Auth | Payload built-in + Zoho OAuth2 SSO |
| Styling | Tailwind CSS |
| Deployment | Railway |

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- PostgreSQL database (or use Railway's free Postgres add-on)

### 1. Clone and install

```bash
git clone https://github.com/liamgilleran/allesley-parish-council.git
cd allesley-parish-council
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and set at minimum:
- `DATABASE_URL` — your PostgreSQL connection string
- `PAYLOAD_SECRET` — a random 32-char secret (`openssl rand -hex 32`)
- `NEXT_PUBLIC_SERVER_URL` — `http://localhost:3000` for local dev

### 3. Run

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin CMS: http://localhost:3000/admin

On first run, visit `/admin` and create your first admin user.

---

## Deploying to Railway

1. Push this repo to GitHub
2. In Railway: **New Project → Deploy from GitHub repo**
3. Add a **PostgreSQL** service (Railway provides this free)
4. Set environment variables (see `.env.example`):
   - `DATABASE_URL` — Railway auto-sets this when you add Postgres
   - `PAYLOAD_SECRET`
   - `NEXT_PUBLIC_SERVER_URL` — your Railway domain
5. Deploy — Railway will use the `Dockerfile` automatically

### Optional: Zoho SSO

1. Go to [https://api-console.zoho.com](https://api-console.zoho.com)
2. Create a **Server-based Application**
3. Set Redirect URI: `https://your-domain/api/auth/zoho/callback`
4. Scopes: `AaaServer.profile.Read`
5. Set in Railway env: `ZOHO_CLIENT_ID` and `ZOHO_CLIENT_SECRET`
6. Uncomment the `auth.providers` block in `src/payload.config.ts`

---

## User Roles

| Role | Capabilities |
|------|-------------|
| **Admin** | Create, edit, publish, delete, archive all content. Manage users. |
| **Councillor** | Create draft posts, edit own drafts, archive own posts. Publishing requires admin approval. |

New users provisioned via Zoho SSO are created as **Councillor** by default. An admin must promote them if needed.

---

## CMS Content Types

| Collection | Description |
|-----------|-------------|
| Posts | Notices, news, crime alerts, vacancies |
| Meetings | Upcoming & past meetings with agenda/minutes uploads |
| Documents | Policies, accounts, financial regs, GDPR docs |
| Gallery | Photo albums |
| Council Members | Councillor profiles for the public site |
| Media | All uploaded files (images, PDFs, Word docs) |
| Users | Admin and councillor accounts |
| Site Settings | Global settings, hero text, emergency banner |

---

## File Storage

By default, uploaded files are stored in `/public/media/`. On Railway this is ephemeral — files are lost on redeploy.

For production, configure S3-compatible storage (e.g. Cloudflare R2 — free tier):
- Add `S3_*` variables to your Railway environment
- Update `src/payload.config.ts` to use `@payloadcms/storage-s3`

---

## Licence

Built for Allesley Parish Council, Coventry. All rights reserved.
