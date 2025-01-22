import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, MapPin, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Cart } from '../components/Cart';
import { useCartStore } from '../store/cartStore';
import type { Restaurant, MenuItem } from '../types';

export function RestaurantDetails() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (id) {
      loadRestaurantDetails();
      loadMenuItems();
    }
  }, [id]);

  async function loadRestaurantDetails() {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error loading restaurant:', error);
      return;
    }

    setRestaurant(data);
    setLoading(false);
  }

  async function loadMenuItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', id)
      .eq('is_available', true)
      .order('category');

    if (error) {
      console.error('Error loading menu items:', error);
      return;
    }

    setMenuItems(data);
    if (data.length > 0) {
      setSelectedCategory(data[0].category);
    }
  }

  if (loading || !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="max-w-5xl mx-auto pb-32">
      {/* Restaurant Header */}
      <div className="relative h-64 -mx-4 sm:-mx-6 lg:-mx-8">
        <img
          src={restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {restaurant.address}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {restaurant.delivery_time} min
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              {restaurant.rating}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="sticky top-0 bg-white shadow-sm -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mt-6">
        <div className="flex gap-2 overflow-x-auto py-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                category === selectedCategory
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-8 grid gap-6">
        {menuItems
          .filter(item => item.category === selectedCategory)
          .map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
            >
              <img
                src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold">${item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addItem(item)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <Cart />
    </div>
  );
}