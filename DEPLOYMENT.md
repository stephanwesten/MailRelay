# Deployment Guide

## Prerequisites

1. **Cloudflare Account**: Sign up at https://dash.cloudflare.com
2. **Node.js**: v20 or higher
3. **Wrangler CLI**: Installed via npm (included in dev dependencies)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Local Environment

Create a `.dev.vars` file in the project root for local development:

```bash
PERSONAL_EMAIL=your-personal@example.com
WORK_EMAIL=your-work@example.com
MAILCHANNELS_API_KEY=your-mailchannels-key
PINCODE=your-secret-pincode
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=MailRelay
```

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:8787` to test locally.

## Production Deployment

### Option 1: GitHub Actions (Automatic)

#### Setup GitHub Secrets

Go to your repository Settings → Secrets and variables → Actions, and add:

1. **CLOUDFLARE_API_TOKEN**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Create token with "Edit Cloudflare Workers" permissions
   - Copy and paste into GitHub secret

2. **CLOUDFLARE_ACCOUNT_ID**
   - Find at https://dash.cloudflare.com
   - Look in the URL or Workers & Pages section
   - Copy your Account ID

#### Configure Worker Secrets

Set environment variables in Cloudflare:

```bash
# Using Wrangler CLI locally
wrangler secret put PERSONAL_EMAIL
wrangler secret put WORK_EMAIL
wrangler secret put MAILCHANNELS_API_KEY
wrangler secret put PINCODE
wrangler secret put FROM_EMAIL
wrangler secret put FROM_NAME
```

Or set them in the Cloudflare Dashboard:
- Go to Workers & Pages → mailrelay → Settings → Variables
- Add each secret

#### Deploy

Push to `main` branch:

```bash
git push origin main
```

GitHub Actions will automatically deploy to Cloudflare Workers.

### Option 2: Manual Deployment

```bash
# Build and deploy
npm run deploy
```

## MailChannels Setup

MailRelay uses MailChannels for email delivery. You need:

1. **Domain with SPF/DKIM configured** for MailChannels
2. **MailChannels API access** (free for Cloudflare Workers users)

See: https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/

## Verification

After deployment:

1. Visit your worker URL (e.g., `https://mailrelay.<your-subdomain>.workers.dev`)
2. You should see "Deployment Test Successful"
3. Test sending an email through the form

## Troubleshooting

### Deployment fails

- Check GitHub Actions logs
- Verify CLOUDFLARE_API_TOKEN has correct permissions
- Verify CLOUDFLARE_ACCOUNT_ID is correct

### Worker runs but emails don't send

- Check MailChannels API key is set correctly
- Verify domain SPF/DKIM records
- Check worker logs in Cloudflare Dashboard

### Local development issues

- Ensure `.dev.vars` file exists with all required variables
- Run `wrangler login` if authentication fails
