# Airlines Manager Webapp - User Guide

## Overview
This application helps you optimize your Airlines Manager tycoon game by recommending the best aircraft, cabin configurations, and routes to maximize profitability.

## Application Structure
- **Frontend**: React application with TypeScript
- **Backend**: Flask API with SupaBase integration

## Deployed Frontend
The frontend is deployed and accessible at:
**[https://wtnbhopg.manus.space](https://wtnbhopg.manus.space)**

## Running the Backend Locally

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- SupaBase account (for authentication and database)

### Step 1: Clone or Download the Repository
Ensure you have the complete application code on your local machine.

### Step 2: Set Up SupaBase
1. Create a SupaBase account at [https://supabase.com/](https://supabase.com/)
2. Create a new project
3. Set up the following tables:
   - users
   - airlines
   - aircraft
   - routes
   - owned_aircraft
4. Note your SupaBase URL and API key (found in Project Settings > API)

### Step 3: Configure Environment Variables
1. Open the `run_backend.sh` script
2. Uncomment and update the SupaBase environment variables:
   ```bash
   export SUPABASE_URL="https://your-supabase-url.supabase.co"
   export SUPABASE_KEY="your-supabase-key"
   ```

### Step 4: Run the Backend
1. Navigate to the backend directory:
   ```bash
   cd airline-manager
   ```
2. Make the run script executable:
   ```bash
   chmod +x run_backend.sh
   ```
3. Run the script:
   ```bash
   ./run_backend.sh
   ```
4. The backend will be available at `http://localhost:5000`

## Connecting Frontend to Local Backend
To use the deployed frontend with your local backend:

1. Install a CORS browser extension (like "CORS Unblock" for Chrome)
2. Enable the extension when using the application
3. The frontend will attempt to connect to the local backend at `http://localhost:5000/api`

## Features

### Dashboard
- Overview of your airline's performance
- Total routes, aircraft, and profit statistics
- Most profitable route and recommended aircraft

### Aircraft Finder
- Find the perfect aircraft for your routes
- Filter by manufacturer, range, and type
- Compare aircraft specifications and costs

### Route Finder
- Discover profitable routes from your hub
- Filter by country and aircraft compatibility
- View detailed route information including demand and profit

### Cabin Configurator
- Optimize cabin layouts for specific routes
- Balance economy, business, and first-class seating
- Maximize profitability based on route demand

## Deploying to Your Own Server

### Backend Deployment
1. Set up a server with Python support
2. Clone the repository to your server
3. Install dependencies: `pip install -r requirements.txt`
4. Set environment variables for production:
   ```
   FLASK_ENV=production
   FLASK_APP=src/main.py
   SECRET_KEY=your-secret-key-here
   SUPABASE_URL=https://your-supabase-url.supabase.co
   SUPABASE_KEY=your-supabase-key
   ```
5. Run with a production WSGI server like Gunicorn:
   ```
   gunicorn -w 4 -b 0.0.0.0:5000 'src.main:app'
   ```

### Frontend Deployment
The frontend is already deployed at https://wtnbhopg.manus.space, but if you want to deploy it to your own server:

1. Update the API URL in `.env.production`:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
   VITE_SUPABASE_KEY=your-supabase-anon-key
   ```
2. Build the frontend: `cd airline-manager-frontend && pnpm build`
3. Deploy the contents of the `dist` directory to your web server

## Troubleshooting

### Backend Issues
- Ensure Python and all dependencies are installed
- Check that SupaBase URL and key are correct
- Verify that the Flask application is running on port 5000

### Frontend Issues
- Clear browser cache and cookies
- Ensure CORS is properly configured if using a different backend
- Check browser console for error messages

### Authentication Issues
- Verify SupaBase configuration
- Ensure the correct API keys are being used
- Check that the necessary tables exist in your SupaBase project

## Support
For additional help or feature requests, please contact the developer.
