# Deploying QR Visitor Management System to Vercel

This guide will walk you through deploying your QR Visitor Management System to Vercel.

## Prerequisites

1. **GitHub Account**: Make sure your code is pushed to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Google Apps Script**: Your Google Apps Script should be deployed and accessible

## Step 1: Prepare Your Repository

1. Make sure all your code is committed and pushed to GitHub
2. Ensure your `.env` file is not committed (it should be in `.gitignore`)
3. Verify your `package.json` has all necessary dependencies

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with your GitHub account

2. **Import Your Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your QR Visitor Management System repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Select "Node.js"
   - **Root Directory**: Leave as `./` (root)
   - **Build Command**: Leave empty (not needed for this project)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Environment Variables**
   - Click "Environment Variables" section
   - Add the following variables:
     ```
     GOOGLE_SCRIPT_URL=your_google_apps_script_web_app_url
     CORS_ORIGIN=your_vercel_domain.vercel.app
     NODE_ENV=production
     RATE_LIMIT_MAX_REQUESTS=100
     RATE_LIMIT_WINDOW_MS=900000
     MAX_FILE_SIZE=10mb
     LOG_LEVEL=combined
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Set environment variables when prompted

## Step 3: Configure Environment Variables

After deployment, go to your Vercel project dashboard and set these environment variables:

### Required Variables:
- `GOOGLE_SCRIPT_URL`: Your Google Apps Script web app URL
- `CORS_ORIGIN`: Your Vercel domain (e.g., `https://your-app.vercel.app`)

### Optional Variables:
- `NODE_ENV`: `production`
- `RATE_LIMIT_MAX_REQUESTS`: `100`
- `RATE_LIMIT_WINDOW_MS`: `900000`
- `MAX_FILE_SIZE`: `10mb`
- `LOG_LEVEL`: `combined`

## Step 4: Update Google Apps Script CORS

1. Go to your Google Apps Script project
2. Update the CORS settings to allow your Vercel domain
3. Redeploy the Google Apps Script if necessary

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Test all functionality:
   - Visitor registration
   - Parking permit generation
   - QR code generation
   - Admin dashboard

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Make sure `CORS_ORIGIN` is set to your Vercel domain
   - Update Google Apps Script CORS settings

2. **Google Script URL Not Found**
   - Verify `GOOGLE_SCRIPT_URL` environment variable is set correctly
   - Ensure Google Apps Script is deployed as a web app

3. **Static Files Not Loading**
   - Check that all static files are in the correct directories
   - Verify file paths in your HTML files

4. **Build Errors**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility

### Getting Help:

- Check Vercel deployment logs in the dashboard
- Review function logs for serverless function errors
- Test locally with `npm start` to isolate issues

## Post-Deployment

1. **Set up Custom Domain** (Optional)
   - Go to your Vercel project settings
   - Add your custom domain
   - Update DNS settings

2. **Monitor Performance**
   - Use Vercel Analytics
   - Monitor function execution times
   - Check error rates

3. **Set up Notifications**
   - Configure deployment notifications
   - Set up error alerts

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Rate Limiting**: Adjust based on your needs
3. **CORS**: Only allow necessary origins
4. **Input Validation**: Ensure all inputs are validated

Your QR Visitor Management System should now be live on Vercel! 🚀
