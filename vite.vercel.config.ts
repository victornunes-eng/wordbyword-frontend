import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { fileURLToPath } from 'node:url';

// Usa os mesmos componentes da versão Sites para gerar uma SPA estática na Vercel.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'NEXT_PUBLIC_');
  return {
    plugins: [react()],
    css: { postcss: { plugins: [tailwindcss()] } },
    resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
    define: { 'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_URL || env.NEXT_PUBLIC_API_URL || 'https://fiap-bff-10aojr.onrender.com/ask') },
    build: { outDir: 'build' },
  };
});
