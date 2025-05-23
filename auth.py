from flask import Blueprint, request, jsonify, session
from src.main import supabase
import json

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user with SupaBase authentication"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({
                'error': 'Missing required fields',
                'message': 'Email and password are required'
            }), 400
            
        # Register user with Supabase
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        # Create airline record for the new user
        if response.user:
            airline_name = data.get('airline_name', f"{email.split('@')[0]}'s Airline")
            hub_airport_code = data.get('hub_airport_code', 'JFK')
            
            # Insert airline data into the airlines table
            airline_data = supabase.table('airlines').insert({
                'user_id': response.user.id,
                'name': airline_name,
                'hub_airport_code': hub_airport_code,
                'balance': 1000000  # Starting balance
            }).execute()
            
            return jsonify({
                'message': 'User registered successfully',
                'user': {
                    'id': response.user.id,
                    'email': response.user.email,
                    'airline': airline_name
                }
            }), 201
        else:
            return jsonify({
                'error': 'Registration failed',
                'message': 'Could not create user account'
            }), 400
            
    except Exception as e:
        return jsonify({
            'error': 'Registration failed',
            'message': str(e)
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login a user with SupaBase authentication"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({
                'error': 'Missing required fields',
                'message': 'Email and password are required'
            }), 400
            
        # Login user with Supabase
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        # Store session data
        session['user'] = {
            'id': response.user.id,
            'email': response.user.email,
            'access_token': response.session.access_token
        }
        
        # Get airline data
        airline_data = supabase.table('airlines').select('*').eq('user_id', response.user.id).execute()
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': response.user.id,
                'email': response.user.email
            },
            'airline': airline_data.data[0] if airline_data.data else None,
            'token': response.session.access_token
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Login failed',
            'message': str(e)
        }), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout a user and clear session"""
    try:
        # Clear session
        session.pop('user', None)
        
        # Sign out from Supabase
        supabase.auth.sign_out()
        
        return jsonify({
            'message': 'Logout successful'
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Logout failed',
            'message': str(e)
        }), 500

@auth_bp.route('/user', methods=['GET'])
def get_user():
    """Get current user information"""
    try:
        # Check if user is in session
        user = session.get('user')
        
        if not user:
            return jsonify({
                'error': 'Unauthorized',
                'message': 'User not logged in'
            }), 401
            
        # Get user data from Supabase
        user_data = supabase.auth.get_user(user.get('access_token'))
        
        # Get airline data
        airline_data = supabase.table('airlines').select('*').eq('user_id', user.get('id')).execute()
        
        return jsonify({
            'user': {
                'id': user_data.user.id,
                'email': user_data.user.email
            },
            'airline': airline_data.data[0] if airline_data.data else None
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to get user data',
            'message': str(e)
        }), 500
