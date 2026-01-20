# Deploy Kanjida to Vercel

## Quick Deploy (5 minutes)

### Step 1: Prepare Your Code

Your code is ready! Just need to push to GitHub.

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Kanjida volleyball kanji game"

# Create GitHub repo and push
# Option A: Using GitHub CLI
gh repo create kanjida-game --public --source=. --push

# Option B: Manual
# 1. Create new repo on github.com
# 2. Follow their instructions to push existing code
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name? kanjida-game
# - Which directory? ./ (current directory)
# - Override settings? No

# Your app is now live! 🎉
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Click "Deploy"

That's it! ✅

### Step 3: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `kanjida.com`)
4. Update your domain's DNS settings as instructed

## Build Settings (Auto-Configured)

Vercel automatically detects Next.js and uses these settings:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## Environment Variables

None needed! Everything runs client-side.

## Post-Deployment

Your app will be available at:
- Production: `https://your-project-name.vercel.app`
- Custom domain: `https://yourdomain.com` (if configured)

### Performance Features (Automatic)

Vercel provides these for free:
- ✅ Global CDN
- ✅ Auto HTTPS
- ✅ Automatic compression
- ✅ Image optimization
- ✅ Edge network
- ✅ Auto git branch previews

## Continuous Deployment

Every time you push to GitHub:
1. Vercel automatically builds your app
2. Runs preview deployment
3. Deploys to production (if on main branch)

## Cost

**$0/month** on Vercel's Hobby plan:
- 100GB bandwidth
- Unlimited builds
- Unlimited projects
- Custom domains
- HTTPS/SSL

Perfect for personal projects! 🎯

## Troubleshooting

### Build fails?

Check the Vercel logs in the dashboard. Common issues:
- Missing dependencies (run `npm install` locally first)
- TypeScript errors (run `npm run build` locally)

### App not loading?

- Clear browser cache
- Check browser console for errors
- Verify build succeeded in Vercel dashboard

## Mobile Testing

Test your deployed app on mobile:
1. Open on phone browser
2. Add to home screen (works as PWA)
3. Play offline after first load!

---

Need help? Check Vercel docs: https://vercel.com/docs
