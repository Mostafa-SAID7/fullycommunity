# Deploying Main Frontend to Vercel

The main frontend has been successfully deployed to Vercel!

## Production URL

**Production:** https://community-car-main-6h66mq1d4-mostafa-said7s-projects.vercel.app

## Deployment Status

✅ **Successfully Deployed**

The main frontend is now live on Vercel with the following configuration:
- **Build Command:** `npm run build:main -- --configuration production`
- **Output Directory:** `dist/main/browser`
- **Install Command:** `npm install --legacy-peer-deps`

## Switching Between Projects

Since both admin and main frontends are in the same directory, you need to switch the Vercel project link when deploying:

### To Deploy Main Frontend:
1. Update `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build:main -- --configuration production",
     "outputDirectory": "dist/main/browser"
   }
   ```
2. Link to main project:
   ```powershell
   npx vercel link --project=community-car-main
   ```
3. Deploy:
   ```powershell
   npx vercel --prod
   ```

### To Deploy Admin Frontend:
1. Update `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build:admin -- --configuration production",
     "outputDirectory": "dist/admin/browser"
   }
   ```
2. Link to admin project:
   ```powershell
   npx vercel link --project=community-car-admin
   ```
3. Deploy:
   ```powershell
   npx vercel --prod
   ```

## Build Warnings

The build shows a budget warning (bundle exceeded 500KB by 114KB). This is just a warning and doesn't prevent deployment. To optimize:
- Consider code splitting
- Lazy load components
- Optimize assets

## Next Steps

- Configure environment variables in Vercel dashboard if needed
- Set up custom domains for both projects
- Configure CI/CD for automatic deployments

