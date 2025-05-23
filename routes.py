from flask import Blueprint, request, jsonify, session
from src.main import supabase

routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/', methods=['GET'])
def get_all_routes():
    """Get all routes for the current user's airline"""
    try:
        # Get user from session
        user = session.get('user')
        
        if not user:
            return jsonify({
                'error': 'Unauthorized',
                'message': 'User not logged in'
            }), 401
            
        # Get airline ID
        airline_data = supabase.table('airlines').select('id').eq('user_id', user.get('id')).execute()
        
        if not airline_data.data:
            return jsonify({
                'error': 'Airline not found',
                'message': 'No airline found for current user'
            }), 404
            
        airline_id = airline_data.data[0]['id']
        
        # Get routes for airline
        routes_data = supabase.table('routes').select('*').eq('airline_id', airline_id).execute()
        
        return jsonify({
            'routes': routes_data.data
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to get routes',
            'message': str(e)
        }), 500

@routes_bp.route('/<int:id>', methods=['GET'])
def get_route(id):
    """Get a specific route by ID"""
    try:
        # Get route data
        route_data = supabase.table('routes').select('*').eq('id', id).execute()
        
        if not route_data.data:
            return jsonify({
                'error': 'Route not found',
                'message': f'No route found with ID {id}'
            }), 404
            
        return jsonify({
            'route': route_data.data[0]
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to get route data',
            'message': str(e)
        }), 500

@routes_bp.route('/', methods=['POST'])
def create_route():
    """Create a new route for the current user's airline"""
    try:
        # Get user from session
        user = session.get('user')
        
        if not user:
            return jsonify({
                'error': 'Unauthorized',
                'message': 'User not logged in'
            }), 401
            
        # Get airline ID
        airline_data = supabase.table('airlines').select('id').eq('user_id', user.get('id')).execute()
        
        if not airline_data.data:
            return jsonify({
                'error': 'Airline not found',
                'message': 'No airline found for current user'
            }), 404
            
        airline_id = airline_data.data[0]['id']
        
        # Get route data from request
        data = request.get_json()
        origin_code = data.get('origin_airport_code')
        destination_code = data.get('destination_airport_code')
        
        if not origin_code or not destination_code:
            return jsonify({
                'error': 'Missing required fields',
                'message': 'Origin and destination airport codes are required'
            }), 400
            
        # Check if airports exist
        origin_airport = supabase.table('airports').select('*').eq('code', origin_code).execute()
        destination_airport = supabase.table('airports').select('*').eq('code', destination_code).execute()
        
        if not origin_airport.data or not destination_airport.data:
            return jsonify({
                'error': 'Airport not found',
                'message': 'Origin or destination airport not found'
            }), 404
            
        # Calculate distance between airports (simplified calculation)
        import math
        
        origin = origin_airport.data[0]
        destination = destination_airport.data[0]
        
        # Calculate distance using Haversine formula
        R = 6371  # Earth radius in km
        lat1 = math.radians(origin['latitude'])
        lon1 = math.radians(origin['longitude'])
        lat2 = math.radians(destination['latitude'])
        lon2 = math.radians(destination['longitude'])
        
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        distance = R * c
        
        # Create route
        route_data = {
            'airline_id': airline_id,
            'origin_airport_code': origin_code,
            'destination_airport_code': destination_code,
            'distance_km': round(distance),
            'demand_economy': data.get('demand_economy', 100),
            'demand_business': data.get('demand_business', 20),
            'demand_first': data.get('demand_first', 10),
            'demand_cargo': data.get('demand_cargo', 5),
            'competition_level': data.get('competition_level', 'medium')
        }
        
        # Insert route
        result = supabase.table('routes').insert(route_data).execute()
        
        return jsonify({
            'message': 'Route created successfully',
            'route': result.data[0]
        }), 201
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to create route',
            'message': str(e)
        }), 500

