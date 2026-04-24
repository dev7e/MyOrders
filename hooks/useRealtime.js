import { useEffect } from 'react';
import { sb } from '../lib/supabase';

export function useRealtime(tables, onChange) {
  useEffect(() => {
    const channel = sb.channel('app-changes');
    tables.forEach((table) => {
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, onChange);
    });
    channel.subscribe();
    return () => { sb.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
