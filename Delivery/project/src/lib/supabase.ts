import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Please click the "Connect to Supabase" button in the top right to set up your Supabase project'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Real-time subscriptions
export const subscribeToOrders = (
  userId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('orders')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToDeliveryOrders = (
  deliveryPersonId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('delivery_orders')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `delivery_person_id=eq.${deliveryPersonId}`,
      },
      callback
    )
    .subscribe();
};