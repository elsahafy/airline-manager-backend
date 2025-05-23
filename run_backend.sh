#!/bin/bash

# Setup script for Airlines Manager Backend with SupaBase integration
# This script sets up the environment and starts the Flask backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Set environment variables
export FLASK_APP=src/main.py
export FLASK_ENV=development
export SECRET_KEY="development-secret-key"

# SupaBase credentials are already configured in the application
export SUPABASE_URL="https://klxiwfahaqwxwgmquipl.supabase.co"
export SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtseGl3ZmFoYXF3eHdnbXF1aXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTc0MDEsImV4cCI6MjA2MzQ3MzQwMX0.ye22o2HYX_8qtWTfUFU8RpUeb1S_vC8BoXZsJ-43wyI"

# Start the Flask application
echo "Starting Flask application..."
echo "The backend will be available at http://localhost:5000"
echo "IMPORTANT: Make sure you have set up the required tables in SupaBase (see SUPABASE_SETUP.md)"
python -m flask run --host=0.0.0.0
