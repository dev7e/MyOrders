import { sb } from '../lib/supabase';
import { dbOrderToApp, appOrderToDb } from '../lib/helpers';

export const ordersService = {
  async list() {
    const { data, error } = await sb
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(dbOrderToApp);
  },

  async create(order) {
    const { data, error } = await sb
      .from('orders')
      .insert(appOrderToDb(order))
      .select()
      .single();
    if (error) throw error;
    return dbOrderToApp(data);
  },

  async update(id, order) {
    const { error } = await sb.from('orders').update(appOrderToDb(order)).eq('id', id);
    if (error) throw error;
  },

  async remove(id) {
    const { error } = await sb.from('orders').delete().eq('id', id);
    if (error) throw error;
  },

  async updateStatus(id, status) {
    const { error } = await sb.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
  },
};
