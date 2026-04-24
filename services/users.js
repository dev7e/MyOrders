import { sb } from '../lib/supabase';

export const usersService = {
  async list() {
    const { data, error } = await sb
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getMyRole(userId) {
    const { data, error } = await sb
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data?.role || 'staff';
  },

  async findByEmail(email) {
    const { data } = await sb
      .from('user_roles')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();
    return data;
  },

  async updateRole(userId, role) {
    const { error } = await sb.from('user_roles').update({ role }).eq('user_id', userId);
    if (error) throw error;
  },

  async updateName(userId, fullName) {
    const { error } = await sb.from('user_roles').update({ full_name: fullName }).eq('user_id', userId);
    if (error) throw error;
  },

  async updateProfile(userId, { role, fullName }) {
    const payload = {};
    if (role !== undefined) payload.role = role;
    if (fullName !== undefined) payload.full_name = fullName;
    const { error } = await sb.from('user_roles').update(payload).eq('user_id', userId);
    if (error) throw error;
  },

  async remove(userId) {
    const { error } = await sb.from('user_roles').delete().eq('user_id', userId);
    if (error) throw error;
  },
};
