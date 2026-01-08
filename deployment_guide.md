# Deploying to Vercel

Reference the following steps to deploy your application to Vercel.

## 1. Prerequisites
- Ensure your code is pushed to a GitHub repository.
- Create an account on [Vercel](https://vercel.com).

## 2. Configuration (Already Created)
I have created the following configuration files for you:
- `vercel.json`: Defines how to build the Frontend and Backend, and how to route traffic.
- `.vercelignore`: Prevents unnecessary files from being uploaded.
- Configured `vite.config.js` and `main.py` for production compatibility.

## 3. How to Deploy

### Option A: Connect via GitHub (Recommended)
1. Go to the Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2. Import your GitHub repository.
3. Vercel should detect the `vercel.json` configuration.
4. Click **Deploy**.

### Option B: Vercel CLI
If you have the Vercel CLI installed:
1. Open a terminal in the project root (`d:\MLDL\ALIVE`).
2. Run:
   ```bash
   vercel
   ```
3. Follow the prompts.

## Troubleshooting
- **Limit Exceeded**: If the build fails due to size (Serverless Function limit is 250MB), you may need to optimize `BackEnd/requirements.txt` by removing unused libraries.
- **CORS Errors**: If you see network errors, check the Browser Console. I have enabled CORS for all origins (`*`) in `main.py` which should prevent this.
