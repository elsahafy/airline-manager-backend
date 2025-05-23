import os
import pytest
from src.main import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_mock_auth_register(client, monkeypatch):
    """Test user registration with mocked SupaBase"""
    # Mock the supabase auth.sign_up method
    class MockUser:
        def __init__(self):
            self.id = "test-user-id"
            self.email = "test@example.com"
    
    class MockResponse:
        def __init__(self):
            self.user = MockUser()
    
    def mock_sign_up(data):
        return MockResponse()
    
    # Mock the supabase table.insert.execute method
    class MockInsertResponse:
        def __init__(self):
            self.data = [{"id": 1, "name": "Test Airline", "hub_airport_code": "JFK"}]
    
    class MockInsert:
        def execute(self):
            return MockInsertResponse()
    
    class MockTable:
        def insert(self, data):
            return MockInsert()
    
    def mock_table(name):
        return MockTable()
    
    # Apply the monkeypatches
    from src.main import supabase
    monkeypatch.setattr(supabase.auth, "sign_up", mock_sign_up)
    monkeypatch.setattr(supabase, "table", mock_table)
    
    # Test the registration endpoint
    response = client.post('/api/auth/register', json={
        "email": "test@example.com",
        "password": "password123",
        "airline_name": "Test Airline",
        "hub_airport_code": "JFK"
    })
    
    data = response.get_json()
    
    assert response.status_code == 201
    assert data['message'] == 'User registered successfully'
    assert data['user']['email'] == 'test@example.com'
    assert data['user']['airline'] == 'Test Airline'

def test_mock_aircraft_recommendation(client, monkeypatch):
    """Test aircraft recommendation with mocked SupaBase"""
    # Mock the supabase table.select.eq.execute method for routes
    class MockRouteResponse:
        def __init__(self):
            self.data = [{
                "id": 1,
                "origin_airport_code": "JFK",
                "destination_airport_code": "LAX",
                "distance_km": 4000,
                "demand_economy": 200,
                "demand_business": 50,
                "demand_first": 20,
                "demand_cargo": 10
            }]
    
    # Mock the supabase table.select.eq.execute method for airports
    class MockAirportResponse:
        def __init__(self, code):
            self.data = [{
                "code": code,
                "name": f"{code} Airport",
                "city": "Test City",
                "country": "Test Country",
                "runway_length": 3000,
                "latitude": 40.0,
                "longitude": -74.0 if code == "JFK" else -118.0
            }]
    
    # Mock the supabase table.select.gte.execute method for aircraft
    class MockAircraftResponse:
        def __init__(self):
            self.data = [
                {
                    "id": 1,
                    "manufacturer": "Boeing",
                    "model": "737-800",
                    "range_km": 5000,
                    "speed_kmh": 850,
                    "fuel_consumption": 2500,
                    "capacity_eco": 160,
                    "capacity_business": 16,
                    "capacity_first": 0,
                    "price": 80000000,
                    "maintenance_cost": 5000,
                    "required_runway_length": 2000
                },
                {
                    "id": 2,
                    "manufacturer": "Airbus",
                    "model": "A320",
                    "range_km": 6000,
                    "speed_kmh": 830,
                    "fuel_consumption": 2400,
                    "capacity_eco": 150,
                    "capacity_business": 12,
                    "capacity_first": 0,
                    "price": 85000000,
                    "maintenance_cost": 4800,
                    "required_runway_length": 2100
                }
            ]
    
    class MockRouteSelect:
        def eq(self, field, value):
            return MockRouteExecute()
    
    class MockRouteExecute:
        def execute(self):
            return MockRouteResponse()
    
    class MockAirportSelect:
        def eq(self, field, value):
            return MockAirportExecute(value)
    
    class MockAirportExecute:
        def __init__(self, code):
            self.code = code
        
        def execute(self):
            return MockAirportResponse(self.code)
    
    class MockAircraftSelect:
        def gte(self, field, value):
            return MockAircraftExecute()
    
    class MockAircraftExecute:
        def execute(self):
            return MockAircraftResponse()
    
    class MockTable:
        def __init__(self, name):
            self.name = name
        
        def select(self, *args):
            if self.name == "routes":
                return MockRouteSelect()
            elif self.name == "airports":
                return MockAirportSelect()
            elif self.name == "aircraft":
                return MockAircraftSelect()
    
    def mock_table(name):
        return MockTable(name)
    
    # Apply the monkeypatch
    from src.main import supabase
    monkeypatch.setattr(supabase, "table", mock_table)
    
    # Test the aircraft recommendation endpoint
    response = client.get('/api/aircraft/recommend?route_id=1')
    
    data = response.get_json()
    
    assert response.status_code == 200
    assert 'route' in data
    assert 'recommended_aircraft' in data
    assert len(data['recommended_aircraft']) == 2
    assert 'estimated_profit' in data['recommended_aircraft'][0]

def test_mock_cabin_configuration(client, monkeypatch):
    """Test cabin configuration recommendation with mocked SupaBase"""
    # Mock the supabase table.select.eq.execute methods
    class MockAircraftResponse:
        def __init__(self):
            self.data = [{
                "id": 1,
                "manufacturer": "Boeing",
                "model": "737-800",
                "range_km": 5000,
                "speed_kmh": 850,
                "fuel_consumption": 2500,
                "capacity_eco": 160,
                "capacity_business": 16,
                "capacity_first": 0,
                "price": 80000000,
                "maintenance_cost": 5000
            }]
    
    class MockRouteResponse:
        def __init__(self):
            self.data = [{
                "id": 1,
                "origin_airport_code": "JFK",
                "destination_airport_code": "LAX",
                "distance_km": 4000,
                "demand_economy": 200,
                "demand_business": 50,
                "demand_first": 20,
                "demand_cargo": 10
            }]
    
    class MockSelect:
        def __init__(self, table_name):
            self.table_name = table_name
        
        def eq(self, field, value):
            return MockExecute(self.table_name)
    
    class MockExecute:
        def __init__(self, table_name):
            self.table_name = table_name
        
        def execute(self):
            if self.table_name == "aircraft":
                return MockAircraftResponse()
            elif self.table_name == "routes":
                return MockRouteResponse()
    
    class MockTable:
        def __init__(self, name):
            self.name = name
        
        def select(self, *args):
            return MockSelect(self.name)
    
    def mock_table(name):
        return MockTable(name)
    
    # Apply the monkeypatch
    from src.main import supabase
    monkeypatch.setattr(supabase, "table", mock_table)
    
    # Test the cabin configuration recommendation endpoint
    response = client.get('/api/config/recommend?aircraft=1&route=1')
    
    data = response.get_json()
    
    assert response.status_code == 200
    assert 'aircraft' in data
    assert 'route' in data
    assert 'configurations' in data
    assert len(data['configurations']) > 0
    assert 'profit' in data['configurations'][0]
    assert 'eco' in data['configurations'][0]
    assert 'business' in data['configurations'][0]
    assert 'first' in data['configurations'][0]
