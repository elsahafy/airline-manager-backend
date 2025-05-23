import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Get Supabase credentials
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://klxiwfahaqwxwgmquipl.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtseGl3ZmFoYXF3eHdnbXF1aXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTc0MDEsImV4cCI6MjA2MzQ3MzQwMX0.ye22o2HYX_8qtWTfUFU8RpUeb1S_vC8BoXZsJ-43wyI')
SECRET_KEY = os.getenv('SECRET_KEY', 'development-secret-key')

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY
app.config['JSON_SORT_KEYS'] = False

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Import routes
from src.routes.auth import auth_bp
from src.routes.aircraft import aircraft_bp
from src.routes.routes import routes_bp
from src.routes.config import config_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(aircraft_bp, url_prefix='/api/aircraft')
app.register_blueprint(routes_bp, url_prefix='/api/routes')
app.register_blueprint(config_bp, url_prefix='/api/config')

# Root route
@app.route('/')
def index():
    return jsonify({
        'message': 'Airlines Manager Optimizer API',
        'status': 'running',
        'version': '1.0.0',
        'supabase_url': SUPABASE_URL
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not Found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    # Get port from environment variable for cloud deployment
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
