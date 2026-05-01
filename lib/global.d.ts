import { compose } from 'redux';

import { electronAPI } from './preload';

declare global {
  const __TEST__: boolean;
  const config: {
    app_engine_url: string;
    app_id: string;
    app_key: string;
    development: boolean;
    is_app_engine: string;
    version: string;
    wpcc_client_id: string;
    wpcc_redirect_url: string;
    supabase_url?: string;
    supabase_key?: string;
    public_web_url?: string;
  };

  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    electron: typeof electronAPI;
    location: Location;
    testEvents: (string | [string, ...any[]])[];
    webConfig?: {
      signout?: (callback: () => void) => void;
    };
  }
}
