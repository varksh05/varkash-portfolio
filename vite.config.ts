import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // nitro builds the server for the host it runs on (Vercel when deployed there)
  plugins: [tanstackStart(), nitro(), viteReact()],
})
