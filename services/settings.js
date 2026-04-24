import { sb } from '../lib/supabase';
import { dbSettingsToApp, appSettingsToDb } from '../lib/helpers';
import { DEFAULT_SETTINGS } from '../config/constants';

export const settingsService = {
  async get() {
    const { data, error } = await sb.from('settings').select('*').eq('id', 1).maybeSingle();
    if (error) throw error;
    return data ? dbSettingsToApp(data) : DEFAULT_SETTINGS;
  },

  async update(settings) {
    const { error } = await sb.from('settings').update(appSettingsToDb(settings)).eq('id', 1);
    if (error) throw error;
  },
};