@routes_bp.route('/<int:id>', methods=['PUT'])
def update_route(id):
    """Update a route"""
    try:
        # Get user from session
        user = session.get('user')
        
        if not user:
            return jsonify({
                'error': 'Unauthorized',
                'message': 'User not logged in'
            }), 401
            
        # Get route data
        route_data = supabase.table('routes').select('*').eq('id', id).execute()
        
        if not route_data.data:
            return jsonify({
                'error': 'Route not found',
                'message': f'No route found with ID {id}'
            }), 404
            
        # Get airline ID
        airline_data = supabase.table('airlines').select('id').eq('user_id', user.get('id')).execute()
        
        if not airline_data.data:
            return jsonify({
                'error': 'Airline not found',
                'message': 'No airline found for current user'
            }), 404
            
        airline_id = airline_data.data[0]['id']
        
        # Check if route belongs to user's airline
        if route_data.data[0]['airline_id'] != airline_id:
            return jsonify({
                'error': 'Unauthorized',
                'message': 'Route does not belong to your airline'
            }), 403
            
        # Get update data from request
        data = request.get_json()
        
        # Update route
        update_data = {}
        
        if 'demand_economy' in data:
            update_data['demand_economy'] = data['demand_economy']
            
        if 'demand_business' in data:
            update_data['demand_business'] = data['demand_business']
            
        if 'demand_first' in data:
            update_data['demand_first'] = data['demand_first']
            
        if 'demand_cargo' in data:
            update_data['demand_cargo'] = data['demand_cargo']
            
        if 'competition_level' in data:
            update_data['competition_level'] = data['competition_level']
            
        # Update route
        result = supabase.table('routes').update(update_data).eq('id', id).execute()
        
        return jsonify({
            'message': 'Route updated successfully',
            'route': result.data[0]
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to update route',
            'message': str(e)
        }), 500

@routes_bp.route('/<int:id>', methods=['DELETE'])
def delete_route(id):
    """Delete a route"""
    try:
        # Get user from session
        user = session.get('user')
        
        if not user:
            return jsonify({
                'error': 'Unauthorized',
                'message': 'User not logged in'
            }), 401
            
        # Get route data
        route_data = supabase.table('routes').select('*').eq('id', id).execute()
        
        if not route_data.data:
            return jsonify({
                'error': 'Route not found',
                'message': f'No route found with ID {id}'
            }), 404
            
        # Get airline ID
        airline_data = supabase.table('airlines').select('id').eq('user_id', user.get('id')).execute()
        
        if not airline_data.data:
            return jsonify({
                'error': 'Airline not found',
                'message': 'No airline found for current user'
            }), 404
            
        airline_id = airline_data.data[0]['id']
        
        # Check if route belongs to user's airline
        if route_data.data[0]['airline_id'] != airline_id:
            return jsonify({
                'error': 'Unauthorized',
                'message': 'Route does not belong to your airline'
            }), 403
            
        # Delete route
        supabase.table('routes').delete().eq('id', id).execute()
        
        return jsonify({
            'message': 'Route deleted successfully'
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to delete route',
            'message': str(e)
        }), 500

