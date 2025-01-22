import React from 'react';
import { ShoppingBag, Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export function Cart() {
  const { 
    items, 
    removeItem, 
    updateQuantity,
    getSubtotal,
    getDeliveryFee,
    getServiceFee,
    getTotal
  } = useCartStore();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 bg-white shadow-lg rounded-t-xl">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingBag className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="font-semibold">Your Order</span>
          </div>
          <span className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded">
            {items.length} items
          </span>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto p-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <div className="flex items-center flex-1">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-4">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="mx-2 min-w-[2rem] text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="ml-2 p-1 hover:bg-gray-100 rounded text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>${getSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Fee</span>
            <span>${getDeliveryFee().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Fee</span>
            <span>${getServiceFee().toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
        </div>

        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}