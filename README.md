# Real-Time Weather Forecast Application

An API-driven full-stack weather application built with a **React.js** frontend and a serverless **Express / Node.js** API proxy designed for seamless deployment on **Vercel**. The system integrates the OpenWeatherMap API with backend-level key masking, in-memory caching to optimize network calls, and responsive UI components.

---

## Architecture Overview

```text
┌─────────────────┐       HTTP / REST       ┌────────────────────────┐       HTTPS        ┌─────────────────────┐
│  React.js UI    │  ───────────────────►   │ Serverless API Proxy   │  ────────────────► │ OpenWeatherMap API  │
│ (Vercel Client) │  ◄───────────────────   │ In-Memory Cache (/api) │  ◄──────────────── │                     │
└─────────────────┘      Sanitized JSON     └────────────────────────┘     Raw Payload    └─────────────────────┘
```

---
app : https://weather-forecast-app-liard.vercel.app/

## 🚀 Deploying to Vercel

### Option 1: Deploy with Vercel Web Dashboard (Recommended)

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Configure project for Vercel deployment"
   git push origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. In **Project Settings > Environment Variables**, add:
   - **Name:** `OPENWEATHER_API_KEY`
   - **Value:** `<Your_OpenWeather_API_Key>`
4. Click **Deploy**. Vercel will automatically build the React app and deploy the serverless `/api/weather` endpoint.

---

### Option 2: Deploy using Vercel CLI

1. Run the deployment command from the project root:
   ```bash
   npx vercel
   ```
2. Follow the interactive prompts to link or create a project.
3. Set your environment variable:
   ```bash
   npx vercel env add OPENWEATHER_API_KEY
   ```
4. Deploy to production:
   ```bash
   npx vercel --prod
   ```

---

## 💻 Local Development

### 1. Configure Environment
Create a `.env` file in the `server` directory or project root:
```bash
OPENWEATHER_API_KEY=your_openweather_api_key_here
PORT=5001
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 3. Run Locally
- **Start Backend:**
  ```bash
  cd server && npm start
  ```
- **Start Frontend:**
  ```bash
  cd client && npm start
  ```
- Or run with Vercel Dev locally:
  ```bash
  npx vercel dev
  ```

---

## 📁 Project Structure

```text
├── api/
│   └── weather.js          # Vercel Serverless Function proxy
├── client/
│   ├── public/             # Public assets
│   ├── src/                # React components and styling
│   └── package.json        # Frontend configuration
├── server/
│   ├── server.js           # Standalone Express development server
│   └── package.json        # Backend configuration
├── .env.example            # Sample environment variables
├── vercel.json             # Vercel routing & build configuration
└── package.json            # Root configuration
```
