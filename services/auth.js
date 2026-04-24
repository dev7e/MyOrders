import { sb } from '../lib/supabase';

export const authService = {
  async getSession() {
    const { data } = await sb.auth.getSession();
    return data.session;
  },

  onAuthChange(cb) {
    const { data: subscription } = sb.auth.onAuthStateChange((_event, session) => cb(session));
    return () => subscription?.subscription?.unsubscribe();
  },

  async signIn(email, password) {
    const { error } = await sb.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
  },

  async signOut() {
    await sb.auth.signOut();
  },

  async resetPassword(email) {
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/#admin`,
    });
    if (error) throw error;
  },
};
