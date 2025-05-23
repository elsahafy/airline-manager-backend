from flask import Blueprint, request, jsonify, session
from src.main import supabase

aircraft_bp = Blueprint('aircraft', __name__)

@aircraft_bp.route('/', methods=['GET'])
def get_all_aircraft():
    """Get all aircraft from the database"""
    try:
        # Get all aircraft data
        aircraft_data = supabase.table('aircraft').select('*').execute()
        
        return jsonify({
            'aircraft': aircraft_data.data
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to get aircraft data',
            'message': str(e)
        }), 500

@aircraft_bp.route('/<int:id>', methods=['GET'])
def get_aircraft(id):
    """Get a specific aircraft by ID"""
    try:
        # Get aircraft data
        aircraft_data = supabase.table('aircraft').select('*').eq('id', id).execute()
        
        if not aircraft_data.data:
            return jsonify({
                'error': 'Aircraft not found',
                'message': f'No aircraft found with ID {id}'
            }), 404
            
        return jsonify({
            'aircraft': aircraft_data.data[0]
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to get aircraft data',
            'message': str(e)
        }), 500

@aircraft_bp.route('/recommend', methods=['GET'])
def recommend_aircraft():
    """Recommend aircraft based on route parameters"""
    try:
        # Get route ID from query parameters
        route_id = request.args.get('route_id')
        
        if not route_id:
            return jsonify({
                'error': 'Missing required parameters',
                'message': 'Route ID is required'
            }), 400
            
        # Get route data
        route_data = supabase.table('routes').select('*').eq('id', route_id).execute()
        
        if not route_data.data:
            return jsonify({
                'error': 'Route not found',
                'message': f'No route found with ID {route_id}'
            }), 404
            
        route = route_data.data[0]
        
        # Get origin and destination airports
        origin_airport = supabase.table('airports').select('*').eq('code', route['origin_airport_code']).execute()
        destination_airport = supabase.table('airports').select('*').eq('code', route['destination_airport_code']).execute()
        
        if not origin_airport.data or not destination_airport.data:
            return jsonify({
                'error': 'Airport not found',
                'message': 'Origin or destination airport not found'
            }), 404
            
        # Calculate distance and determine aircraft category
        distance_km = route['distance_km']
        
        # Determine aircraft category based on distance
        if distance_km <= 2000:
            category = 'shorthaul'
        elif distance_km <= 5000:
            category = 'midhaul'
        else:
            category = 'longhaul'
            
        # Get suitable aircraft based on range and runway requirements
        suitable_aircraft = supabase.table('aircraft').select('*').gte('range_km', distance_km).execute()
        
        # Filter by runway requirements
        origin_runway = origin_airport.data[0]['runway_length']
        destination_runway = destination_airport.data[0]['runway_length']
        min_runway = min(origin_runway, destination_runway)
        
        filtered_aircraft = [a for a in suitable_aircraft.data if a['required_runway_length'] <= min_runway]
        
        # Calculate profitability for each aircraft
        for aircraft in filtered_aircraft:
            # Calculate basic operational costs
            flight_time_hours = distance_km / aircraft['speed_kmh']
            fuel_cost = aircraft['fuel_consumption'] * flight_time_hours * 0.8  # Assuming $0.8 per unit of fuel
            maintenance_cost = aircraft['maintenance_cost'] * flight_time_hours
            
            # Calculate potential revenue based on demand and capacity
            eco_capacity = aircraft['capacity_eco']
            business_capacity = aircraft['capacity_business']
            first_capacity = aircraft['capacity_first']
            
            eco_demand = min(route['demand_economy'], eco_capacity)
            business_demand = min(route['demand_business'], business_capacity)
            first_demand = min(route['demand_first'], first_capacity)
            
            # Assume average ticket prices
            eco_price = distance_km * 0.1  # $0.1 per km
            business_price = distance_km * 0.3  # $0.3 per km
            first_price = distance_km * 0.5  # $0.5 per km
            
            revenue = (eco_demand * eco_price) + (business_demand * business_price) + (first_demand * first_price)
            
            # Calculate profit
            profit = revenue - (fuel_cost + maintenance_cost)
            
            # Add profitability data to aircraft
            aircraft['estimated_profit'] = profit
            aircraft['flight_time_hours'] = flight_time_hours
            aircraft['fuel_cost'] = fuel_cost
            aircraft['maintenance_cost'] = maintenance_cost
            aircraft['estimated_revenue'] = revenue
            
        # Sort by profitability
        sorted_aircraft = sorted(filtered_aircraft, key=lambda x: x['estimated_profit'], reverse=True)
        
        return jsonify({
            'route': route,
            'recommended_aircraft': sorted_aircraft
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to recommend aircraft',
            'message': str(e)
        }), 500

@aircraft_bp.route('/filter', methods=['GET'])
def filter_aircraft():
    """Filter aircraft based on parameters"""
    try:
        # Get filter parameters
        manufacturer = request.args.get('manufacturer')
        category = request.args.get('category')
        min_range = request.args.get('min_range')
        max_range = request.args.get('max_range')
        aircraft_type = request.args.get('type')  # PAX or cargo
        
        # Build query
        query = supabase.table('aircraft').select('*')
        
        if manufacturer:
            query = query.eq('manufacturer', manufacturer)
            
        if category:
            query = query.eq('category', category)
            
        if min_range:
            query = query.gte('range_km', int(min_range))
            
        if max_range:
            query = query.lte('range_km', int(max_range))
            
        if aircraft_type:
            if aircraft_type == 'cargo':
                query = query.gt('cargo_capacity', 0)
            elif aircraft_type == 'pax':
                query = query.gt('capacity_eco', 0)
                
        # Execute query
        result = query.execute()
        
        return jsonify({
            'aircraft': result.data
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to filter aircraft',
            'message': str(e)
        }), 500
