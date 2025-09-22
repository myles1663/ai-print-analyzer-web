import { createBrowserClient } from '@supabase/ssr';
import { getEnvVar } from '@/lib/env';

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const supabaseBrowserClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
};
