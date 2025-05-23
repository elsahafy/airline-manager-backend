import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# SupaBase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://your-supabase-url.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'your-supabase-key')

# Flask configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 't')

# Database configuration
DB_USERNAME = os.getenv('DB_USERNAME', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'password')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_NAME = os.getenv('DB_NAME', 'mydb')

# Application configuration
APP_NAME = 'Airlines Manager Optimizer'
