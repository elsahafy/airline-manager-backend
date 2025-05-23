import React, { useState, useEffect } from 'react';
import { aircraftAPI } from '../lib/api';
import { Aircraft } from '../types/api';

interface FilterParams {
  manufacturer: string;
  category: string;
  min_range: string;
  max_range: string;
  type: string;
}

const AircraftFinder: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [filteredAircraft, setFilteredAircraft] = useState<Aircraft[]>([]);
  const [filters, setFilters] = useState<FilterParams>({
    manufacturer: '',
    category: '',
    min_range: '',
    max_range: '',
    type: ''
  });

  // Manufacturers list
  const manufacturers = ['All', 'Airbus', 'Boeing', 'Embraer', 'Bombardier', 'ATR', 'Sukhoi', 'McDonnell Douglas'];
  
  // Categories list
  const categories = ['All', 'shorthaul', 'midhaul', 'longhaul'];
  
  // Aircraft types
  const types = ['All', 'pax', 'cargo'];

  useEffect(() => {
    const fetchAircraft = async () => {
      try {
        setLoading(true);
        const response = await aircraftAPI.getAll();
        setAircraft(response.data.aircraft || []);
        setFilteredAircraft(response.data.aircraft || []);
      } catch (error) {
        console.error('Error fetching aircraft:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAircraft();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      
      // Only include non-empty filters
      const params: Record<string, string> = {};
      if (filters.manufacturer && filters.manufacturer !== 'All') params.manufacturer = filters.manufacturer;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.min_range) params.min_range = filters.min_range;
      if (filters.max_range) params.max_range = filters.max_range;
      if (filters.type && filters.type !== 'All') params.type = filters.type;
      
      if (Object.keys(params).length > 0) {
        const response = await aircraftAPI.filter(params);
        setFilteredAircraft(response.data.aircraft || []);
      } else {
        setFilteredAircraft(aircraft);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      manufacturer: '',
      category: '',
      min_range: '',
      max_range: '',
      type: ''
    });
    setFilteredAircraft(aircraft);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Aircraft Finder</h2>
        <p className="text-gray-600 mb-4">
          Find the perfect aircraft for your routes based on range, capacity, and operational requirements.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            Select your criteria below to filter aircraft. You can filter by manufacturer, range category, 
            specific range requirements, and aircraft type.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
            <select
              name="manufacturer"
              value={filters.manufacturer}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Manufacturers</option>
              {manufacturers.map((manufacturer, index) => (
                <option key={index} value={manufacturer === 'All' ? '' : manufacturer}>
                  {manufacturer}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Range Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category === 'All' ? '' : category}>
                  {category === 'shorthaul' ? 'Short Haul' : 
                   category === 'midhaul' ? 'Mid Haul' : 
                   category === 'longhaul' ? 'Long Haul' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {types.map((type, index) => (
                <option key={index} value={type === 'All' ? '' : type}>
                  {type === 'pax' ? 'Passenger' : 
                   type === 'cargo' ? 'Cargo' : type}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Range (km)</label>
            <input
              type="number"
              name="min_range"
              value={filters.min_range}
              onChange={handleFilterChange}
              placeholder="Min Range"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Range (km)</label>
            <input
              type="number"
              name="max_range"
              value={filters.max_range}
              onChange={handleFilterChange}
              placeholder="Max Range"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Aircraft Results</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredAircraft.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Range (km)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed (km/h)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAircraft.map((aircraft) => (
                  <tr key={aircraft.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aircraft.manufacturer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{aircraft.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aircraft.range_km.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aircraft.speed_kmh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {aircraft.capacity_eco + aircraft.capacity_business + aircraft.capacity_first}
                      <span className="text-xs text-gray-500 ml-1">
                        (E: {aircraft.capacity_eco}, B: {aircraft.capacity_business}, F: {aircraft.capacity_first})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${aircraft.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No aircraft found matching your criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AircraftFinder;
