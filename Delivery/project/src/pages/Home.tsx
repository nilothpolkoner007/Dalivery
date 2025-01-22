import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Restaurant } from '../types';

export function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');

  useEffect(() => {
    loadRestaurants();
  }, []);

  async function loadRestaurants() {
    let query = supabase
      .from('restaurants')
      .select('*')
      .order('name');

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    if (cuisineFilter) {
      query = query.eq('cuisine_type', cuisineFilter);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error loading restaurants:', error);
      return;
    }

    setRestaurants(data);
  }

  useEffect(() => {
    loadRestaurants();
  }, [searchQuery, cuisineFilter]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-indigo-600 -mx-4 px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            Delicious food delivered to your doorstep
          </h1>
          <p className="text-lg mb-8">
            Order from your favorite restaurants and track your delivery in real-time
          </p>
          <div className="flex items-center max-w-md mx-auto bg-white rounded-lg overflow-hidden">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for restaurants or cuisines..."
                className="w-full px-4 py-3 text-gray-900 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-indigo-700 text-white px-6 py-3 hover:bg-indigo-800">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cuisine Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Italian', 'Japanese', 'Indian', 'Mexican', 'Chinese'].map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => setCuisineFilter(cuisine === 'All' ? '' : cuisine)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              (cuisine === 'All' && !cuisineFilter) || cuisine === cuisineFilter
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Link
            key={restaurant.id}
            to={`/restaurant/${restaurant.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}
              alt={restaurant.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                  {restaurant.rating} ★
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine_type}</p>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {restaurant.address}
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {restaurant.delivery_time} min
                </span>
                <span className="text-gray-600">
                  ${restaurant.delivery_fee} delivery
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}