import { sb } from '../lib/supabase';
import { dbProductToApp, appProductToDb } from '../lib/helpers';

export const productsService = {
  async list() {
    const { data, error } = await sb
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(dbProductToApp);
  },

  async listActive() {
    const { data, error } = await sb
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(dbProductToApp);
  },

  async create(product) {
    const { error } = await sb.from('products').insert(appProductToDb(product));
    if (error) throw error;
  },

  async update(id, product) {
    const { error } = await sb.from('products').update(appProductToDb(product)).eq('id', id);
    if (error) throw error;
  },

  async remove(id) {
    const { error } = await sb.from('products').delete().eq('id', id);
    if (error) throw error;
  },
};
