import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Order } from '../types';
import { Clock, MapPin } from 'lucide-react';

export function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  async function loadOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurant:restaurants(name, image_url)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading orders:', error);
      return;
    }

    setOrders(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
        <p className="text-gray-600">
          When you place orders, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                <span className={`
                  px-3 py-1 rounded-full text-sm
                  ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'}
                `}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={order.restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}
                  alt={order.restaurant.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium">{order.restaurant.name}</h4>
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {order.delivery_address}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold">${order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Order Date</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {order.status === 'preparing' || order.status === 'out_for_delivery' ? (
                <div className="mt-4 bg-indigo-50 p-3 rounded-md">
                  <div className="flex items-center text-indigo-800">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Estimated delivery: 25-35 minutes
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}