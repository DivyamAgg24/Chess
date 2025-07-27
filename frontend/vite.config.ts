import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    // server: {
    //     host: '0.0.0.0',
    //     port: 3000,
    //     proxy: {
    //         '/api1': 'ws://localhost:8080',
    //         '/api2': 'http://localhost:8000'

    //     }
    // },
})
