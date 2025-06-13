# Supabase Setup Guide

## Prerequisites
- Node.js installed on your local machine
- A Supabase account (free tier available)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `portfolio-optimizer`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"

## Step 2: Get Project Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

## Step 3: Install Supabase CLI

```bash
npm install -g supabase
```

## Step 4: Login and Link Project

```bash
# Login to Supabase
supabase login

# Navigate to your project directory
cd /path/to/your/project

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF
```

Your project ref can be found in your Supabase dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`

## Step 5: Deploy Edge Function

```bash
# Deploy the fetch-stocks function
supabase functions deploy fetch-stocks
```

## Step 6: Set Environment Variables

Create a `.env.local` file in your project root:

```env

```

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Select some stocks in the application
3. Click "Optimize Portfolio"
4. The app should now fetch real stock data from Yahoo Finance via your Supabase Edge Function

## Troubleshooting

### Function Not Found Error
- Make sure the function is deployed: `supabase functions list`
- Check function logs: `supabase functions logs fetch-stocks`

### CORS Errors
- Ensure your domain is added to the allowed origins in Supabase dashboard
- Check that the function includes proper CORS headers

### Environment Variables Not Working
- Make sure `.env.local` is in your project root
- Restart your development server after adding environment variables
- Check that variable names start with `VITE_` for Vite projects

### Yahoo Finance API Errors
- The function uses yahoo-finance2 which may have rate limits
- Consider implementing caching for production use
- Check function logs for specific error messages

## Production Deployment

For production deployment (like Netlify), add the environment variables in your hosting platform's dashboard:

### Netlify
1. Go to Site settings > Environment variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy your site

## Current Status

Without Supabase configured, the application will:
- Use mock data for stock prices
- Still perform portfolio optimization
- Show realistic-looking results for demonstration

With Supabase configured, the application will:
- Fetch real stock data from Yahoo Finance
- Provide accurate portfolio optimization
- Support real-time market data