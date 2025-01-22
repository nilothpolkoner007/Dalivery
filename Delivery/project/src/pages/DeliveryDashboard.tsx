import React, { useEffect, useState } from 'react';
import { MapPin, Package, Clock, Phone, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Order, DeliveryEarnings } from '../types';

export function DeliveryDashboard() {
  const { user } = useAuthStore();
  const [isOnline, setIsOnline] = useState(false);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [earnings, setEarnings] = useState<DeliveryEarnings>({
    daily: 0,
    weekly: 0,
    monthly: 0,
    total_deliveries: 0,
  });

  useEffect(() => {
    if (user) {
      loadOrders();
      loadEarnings();
    }
  }, [user]);

  async function loadOrders() {
    const { data: activeData, error: activeError } = await supabase
      .from('orders')
      .select('*, restaurant:restaurants(name, address, phone)')
      .eq('delivery_person_id', user?.id)
      .in('status', ['confirmed', 'picked_up', 'out_for_delivery'])
      .order('created_at', { ascending: false });

    if (activeError) {
      console.error('Error loading active orders:', activeError);
      return;
    }

    const { data: completedData, error: completedError } = await supabase
      .from('orders')
      .select('*, restaurant:restaurants(name, address, phone)')
      .eq('delivery_person_id', user?.id)
      .eq('status', 'delivered')
      .order('created_at', { ascending: false })
      .limit(10);

    if (completedError) {
      console.error('Error loading completed orders:', completedError);
      return;
    }

    setActiveOrders(activeData || []);
    setCompletedOrders(completedData || []);
  }

  async function loadEarnings() {
    // In a real app, this would calculate actual earnings from the database
    setEarnings({
      daily: 85.50,
      weekly: 542.75,
      monthly: 2156.25,
      total_deliveries: 45,
    });
  }

  async function toggleOnlineStatus() {
    const newStatus = !isOnline;
    const { error } = await supabase
      .from('users')
      .update({ is_online: newStatus })
      .eq('id', user?.id);

    if (error) {
      console.error('Error updating status:', error);
      return;
    }

    setIsOnline(newStatus);
  }

  async function updateOrderStatus(orderId: string, status: Order['status']) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return;
    }

    loadOrders();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Delivery Dashboard</h1>
          <button
            onClick={toggleOnlineStatus}
            className={`px-4 py-2 rounded-full font-medium ${
              isOnline
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isOnline ? '● Online' : '○ Offline'}
          </button>
        </div>

        <div className="mt-4 md:mt-0 bg-white rounded-lg shadow-sm p-4 w-full md:w-auto">
          <h2 className="text-lg font-semibold mb-3">Earnings Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-lg font-semibold">${earnings.daily}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-lg font-semibold">${earnings.weekly}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-lg font-semibold">${earnings.monthly}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Deliveries</p>
              <p className="text-lg font-semibold">{earnings.total_deliveries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Orders */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Pickup Details */}
                <div className="space-y-2">
                  <h3 className="font-medium">Pickup Details</h3>
                  <div className="flex items-start text-sm">
                    <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-500" />
                    <span>{order.restaurant.address}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{order.restaurant.phone}</span>
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="space-y-2">
                  <h3 className="font-medium">Delivery Details</h3>
                  <div className="flex items-start text-sm">
                    <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-500" />
                    <span>{order.delivery_address}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{order.customer_phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Delivery Fee: ${order.delivery_fee.toFixed(2)}
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'picked_up')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Mark as Picked Up
                      </button>
                    )}
                    {order.status === 'picked_up' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Start Delivery
                      </button>
                    )}
                    {order.status === 'out_for_delivery' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Complete Delivery
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {activeOrders.length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Deliveries</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.restaurant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.delivery_fee.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}