@routes_bp.route('/recommend', methods=['GET'])
def recommend_routes():
    """Recommend routes based on hub and aircraft"""
    try:
        # Get parameters
        hub = request.args.get('hub')
        aircraft_id = request.args.get('aircraft')
        
        if not hub:
            return jsonify({
                'error': 'Missing required parameters',
                'message': 'Hub airport code is required'
            }), 400
            
        # Get hub airport
        hub_airport = supabase.table('airports').select('*').eq('code', hub).execute()
        
        if not hub_airport.data:
            return jsonify({
                'error': 'Airport not found',
                'message': f'No airport found with code {hub}'
            }), 404
            
        # Get aircraft if specified
        aircraft = None
        if aircraft_id:
            aircraft_data = supabase.table('aircraft').select('*').eq('id', aircraft_id).execute()
            if aircraft_data.data:
                aircraft = aircraft_data.data[0]
        
        # Get all airports
        all_airports = supabase.table('airports').select('*').execute()
        
        # Calculate potential routes
        potential_routes = []
        
        for airport in all_airports.data:
            if airport['code'] == hub:
                continue
                
            # Calculate distance
            import math
            
            # Calculate distance using Haversine formula
            R = 6371  # Earth radius in km
            lat1 = math.radians(hub_airport.data[0]['latitude'])
            lon1 = math.radians(hub_airport.data[0]['longitude'])
            lat2 = math.radians(airport['latitude'])
            lon2 = math.radians(airport['longitude'])
            
            dlon = lon2 - lon1
            dlat = lat2 - lat1
            
            a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
            distance = R * c
            
            # Check if aircraft can reach this destination
            if aircraft and distance > aircraft['range_km']:
                continue
                
            # Check runway requirements
            if aircraft and airport['runway_length'] < aircraft['required_runway_length']:
                continue
                
            # Generate demand based on airport size and distance
            hub_size = hub_airport.data[0]['hub_size']
            dest_size = airport['hub_size']
            
            # Base demand calculation
            base_demand = (hub_size + dest_size) * 10
            
            # Distance factor (demand decreases with distance)
            distance_factor = max(0.5, 1 - (distance / 10000))
            
            # Calculate demand for each class
            eco_demand = int(base_demand * distance_factor)
            business_demand = int(eco_demand * 0.2)
            first_demand = int(eco_demand * 0.05)
            cargo_demand = int(eco_demand * 0.1)
            
            # Create route object
            route = {
                'origin_airport_code': hub,
                'destination_airport_code': airport['code'],
                'destination_name': airport['name'],
                'destination_city': airport['city'],
                'destination_country': airport['country'],
                'distance_km': round(distance),
                'demand_economy': eco_demand,
                'demand_business': business_demand,
                'demand_first': first_demand,
                'demand_cargo': cargo_demand
            }
            
            # Calculate profitability if aircraft is specified
            if aircraft:
                # Calculate basic operational costs
                flight_time_hours = distance / aircraft['speed_kmh']
                fuel_cost = aircraft['fuel_consumption'] * flight_time_hours * 0.8  # Assuming $0.8 per unit of fuel
                maintenance_cost = aircraft['maintenance_cost'] * flight_time_hours
                
                # Calculate potential revenue based on demand and capacity
                eco_capacity = aircraft['capacity_eco']
                business_capacity = aircraft['capacity_business']
                first_capacity = aircraft['capacity_first']
                
                eco_demand = min(eco_demand, eco_capacity)
                business_demand = min(business_demand, business_capacity)
                first_demand = min(first_demand, first_capacity)
                
                # Assume average ticket prices
                eco_price = distance * 0.1  # $0.1 per km
                business_price = distance * 0.3  # $0.3 per km
                first_price = distance * 0.5  # $0.5 per km
                
                revenue = (eco_demand * eco_price) + (business_demand * business_price) + (first_demand * first_price)
                
                # Calculate profit
                profit = revenue - (fuel_cost + maintenance_cost)
                
                # Add profitability data to route
                route['estimated_profit'] = profit
                route['flight_time_hours'] = flight_time_hours
                route['fuel_cost'] = fuel_cost
                route['maintenance_cost'] = maintenance_cost
                route['estimated_revenue'] = revenue
            
            potential_routes.append(route)
            
        # Sort routes by profitability if aircraft is specified, otherwise by demand
        if aircraft:
            sorted_routes = sorted(potential_routes, key=lambda x: x['estimated_profit'], reverse=True)
        else:
            sorted_routes = sorted(potential_routes, key=lambda x: x['demand_economy'], reverse=True)
        
        return jsonify({
            'hub': hub_airport.data[0],
            'aircraft': aircraft,
            'recommended_routes': sorted_routes[:20]  # Return top 20 routes
        }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to recommend routes',
            'message': str(e)
        }), 500
