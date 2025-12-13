# Deploying Admin Frontend to Vercel

The Vercel configuration file `vercel.json` has been verified and is ready for deployment.

## Verified Configuration
- **Project:** `community-car-admin`
- **Build Command:** `npm run build:admin`
- **Output Directory:** `dist/admin/browser`
- **Routing:** Rewrites all paths to `index.html` (SPA support)

## Deployment Steps

Since the Vercel CLI requires authentication, please run the following commands in your terminal:

1. **Navigate to the ClientApp directory:**
   ```powershell
   cd ClientApp
   ```

2. **Login to Vercel (if not already logged in):**
   ```powershell
   npx vercel login
   ```

3. **Deploy to Production:**
   ```powershell
   npx vercel --prod
   ```

   Follow the interactive prompts:
   - **Set up and deploy?** [Y]
   - **Which scope?** (Select your account/team)
   - **Link to existing project?** [N] (unless you have one already)
   - **Project Name:** `community-car-admin` (or your preferred name)
   - **In which directory is your code located?** `./` (Default)
   - **Want to modify these settings?** [N] (The `vercel.json` file already handles this!)

## Troubleshooting
If you encounter any issues, ensure:
- You are in the `ClientApp` directory.
- `package.json` and `vercel.json` are present in this directory.
