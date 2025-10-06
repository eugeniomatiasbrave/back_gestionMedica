import { config } from "dotenv";

// Cargar variables de entorno desde un archivo .env
config();

export default {
    app: {
        PORT: process.env.PORT || 8080
    },
    mongo: {
        URL: process.env.MONGO_URL || ''
    },
    env: {
        NODE_ENV: process.env.NODE_ENV || 'development' || 'production',
        FRONTEND_URL: process.env.FRONTEND_URL || 'https://bravegestionmedica.vercel.app',
        ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || [  // URLs permitidas para CORS (separadas por comas)
            'https://bravegestionmedica.vercel.app',
            'http://localhost:5173', // Desarrollo local SvelteKit
            'http://localhost:8080'  // Desarrollo local alternativo
        ]
        
    }
};