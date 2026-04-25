/**
 * Singleton Supabase client.
 *
 * Both the OTP login flow (lib/boot-without-auth.tsx) and the sync layer
 * (lib/sync/middleware.ts) need a Supabase client. Creating two clients
 * against the same project triggers a "Multiple GoTrueClient instances
 * detected" warning because they share the same auth storage key.
 *
 * Importing through this module guarantees the renderer process holds at
 * most one client.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

const resolveConfig = (): { url?: string; key?: string } => {
  const electronCfg = (window as any).electron?.getCloudConfig?.() || {};
  return {
    url: electronCfg.url || (config as any).supabase_url,
    key: electronCfg.key || (config as any).supabase_key,
  };
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (_client) return _client;
  const { url, key } = resolveConfig();
  if (!url || !key) return null;
  _client = createClient(url, key);
  return _client;
};
