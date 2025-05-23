import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { routesAPI, aircraftAPI } from '../lib/api';
import { Route, DashboardStats } from '../types/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRoutes: 0,
    totalAircraft: 0,
    totalProfit: 0,
    mostProfitableRoute: null,
    recommendedAircraft: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch routes
        const routesResponse = await routesAPI.getAll();
        setRoutes(routesResponse.data.routes || []);
        
        // Fetch aircraft
        const aircraftResponse = await aircraftAPI.getAll();
        
        // Calculate stats
        if (routesResponse.data.routes && routesResponse.data.routes.length > 0) {
          const routes = routesResponse.data.routes;
          const totalRoutes = routes.length;
          
          // Find most profitable route
          let mostProfitableRoute = routes[0];
          routes.forEach((route: Route) => {
            if (route.estimated_profit && mostProfitableRoute.estimated_profit && 
                route.estimated_profit > mostProfitableRoute.estimated_profit) {
              mostProfitableRoute = route;
            }
          });
          
          // Get recommended aircraft for most profitable route
          if (mostProfitableRoute) {
            try {
              const recommendResponse = await aircraftAPI.recommend(mostProfitableRoute.id);
              const recommendedAircraft = recommendResponse.data.recommended_aircraft?.[0] || null;
              
              setStats({
                totalRoutes,
                totalAircraft: aircraftResponse.data.aircraft?.length || 0,
                totalProfit: routes.reduce((sum: number, route: Route) => sum + (route.estimated_profit || 0), 0),
                mostProfitableRoute,
                recommendedAircraft
              });
            } catch (error) {
              console.error('Error fetching recommended aircraft:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Airlines Manager Optimizer</h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">
            <span className="font-bold">Airline:</span> {user?.airline?.name || 'Your Airline'} | 
            <span className="font-bold ml-2">Hub:</span> {user?.airline?.hub_airport_code || 'JFK'} | 
            <span className="font-bold ml-2">Balance:</span> ${user?.airline?.balance?.toLocaleString() || '1,000,000'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Routes</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalRoutes}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Aircraft</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalAircraft}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Profit</h3>
          <p className="text-3xl font-bold text-green-600">${stats.totalProfit.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Efficiency</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.totalRoutes > 0 ? `${Math.round((stats.totalProfit / stats.totalRoutes))}` : '0'}
          </p>
          <p className="text-sm text-gray-500">Profit per route</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Routes</h3>
          {routes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {routes.slice(0, 5).map((route, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.origin_airport_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.destination_airport_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.distance_km} km</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${route.estimated_profit?.toLocaleString() || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No routes found. Use the Route Finder to add routes.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h3>
          {stats.mostProfitableRoute ? (
            <div>
              <div className="mb-4">
                <h4 className="font-medium text-gray-700">Most Profitable Route:</h4>
                <p className="text-blue-600 font-semibold">
                  {stats.mostProfitableRoute.origin_airport_code} → {stats.mostProfitableRoute.destination_airport_code}
                </p>
                <p className="text-sm text-gray-600">
                  Distance: {stats.mostProfitableRoute.distance_km} km | 
                  Profit: ${stats.mostProfitableRoute.estimated_profit?.toLocaleString() || 'N/A'}
                </p>
              </div>
              
              {stats.recommendedAircraft && (
                <div>
                  <h4 className="font-medium text-gray-700">Recommended Aircraft:</h4>
                  <p className="text-blue-600 font-semibold">
                    {stats.recommendedAircraft.manufacturer} {stats.recommendedAircraft.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    Range: {stats.recommendedAircraft.range_km} km | 
                    Capacity: {stats.recommendedAircraft.capacity_eco + 
                              (stats.recommendedAircraft.capacity_business || 0) + 
                              (stats.recommendedAircraft.capacity_first || 0)} seats
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No recommendations available yet. Add routes to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
