# Airlines Manager Webapp - Updated User Guide

## Overview
This application helps you optimize your Airlines Manager tycoon game by recommending the best aircraft, cabin configurations, and routes to maximize profitability.

## Application Structure
- **Frontend**: React application with TypeScript (deployed)
- **Backend**: Flask API with SupaBase integration (run locally)

## Quick Start Guide

### Step 1: Set Up SupaBase Database
1. Follow the instructions in `SUPABASE_SETUP.md` to create all required tables
2. Add sample aircraft data using the provided SQL scripts
3. Verify that tables are created correctly in your SupaBase dashboard

### Step 2: Run the Backend
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

### Step 3: Access the Frontend
The frontend is deployed and accessible at:
**[https://wtnbhopg.manus.space](https://wtnbhopg.manus.space)**

## Using the Application

### First-Time Setup
1. Register a new account using the registration form
2. Create your airline by providing a name and hub airport code
3. Log in with your credentials

### Features

#### Dashboard
- Overview of your airline's performance
- Total routes, aircraft, and profit statistics
- Most profitable route and recommended aircraft

#### Aircraft Finder
- Find the perfect aircraft for your routes
- Filter by manufacturer, range, and type
- Compare aircraft specifications and costs

#### Route Finder
- Discover profitable routes from your hub
- Filter by country and aircraft compatibility
- View detailed route information including demand and profit

#### Cabin Configurator
- Optimize cabin layouts for specific routes
- Balance economy, business, and first-class seating
- Maximize profitability based on route demand

## Troubleshooting

### Backend Issues
- Ensure Python and all dependencies are installed
- Verify that SupaBase tables are created according to the setup guide
- Check that the Flask application is running on port 5000
- Look for error messages in the terminal running the backend

### Frontend Issues
- Clear browser cache and cookies
- Use a CORS browser extension if needed
- Check browser console for error messages
- Verify that the backend URL is correctly configured

### Authentication Issues
- Ensure SupaBase tables are set up correctly
- Check that the users table has the correct structure
- Verify that Row Level Security policies are applied

## Advanced Configuration

### Customizing the Backend
- Edit `src/main.py` to modify API endpoints or add new features
- Update route handlers in the `src/routes` directory
- Add new models in the `src/models` directory

### Connecting to a Different SupaBase Project
If you want to use a different SupaBase project:
1. Update the SupaBase URL and key in `run_backend.sh`
2. Update the SupaBase URL and key in `src/main.py`
3. Update the SupaBase URL and key in `src/lib/supabase.ts` in the frontend

## Support and Feedback
For additional help or feature requests, please contact the developer.
