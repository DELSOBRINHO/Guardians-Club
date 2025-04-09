import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('Vite config loaded with mode:', mode);
  console.log('Environment variables loaded:', Object.keys(env).filter(key => key.startsWith('VITE_')));
  console.log('Supabase URL:', env.VITE_SUPABASE_URL);
  console.log('Supabase Anon Key (first 10 chars):', env.VITE_SUPABASE_ANON_KEY?.substring(0, 10));
  console.log('Supabase Anon Key length:', env.VITE_SUPABASE_ANON_KEY?.length || 0);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Expose env variables to the client
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },
  };
});
