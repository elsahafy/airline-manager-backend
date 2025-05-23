import React, { useState, useEffect } from 'react';
import { configAPI, aircraftAPI, routesAPI } from '../lib/api';
import { Aircraft, Route, Configuration } from '../types/api';

const CabinConfigurator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedConfig, setOptimizedConfig] = useState<Configuration | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch aircraft
        const aircraftResponse = await aircraftAPI.getAll();
        setAircraft(aircraftResponse.data.aircraft || []);
        
        // Fetch routes
        const routesResponse = await routesAPI.getAll();
        setRoutes(routesResponse.data.routes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAircraftChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAircraft(e.target.value);
    setConfigurations([]);
    setOptimizedConfig(null);
  };

  const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoute(e.target.value);
    setConfigurations([]);
    setOptimizedConfig(null);
  };

  const findConfigurations = async () => {
    if (!selectedAircraft || !selectedRoute) {
      alert('Please select both an aircraft and a route');
      return;
    }
    
    try {
      setLoading(true);
      const response = await configAPI.recommend(
        parseInt(selectedAircraft), 
        parseInt(selectedRoute)
      );
      
      setConfigurations(response.data.configurations || []);
    } catch (error) {
      console.error('Error finding configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const optimizeConfiguration = async () => {
    if (!selectedAircraft || !selectedRoute) {
      alert('Please select both an aircraft and a route');
      return;
    }
    
    try {
      setOptimizing(true);
      const response = await configAPI.optimize({
        aircraft_id: parseInt(selectedAircraft),
        route_id: parseInt(selectedRoute)
      });
      
      setOptimizedConfig(response.data.configuration || null);
    } catch (error) {
      console.error('Error optimizing configuration:', error);
    } finally {
      setOptimizing(false);
    }
  };

  const getSelectedAircraftDetails = () => {
    if (!selectedAircraft) return null;
    return aircraft.find(a => a.id === parseInt(selectedAircraft));
  };

  const getSelectedRouteDetails = () => {
    if (!selectedRoute) return null;
    return routes.find(r => r.id === parseInt(selectedRoute));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cabin Configurator</h2>
        <p className="text-gray-600 mb-4">
          Optimize your aircraft cabin configuration to maximize profitability based on route demand.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            Select an aircraft and route to find the optimal cabin configuration. 
            The configurator will analyze passenger demand and suggest the best seat allocation 
            for economy, business, and first class.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft</label>
            <select
              value={selectedAircraft}
              onChange={handleAircraftChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Aircraft</option>
              {aircraft.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.manufacturer} {a.model}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
            <select
              value={selectedRoute}
              onChange={handleRouteChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Route</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.origin_airport_code} → {r.destination_airport_code} ({r.distance_km} km)
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2 flex justify-center space-x-4">
            <button
              onClick={findConfigurations}
              disabled={loading || !selectedAircraft || !selectedRoute}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {loading ? 'Loading...' : 'Find Configurations'}
            </button>
            
            <button
              onClick={optimizeConfiguration}
              disabled={optimizing || !selectedAircraft || !selectedRoute}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300"
            >
              {optimizing ? 'Optimizing...' : 'Advanced Optimization'}
            </button>
          </div>
        </div>
      </div>
      
      {(configurations.length > 0 || optimizedConfig) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Configuration Results</h3>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Selected Aircraft & Route</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold">{getSelectedAircraftDetails()?.manufacturer} {getSelectedAircraftDetails()?.model}</p>
                <p className="text-sm text-gray-600">
                  Default Configuration: {getSelectedAircraftDetails()?.capacity_eco} Economy, {getSelectedAircraftDetails()?.capacity_business} Business, {getSelectedAircraftDetails()?.capacity_first} First
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold">{getSelectedRouteDetails()?.origin_airport_code} → {getSelectedRouteDetails()?.destination_airport_code}</p>
                <p className="text-sm text-gray-600">
                  Demand: {getSelectedRouteDetails()?.demand_economy} Economy, {getSelectedRouteDetails()?.demand_business} Business, {getSelectedRouteDetails()?.demand_first} First
                </p>
              </div>
            </div>
          </div>
          
          {optimizedConfig && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Advanced Optimized Configuration</h4>
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Economy Seats</p>
                    <p className="text-2xl font-bold text-gray-800">{optimizedConfig.eco}</p>
                    <p className="text-xs text-gray-500">Load Factor: {optimizedConfig.eco_load.toFixed(1)}%</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Business Seats</p>
                    <p className="text-2xl font-bold text-gray-800">{optimizedConfig.business}</p>
                    <p className="text-xs text-gray-500">Load Factor: {optimizedConfig.business_load.toFixed(1)}%</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">First Class Seats</p>
                    <p className="text-2xl font-bold text-gray-800">{optimizedConfig.first}</p>
                    <p className="text-xs text-gray-500">Load Factor: {optimizedConfig.first_load.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-xl font-bold text-green-600">${optimizedConfig.total_revenue.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Cost</p>
                    <p className="text-xl font-bold text-red-600">${optimizedConfig.total_cost.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Profit</p>
                    <p className="text-xl font-bold text-blue-600">${optimizedConfig.profit.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Overall Load Factor</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, optimizedConfig.overall_load)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1">{optimizedConfig.overall_load.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}
          
          {configurations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Standard Configurations</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Configuration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats (E/B/F)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load Factor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {configurations.map((config, index) => (
                      <tr key={index} className={config.is_default ? 'bg-blue-50' : (config.rank === 1 ? 'bg-green-50' : '')}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {config.rank || index + 1}
                          {config.rank === 1 && <span className="ml-1 text-green-600">★</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {config.name || (config.is_default ? 'Default' : `Configuration ${index + 1}`)}
                          {config.is_default && <span className="ml-1 text-xs text-blue-600">(Default)</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {config.eco} / {config.business} / {config.first}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {config.overall_load.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${config.total_revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ${config.profit.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CabinConfigurator;
