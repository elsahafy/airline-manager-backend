import React, { useState, useEffect } from 'react';
import { routesAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Route, Airport } from '../types/api';

const RouteFinder: React.FC = () => {
  const { user } = useAuth();
  const [searchLoading, setSearchLoading] = useState(false);
  const [hub, setHub] = useState(user?.airline?.hub_airport_code || '');
  const [selectedAircraft, setSelectedAircraft] = useState<string>('');
  const [recommendedRoutes, setRecommendedRoutes] = useState<Route[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  useEffect(() => {
    // In a real app, we would fetch countries and airports from the API
    // For now, we'll use mock data
    setCountries([
      'United States', 'United Kingdom', 'France', 'Germany', 'Japan', 
      'China', 'Australia', 'Brazil', 'Canada', 'India'
    ]);
    
    setAirports([
      { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States', runway_length: 4423, latitude: 40.6413, longitude: -73.7781 },
      { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States', runway_length: 3685, latitude: 33.9416, longitude: -118.4085 },
      { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', country: 'United States', runway_length: 3962, latitude: 41.9742, longitude: -87.9073 },
      { code: 'LHR', name: 'Heathrow', city: 'London', country: 'United Kingdom', runway_length: 3902, latitude: 51.4700, longitude: -0.4543 },
      { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', runway_length: 4215, latitude: 49.0097, longitude: 2.5479 },
      { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', runway_length: 4000, latitude: 50.0379, longitude: 8.5622 },
      { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', runway_length: 3360, latitude: 35.5494, longitude: 139.7798 },
      { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China', runway_length: 3800, latitude: 40.0799, longitude: 116.6031 },
      { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia', runway_length: 3962, latitude: -33.9399, longitude: 151.1753 },
      { code: 'GRU', name: 'São Paulo–Guarulhos International', city: 'São Paulo', country: 'Brazil', runway_length: 3700, latitude: -23.4356, longitude: -46.4731 }
    ]);
    
    // Set default hub if available
    if (user?.airline?.hub_airport_code) {
      setHub(user.airline.hub_airport_code);
    }
  }, [user]);

  const searchRoutes = async () => {
    if (!hub) {
      alert('Please select a hub airport');
      return;
    }
    
    try {
      setSearchLoading(true);
      const response = await routesAPI.recommend(hub, selectedAircraft ? parseInt(selectedAircraft) : undefined);
      setRecommendedRoutes(response.data.recommended_routes || []);
    } catch (error) {
      console.error('Error searching routes:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  const handleHubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHub(e.target.value);
  };

  const handleAircraftChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAircraft(e.target.value);
  };

  const filteredAirports = selectedCountry 
    ? airports.filter(airport => airport.country === selectedCountry)
    : airports;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Route Finder</h2>
        <p className="text-gray-600 mb-4">
          Find the most profitable routes for your airline based on your hub and aircraft.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            Select your hub airport and optionally an aircraft to find recommended routes.
            Routes are ranked by profitability and passenger demand.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Countries</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hub Airport</label>
            <select
              value={hub}
              onChange={handleHubChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Hub Airport</option>
              {filteredAirports.map((airport, index) => (
                <option key={index} value={airport.code}>
                  {airport.code} - {airport.name} ({airport.city})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft (Optional)</label>
            <select
              value={selectedAircraft}
              onChange={handleAircraftChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Aircraft</option>
              <option value="1">Boeing 737-800</option>
              <option value="2">Airbus A320</option>
              <option value="3">Boeing 787-9</option>
              <option value="4">Airbus A350-900</option>
              <option value="5">Embraer E190</option>
            </select>
          </div>
          
          <div className="lg:col-span-3 flex justify-center">
            <button
              onClick={searchRoutes}
              disabled={searchLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {searchLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : 'Search Routes'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommended Routes</h3>
        
        {searchLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : recommendedRoutes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demand (Eco/Bus/First)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Profit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recommendedRoutes.map((route, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{route.destination_airport_code}</div>
                      <div className="text-xs text-gray-500">{route.destination_city}, {route.destination_country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.distance_km.toLocaleString()} km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.flight_time_hours ? `${route.flight_time_hours.toFixed(1)} hrs` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.demand_economy} / {route.demand_business} / {route.demand_first}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {route.estimated_profit ? `$${route.estimated_profit.toLocaleString()}` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {hub ? 'No routes found. Try selecting a different hub or aircraft.' : 'Select a hub airport and click "Search Routes" to find recommended routes.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteFinder;
