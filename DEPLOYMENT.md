# Deployment Guide

## Deploy to Vercel (Recommended)

The BD Control Plane is optimized for deployment on Vercel.

### Option 1: GitHub Integration (Easiest)

1. Push your repository to GitHub (already done!)
   ```bash
   git push origin main
   ```

2. Visit [vercel.com](https://vercel.com) and sign in with GitHub

3. Click "Add New..." → "Project"

4. Import the `bd-control-plane` repository

5. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`
   - **Output Directory**: `.next`

6. Click "Deploy"

That's it! Vercel will:
- Automatically deploy on every push to `main`
- Provide a production URL
- Handle SSL certificates
- Enable preview deployments for PRs

### Option 2: Vercel CLI

If you prefer command-line deployment:

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Environment Variables

No environment variables are required for the basic deployment. The app works out of the box!

However, if you want to customize behavior:

- `NEXT_PUBLIC_APP_URL`: Your production URL (optional)

## Post-Deployment

After deployment, your dashboard will:
- Scan for `.beads/` directories when accessed
- Work with any BD-tracked repositories on the server
- Display data from the deployment environment

**Note**: The deployed version will only show BD data from repositories on the Vercel build environment. For local development with your actual repositories, run:

```bash
npm run dev
```

## Continuous Deployment

With GitHub integration, Vercel automatically:
- Deploys `main` branch to production
- Creates preview deployments for PRs
- Runs build checks on every push

## Custom Domain

To add a custom domain:
1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

### Build Failures

If the build fails:
1. Check the build logs on Vercel
2. Ensure all dependencies are in `package.json`
3. Verify the install command includes `--legacy-peer-deps`

### Peer Dependency Issues

If you see peer dependency warnings:
- The `--legacy-peer-deps` flag in `vercel.json` should handle this
- If issues persist, update `package.json` dependency versions

### No Data Showing

Remember: The production deployment scans for `.beads/` directories in the deployment environment. To see your local BD data:
- Run the app locally with `npm run dev`
- Or commit your `.beads/` directory to git (if you want to track issues in version control)

---

**Deployment Status**: ✅ Ready to deploy!

Repository: https://github.com/numman-ali/bd-control-plane
