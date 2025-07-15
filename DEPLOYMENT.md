# Vercel Deployment Guide for Fix-Time

This guide will help you deploy your Fix-Time application on Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. A MongoDB database (MongoDB Atlas recommended)
3. Git repository with your Fix-Time code

## Step 1: Set up environment variables

Create a `.env` file in the root of your project with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

## Step 2: Deploy to Vercel

1. Login to [Vercel](https://vercel.com)
2. Click "New Project" and import your Git repository
3. Configure the project:
   - Root Directory: Leave as is (the repository root)
   - Framework Preset: Select "Other"
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/build`
4. Add the environment variables from Step 1 to the Vercel project settings
5. Click "Deploy"

## Step 3: Configure Domain Settings

1. After deployment, go to your project settings
2. Under "Domains", you can add a custom domain or use the default Vercel domain
3. Update the `FRONTEND_URL` in your environment variables if you change the domain

## Troubleshooting

- **404 Errors**: Make sure your `vercel.json` configuration is correct
- **API Connection Issues**: Verify that environment variables are set correctly
- **CORS Errors**: Ensure that your server's CORS settings include your Vercel domain
- **Database Errors**: Check your MongoDB connection string and network access settings

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel) 