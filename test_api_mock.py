import os
import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture
def app():
    # Use a testing configuration
    os.environ['SUPABASE_URL'] = 'https://test-url.supabase.co'
    os.environ['SUPABASE_KEY'] = 'test-key'
    
    # Import app after setting environment variables
    from src.main import app as flask_app
    flask_app.config['TESTING'] = True
    
    return flask_app

@pytest.fixture
def client(app):
    with app.test_client() as client:
        yield client

@pytest.fixture
def mock_supabase():
    # Create a mock for the supabase client
    mock_client = MagicMock()
    
    # Configure the mock to return appropriate responses
    mock_auth = MagicMock()
    mock_client.auth = mock_auth
    
    mock_table = MagicMock()
    mock_client.table.return_value = mock_table
    
    # Return the configured mock
    with patch('src.main.supabase', mock_client):
        yield mock_client

def test_index_route(client):
    """Test the root route returns correct response"""
    response = client.get('/')
    data = response.get_json()
    
    assert response.status_code == 200
    assert data['message'] == 'Airlines Manager Optimizer API'
    assert data['status'] == 'running'

def test_auth_routes_exist(client):
    """Test that auth routes are registered"""
    response = client.post('/api/auth/register')
    assert response.status_code != 404
    
    response = client.post('/api/auth/login')
    assert response.status_code != 404
    
    response = client.post('/api/auth/logout')
    assert response.status_code != 404
    
    response = client.get('/api/auth/user')
    assert response.status_code != 404

def test_aircraft_routes_exist(client):
    """Test that aircraft routes are registered"""
    response = client.get('/api/aircraft/')
    assert response.status_code != 404
    
    response = client.get('/api/aircraft/1')
    assert response.status_code != 404
    
    response = client.get('/api/aircraft/recommend')
    assert response.status_code != 404
    
    response = client.get('/api/aircraft/filter')
    assert response.status_code != 404

def test_routes_routes_exist(client):
    """Test that routes routes are registered"""
    response = client.get('/api/routes/')
    assert response.status_code != 404
    
    response = client.get('/api/routes/1')
    assert response.status_code != 404
    
    response = client.post('/api/routes/')
    assert response.status_code != 404
    
    response = client.put('/api/routes/1')
    assert response.status_code != 404
    
    response = client.delete('/api/routes/1')
    assert response.status_code != 404
    
    response = client.get('/api/routes/recommend')
    assert response.status_code != 404

def test_config_routes_exist(client):
    """Test that config routes are registered"""
    response = client.get('/api/config/recommend')
    assert response.status_code != 404
    
    response = client.post('/api/config/optimize')
    assert response.status_code != 404

def test_error_handlers(client):
    """Test error handlers"""
    response = client.get('/nonexistent-route')
    assert response.status_code == 404
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'Not Found'
