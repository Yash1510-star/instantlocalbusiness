# InstantLocalBusiness.com

AI-powered websites for local businesses — live in 60 seconds.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Lucide React
- **Images**: Unsplash (free CDN, no API key needed)
- **Deployment**: Vercel (recommended) or self-hosted

---

## Local Development

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Hosting Options (Cheapest to Most Powerful)

### Option A — Vercel (RECOMMENDED · $0/month to start)

The absolute easiest, cheapest, and fastest way to host this site.

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create instantlocalbusiness --public --push
   ```

2. Go to [vercel.com](https://vercel.com) → "Add New Project" → import your GitHub repo

3. Add environment variables (from `.env.example`) in the Vercel dashboard

4. Click Deploy. **Done.** Your site is live at `your-project.vercel.app`

5. Connect your domain `instantlocalbusiness.com`:
   - In Vercel → Project → Settings → Domains → Add `instantlocalbusiness.com`
   - In your domain registrar (Namecheap/GoDaddy), set DNS:
     - A record: `@` → `76.76.21.21`
     - CNAME: `www` → `cname.vercel-dns.com`

**Cost**: Free for personal/hobby use. ~$20/month for Pro (needed for commercial use with custom domain SLA).

**Why Vercel**: Zero config, global CDN, automatic HTTPS, instant deploys, preview URLs for every PR.

---

### Option B — Host on Your Mac (Cheapest · $0/month)

Yes — you can host this on your Mac and make it available to the internet. Here's exactly how:

#### Step 1 — Build the production app

```bash
cd /Users/pendyals/ilb
npm run build
```

#### Step 2 — Install PM2 to keep it running 24/7

```bash
npm install -g pm2
pm2 start npm --name "ilb" -- start
pm2 startup    # makes it survive reboots
pm2 save
```

Your site now runs on port 3000, always on.

#### Step 3 — Expose your Mac to the internet with Cloudflare Tunnel

Cloudflare Tunnel creates a secure HTTPS tunnel from Cloudflare's edge to your Mac — **no port forwarding, no exposing your home IP, completely free**.

```bash
# Install cloudflared
brew install cloudflare/cloudflare/cloudflared

# Login to Cloudflare (opens browser)
cloudflared tunnel login

# Create a named tunnel
cloudflared tunnel create instantlocalbusiness

# Create tunnel config
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: YOUR_TUNNEL_ID_HERE
credentials-file: /Users/pendyals/.cloudflared/YOUR_TUNNEL_ID_HERE.json

ingress:
  - hostname: instantlocalbusiness.com
    service: http://localhost:3000
  - hostname: www.instantlocalbusiness.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# Route your domain through the tunnel
cloudflared tunnel route dns instantlocalbusiness YOUR_TUNNEL_ID

# Run the tunnel (add to PM2 for persistence)
pm2 start "cloudflared tunnel run instantlocalbusiness" --name "cloudflare-tunnel"
pm2 save
```

**Your Mac is now the server and instantlocalbusiness.com is live on the internet.**

#### What you need:
- Mac stays on (or configure it to never sleep: System Settings → Energy → Prevent sleep)
- Internet connection (home broadband is fine)
- Free Cloudflare account at cloudflare.com
- Your domain DNS nameservers pointed to Cloudflare

#### Cost breakdown:
| Item | Cost |
|------|------|
| Mac (you already have it) | $0 |
| Cloudflare Tunnel | Free |
| Cloudflare DNS | Free |
| Domain (instantlocalbusiness.com) | ~$12/year |
| Electricity (Mac mini idle ~6W) | ~$6/year |
| **Total** | **~$18/year** |

---

### Option C — Cheap VPS ($5–6/month)

When your Mac can't be on 24/7 or you want dedicated hardware:

**Providers:**
- [Hetzner](https://hetzner.com) — **CX22: €3.79/mo** (2 vCPU, 4GB RAM) — best value globally
- [DigitalOcean](https://digitalocean.com) — Basic Droplet: $6/mo
- [Vultr](https://vultr.com) — Cloud Compute: $6/mo

**Deploy to any VPS:**

```bash
# On your VPS (Ubuntu 22.04)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx certbot python3-certbot-nginx

# Clone your repo
git clone https://github.com/YOUR_USERNAME/instantlocalbusiness.git
cd instantlocalbusiness

# Install and build
npm install
npm run build

# Install PM2 and start
npm install -g pm2
pm2 start npm --name "ilb" -- start
pm2 startup && pm2 save

# Configure Nginx as reverse proxy
sudo cat > /etc/nginx/sites-available/ilb << 'EOF'
server {
    server_name instantlocalbusiness.com www.instantlocalbusiness.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/ilb /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Free SSL with Let's Encrypt
sudo certbot --nginx -d instantlocalbusiness.com -d www.instantlocalbusiness.com
```

---

### Option D — Cloudflare Pages (Free · No Server Needed)

For a fully static export (no server-side rendering):

```bash
# In next.config.ts, add:
# output: 'export'
# Then:
npm run build   # generates /out folder

# Deploy to Cloudflare Pages
npm install -g wrangler
wrangler pages deploy out --project-name=instantlocalbusiness
```

**Note**: Static export disables server-side features. The `/preview/[slug]` route needs `generateStaticParams()` to work. The current app uses SSR — Vercel or a VPS is better.

---

## Recommended Approach

| Scenario | Use |
|----------|-----|
| Just launched, testing | Vercel free tier |
| Want $0/month, have a Mac always on | Cloudflare Tunnel on your Mac |
| Scaling to 1,000+ customers | Hetzner VPS ($3.79/mo) + Cloudflare CDN |
| Maximum reliability | Vercel Pro ($20/mo) |

**Start with Option A (Vercel).** If it gets traffic and you want to cut costs, migrate to Option B or C later. The app is stateless and easy to move.

---

## Production Checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` in environment variables
- [ ] Add domain to Vercel/Cloudflare
- [ ] Submit `instantlocalbusiness.com/sitemap.xml` to Google Search Console
- [ ] Set up Cloudflare for DDoS protection (free)
- [ ] Enable Vercel Analytics or Plausible for privacy-friendly analytics
- [ ] Add `public/og-image.png` (1200×630px) for social sharing previews
- [ ] Configure `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` after Search Console setup

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/build` | 5-step AI website builder |
| `/preview/[slug]` | Generated site preview |
| `/pricing` | Pricing plans |
| `/examples` | Example websites |
| `/demo` | Book a demo |
| `/contact` | Contact form |
| `/signin` | Sign in / create account |
| `/about` | About page |
| `/help` | Help center / FAQ |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Auto-generated robots file |

---

## License

Copyright © 2026 InstantLocalBusiness.com. All rights reserved.
