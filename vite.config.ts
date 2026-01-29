import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // No base needed, or strictly '/'
  plugins: [react()],
})